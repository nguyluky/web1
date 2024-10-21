import fakeDatabase from '../db/fakeDb.js';
import uuidv4 from '../until/uuid.js';
import { searchList, renderTable, defaultRenderRow } from './baseRender.js';
import { validateUserInfo } from '../until/type.js';

/** @typedef {import('../db/fakeDb.js').UserInfo} UserInfo */

// Định nghĩa các cột trong bảng người dùng
const cols = {
    id: 'Id',
    name: 'Name',
    passwd: 'Pass',
    email: 'Email',
    phone_num: 'Phone',
    rule: 'Rule',
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
async function userDoSave() {
    // Lưu các thay đổi từ cacheSave vào database

    const values = Object.values(cacheSave);

    for (let i = 0; i < values.length; i++) {
        const { key, msg } = validateUserInfo(values[i]) || {};
        if (msg) {
            // TODO: làm tiếp hiếu
            // hiếu bận học để mai kiểm tra rồi
        }
    }

    const taskAdd = Object.keys(cacheSave).map((e) => {
        const data = cacheSave[e];
        return fakeDatabase.updateUserInfo(data); // Gọi hàm cập nhật người dùng trong cơ sở dữ liệu giả lập
    });

    try {
        await Promise.all(taskAdd);
    } catch (e) {
        console.error(e);
    }

    // Lưu người dùng mới vào database
    cacheAdd.forEach((e) => {
        console.log(e);
        fakeDatabase.addUserInfo(e); // Gọi hàm thêm người dùng mới vào cơ sở dữ liệu
    });
    cacheAdd = [];
    document.querySelectorAll('#content_table td').forEach((e) => {
        e.setAttribute('contenteditable', 'false'); // Khóa không cho chỉnh sửa
        e.setAttribute('ischange', 'false'); // Đặt lại trạng thái là không thay đổi
        e.setAttribute('default-value', e.textContent || ''); // Cập nhật giá trị mặc định
    });
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
        id: uuidv4(),
        email: '',
        name: '',
        passwd: '',
        phone_num: '',
        rule: 'user',
    };

    // Lưu người dùng mới vào cache
    cacheAdd.push(data);

    // Tạo một hàng mới cho người dùng trong bảng
    const row = defaultRenderRow(data, cols, (data, key, values) => {
        cacheAdd[0] = {
            ...cacheAdd[0],
            [key]: values,
        };
    });

    // Cho phép chỉnh sửa các ô trong hàng mới
    row.querySelectorAll('td').forEach((e) =>
        e.setAttribute('contenteditable', 'true'),
    );

    // Thêm hàng mới lên đầu bảng
    table.insertBefore(row, table.childNodes[1]);
    /** @type {HTMLElement} */ (table.parentNode).scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

/** Hủy hành động thêm người dùng mới và xóa hàng vừa thêm */
function cancelAdd() {
    document.querySelector(`tr[id-row="${cacheAdd[0].id}"]`)?.remove();
    cacheAdd = [];
}

/** Xóa các người dùng đã được chọn trong bảng */
function removeRows() {
    document.querySelectorAll('tr').forEach((e) => {
        let cb = /** @type {HTMLInputElement | null} */ (
            e.querySelector('input[type="checkbox"]')
        );
        if (cb?.checked) {
            let rowID = e.getAttribute('id-row');
            if (rowID) fakeDatabase.deleteUserById(rowID);
            e.remove();
        }
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
