import fakeDatabase from '../../db/fakeDBv1.js';
import { validataCart } from '../../until/type.js';
import {
    createCheckBox,
    createTableSellWrapper,
    renderTable,
    searchList,
    tableClearErrorKey,
    tableShowErrorKey,
} from './baseRender.js';

/**
 * @typedef {import('../../until/type.js').Cart} Cart
 * */

const cols = {
    user_id: 'User id',
    sach: 'Sách',
    quantity: 'Số lượng',
    timecreate: 'Ngày thêm',
};

/**
 * @type {{
 * [Key: string]: Cart;
 * }}
 */
const cacheSave = {};

/**
 * Hàm xử lý khi có thay đổi dữ liệu trên bảng (hàm callback)
 *
 * @type {import('./baseRender.js').OnChange<Cart>}
 */
function handleOnChangeRow(data, key, newValue) {
    if (cacheSave[data.id]) {
        cacheSave[data.id] = {
            ...cacheSave[data.id],
            [key]: newValue,
        };
        return;
    }

    cacheSave[data.id] = {
        ...data,
        [key]: newValue,
    };
}

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

    const tdUserName = createTableSellWrapper('user_id');
    fakeDatabase.getUserInfoByUserId(value['user_id']).then((user) => {
        tdUserName.textContent = user?.name || '';
    });
    tdUserName.removeAttribute('key');
    tr.appendChild(tdUserName);

    const tdSach = createTableSellWrapper('sach');
    fakeDatabase.getSachById(value['sach']).then((sach) => {
        tdSach.textContent = sach?.title || '';
    });
    tdSach.removeAttribute('key');
    tdSach.style.minWidth = '100px';
    tr.appendChild(tdSach);

    const tdSoLuong = createTableSellWrapper('quantity');
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

    const tdDate = createTableSellWrapper('timecreate');
    const dateTimeInput = document.createElement('input');
    dateTimeInput.type = 'datetime-local';
    dateTimeInput.className = 'custom-datetime-input';
    const dateTimeStringValue = (
        typeof value['timecreate'] == 'string'
            ? value['timecreate']
            : value['timecreate'].toISOString()
    )
        .split('.')[0]
        .replace('Z', '');

    dateTimeInput.value = dateTimeStringValue;

    dateTimeInput.addEventListener('change', () => {
        console.log(dateTimeInput.value);
        const date = new Date(dateTimeInput.value);
        onchange && onchange(value, 'timecreate', date);
    });

    tdDate.appendChild(dateTimeInput);
    tr.appendChild(tdDate);

    return tr;
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

async function cartDoSave() {
    const saveValues = Object.values(cacheSave);
    let hasError = false;
    saveValues.forEach((cart) => {
        const errors = validataCart(cart);

        if (!errors.length) return;

        hasError = true;
        errors.forEach((error) => {
            tableShowErrorKey(cart.id, error.key, error.msg);
        });
    });

    if (hasError) {
        throw Error('Có lỗi xảy ra');
    }

    saveValues.forEach((cart) => {
        fakeDatabase.updateCart(cart);
    });

    tableClearErrorKey();

    document.querySelectorAll('#content_table td').forEach((e) => {
        e.setAttribute('contenteditable', 'false'); // Khóa không cho chỉnh sửa
        e.setAttribute('ischange', 'false'); // Đặt lại trạng thái là không thay đổi
        e.setAttribute('default-value', e.textContent || ''); // Cập nhật giá trị mặc định
    });
}

/** @type {import('./baseRender.js').IntefaceRender<Cart>} */
const Cart_ = {
    cols,
    renderTable: renderCart,
    search: searchCart,
    doSave: cartDoSave,
    addRow: () => {
        throw new Error('Tam thời chưa cần thiết cho lắm');
    },
    removeRows: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    cancelAdd: () => {
        throw new Error('Làm này đi, đồ lười');
    },
};

export default Cart_;
