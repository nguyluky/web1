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
 *
 * @param {import("../db/fakeDb.js").UserInfo[]} list
 */
export function renderUser(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols);
}

/**
 * @param {import("../db/fakeDb.js").UserInfo[]} list
 */
export function searchUser(list) {
    searchList(list, cols);
}
