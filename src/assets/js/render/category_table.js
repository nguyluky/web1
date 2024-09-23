import { renderTable, searchList } from './reader_table.js';

const cols = {
    id: 'Id',
    name: 'Name',
    long_name: 'Long Name',
};

/**
 *
 * @param {import("../db/fakeDb").Category[]} list
 */
export function renderCategory(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols);
}

/**
 *
 * @param {import("../db/fakeDb").Category[]} list
 */
export function searchCategory(list) {
    searchList(list, cols);
}
