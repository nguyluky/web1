import { renderTable } from './reader_table.js';

/**
 *
 * @param {import("../db/fakeDb.js").UserInfo[]} list
 */
function renderUser(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, {
        id: 'Id',
        name: 'Name',
        passwd: 'Pass',
        email: 'Email',
        phone_num: 'Phone',
        rule: 'Rule',
    });
}

export default renderUser;
