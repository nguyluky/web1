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
 * @param {string} key_name
 * @returns {HTMLTableCellElement}
 */
export function createTableSell(key_name) {
    const col = document.createElement('td');
    col.setAttribute('ischange', 'false');
    col.setAttribute('key', key_name);
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
        const col = createTableSell(key);
        col.oninput = (event) => {
            const target = /** @type {HTMLTableCellElement} */ (event.target);
            if (onchange)
                onchange(
                    value,
                    // @ts-ignore
                    key,
                    target.textContent,
                );

            // TODO: nhớ thêm vào vào
            // Đánh dấu cột nếu dữ liệu đã thay đổi
            if (target.textContent == target.getAttribute('default-value'))
                col.setAttribute('ischange', 'false');
            else col.setAttribute('ischange', 'true');
        };
        col.setAttribute('default-value', value[key] || '');
        col.insertAdjacentHTML('beforeend', value[key] || '');
        row.appendChild(col);
    });

    return row;
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
    });

    return dateTimeInput;
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
