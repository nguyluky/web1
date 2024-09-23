import { renderTable } from './reader_table.js';

/**
 *
 * @param {import("../db/fakeDb").Sach[]} list
 */
function renderSach(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, {
        id: 'Id',
        title: 'Title',
        details: 'Details',
        thumbnal: 'Thumbnal',
        base_price: 'Price',
        category: 'Category',
        option: 'Option',
    });
}

export default renderSach;
