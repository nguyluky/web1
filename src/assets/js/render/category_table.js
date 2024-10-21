import { renderTable, searchList } from './baseRender.js';

/** @typedef {import('../until/type.js').Category} Category */

const cols = {
    id: 'Id',
    name: 'Name',
    long_name: 'Long Name',
};

/** @param {Category[]} list */
function renderCategory(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols);
}

/** @param {Category[]} list */
function searchCategory(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(searchList(list, cols), table, cols);
}

/** @type {import('./baseRender.js').IntefaceRender<Category>} */
const Category_ = {
    cols,
    renderTable: renderCategory,
    search: searchCategory,
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

export default Category_;
