import fakeDatabase from '../db/fakeDBv1.js';
import { validateUserInfo } from '../until/type.js';
import uuidv from '../until/uuid.js';
import {
    searchList,
    renderTable,
    createDefaultRow,
    tableShowErrorKey,
    tableClearErrorKey,
    defaultAddRow,
    defaultRemoveAddRow,
    getRowsSeletion,
    removeRowById,
} from './baseRender.js';

/** @typedef {import('../until/type.js').UserInfo} UserInfo */

// Định nghĩa các cột trong bảng người dùng
const cols = {
    // id: 'Id',
    name: 'Name',
    passwd: 'Pass',
    email: 'Email',
    phone_num: 'Phone',
    rule: 'Rule',
    status: 'Status',
    datecreated: 'Ngày tạo',
};

/**
 * CacheSave lưu trữ tạm thời các thay đổi của người dùng trước khi lưu vào
 * database
 *
 * @type {{ [key: string]: UserInfo }}
 */
let cacheSave = {};

/**
 * CacheAdd lưu trữ tạm thời các người dùng mới được thêm vào trước khi lưu vào
 * database
 *
 * @type {UserInfo[]}
 */
let cacheAdd = [];

/**
 * Hàm xử lý khi có thay đổi dữ liệu trên bảng (hàm callback)
 *
 * @type {import('./baseRender.js').OnChange<UserInfo>}
 */
function onChangeHandle(data, key, newValue) {
    console.log('onchange called');

    if (cacheSave[data.id]) {
        cacheSave[data.id] = {
            ...cacheSave[data.id],
            [key]: newValue,
        };
    } else {
        cacheSave[data.id] = {
            ...data,
            [key]: newValue,
        };
    }
}

/** Hàm lưu lại các chỉnh sửa và người dùng mới vào database */
/** @returns {Promise<boolean>} */
async function userDoSave() {
    const updateValues = Object.values(cacheSave);
    const addValues = Object.values(cacheAdd);

    let hasError = false;

    [...updateValues, ...addValues].forEach((value) => {
        const errors = validateUserInfo(value);

        errors.forEach((e) => {
            const { key, msg } = e;
            hasError = true;
            tableShowErrorKey(value.id, key, msg);
        });
    });

    if (hasError) {
        throw Error('Có lỗi xảy ra');
    }

    const changeV = updateValues.map((e) => {
        return fakeDatabase.updateUserInfo(e).catch((ee) => {
            console.error({ e: ee });
            if (ee.name == 'ConstraintError') {
                const key = /** @type {string} */ (
                    ee.message.match(/'([^']+)'/)?.[0]
                );
                if (key) {
                    tableShowErrorKey(
                        e.id,
                        key.replace(/'/g, ''),
                        'Email đã tồn tại',
                    );
                }
            }
            hasError = true;
        });
    });

    // Lưu người dùng mới vào database
    const addV = cacheAdd.map((e) => {
        return fakeDatabase.addUserInfo(e).catch((ee) => {
            console.error({ e: ee });
            if (ee.name == 'ConstraintError') {
                const key = /** @type {string} */ (
                    ee.message.match(/'([^']+)'/)?.[0]
                );
                if (key) {
                    tableShowErrorKey(
                        e.id,
                        key.replace(/'/g, ''),
                        'Email đã tồn tại',
                    );
                }
            }
            hasError = true;
        });
    });

    await Promise.all([...changeV, ...addV]);

    if (hasError) {
        throw Error('Có lỗi xảy ra');
    }

    cacheAdd = [];
    cacheSave = {};

    tableClearErrorKey();

    document.querySelectorAll('#content_table td').forEach((e) => {
        e.setAttribute('contenteditable', 'false'); // Khóa không cho chỉnh sửa
        e.setAttribute('ischange', 'false'); // Đặt lại trạng thái là không thay đổi
        e.setAttribute('default-value', e.textContent || ''); // Cập nhật giá trị mặc định
    });

    return true;
}

/**
 * Render bảng người dùng từ danh sách dữ liệu
 *
 * @param {UserInfo[]} list - Danh sách người dùng cần hiển thị
 */
function renderUser(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, onChangeHandle);
}

/**
 * Hàm tìm kiếm người dùng trong bảng dựa trên input tìm kiếm
 *
 * @param {UserInfo[]} list - Danh sách người dùng để tìm kiếm
 */
function searchUser(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    // Sử dụng hàm searchList để lọc danh sách người dùng theo input tìm kiếm
    const result = searchList(list, cols).map((e) => e.id);

    // Duyệt qua tất cả các hàng của bảng và hiển thị hoặc ẩn dựa trên kết quả tìm kiếm
    document.querySelectorAll('#content_table > tr[id-row]').forEach((e) => {
        const id = e.getAttribute('id-row') || '';
        if (result.includes(id)) {
            /** @type {HTMLElement} */ (e).style.display = '';
        } else {
            /** @type {HTMLElement} */ (e).style.display = 'none';
        }
    });
}

/** Hàm thêm một người dùng mới vào bảng */
function addUser() {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );

    if (!table) {
        throw new Error('cái đéo gì vậy');
    }

    /** @type {UserInfo} */
    const data = {
        id: uuidv(8),
        email: '',
        name: '',
        passwd: '',
        phone_num: '',
        rule: 'user',
        status: 'active',
        datecreated: new Date(),
    };

    // Lưu người dùng mới vào cache
    cacheAdd.push(data);

    // Tạo một hàng mới cho người dùng trong bảng
    const row = createDefaultRow(data, cols, (data, key, values) => {
        cacheAdd[0] = {
            ...cacheAdd[0],
            [key]: values,
        };
    });

    defaultAddRow(table, row);
}

/** Hủy hành động thêm người dùng mới và xóa hàng vừa thêm */
function cancelAdd() {
    defaultRemoveAddRow();
    cacheAdd = [];
}

/** Xóa các người dùng đã được chọn trong bảng */
function removeRows() {
    const selections = getRowsSeletion();

    selections.forEach((id) => {
        fakeDatabase.deleteSachById(id);
        removeRowById(id);
    });
}

/**
 * Đối tượng quản lý toàn bộ các thao tác liên quan đến người dùng
 *
 * @type {import('./baseRender.js').IntefaceRender<UserInfo>}
 */
const user_ = {
    cols,
    renderTable: renderUser,
    doSave: userDoSave,
    search: searchUser,
    addRow: addUser,
    removeRows,
    cancelAdd,
};
export default user_;
