/**
 * @typedef {import("../until/type").Order} Order
 */

import { renderTable } from './baseRender.js';

const cols = {
    user_id: 'User id',
    state: 'State',
    data: 'Date',
    last_update: 'Last Update',
    is_pay: 'Pay',
    total: 'Total',
};

/**
 *
 * @param {Order[]} list
 */
function renderOrder(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols);
}

/**
 * @type {import("./baseRender").IntefaceRender<Order>}
 */
const order = {
    cols,
    renderTable: renderOrder,
    search: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    doSave: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    addRow: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    removeRows: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    cancelAdd: () => {
        throw new Error('Làm này đi, đồ lười');
    },
};

export default order;
