import fackDatabase from '../db/fakeDb.js';
import { searchList, renderTable } from './reader_table.js';

const cols = {
    id: 'Id',
    name: 'Name',
    passwd: 'Pass',
    email: 'Email',
    phone_num: 'Phone',
    rule: 'Rule',
};

/**
 * @type {{[key: string]: import('../db/fakeDb.js').UserInfo}}
 */
const cacheSave = {};

/**
 *
 * @type {import('./reader_table.js').OnChange<import('../db/fakeDb.js').UserInfo>}
 */
function onChangeHandle(data, key, newValue) {
    // @ts-ignore
    data[key] = newValue;
    cacheSave[data.id] = data;
}

export function userDoSave() {
    Object.keys(cacheSave).forEach((e) => {
        console.log(e);
        const data = cacheSave[e];
        fackDatabase.updateUserInfo(
            data.id,
            data.userName,
            data.name,
            data.email,
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
export function renderUser(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols, onChangeHandle);
}

/**
 * @param {import("../db/fakeDb.js").UserInfo[]} list
 */
export function searchUser(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(searchList(list, cols), table, cols, onChangeHandle);
}
