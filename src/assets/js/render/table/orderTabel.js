/**
 * @typedef {import("../../until/type").Order} Order
 */

import fakeDatabase from '../../db/fakeDBv1.js';
import {
    createCheckBox,
    renderTable,
    searchList,
    tableClearErrorKey,
} from './baseRender.js';
import { createOptionTabelCell } from './customCell.js';
import { createNumberTableCell } from './customCell.js';
import { createDateTimeTableCell } from './customCell.js';
import { createTextTableCell } from './customCell.js';

const cols = {
    user_id: 'User id',
    state: 'State',
    date: 'Date',
    last_update: 'Last Update',
    is_pay: 'Pay',
    total: 'Total',
};

/**
 * @type {{[key: string] : Order}}
 */
const cacheEdit = {};

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
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 */
function renderRow(row, value, onchange) {
    Object.keys(cols).forEach((key) => {
        switch (key) {
            case 'state': {
                const state = createOptionTabelCell(
                    'state',
                    value.state,
                    [
                        { title: 'Đợi xác nhận', value: 'doixacnhan' },
                        { title: 'Đã xác nhận', value: 'daxacnhan' },
                        { title: 'Đang giao hàng', value: 'danggiaohang' },
                        {
                            title: 'Giao hàng thành công',
                            value: 'giaohangthanhcong',
                        },
                        { title: 'Hủy', value: 'Huy' },
                    ],
                    (nv) => {
                        onchange && onchange(value, 'state', nv);
                    },
                );
                row.appendChild(state);
                break;
            }
            case 'user_id': {
                const user_id = createTextTableCell(
                    'user_id',
                    value.user_id,
                    (nv) => {
                        onchange && onchange(value, 'user_id', nv);
                    },
                );

                fakeDatabase.getUserInfoByUserId(value.user_id).then((user) => {
                    user_id.textContent = user?.name || '';
                    user_id.setAttribute('default-value', user?.name || '');
                });

                row.appendChild(user_id);

                break;
            }
            case 'date':
            case 'last_update': {
                const date = createDateTimeTableCell(key, value[key], (nv) => {
                    onchange && onchange(value, key, nv);
                });
                row.appendChild(date);
                break;
            }
            case 'is_pay': {
                const option = createOptionTabelCell(
                    'is_pay',
                    value.is_pay ? 'true' : 'false',
                    [
                        { title: 'Thành công', value: 'true' },
                        { title: 'Chưa thanh toán', value: 'false' },
                    ],
                    (nv) => {
                        onchange && onchange(value, 'is_pay', nv);
                    },
                );
                row.appendChild(option);
                break;
            }
            case 'total': {
                const to = createNumberTableCell('total', value.total, (nv) => {
                    onchange && onchange(value, 'total', nv);
                });
                row.appendChild(to);
                break;
            }
            default: {
                const col = createTextTableCell(key, value[key], (nv) => {
                    // @ts-ignore
                    onchange && onchange(value, key, nv);
                });
                row.appendChild(col);
            }
        }
    });

    // row.addEventListener('click', () => {
    //     if (!row.getAttribute('dropdown')) {
    //         row.setAttribute('dropdown', 'true');

    //         const tr = document.createElement('tr');
    //         const td = document.createElement('td');
    //         td.colSpan = Object.keys(cols).length + 1;

    //         const title = document.createElement('div');
    //         title.style.display = 'flex';
    //         title.innerHTML = `
    //             <div style="width: 20%; text-align: center;">STT</div>
    //             <div style="width: 40%;">Tên</div>
    //             <div style="width: 20%; text-align: center;">số lượng</div>
    //             <div style="width: 20%; text-align: center;">số lượng</div>
    //         `;

    //         td.appendChild(title);

    //         value.items.forEach((e, index) => {
    //             const div = document.createElement('div');
    //             div.style.display = 'flex';

    //             const stt = document.createElement('div');
    //             stt.textContent = index + '';
    //             stt.style.width = '20%';
    //             stt.style.textAlign = 'center';
    //             div.appendChild(stt);

    //             const sach = document.createElement('div');
    //             sach.style.width = '40%';
    //             sach.textContent = e.sach;

    //             const quantity = document.createElement('div');
    //             quantity.style.width = '20%';
    //             quantity.style.textAlign = 'center';
    //             quantity.textContent = e.quantity + '';

    //             const donqia = document.createElement('div');
    //             donqia.textContent = '';
    //             donqia.style.width = '20%';
    //             donqia.style.textAlign = 'center';

    //             fakeDatabase.getSachById(e.sach).then((sach_) => {
    //                 sach.textContent = sach_?.title || '';
    //                 donqia.textContent = sach_?.base_price + '';
    //             });

    //             div.appendChild(sach);
    //             div.appendChild(quantity);
    //             div.appendChild(donqia);

    //             td.appendChild(div);
    //         });

    //         tr.appendChild(td);

    //         if (row.nextElementSibling) {
    //             row.parentElement?.insertBefore(tr, row.nextElementSibling);
    //         } else {
    //             row.parentElement?.appendChild(tr);
    //         }
    //     } else {
    //         row.removeAttribute('dropdown');
    //         row.nextElementSibling?.remove();
    //     }
    // });
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

    renderTable(list, table, cols, handleOnChange, renderRow, customeHeader);
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

function customeHeader() {
    const tableHeader = document.createElement('tr');

    const col = document.createElement('th');
    col.insertAdjacentHTML('beforeend', 'Check');
    tableHeader.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('th');
        document.createElement('span');
        col.innerHTML = `
            <div class="header-popip-wrapper">
                <span>${key}</span>
                <span><i class="fa-solid fa-caret-down"></i></span>
                <div class="popup-filter-header">
                    <p>sort by a->z</p>
                    <p>sort by z->a</p>
                    <hr>
                </div>
            </div>
        `;
        tableHeader.appendChild(col);
    });

    return tableHeader;
}

/**
 *
 *
 * TODO: làm sao đây
 * @param {string} key
 * @param {any} value
 *
 */
function advancedSearch(key, value) {}

async function doSave() {
    const updateValues = Object.values(cacheEdit);

    const promiseUpdate = updateValues.map((e) => {
        return fakeDatabase.updateOrder(e);
    });

    await Promise.all(promiseUpdate);

    tableClearErrorKey();
}

/**
 * @type {import("./baseRender.js").IntefaceRender<Order>}
 */
const order = {
    cols,
    renderTable: renderOrder,
    search: searchOrder,
    doSave: doSave,
    addRow: undefined,
    removeRows: undefined,
    cancelAdd: undefined,
};

export default order;
