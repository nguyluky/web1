import text2htmlElement from '../until/text2htmlElement.js';

/**
 * @template T
 * @param {T[]} values
 * @param {HTMLTableElement} table
 * @param {{[key in keyof T]: string}} cols
 */
export default function renderTable(values, table, cols) {
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
