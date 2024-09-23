import text2htmlElement from '../until/text2htmlElement.js';

/**
 * @template T
 * @param {T[]} values
 * @param {HTMLTableElement} table
 * @param {{[key in keyof T]: string}} cols
 */
function renderTable(values, table, cols) {
    table.innerHTML = '';

    const tableHeader = document.createElement('tr');

    // render table
    const col = document.createElement('th');
    const icon = text2htmlElement('<i class="fa-solid fa-filter"></i>');
    col.insertAdjacentHTML('beforeend', 'Check');
    if (icon) col.appendChild(icon);
    tableHeader.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('th');
        const icon = text2htmlElement('<i class="fa-solid fa-filter"></i>');

        col.insertAdjacentHTML('beforeend', cols[key]);
        if (icon) col.appendChild(icon);

        tableHeader.appendChild(col);
    });

    table.appendChild(tableHeader);

    values.forEach((value, index) => {
        const row = document.createElement('tr');

        const col = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'table-check-box';
        col.appendChild(checkbox);
        row.appendChild(col);

        Object.keys(cols).forEach((key) => {
            const col = document.createElement('td');

            col.insertAdjacentHTML('beforeend', value[key]);
            row.appendChild(col);
        });

        table.appendChild(row);
    });
}

/**
 * @template T
 * @param {T[]} values
 * @param {{[key in keyof T]: string}} cols
 */
function searchList(values, cols) {
    const searchInput = /**@type {HTMLInputElement}*/ (document.getElementById('search-input'));
    if (!searchInput) return;
    let valueSearchInput = searchInput.value;
    let result = values.filter((e) => {
        return Object.keys(cols).some((key) => {
            if (e[key] === undefined) return false;
            return e[key].toUpperCase().includes(valueSearchInput.toUpperCase());
        });
    });
    let table = /**@type {HTMLTableElement}*/ (document.getElementById('content_table'));
    if (!table) return;
    renderTable(result, table, cols);
}

export { searchList, renderTable };
