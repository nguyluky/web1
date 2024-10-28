import fakeDatabase from '../../db/fakeDBv1.js';
import { validateUserInfo } from '../../until/type.js';
import uuidv from '../../until/uuid.js';
import {
    searchList,
    renderTable,
    tableShowErrorKey,
    tableClearErrorKey,
    defaultAddRow,
    defaultRemoveAddRow,
    getRowsSeletion,
    removeRowById,
    createCheckBox,
    createOpstionCell,
    createTextSell,
    createDateTableCell,
} from './baseRender.js';

/** @typedef {import('../../until/type.js').UserInfo} UserInfo */

// Định nghĩa các cột trong bảng người dùng
/**
 * @type {import('./baseRender.js').COLS<UserInfo>}
 */
const cols = {
    // id: 'Id',
    name: 'Name',
    passwd: 'Pass',
    email: 'Email',
    phone_num: 'Phone',
    status: 'Status',
    rule: 'Rule',
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

        const key = e.getAttribute('key');
        // TODO:
        if (key == 'datecreated') {
            const input = e.querySelector('input');
            e.setAttribute(
                'default-value',
                String(new Date(input?.value || '')),
            );
        } else if (key == 'rule' || key == 'status') {
            const select = e.querySelector('select');
            e.setAttribute('default-value', select?.value || '');
        } else e.setAttribute('default-value', e.textContent || ''); // Cập nhật giá trị mặc định
    });

    return true;
}

/**
 *
 * @param {UserInfo} value
 * @param {import('./baseRender.js').OnChange<UserInfo>} [onchange]
 * @returns {HTMLTableRowElement}
 */
function creatorRow(value, onchange) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);

    const col = createCheckBox(value['id']);
    row.appendChild(col);

    const userName = createTextSell('name', value['name'], (va) => {
        onchange && onchange(value, 'name', va);
    });
    row.appendChild(userName);

    const passwd = createTextSell('passwd', value['passwd'], (va) => {
        onchange && onchange(value, 'passwd', va);
    });
    row.appendChild(passwd);

    const email = createTextSell('email', value['email'], (va) => {
        onchange && onchange(value, 'email', va);
    });
    row.appendChild(email);

    const phone_num = createTextSell('phone_num', value['phone_num'], (va) => {
        onchange && onchange(value, 'phone_num', va);
    });
    row.appendChild(phone_num);

    const rule = createOpstionCell(
        'rule',
        value['rule'],
        [
            {
                title: 'User',
                value: 'user',
            },
            {
                title: 'Admin',
                value: 'admin',
            },
        ],
        (va) => {
            onchange && onchange(value, 'rule', va);
        },
    );
    row.appendChild(rule);

    const datecreated = createDateTableCell(
        'datecreated',
        value['datecreated'],
        (va) => {
            onchange && onchange(value, 'datecreated', va);
        },
    );
    row.appendChild(datecreated);

    const status = createOpstionCell(
        'status',
        value['status'],
        [
            { title: 'Active', value: 'active' },
            { title: 'Block', value: 'ban' },
        ],
        (va) => {
            onchange && onchange(value, 'status', va);
        },
    );
    row.appendChild(status);

    return row;
}

/**
 * Render bảng người dùng từ danh sách dữ liệu
 *
 * @param {UserInfo[]} list - Danh sách người dùng cần hiển thị
 */
function rendererUser(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;
    renderTable(list, table, cols, onChangeHandle, creatorRow);
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

/**
 * thêm một row vào bản
 *
 */
function addRow() {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );

    if (!table) {
        throw new Error('cái đéo gì vậy');
    }
    const now = new Date();
    console.log(now);
    /** @type {UserInfo} */
    const data = {
        id: uuidv(8),
        email: '',
        name: '',
        passwd: '',
        phone_num: '',
        rule: 'user',
        status: 'active',
        datecreated: now,
    };

    // Lưu người dùng mới vào cache
    cacheAdd.push(data);

    // Tạo một hàng mới cho người dùng trong bảng
    const row = creatorRow(data, (data, key, values) => {
        cacheAdd[0] = {
            ...cacheAdd[0],
            [key]: values,
        };
    });
    row.querySelector('select')?.classList.add('allow-change');
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
    renderTable: rendererUser,
    doSave: userDoSave,
    search: searchUser,
    addRow,
    removeRows,
    cancelAdd,
};
export default user_;
