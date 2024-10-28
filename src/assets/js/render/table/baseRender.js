/**
 * @template T
 * @typedef {{ [P in keyof Partial<T>]: string }} COLS
 */

import {
    BaseTableCell,
    BlockTextCell,
    DatetimeTableCell,
    ImgThumbnailCell,
    OptionTableCell,
    StringTableCell,
    TagsInputCell,
} from './CustomElement.js';

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
 * @param {string} key
 * @param {string} value
 * @param {(value: string) => any} onchange
 * @param {boolean} [canEdit]
 * @returns {StringTableCell}
 */
export function createTextSell(key, value, onchange, canEdit = true) {
    // ? what is "IS"
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
    const td = /**@type {StringTableCell} */ (
        document.createElement('td', { is: 'string-cell' })
    );

    td.disable = true;
    td.canEdit = canEdit;
    td.value = value;
    td.defaultValue = value;

    td.setAttribute('key', key);
    td.addEventListener('change', () => onchange(td.value));
    return td;
}

/**
 * @param {string} key
 * @param {string | Date} value
 * @param {(value: Date) => any} onchange
 * @returns {HTMLTableCellElement}
 */
export function createDateTableCell(key, value, onchange) {
    const data = typeof value == 'string' ? new Date(value) : value;

    // ? what is "IS"
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
    const td = /**@type {DatetimeTableCell} */ (
        document.createElement('td', { is: 'datetime-cell' })
    );
    td.disable = true;
    td.value = data;
    td.defaultValue = data;

    td.setAttribute('key', key);
    td.addEventListener('change', () => onchange(td.value));
    return td;
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {{title: string, value: string}[]} options
 * @param {(value: string) => any} onchange
 * @returns {HTMLTableCellElement}
 */
export function createOpstionCell(key, value, options, onchange) {
    // ? what is "IS"
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
    const td = /**@type {OptionTableCell} */ (
        document.createElement('td', { is: 'option-cell' })
    );
    td.setAttribute('key', key);
    td.disable = true;
    td.value = value;
    td.defaultValue = value;
    td.values = options;
    td.addEventListener('change', () => onchange(td.value));
    return td;
}

/**
 * @typedef {import('./CustomElement.js').Tag} Tag
 */

/**
 *
 * @param {string} key
 * @param {string[]} value
 * @param {Tag[]} tags
 * @param {(value: string[]) => any} onchange
 * @returns {TagsInputCell}
 */
export function createTagsCell(key, value, tags, onchange) {
    // ? what is "IS"
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
    const td = /**@type {TagsInputCell} */ (
        document.createElement('td', { is: 'tags-cell' })
    );

    td.setAttribute('key', key);
    td.disable = true;
    td.value = value;
    td.defaultValue = value;
    td.allTags = tags;
    td.addEventListener('change', () => onchange(td.value));

    return td;
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {(value: string) => any} onchange
 * @returns {ImgThumbnailCell}
 */
export function createImgThumbnailCell(key, value, onchange) {
    const td = /**@type {ImgThumbnailCell}*/ (
        document.createElement('td', { is: 'img-thumbnail-cell' })
    );
    td.setAttribute('key', key);
    td.disable = true;
    td.value = value;
    td.defaultValue = value;
    return td;
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {(value: string) => any} onchange
 * @returns
 */
export function createBlockTextCell(key, value, onchange) {
    const td = /**@type {BlockTextCell} */ (
        document.createElement('td', { is: 'block-text-cell' })
    );
    td.setAttribute('key', key);
    td.disable = true;
    td.value = value;
    td.defaultValue = value;
    td.addEventListener('change', () => onchange(td.value));

    return td;
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
    /**@type {NodeListOf<BaseTableCell>} */ (
        row.querySelectorAll('td')
    ).forEach((e) => (e.disable = false));

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
