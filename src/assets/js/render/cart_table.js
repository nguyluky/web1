import { renderTable, searchList } from './reader_table.js';

/**
 * @typedef {import('../db/fakeDb').Cart} Cart
 */

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
 * @param {Cart[]} list
 */
function renderCart(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols);
}

/**
 *
 * @param {Cart[]} list
 */
function searchCart(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;
    const result = searchList(list, cols);

    renderTable(result, table, cols);
}

/**
 * @type {import('./reader_table.js').intefaceRender<Cart>}
 */
const Cart_ = {
    cols,
    renderTable: renderCart,
    search: searchCart,
    doSave: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    addRow: () => {
        throw new Error('Làm này đi, đồ lười');
    },
};

export default Cart_;
