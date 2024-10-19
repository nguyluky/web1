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
 * @param {OnChange<T>?} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 * @returns {HTMLTableRowElement} - Hàng bảng đã được tạo.
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
            const target = /** @type {HTMLTableCellElement} */ (event.target);
            if (onchange)
                onchange(
                    value,
                    // @ts-ignore
                    key,
                    target.textContent,
                );

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
 * Render bảng HTML với nhiều hàng dữ liệu.
 *
 * @template {{ id: string }} T
 * @param {T[]} values - Dữ liệu để hiển thị.
 * @param {HTMLTableElement} table - Phần tử bảng HTML để render.
 * @param {COLS<T>} cols - Định nghĩa các cột trong bảng.
 * @param {OnChange<T>} [onchange] - Hàm gọi lại khi dữ liệu thay đổi.
 * @param {(value: T, onchange?: OnChange<T>) => HTMLTableRowElement} [cRenderRow]
 *   - Hàm render hàng tùy chỉnh.
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
            return e[key]
                .toUpperCase()
                .includes(valueSearchInput.toUpperCase());
        });
    });

    return result;
}

/**
 * Tạo và hiển thị một popup xác nhận.
 *
 * @param {HTMLElement} parder - Phần tử cha chứa popup.
 * @param {string} title - Tiêu đề của popup.
 * @param {string} context - Nội dung của popup.
 * @param {(() => void)?} onOk - Hàm gọi lại khi người dùng nhấn OK.
 * @param {(() => void)?} onCancel - Hàm gọi lại khi người dùng nhấn Cancel.
 */
function showPopup(parder, title, context, onOk, onCancel) {
    // Create the main popup div
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Create the header
    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    const title_ = document.createElement('h1');
    title_.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.className = 'button_1';
    closeButton.onclick = () => {
        parder.innerHTML = '';
        if (onCancel) onCancel();
    };
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeButton.appendChild(closeIcon);

    // Append header elements
    popupHeader.appendChild(title_);
    popupHeader.appendChild(closeButton);
    popup.appendChild(popupHeader);

    // Create the context
    const popupContext = document.createElement('div');
    popupContext.className = 'pupop-context';
    popupContext.textContent = context;
    popup.appendChild(popupContext);

    // Create the footer
    const popupFooter = document.createElement('div');
    popupFooter.className = 'popup-footer';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'button_1 btn-primary';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = () => {
        parder.innerHTML = '';
        if (onCancel) onCancel();
    };

    const okButton = document.createElement('button');
    okButton.className = 'button_1 btn-ouline-primary';
    okButton.textContent = 'OK';
    okButton.onclick = () => {
        parder.innerHTML = '';
        if (onOk) onOk();
    };

    // Append footer elements
    popupFooter.appendChild(cancelButton);
    popupFooter.appendChild(okButton);
    popup.appendChild(popupFooter);

    parder.appendChild(popup);

    parder.onclick = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.contains(popup)) {
            parder.innerHTML = '';
            if (onCancel) onCancel();
        }
    };
}

/**
 * Fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
 *
 * @template {{ id: string }} T
 * @typedef {{
 *     cols: COLS<T>;
 *     renderTable: (list: T[]) => void;
 *     renderRow?: (value: T) => HTMLTableRowElement;
 *     doSave: () => void;
 *     search: (list: T[]) => void;
 *     addRow: () => void;
 *     removeRows: () => void;
 *     cancelAdd: () => void;
 * }} intefaceRender
 */

export { searchList, renderTable, showPopup };
