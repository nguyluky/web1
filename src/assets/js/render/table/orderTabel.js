/**
 * @typedef {import("../../until/type").Order} Order
 */

import fakeDatabase from '../../db/fakeDBv1.js';
import { isDate } from '../../until/validator.js';
import { renderTable, searchList, tableClearErrorKey } from './baseRender.js';
import {
    createOptionTabelCell,
    createNumberTableCell,
    createDateTimeTableCell,
    createTextTableCell,
} from './customCell.js';

const cols = {
    user_id: 'User id',
    state: 'State',
    date: 'Date',
    last_update: 'Last Update',
    is_pay: 'Pay',
    total: 'Total',
    address: 'Địa trỉ',
};

/**
 * @type {{[key: string] : Order}}
 */
let cacheEdit = {};

/**
 * @type {import('./baseRender.js').OnChange<Order>}
 */
function handleOnChange(data, key, newValue) {
    console.log('onchange called');

    cacheEdit[data.id] = {
        ...cacheEdit[data.id],
        [key]: newValue,
    };
}

/**
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 */
function renderRow(row, value, onchange) {
    Object.keys(cols).forEach((key) => {
        switch (key) {
            case 'state':
                appendStateCell(row, value, onchange);
                break;
            case 'user_id':
                appendUserIdCell(row, value, onchange);
                break;
            case 'date':
            case 'last_update':
                appendDateCell(row, key, value, onchange);
                break;
            case 'is_pay':
                appendIsPayCell(row, value, onchange);
                break;
            case 'total':
                appendTotalCell(row, value, onchange);
                break;
            case 'address': {
                const col = createTextTableCell(key, value[key], (nv) => {
                    // @ts-ignore
                    onchange && onchange(value, key, nv);
                });
                col.style.minWidth = '200px';
                row.appendChild(col);

                break;
            }
            default:
                appendDefaultCell(row, key, value, onchange);
        }
    });

    row.addEventListener('click', () => toggleDropdown(row, value));
}

/**
 *
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 */
function appendStateCell(row, value, onchange) {
    const state = createOptionTabelCell(
        'state',
        value.state,
        [
            { title: 'Đợi xác nhận', value: 'doixacnhan' },
            { title: 'Đã xác nhận', value: 'daxacnhan' },
            { title: 'Đang giao hàng', value: 'danggiaohang' },
            { title: 'Giao hàng thành công', value: 'giaohangthanhcong' },
            { title: 'Hủy', value: 'Huy' },
        ],
        (nv) => onchange && onchange(value, 'state', nv),
    );
    row.appendChild(state);
}
/**
 *
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 */
function appendUserIdCell(row, value, onchange) {
    const user_id = createTextTableCell(
        'user_id',
        value.user_id,
        (nv) => onchange && onchange(value, 'user_id', nv),
        false,
    );

    user_id.style.minWidth = '100px';
    fakeDatabase.getUserInfoByUserId(value.user_id).then((user) => {
        user_id.textContent = user?.name || '';
        user_id.setAttribute('default-value', user?.name || '');
    });

    row.appendChild(user_id);
}

/**
 *
 * @param {HTMLTableRowElement} row
 * @param {string} key
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange ]
 */
function appendDateCell(row, key, value, onchange) {
    const date = createDateTimeTableCell(
        key,
        value[key],
        // @ts-ignore
        (nv) => onchange && onchange(value, key, nv),
        false,
    );
    row.appendChild(date);
}

/**
 *
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 */
function appendIsPayCell(row, value, onchange) {
    const option = createOptionTabelCell(
        'is_pay',
        value.is_pay ? 'true' : 'false',
        [
            { title: 'Thành công', value: 'true' },
            { title: 'Chưa thanh toán', value: 'false' },
        ],
        (nv) => onchange && onchange(value, 'is_pay', nv),
    );
    row.appendChild(option);
}

/**
 *
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange]
 */
function appendTotalCell(row, value, onchange) {
    const to = createNumberTableCell(
        'total',
        value.total,
        (nv) => onchange && onchange(value, 'total', nv),
        false,
    );
    row.appendChild(to);
}

/**
 *
 * @param {HTMLTableRowElement} row
 * @param {string} key
 * @param {Order} value
 * @param {import('./baseRender.js').OnChange<Order>} [onchange ]
 */
function appendDefaultCell(row, key, value, onchange) {
    const col = createTextTableCell(key, value[key], (nv) => {
        // @ts-ignore
        onchange && onchange(value, key, nv);
    });
    row.appendChild(col);
}

/**
 *
 * @param {HTMLTableRowElement} row
 * @param {Order} value
 */
function toggleDropdown(row, value) {
    if (row.querySelector('td[contenteditable = "true"]')) return;

    /**
     *
     * @param {MouseEvent} event
     * @returns {void}
     */
    function handleClickOutside(event) {
        const target = /**@type {HTMLElement}*/ (event.target);
        if (target.isSameNode(row)) return;
        if (row.nextElementSibling?.contains(target)) return;
        if (row.contains(target)) return;

        row.removeAttribute('dropdown');
        row.nextElementSibling?.remove();
        document.removeEventListener('click', handleClickOutside);
    }

    if (!row.getAttribute('dropdown')) {
        row.setAttribute('dropdown', 'true');

        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = Object.keys(cols).length + 1;

        const title = document.createElement('div');
        title.style.display = 'flex';
        title.innerHTML = `
            <div style="width: 20%; text-align: center;">STT</div>
            <div style="width: 40%;">Tên</div>
            <div style="width: 20%; text-align: center;">số lượng</div>
            <div style="width: 20%; text-align: center;">Tiền</div>
        `;

        td.appendChild(title);

        value.items.forEach((e, index) => {
            const div = document.createElement('div');
            div.style.display = 'flex';

            const stt = document.createElement('div');
            stt.textContent = index + '';
            stt.style.width = '20%';
            stt.style.textAlign = 'center';
            div.appendChild(stt);

            const sach = document.createElement('div');
            sach.style.width = '40%';
            sach.textContent = e.sach;

            const quantity = document.createElement('div');
            quantity.style.width = '20%';
            quantity.style.textAlign = 'center';
            quantity.textContent = e.quantity + '';

            const donqia = document.createElement('div');
            donqia.textContent = '';
            donqia.style.width = '20%';
            donqia.style.textAlign = 'center';

            fakeDatabase.getSachById(e.sach).then((sach_) => {
                sach.textContent = sach_?.title || '';
                donqia.textContent = sach_?.base_price + '';
            });

            div.appendChild(sach);
            div.appendChild(quantity);
            div.appendChild(donqia);

            td.appendChild(div);
        });

        tr.appendChild(td);

        if (row.nextElementSibling) {
            row.parentElement?.insertBefore(tr, row.nextElementSibling);
        } else {
            row.parentElement?.appendChild(tr);
        }
        document.addEventListener('click', handleClickOutside);
    } else {
        row.removeAttribute('dropdown');
        row.nextElementSibling?.remove();
        document.removeEventListener('click', handleClickOutside);
    }
}

/**
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

/**
 * @param {{title: string, body: () => HTMLElement, onOk: (element: HTMLElement | null) => any, onCancel: () => any}[]} options
 * @returns {HTMLDivElement}
 */
function createDropdownFilter(options) {
    const popupFilterHeader = document.createElement('div');

    popupFilterHeader.setAttribute('class', 'popup-filter-header');
    popupFilterHeader.style.display = 'none';

    const line1 = document.createElement('P');
    popupFilterHeader.appendChild(line1);
    line1.textContent = 'sort by a->z';

    const line2 = document.createElement('P');
    popupFilterHeader.appendChild(line2);
    line2.textContent = 'sort by z->a';

    const hr = document.createElement('HR');
    popupFilterHeader.appendChild(hr);

    // ==================================
    const select = document.createElement('select');
    popupFilterHeader.appendChild(select);

    // tạo option

    options.forEach((e) => {
        const option = document.createElement('option');
        option.value = e.title;
        option.textContent = e.title;
        select.appendChild(option);
    });

    // ==================================

    const body = document.createElement('div');
    body.className = 'popup-filter-body';
    popupFilterHeader.appendChild(body);

    const button_wrapper = document.createElement('div');
    button_wrapper.className = 'custom-header-button-wrapper';
    popupFilterHeader.appendChild(button_wrapper);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'button-ok-filter';
    cancelBtn.textContent = 'clear';
    cancelBtn.style.display = 'inline-block';
    button_wrapper.appendChild(cancelBtn);

    const filterBtn = document.createElement('button');
    filterBtn.className = 'button-ok-filter';
    filterBtn.textContent = 'ok';
    filterBtn.style.display = 'inline-block';
    button_wrapper.appendChild(filterBtn);

    filterBtn.addEventListener('click', () => {
        const option = options.find((e) => e.title == select.value);

        if (!option) return;
        option.onOk(/** @type {HTMLElement | null}*/ (body.firstChild));
    });

    cancelBtn.addEventListener('click', () => {
        const option = options.find((e) => e.title == select.value);

        if (!option) return;
        option.onCancel();
    });

    select.addEventListener('change', function optionChangeHandler() {
        const body = popupFilterHeader.querySelector('.popup-filter-body');
        const option = options.find((e) => e.title == select.value);

        if (!option || !body) return;

        body.innerHTML = '';
        body.appendChild(option.body());
    });

    const option = options.find((e) => e.title == select.value);

    if (option) {
        body.innerHTML = '';
        body.appendChild(option.body());
    }

    return popupFilterHeader;
}

/**
 * @returns {HTMLTableRowElement}
 */
function customeHeader() {
    const tableHeader = document.createElement('tr');

    const col = document.createElement('th');
    col.insertAdjacentHTML('beforeend', 'Check');
    tableHeader.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('th');

        const headerPopupWrapper = document.createElement('DIV');
        headerPopupWrapper.setAttribute('class', 'header-popup-wrapper');

        const title = document.createElement('SPAN');
        headerPopupWrapper.appendChild(title);
        title.className = 'custom-header-title';
        title.textContent = key;

        const iconWrapper = document.createElement('SPAN');
        iconWrapper.className = 'custom-header-icon-wrapper';
        headerPopupWrapper.appendChild(iconWrapper);

        const icon = document.createElement('I');
        icon.setAttribute('class', 'fa-solid fa-caret-down');
        iconWrapper.appendChild(icon);

        const dropDownPopup = createDropdownFilter([
            {
                title: 'text',
                body: () => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = 'search';
                    return input;
                },
                onOk: (element) => {
                    if (!HTMLElement) return;

                    console.log(element);

                    const i1 = /**@type {HTMLInputElement} */ (element).value;

                    advancedSearch(undefined, (v) => {
                        const td = v.querySelector('td[key=' + key + ']');
                        const text = (td?.textContent || '').toLowerCase();

                        console.log(text.includes(i1.toLowerCase()));

                        return text.includes(i1.toLowerCase());
                    });
                },
                onCancel: () => {
                    console.log('cancel');
                },
            },
            {
                title: 'date-range',
                body: () => {
                    const div = document.createElement('div');
                    div.style.display = 'flex';
                    div.style.flexDirection = 'column';

                    const input1 = document.createElement('input');
                    input1.type = 'date';
                    div.appendChild(input1);

                    const input2 = document.createElement('input');
                    input2.type = 'date';
                    div.appendChild(input2);

                    return div;
                },
                onOk: (element) => {
                    console.log(element);
                },
                onCancel: () => {
                    console.log('cancel');
                },
            },
        ]);
        headerPopupWrapper.appendChild(dropDownPopup);

        /**
         * @param {MouseEvent} event
         */
        function handleClickOutside(event) {
            const target = /**@type {HTMLElement}*/ (event.target);
            if (target.isSameNode(iconWrapper) || iconWrapper.contains(target))
                return;

            if (
                !dropDownPopup.isSameNode(target) &&
                !dropDownPopup.contains(target)
            ) {
                dropDownPopup.style.display = 'none';
                document.removeEventListener('click', handleClickOutside);
            }
        }

        iconWrapper.addEventListener('click', () => {
            if (dropDownPopup.style.display == 'none') {
                dropDownPopup.style.display = 'flex';
                document.addEventListener('click', handleClickOutside);
            } else {
                dropDownPopup.style.display = 'none';
                document.removeEventListener('click', handleClickOutside);
            }
        });

        col.appendChild(headerPopupWrapper);

        tableHeader.appendChild(col);
    });

    return tableHeader;
}

/**
 * TODO: làm sao đây
 * @param {(a: HTMLTableRowElement, b: HTMLTableRowElement) => number} [compareFn]
 * @param {(value: HTMLTableRowElement, index: number, array: HTMLTableRowElement[]) => any} [predicate]
 */
function advancedSearch(compareFn, predicate) {
    console.log('test');

    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );

    let rows = /**@type {HTMLTableRowElement[]} */ (Array.from(table.rows));

    rows = rows.filter((e) => !!e.getAttribute('id-row'));

    if (predicate) {
        rows = rows.filter(predicate);
    }

    if (compareFn) rows.sort(compareFn);

    rows.forEach((e, i) => {
        table.insertBefore(e, table.rows[i + 1]);
    });

    const ids = rows.map((e) => e.getAttribute('id-row'));
    table.querySelectorAll('tr[id-row]').forEach((e) => {
        const id = e.getAttribute('id-row');

        if (!ids.includes(id)) {
            /**@type {HTMLElement}*/ (e).style.display = 'none';
        } else {
            /**@type {HTMLElement}*/ (e).style.display = '';
        }
    });
}

/**
 * @returns {Promise<void>}
 */
async function doSave() {
    const updateValues = Object.values(cacheEdit);

    const promiseUpdate = updateValues.map((e) => {
        return fakeDatabase.updateOrder(e);
    });

    await Promise.all(promiseUpdate);

    tableClearErrorKey();
}

/**
 * @returns {void}
 */
function removeAllChange() {
    cacheEdit = {};
    document.querySelectorAll('tr').forEach((e) => {
        let cb = /** @type {HTMLInputElement | null} */ (
            e.querySelector('input[type="checkbox"]')
        );
        if (cb?.checked) {
            cb.checked = false;
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
    doSave: doSave,
    addRow: undefined,
    removeRows: undefined,
    cancelAdd: undefined,
    removeAllChange,
};

export default order;
