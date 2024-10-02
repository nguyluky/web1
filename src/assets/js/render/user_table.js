import fackDatabase from '../db/fakeDb.js';
import { searchList, renderTable } from './reader_table.js';

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
const cacheSave = {};

/**
 *
 * @type {import('./reader_table.js').OnChange<UserInfo>}
 */
function onChangeHandle(data, key, newValue) {
    // @ts-ignore
    data[key] = newValue;
    cacheSave[data.id] = data;
}

function userDoSave() {
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
}

/**
 *
 * @param {import("../db/fakeDb.js").UserInfo[]} list
 */
function renderUser(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols, onChangeHandle);
}

/**
 * @param {import("../db/fakeDb.js").UserInfo[]} list
 */
function searchUser(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
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

function addUser() {}

/**
 * @type {import('./reader_table.js').intefaceRender<UserInfo>}
 */

const user_ = {
    cols,
    renderTable: renderUser,
    doSave: userDoSave,
    search: searchUser,
    addRow: addUser,
};
export default user_;
