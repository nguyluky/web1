import fackDatabase from '../db/fakeDb.js';
import { renderTable, searchList } from './reader_table.js';

/**
 * @typedef {import('../db/fakeDb').Sach} Sach
 */

const cols = {
    id: 'Id',
    title: 'Title',
    base_price: 'Price',
    details: 'Details',
    thumbnal: 'Thumbnal',
    // imgs: 'imgs',
    // category: 'Category',
    // option: 'Option',
};

/**
 *
 * @param {Sach} value
 */
function renderRow(value) {
    const row = document.createElement('tr');

    const col = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value['id'];
    checkbox.className = 'table-check-box';
    col.appendChild(checkbox);
    row.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('td');
        col.oninput = (event) => {
            if (onchange)
                onchange(
                    value,
                    // @ts-ignore
                    key,
                    /**@type {HTMLTableCellElement}*/ (event.target).textContent,
                );
        };
        col.setAttribute('key', key);

        if (key == 'thumbnal') {
            const img = document.createElement('img');
            img.src = fackDatabase.getImgById(value[key])?.data || '=(';
            col.appendChild(img);
        } else col.insertAdjacentHTML('beforeend', value[key]);
        row.appendChild(col);
    });

    return row;
}

/**
 *
 * @param {Sach[]} list
 */
function renderSach(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols, null, renderRow);
}

/**
 *
 * @param {Sach[]} list
 */
function searchSach(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    const result = searchList(list, cols).map((e) => e.id);
    document.querySelectorAll('#content_table > tr[id-row]').forEach((e) => {
        const id = e.getAttribute('id-row') || '';
        if (result.includes(id)) {
            /**@type {HTMLElement}*/ (e).style.display = '';
        } else {
            /**@type {HTMLElement}*/ (e).style.display = 'none';
        }
    });
}

/**
 * @type {import('./reader_table.js').intefaceRender<Sach>}
 */
const Sach_ = {
    cols,
    renderTable: renderSach,
    renderRow,
    search: searchSach,
    doSave: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    addRow: () => {
        throw new Error('Làm này đi, đồ lười');
    },
};

export default Sach_;
