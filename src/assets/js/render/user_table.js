import fackDatabase from '../db/fakeDb.js';
import uuidv4 from '../until/uuid.js';
import { searchList, renderTable, defaultRenderRow } from './reader_table.js';

/**
 * @typedef {import('../db/fakeDb.js').UserInfo} UserInfo
 */

const cols = {
    id: 'Id',
    name: 'Name',
    passwd: 'Pass',
    email: 'Email',
    phone_num: 'Phone',
    rule: 'Rule',
};

/**
 * @type {{[key: string]: UserInfo}}
 */
let cacheSave = {};

/**
 * @type {UserInfo[]}
 */
let cacheAdd = [];

/**
 *
 * @type {import('./reader_table.js').OnChange<UserInfo>}
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

/**
 * lưu chỉnh sử và sác nhận thêm
 */
function userDoSave() {
    // TODO: thêm kiểm tra dữ liệu vidu là email và std
    Object.keys(cacheSave).forEach((e) => {
        console.log(e);
        const data = cacheSave[e];
        fackDatabase.updateUserInfo(
            data.id,
            data.email,
            data.name,
            data.passwd,
            data.phone_num,
            data.rule,
        );
    });

    cacheAdd.forEach((e) => {
        console.log(e);
        fackDatabase.addUserInfo(e);
    });

    document.querySelectorAll('#content_table td').forEach((e) => {
        e.setAttribute('contenteditable', 'false');
        e.setAttribute('ischange', 'false');
        e.setAttribute('default-value', e.textContent || '');
    });
}

/**
 *
 * @param {UserInfo[]} list
 */
function renderUser(list) {
    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, onChangeHandle);
}

/**
 * @param {UserInfo[]} list
 */
function searchUser(list) {
    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );
    if (!table) return;

    const result = searchList(list, cols).map((e) => e.id);

    document.querySelectorAll('#content_table > tr[id-row]').forEach((e) => {
        const id = e.getAttribute('id-row') || '';
        if (result.includes(id)) {
            /**@type {HTMLElement}*/ (e).style.display = '';
        } else {
            /**@type {HTMLElement}*/ (e).style.display = 'none';
        }
    });
}

function addUser() {
    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );

    if (!table) {
        throw new Error('cái đéo gì vậy');
    }

    /**
     * @type {UserInfo}
     */
    const data = {
        id: uuidv4(),
        email: '',
        name: '',
        passwd: '',
        phone_num: '',
        rule: 'user',
    };
    cacheAdd.push(data);
    const row = defaultRenderRow(data, cols, (data, key, values) => {
        cacheAdd[0] = {
            ...cacheAdd[0],
            [key]: values,
        };
    });

    row.querySelectorAll('td').forEach((e) =>
        e.setAttribute('contenteditable', 'true'),
    );

    table.insertBefore(row, table.childNodes[1]);
    /**@type {HTMLElement} */ (table.parentNode).scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

/**
 * tôi không chắc là các này tối ưu nhất
 * có ỳ mấy ông sử cho tôi
 * ký tên Hiếu
 * người dùng hủy yêu cầu thêm
 */
function cancelAdd() {
    cacheAdd.forEach((e) => {
        document.querySelector(`tr[id-row="${e.id}"]`)?.remove();
    });
    cacheAdd = [];
}

/**
 * lấy toàn bộ các row đã chọn rồi delete
 */
function removeRow() {
    throw new Error('làm đi remove');
}

/**
 * @type {import('./reader_table.js').intefaceRender<UserInfo>}
 */

const user_ = {
    cols,
    renderTable: renderUser,
    doSave: userDoSave,
    search: searchUser,
    addRow: addUser,
    removeRow,
    cancelAdd,
};
export default user_;
