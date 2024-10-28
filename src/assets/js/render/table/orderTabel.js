/**
 * @typedef {import("../../until/type").Order} Order
 */

import fakeDatabase from '../../db/fakeDBv1.js';
import {
    createCheckBox,
    createDateTableCell,
    createImgThumbnailCell,
    createOpstionCell,
    createTextSell,
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

    const tdUserName = createTextSell(
        'user_id',
        value['user_id'],
        (nv) => {
            onchange && onchange(value, 'user_id', nv);
        },
        false,
    );
    fakeDatabase.getUserInfoByUserId(value['user_id']).then((user) => {
        tdUserName.value = user?.name || '';
    });
    tr.appendChild(tdUserName);

    const cellState = createOpstionCell(
        'state',
        value.state,
        [
            { title: 'suly', value: 'suly' },
            { title: 'doixacnhan', value: 'doixacnhan' },
            { title: 'thanhcong', value: 'thanhcong' },
            { title: 'huy', value: 'huy' },
        ],
        (nv) => {
            onchange && onchange(value, 'state', nv);
        },
    );
    tr.appendChild(cellState);

    const date = createDateTableCell('date', value.date, (nv) => {
        onchange && onchange(value, 'date', nv);
    });
    tr.appendChild(date);

    const lastUpdate = createDateTableCell(
        'last_update',
        value.last_update,
        (nv) => {
            onchange && onchange(value, 'last_update', nv);
        },
    );
    tr.appendChild(lastUpdate);

    const cellIsPay = createOpstionCell(
        'is_pay',
        value.is_pay ? '1' : '0',
        [
            { title: 'Chưa thanh toán', value: '0' },
            { title: 'Đã thanh toán', value: '1' },
        ],
        (nv) => {
            onchange && onchange(value, 'is_pay', nv == '1');
        },
    );
    tr.appendChild(cellIsPay);

    const total = createTextSell('total', value.total + '', (nv) => {
        onchange && onchange(value, 'total', parseInt(nv));
    });
    tr.appendChild(total);
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
