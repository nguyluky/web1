import text2htmlElement from '../until/text2htmlElement.js';

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
    // const icon = text2htmlElement('<i class="fa-solid fa-filter"></i>');
    col.insertAdjacentHTML('beforeend', 'Check');
    // if (icon) col.appendChild(icon);
    tableHeader.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('th');
        // const icon = text2htmlElement('<i class="fa-solid fa-filter"></i>');

        col.insertAdjacentHTML('beforeend', cols[key]);
        // if (icon) col.appendChild(icon);

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
 * dòng js để tạo một popup rồi thêm vào parder
 * <div class="popup">
 *     <div class="popup-header">
 *         <h1>Xác nhận xóa</h1>
 *         <button class="button_1">
 *             <i class="fa-solid fa-xmark"></i>
 *         </button>
 *     </div>
 *     <div class="pupop-context">Bạn có chắc là muốn xóa 20 dòng không:</div>
 *     <div class="popup-footer">
 *         <button class="button_1 btn-primary">Cancel</button>
 *         <button class="button_1 btn-ouline-primary">OK</button>
 *     </div>
 * </div>
 *
 * @param {HTMLElement} parder
 * @param {string} title
 * @param {string} context
 * @param {(() => void )?} onOk
 * @param {(() => void)?} onCancel
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
