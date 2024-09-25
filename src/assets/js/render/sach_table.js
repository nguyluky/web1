import fackDatabase from '../db/fakeDb.js';
import { renderTable, searchList } from './reader_table.js';

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
 * @param {import('../db/fakeDb').Sach} value
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
 * @param {import("../db/fakeDb").Sach[]} list
 */
export function renderSach(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    renderTable(list, table, cols, null, renderRow);
}

/**
 *
 * @param {import("../db/fakeDb").Sach[]} list
 */
export function searchSach(list) {
    const table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;

    const result = searchList(list, cols);
    renderTable(result, table, cols, null, renderRow);
}
