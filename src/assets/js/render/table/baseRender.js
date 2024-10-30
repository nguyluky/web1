/**
 * @template T
 * @typedef {{ [P in keyof Partial<T>]: string }} COLS
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
 * @param {string} key
 * @param {string} value
 * @param {(nv: string) => any} [onchange]
 * @param {boolean} [canEditable]
 * @returns
 */
export function createTextTableCell(key, value, onchange, canEditable = true) {
    const td = document.createElement('td');
    td.textContent = value;
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'text');
    td.setAttribute('default-value', value);

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    td.addEventListener('input', () => {
        onchange && onchange(td.textContent || '');

        if (td.textContent == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    });

    return td;
}

/**
 *
 * @param {string} key
 * @param {Date | string} value
 * @param {(nv: Date) => any} [onchange ]
 * @param {boolean} [canEditable ]
 * @returns
 */
export function createDateTimeTableCell(
    key,
    value,
    onchange,
    canEditable = true,
) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'date-time');
    td.setAttribute('default-value', String(value));

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

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

        onchange && onchange(date);

        if (String(date) == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    });

    td.appendChild(dateTimeInput);

    return td;
}

/**
 *
 * @param {string} key
 * @param {number} value
 * @param {(nv: number) => any} [onchange]
 * @param {boolean} [canEditable]
 */
export function createNumberTableCell(
    key,
    value,
    onchange,
    canEditable = true,
) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'number');
    td.setAttribute('default-value', value + '');
    td.textContent = value + '';

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    td.addEventListener('keypress', (e) => {
        if (isNaN(+String.fromCharCode(e.which))) e.preventDefault();
    });

    td.addEventListener('input', () => {
        onchange && onchange(+(td.textContent || '0'));

        if (td.textContent == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    });

    return td;
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {{title: string, value: string}[]} options
 * @param {(nv: string) => any} [onchange]
 */
export function createOptionTabelCell(key, value, options, onchange) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'option');
    td.setAttribute('default-value', value);

    const select = document.createElement('select');
    options.forEach((e) => {
        const op = document.createElement('option');
        op.value = e.value;
        op.textContent = e.title;
        select.appendChild(op);
    });

    select.value = value;
    select.addEventListener('change', () => {
        console.log('change status');

        onchange && onchange(select.value);

        if (select.value == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    });

    td.appendChild(select);

    return td;
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
 *
 * @param {string} key
 * @param {string} value
 * @param {(nv: string) => any} onchange
 * @returns
 */
export function createBlockTextTabelCell(key, value, onchange) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'block-text');
    td.setAttribute('default-value', value);

    const details_wrapper = document.createElement('div');
    details_wrapper.className = 'details-wrapper';
    details_wrapper.insertAdjacentHTML('beforeend', value);

    details_wrapper.addEventListener('input', () => {
        onchange && onchange(details_wrapper.textContent || '');

        if (details_wrapper.textContent == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    });

    td.appendChild(details_wrapper);
    return td;
}

// ====================Render====================

/**
 * Tạo một hàng bảng HTML dựa trên dữ liệu cung cấp.
 *
 * @template {{ id: string }} T
 * @param {HTMLTableRowElement} row
 * @param {T} value - Dữ liệu của hàng.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @param {OnChange<T>} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 */
export function renderDefaultRow(row, value, cols, onchange) {
    // thêm check box
    const col = createCheckBox(value['id']);
    row.appendChild(col);

    // thêm các phần khác
    Object.keys(cols).forEach((key) => {
        const col = createTextTableCell(key, value[key], (nv) => {
            // @ts-ignore
            onchange && onchange(value, key, nv);
        });
        row.appendChild(col);
    });
}

/**
 * @template {{ id: string }} T
 * @param {T[]} values - Dữ liệu để hiển thị.
 * @param {HTMLTableElement} table - Phần tử bảng HTML để render.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @param {OnChange<T>} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 * @param {(row: HTMLTableRowElement, value: T, onchange?: OnChange<T>) => any} [cRenderRow]
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
        table.appendChild(createRow(value, cols, onchange, cRenderRow));
    });
}

/**
 * @template {{id: string}} T
 * @param {T} value
 * @param {COLS<T>} cols
 * @param {OnChange<T>} [onchange]
 * @param {(row: HTMLTableRowElement, value: T, onchange?: OnChange<T>) => any} [cRenderRow]
 */
export function createRow(value, cols, onchange, cRenderRow) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);

    const check = createCheckBox(value.id);
    row.appendChild(check);

    cRenderRow
        ? cRenderRow(row, value, onchange)
        : renderDefaultRow(row, value, cols, onchange);

    return row;
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
