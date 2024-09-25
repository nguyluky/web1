import { renderTable, searchList } from './reader_table.js';

const cols = {
    id: 'Id',
    user_id: 'User id',
    sach: 'Sách id',
    quantity: 'Số lượng',
    option_id: 'Option',
    status: 'Trạng thái',
};

/**
 *
 * @param {import("../db/fakeDb").Cart[]} list
 */
export function renderCart(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols);
}

/**
 *
 * @param {import("../db/fakeDb").Cart[]} list
 */
export function searchCart(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;
    const result = searchList(list, cols);

    renderTable(result, table, cols);
}
