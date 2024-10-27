/**
 * @template T
 * @typedef {{ [P in keyof Partial<T>]: string }} COLS
 */

/**
 * @template T
 * @typedef {(value: T) => any} cellChange
 */

/**
 * @template T
 * @typedef {(data: T, key: keyof T, newValue: T[key]) => void} OnChange
 */

// ==================Error show & hide===================
/**
 *
 * @param {string} id
 * @param {string} key
 * @param {string} msg
 */
export function tableShowErrorKey(id, key, msg) {
    const col = document?.querySelector(`tr[id-row="${id}"] td[key="${key}"]`);
    col?.setAttribute('error', msg);
}

/**
 * xóa toàn bộ error
 */
export function tableClearErrorKey() {
    document
        .querySelectorAll('td[error]')
        .forEach((e) => e.removeAttribute('error'));
}

// ===================Create element function==================

/**
 *
 * @param {HTMLElement} element
 * @returns {HTMLTableCellElement | undefined}
 */
function getTableCell(element) {
    while (element && element.tagName != 'TD') {
        element = /**@type {HTMLElement}*/ (element.parentElement);
    }

    return /**@type {HTMLTableCellElement} */ (element);
}

/**
 *
 * @param {string} value_id
 * @returns {HTMLTableCellElement}
 */
export function createCheckBox(value_id) {
    const col = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value_id;
    checkbox.className = 'table-check-box';
    col.appendChild(checkbox);
    return col;
}

/**
 * Tạo một hàng bảng HTML dựa trên dữ liệu cung cấp.
 *
 * @template {{ id: string }} T
 * @param {T} value - Dữ liệu của hàng.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @param {OnChange<T>} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 * @returns {HTMLTableRowElement} - Hàng bảng đã được tạo.
 */
export function createDefaultRow(value, cols, onchange) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);

    // thêm check box
    const col = createCheckBox(value['id']);
    row.appendChild(col);

    // thêm các phần khác
    Object.keys(cols).forEach((key) => {
        const col = createTextSell(key, value[key], (nv) => {
            // @ts-ignore
            onchange && onchange(value, key, nv);
        });
        row.appendChild(col);
    });

    return row;
}

/**
 *
 * @param {string} key_name
 * @returns {HTMLTableCellElement}
 */
export function createTableSellWrapper(key_name) {
    const col = document.createElement('td');
    col.setAttribute('ischange', 'false');
    col.setAttribute('key', key_name);
    return col;
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {(value: string) => any} onchange
 * @param {boolean} [canEdit]
 * @returns
 */

export function createTextSell(key, value, onchange, canEdit = true) {
    const td = document.createElement('td');
    td.setAttribute('ischange', 'false');

    const input = document.createElement('input');
    input.value = value;

    td.appendChild(input);

    input.addEventListener('change', () => {
        onchange(input.value);

        if (input.value == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    });

    td.setAttribute('type', 'string');
    td.setAttribute('key', key);
    td.setAttribute('default-value', value);

    return td;
}

/**
 *
 * @param {string | Date} value
 * @param {(value: Date) => any} onchange
 * @returns {HTMLInputElement}
 */
export function createDateTableCell(value, onchange) {
    const dateTimeInput = document.createElement('input');
    dateTimeInput.type = 'datetime-local';
    dateTimeInput.className = 'custom-datetime-input';
    const dateTimeStringValue = (
        typeof value == 'string' ? value : value.toISOString()
    )
        .split('.')[0]
        .replace('Z', '');

    dateTimeInput.value = dateTimeStringValue;

    dateTimeInput.addEventListener('change', () => {
        console.log(dateTimeInput.value);
        const date = new Date(dateTimeInput.value);
        onchange(date);

        const col = getTableCell(dateTimeInput);

        if (!col) return;
        if (String(date) == col.getAttribute('default-value')) {
            col.setAttribute('ischange', 'false');
        } else {
            col.setAttribute('ischange', 'true');
        }
    });

    return dateTimeInput;
}

/**
 *
 * @param {string} value
 * @param {{title: string, value: string}[]} options
 * @param {(value: string) => any} onchange
 * @returns {HTMLElement}
 */
export function createOpstionCell(value, options, onchange) {
    const select = document.createElement('select');

    options.forEach((e) => {
        const op = document.createElement('option');
        op.value = e.value;
        op.textContent = e.title;
        select.appendChild(op);
    });

    select.value = value;
    select.addEventListener('change', () => {
        onchange(select.value);

        const col = getTableCell(select);
        if (!col) return;
        if (String(select.value) == col.getAttribute('default-value')) {
            col.setAttribute('ischange', 'false');
        } else {
            col.setAttribute('ischange', 'true');
        }
    });

    return select;
}

// ====================Render====================

/**
 * @template {{ id: string }} T
 * @param {T[]} values - Dữ liệu để hiển thị.
 * @param {HTMLTableElement} table - Phần tử bảng HTML để render.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @param {OnChange<T>} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 * @param {(value: T, onchange?: OnChange<T>) => HTMLTableRowElement} [cRenderRow]
 *   - Hàm render hàng tùy chỉnh.
 *
 *   {@link https://github.com/nguyluky/web1/blob/main/docs/RENDER_TABLE.md} for
 *   more information.
 */
function renderTable(values, table, cols, onchange, cRenderRow) {
    table.innerHTML = '';

    const tableHeader = document.createElement('tr');

    // render table
    // check
    const col = document.createElement('th');
    col.insertAdjacentHTML('beforeend', 'Check');
    tableHeader.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('th');

        col.insertAdjacentHTML('beforeend', cols[key]);

        tableHeader.appendChild(col);
    });

    table.appendChild(tableHeader);

    values.forEach((value) => {
        const row = cRenderRow
            ? cRenderRow(value, onchange)
            : createDefaultRow(value, cols, onchange);
        table.appendChild(row);
    });
}

/**
 * Tìm kiếm trong danh sách dựa trên input tìm kiếm và cột.
 *
 * @template {{ id: string }} T
 * @param {T[]} values - Danh sách dữ liệu để tìm kiếm.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @returns {T[]} - Danh sách các giá trị tìm kiếm được.
 *
 *   {@link https://github.com/nguyluky/web1/blob/main/docs/SEARCH_LIST.md} for
 *   more information.
 */
function searchList(values, cols) {
    const searchInput = /** @type {HTMLInputElement} */ (
        document.getElementById('search-input')
    );
    if (!searchInput) return [];
    let valueSearchInput = searchInput.value;
    let result = values.filter((e) => {
        return Object.keys(cols).some((key) => {
            if (e[key] === undefined) return false;
            return String(e[key])
                .toUpperCase()
                .includes(valueSearchInput.toUpperCase());
        });
    });

    return result;
}

/**
 *
 * @param {HTMLTableElement} table
 * @param {HTMLTableRowElement} row
 */
export function defaultAddRow(table, row) {
    row.setAttribute('isAddCache', 'true');

    // Cho phép chỉnh sửa các ô trong hàng mới
    row.querySelectorAll('td[key]').forEach((e) =>
        e.setAttribute('contenteditable', 'true'),
    );

    // Thêm hàng mới lên đầu bảng
    table.insertBefore(row, table.childNodes[1]);

    row.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
    });
}

/**
 * remove row add templay
 */
export function defaultRemoveAddRow() {
    document.querySelector(`tr[isAddCache="true"]`)?.remove();
}

/**
 * @returns {string[]}
 */
export function getRowsSeletion() {
    return Array.from(document.querySelectorAll('tr'))
        .filter((tr) => {
            return /**@type {HTMLInputElement}*/ (
                tr.querySelector('input[type="checkbox"]')
            )?.checked;
        })
        .map((row) => row.getAttribute('id-row') || '');
}

/**
 *
 * @param {string} id
 */
export function removeRowById(id) {
    document.querySelector(`tr[id-row='${id}']`)?.remove();
}

/**
 * Fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
 *
 * @template {{ id: string }} T
 * @typedef {{
 *     cols: COLS<T>;
 *     renderTable: (list: T[]) => void;
 *     renderRow?: (value: T) => HTMLTableRowElement;
 *     doSave: () => Promise<?>;
 *     search: (list: T[]) => void;
 *     addRow: () => void;
 *     removeRows: () => void;
 *     cancelAdd: () => void;
 * }} IntefaceRender
 */

export { searchList, renderTable };
