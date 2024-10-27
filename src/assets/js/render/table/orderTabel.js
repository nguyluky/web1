/**
 * @typedef {import("../../until/type").Order} Order
 */

import fakeDatabase from '../../db/fakeDBv1.js';
import {
    createCheckBox,
    createDefaultRow,
    createOpstionCell,
    createTableSellWrapper,
    renderTable,
    searchList,
} from './baseRender.js';

const cols = {
    user_id: 'User id',
    state: 'State',
    date: 'Date',
    last_update: 'Last Update',
    is_pay: 'Pay',
    total: 'Total',
};

/**
 *
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 * @returns {HTMLTableRowElement}
 */
function createRow(value, onchange) {
    const tr = document.createElement('tr');
    tr.setAttribute('id-row', value.id);

    const check = createCheckBox(value.id);
    tr.appendChild(check);

    const tdUserName = createTableSellWrapper('user_id');
    fakeDatabase.getUserInfoByUserId(value['user_id']).then((user) => {
        tdUserName.textContent = user?.name || '';
    });
    tdUserName.removeAttribute('key');
    tr.appendChild(tdUserName);

    const cellState = createTableSellWrapper('state');
    const state = createOpstionCell(
        value.state,
        [
            { title: 'suly', value: 'suly' },
            { title: 'doixacnhan', value: 'doixacnhan' },
            { title: 'thanhcong', value: 'thanhcong' },
            { title: 'huy', value: 'huy' },
        ],
        () => {},
    );
    cellState.appendChild(state);
    tr.appendChild(cellState);

    return tr;
}

/**
 * @type {import('./baseRender.js').OnChange<Order>}
 */
function handleOnChangeRow(data, key, newValue) {
    console.log(data);
}

/**
 *
 * @param {Order[]} list
 */
function renderOrder(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, handleOnChangeRow, createRow);
}

/** @param {Order[]} list */
function searchOrder(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;
    const result = searchList(list, cols).map((e) => e.id);

    document.querySelectorAll('#content_table > tr[id-row]').forEach((e) => {
        const id = e.getAttribute('id-row') || '';
        if (result.includes(id)) {
            /** @type {HTMLElement} */ (e).style.display = '';
        } else {
            /** @type {HTMLElement} */ (e).style.display = 'none';
        }
    });
}

/**
 * @type {import("./baseRender.js").IntefaceRender<Order>}
 */
const order = {
    cols,
    renderTable: renderOrder,
    search: searchOrder,
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
