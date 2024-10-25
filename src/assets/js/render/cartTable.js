import fakeDatabase from '../db/fakeDBv1.js';
import {
    createCheckBox,
    createTableSell,
    renderTable,
    searchList,
} from './baseRender.js';

/** @typedef {import('../until/type.js').Cart} Cart */

const cols = {
    user_id: 'User id',
    sach: 'Sách',
    quantity: 'Số lượng',
    timecreate: 'Ngày thêm',
};

/**
 *
 * @param {Cart} value
 * @param {import('./baseRender.js').OnChange<Cart>} [onchange]
 * @returns {HTMLTableRowElement}
 */
function createRowCart(value, onchange) {
    const tr = document.createElement('tr');
    tr.setAttribute('id-row', value.id);

    const td = createCheckBox(value['id']);
    tr.appendChild(td);

    const tdUserName = createTableSell('user_id');
    fakeDatabase.getUserInfoByUserId(value['user_id']).then((user) => {
        tdUserName.textContent = user?.name || '';
    });
    tdUserName.removeAttribute('key');
    tr.appendChild(tdUserName);

    const tdSach = createTableSell('sach');
    fakeDatabase.getSachById(value['sach']).then((sach) => {
        tdSach.textContent = sach?.title || '';
    });
    tdSach.removeAttribute('key');
    tdSach.style.minWidth = '100px';
    tr.appendChild(tdSach);

    const tdSoLuong = createTableSell('quantity');
    tdSoLuong.textContent = value['quantity'] + '';
    tdSoLuong.setAttribute('default-value', value['quantity'] + '');
    tr.appendChild(tdSoLuong);

    tdSoLuong.addEventListener('input', () => {
        onchange &&
            onchange(value, 'quantity', +(tdSoLuong.textContent || '0'));

        tdSoLuong.getAttribute('default-value') == tdSoLuong.textContent
            ? td.setAttribute('ischange', 'false')
            : td.setAttribute('ischange', 'true');
    });

    const tdDate = createTableSell('timecreate');
    const dateTimeInput = document.createElement('input');
    dateTimeInput.type = 'datetime-local';
    dateTimeInput.className = 'custom-datetime-input';
    const dateTimeStringValue =
        typeof value['timecreate'] == 'string'
            ? value['timecreate']
            : value['timecreate'].toISOString().replace('Z', '');

    tdDate.setAttribute('default-value', dateTimeStringValue);
    dateTimeInput.value = dateTimeStringValue.split('.')[0];

    dateTimeInput.addEventListener('change', () => {
        console.log(dateTimeInput.value);
        const date = new Date(dateTimeInput.value);
        onchange && onchange(value, 'timecreate', date);
    });

    tdDate.appendChild(dateTimeInput);
    tr.appendChild(tdDate);

    return tr;
}

/**
 * Hàm xử lý khi có thay đổi dữ liệu trên bảng (hàm callback)
 *
 * @type {import('./baseRender.js').OnChange<Cart>}
 */
function handleOnChangeRow(data, key, newValue) {
    // console.log(data, key, newValue);
}

/** @param {Cart[]} list */
function renderCart(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, handleOnChangeRow, createRowCart);
}

/** @param {Cart[]} list */
function searchCart(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;
    const result = searchList(list, cols);

    renderTable(result, table, cols);
}

/** @type {import('./baseRender.js').IntefaceRender<Cart>} */
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
    removeRows: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    cancelAdd: () => {
        throw new Error('Làm này đi, đồ lười');
    },
};

export default Cart_;
