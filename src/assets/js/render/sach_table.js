import { renderTable, searchList } from './reader_table.js';

const cols = {
    id: 'Id',
    title: 'Title',
    details: 'Details',
    thumbnal: 'Thumbnal',
    base_price: 'Price',
    category: 'Category',
    option: 'Option',
};

/**
 *
 * @param {import("../db/fakeDb").Sach[]} list
 */
export function renderSach(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols);
}

/**
 *
 * @param {import("../db/fakeDb").Sach[]} list
 */
export function searchSach(list) {
    searchList(list, cols);
}
