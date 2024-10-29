/**
 * @typedef {import("../../until/type").Order} Order
 */

import fakeDatabase from '../../db/fakeDBv1.js';
import { createCheckBox, createDateTableCell, createOpstionCell, createTableSell, renderTable, searchList } from './baseRender.js';

const cols = {
    user_id: 'User id',
    state: 'State',
    data: 'Date',
    last_update: 'Last Update',
    is_pay: 'Pay',
    total: 'Total',
};

const cacheEdit = {};
const cacheAdd = [];

/**
 * @type {import('./baseRender.js').OnChange<Order>}
 */
function handleOnChange(data, key, newValue) {
    console.log('onchange called');

    if (cacheEdit[data.id]) {
        cacheEdit[data.id] = {
            ...cacheEdit[data.id],
            [key]: newValue,
        };
    } else {
        cacheEdit[data.id] = {
            ...data,
            [key]: newValue,
        };
    }
}

/**
 * 
 * @param {Order} value 
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 * @returns {HTMLTableRowElement}
 */
function createRow(value, onchange) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);
    const col = createCheckBox(value['id']);
    row.appendChild(col);

    const userCell = createTableSell('user_id');
    fakeDatabase.getUserInfoByUserId(value.user_id).then(user => {
        userCell.textContent = user?.name || 'Không tìm thấy người dùng'
    })


    row.appendChild(userCell)

    const state = createTableSell('state');
    // TODO: không có gì
    const stateOpstion = createOpstionCell(value.state, [
        {title: 'Đợi xác nhận', value: 'doixacnhan'},
        {title: 'Đã xác nhận', value: 'daxacnhan'},
        {title: 'Đang giao hàng', value: 'danggiaohang'},
        {title: 'Giao hàng thành công', value: 'giaohangthanhcong'},
        {title: 'Hủy', value: 'Huy'},
    ], (nv) => {
        onchange && onchange(value, 'state', nv)
    })
    state.append(stateOpstion);

    row.appendChild(state);

    const date = createTableSell('date')
    const dateinput = createDateTableCell(value.date, (nv) => {
        onchange && onchange(value, 'date', nv);
    });

    date.appendChild(dateinput);
    row.appendChild(date);

    const dateLast = createTableSell('last_update')
    const dateinputLast = createDateTableCell(value.last_update, (nv) => {
        onchange && onchange(value, 'last_update', nv);
    });

    dateLast.appendChild(dateinputLast);
    row.appendChild(dateLast);

    const ispay = createTableSell('is_pay');
    const payOpstion = createOpstionCell(value.is_pay ? 'true' : 'flase', [
        {title: "Thành công", value: 'true'},
        {title: "Chưa thanh toán", value: 'false'},
    ], (nv) => {
        onchange && onchange(value, 'is_pay', nv == 'true')
    })

    ispay.appendChild(payOpstion)
    row.appendChild(ispay)


    const total = createTableSell('total');
    total.textContent = value.total + '';

    total.addEventListener('input', () => {
        onchange && onchange(value, 'total', +(total.textContent || 0))
    })

    row.appendChild(total);
    return row;

    
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

    renderTable(list, table, cols, handleOnChange, createRow);
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
