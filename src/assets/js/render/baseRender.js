/**
 * File này định nghĩa các chức năng để render bảng dữ liệu (table), tìm kiếm dữ
 * liệu (search), và hiển thị popup xác nhận. File sử dụng các kiểu dữ liệu tổng
 * quát (generic types) để áp dụng cho nhiều loại dữ liệu khác nhau, dựa vào các
 * đặc tính chung như id.
 */

/**
 * @template T
 * @typedef {{ [P in keyof Partial<T>]: string }} COLS
 */

/**
 * @template T
 * @typedef {(data: T, key: keyof T, newValue: T[key]) => void} OnChange
 */

/**
 * Tạo một hàng bảng HTML dựa trên dữ liệu cung cấp.
 *
 * @template {{ id: string }} T
 * @param {T} value - Dữ liệu của hàng.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @param {OnChange<T>} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 * @returns {HTMLTableRowElement} - Hàng bảng đã được tạo.
 */
export function defaultRenderRow(value, cols, onchange) {
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

    values.forEach((value, index) => {
        const row = cRenderRow
            ? cRenderRow(value, onchange)
            : defaultRenderRow(value, cols, onchange);
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
