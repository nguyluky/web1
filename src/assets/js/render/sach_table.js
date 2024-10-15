import fackDatabase from '../db/fakeDb.js';
import { renderTable, searchList } from './reader_table.js';

/**
 * @typedef {import('../until/type.js').Sach} Sach
 * @typedef {import('../until/type.js').imgStore} imgStore
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
 * @returns {HTMLTableRowElement} row
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
                    /**@type {HTMLTableCellElement}*/ (event.target)
                        .textContent,
                );
        };
        col.setAttribute('key', key);

        if (key == 'details') {
            const details_wrapper = document.createElement('div');
            details_wrapper.className = 'details-wrapper';
            details_wrapper.insertAdjacentHTML('beforeend', value[key]);
            col.appendChild(details_wrapper);
        } else if (key == 'thumbnal') {
            const img_wrapper = document.createElement('div');
            img_wrapper.className = 'img-wrapper';
            const img = document.createElement('img');
            fackDatabase.getImgById(value[key]).then((imgS) => {
                img.src = imgS?.data || '=(';
            });
            img_wrapper.appendChild(img);
            col.appendChild(img_wrapper);
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
    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, undefined, renderRow);

    Array.from(document.getElementsByClassName('details-wrapper')).forEach(
        (e) => {
            if (e.scrollHeight > e.clientHeight) e.classList.add('isOverFlow');
        },
    );
}

/**
 *
 * @param {Sach[]} list
 */
function searchSach(list) {
    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );
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

function addRow() {
    const table = /**@type {HTMLTableElement}*/ (
        document.getElementById('content_table')
    );
    if (!table) return;
    /**@type {Sach}*/
    const data = {
        id: '',
        title: '',
        details: '',
        thumbnal: 'default',
        imgs: [],
        base_price: 0,
        category: [],
        option: [],
    };
    const row = renderRow(data);
    const thumbnal = row.querySelector('td[key="thumbnal"]');
    if (!thumbnal) return;
    if (thumbnal.firstElementChild)
        thumbnal.removeChild(thumbnal.firstElementChild);
    const upFile = document.createElement('input');
    upFile.type = 'file';
    thumbnal.appendChild(upFile);
    table.insertBefore(row, table.childNodes[1]);
    /**@type {HTMLElement} */ (table.parentNode).scrollTo({
        top: 0,
        behavior: 'smooth',
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
    addRow,
    removeRows: () => {
        throw new Error('Làm này đi, đồ lười');
    },
    cancelAdd: () => {
        throw new Error('Làm này đi, đồ lười');
    },
};

export default Sach_;
