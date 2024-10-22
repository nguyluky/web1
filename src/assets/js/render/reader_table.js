import text2htmlElement from '../until/text2htmlElement.js';
import elementFactory from './elementFactory.js';

/**
 * @template T
 * @typedef {{[P in keyof Partial<T>]: string}} COLS
 */

/**
 * @template T
 * @typedef {(data : T, key: keyof T, newValue: T[key]) => void} OnChange
 */

/**
 * @template {{id: string}} T
 * @param {T} value
 * @param {COLS<T>} cols
 * @param {OnChange<T>?} onchange
 * @returns {HTMLTableRowElement} r
 */
export function defaultRenderRow(value, cols, onchange = null) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);

    // thêm check box
    const col = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value['id'];
    checkbox.className = 'table-check-box';
    col.appendChild(checkbox);
    row.appendChild(col);

    // thêm các phần khác
    Object.keys(cols).forEach((key) => {
        const col = document.createElement('td');
        col.oninput = (event) => {
            const target = /**@type {HTMLTableCellElement}*/ (event.target);
            if (onchange)
                onchange(
                    value,
                    // @ts-ignore
                    key,
                    target.textContent,
                );

            if (target.textContent == target.getAttribute('default-value'))
                col.setAttribute('ischange', 'false');
            else col.setAttribute('ischange', 'true');
        };
        // col.setAttribute('contenteditable', 'true');
        col.setAttribute('ischange', 'false');
        col.setAttribute('key', key);
        col.setAttribute('default-value', value[key] || '');
        col.insertAdjacentHTML('beforeend', value[key] || '');
        row.appendChild(col);
    });

    return row;
}

/**
 * @template {{id: string}} T
 * @param {T[]} values
 * @param {HTMLTableElement} table
 * @param {COLS<T>} cols
 * @param {OnChange<T>| undefined} onchange
 * @param {((key: T, onchange?: OnChange<T>) => HTMLTableRowElement) | undefined} cRenderRow
 */
function renderTable(
    values,
    table,
    cols,
    onchange = undefined,
    cRenderRow = undefined,
) {
    table.innerHTML = '';

    const tableHeader = document.createElement('tr');

    // render table
    // check
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

    if (cRenderRow) {
        values.forEach((value, index) => {
            const row = cRenderRow(value, onchange);
            table.appendChild(row);
        });
    } else
        values.forEach((value, index) => {
            const row = defaultRenderRow(value, cols, onchange);
            table.appendChild(row);
        });
}

/**
 * @template {{id: string}} T
 * @param {T[]} values
 * @param {COLS<T>} cols
 * @returns {T[]} ok
 */
function searchList(values, cols) {
    const searchInput = /**@type {HTMLInputElement}*/ (
        document.getElementById('search-input')
    );
    if (!searchInput) return [];
    let valueSearchInput = searchInput.value;
    let result = values.filter((e) => {
        return Object.keys(cols).some((key) => {
            if (e[key] === undefined) return false;
            return e[key]
                .toUpperCase()
                .includes(valueSearchInput.toUpperCase());
        });
    });

    return result;
}

/**
 *
 * @param {HTMLElement} parder
 * @param {string} title
 * @param {string} context
 * @param {() => void} [onOk]
 * @param {() => void} [onCancel]
 */
function showPopup(parder, title, context, onOk, onCancel) {
    const popup = elementFactory.popupElementAdmin(
        title,
        context,
        () => {
            parder.innerHTML = '';
            onOk && onOk();
        },
        () => {
            parder.innerHTML = '';
            onCancel && onCancel();
        },
    );

    parder.appendChild(popup);

    parder.onclick = (event) => {
        const target = /**@type {HTMLElement}*/ (event.target);
        if (target.contains(popup)) {
            parder.innerHTML = '';
            if (onCancel) onCancel();
        }
    };
}

/**
 *
 * fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
 *
 * @template {{id: string}} T
 * @typedef {{
 * cols: COLS<T>,
 * renderTable: (list: T[]) => void,
 * renderRow?: (value: T) => HTMLTableRowElement,
 * doSave: () => void,
 * search: (list: T[]) => void,
 * addRow: () => void,
 * removeRows: () => void,
 * cancelAdd: () => void
 * }} intefaceRender
 */

export { searchList, renderTable, showPopup };
