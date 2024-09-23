import { renderTable } from './reader_table.js';

/**
 *
 * @param {import("../db/fakeDb").Category[]} list
 */
function renderCategory(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, {
        id: 'Id',
        name: 'Name',
        long_name: 'Long Name',
    });
}

export default renderCategory;
