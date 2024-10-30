import fakeDatabase from '../../db/fakeDBv1.js';
import { validataCart } from '../../until/type.js';
import {
    createCheckBox,
    getAllRowsSeletion,
    removeRowById,
    renderTable,
    searchList,
    tableClearErrorKey,
    tableShowErrorKey,
} from './baseRender.js';
import { createDateTimeTableCell } from './customCell.js';
import { createTextTableCell } from './customCell.js';

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
 * @param {HTMLTableRowElement} row
 * @param {Cart} value
 * @param {import('./baseRender.js').OnChange<Cart>} [onchange]
 */
function createRow(row, value, onchange) {
    Object.keys(cols).forEach((key) => {
        switch (key) {
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
            case 'sach': {
                const sachCell = createTextTableCell(
                    'sach',
                    value.sach,
                    (nv) => {
                        onchange && onchange(value, 'sach', nv);
                    },
                );

                fakeDatabase.getSachById(value.sach).then((sach) => {
                    sachCell.textContent = sach?.title || '';
                    sachCell.setAttribute('default-value', sach?.title || '');
                });

                row.appendChild(sachCell);

                break;
            }
            case 'timecreate': {
                const date = createDateTimeTableCell(
                    key,
                    value.timecreate,
                    (nv) => {
                        onchange && onchange(value, 'timecreate', nv);
                    },
                );
                row.appendChild(date);
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
}

/** @param {Cart[]} list */
function renderCart(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, handleOnChangeRow, createRow);
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

function removeRows() {
    const rows = getAllRowsSeletion();
    rows.forEach((id) => {
        fakeDatabase.deleteCardById(id);
        removeRowById(id);
    });
}

/** @type {import('./baseRender.js').IntefaceRender<Cart>} */
const Cart_ = {
    cols,
    renderTable: renderCart,
    search: searchCart,
    doSave: cartDoSave,
    removeRows: removeRows,
};

export default Cart_;
