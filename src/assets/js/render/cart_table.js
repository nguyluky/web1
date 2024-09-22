import renderTable from './reader_table.js';

/**
 *
 * @param {import("../db/fakeDb").Cart[]} list
 */
function renderCart(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, {
        id: 'Id',
        user_id: 'User id',
        sach: 'Sach id',
        quantity: 'Số lượng',
        opstion_id: 'opstion',
        status: 'trạng thái',
    });
}

export default renderCart;
