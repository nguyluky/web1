import text2htmlElement from '../until/text2htmlElement.js';

/**
 * @template T
 * @typedef {(data : T, key: keyof T, newValue: T[key]) => void} OnChange
 */

/**
 * @template {{id: string}} T
 * @param {T[]} values
 * @param {HTMLTableElement} table
 * @param {{[key in keyof T]: string}} cols
 * @param {OnChange<T>?} onchange
 */
function renderTable(values, table, cols, onchange = null) {
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

    values.forEach((value, index) => {
        const row = document.createElement('tr');

        const col = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value['id'];
        checkbox.className = 'table-check-box';
        col.appendChild(checkbox);
        row.appendChild(col);

        Object.keys(cols).forEach((key) => {
            const col = document.createElement('td');
            col.oninput = (event) => {
                if (onchange)
                    onchange(
                        value,
                        // @ts-ignore
                        key,
                        /**@type {HTMLTableCellElement}*/ (event.target).textContent,
                    );
            };
            // col.setAttribute('contenteditable', 'true');
            col.setAttribute('key', key);

            col.insertAdjacentHTML('beforeend', value[key]);
            row.appendChild(col);
        });

        table.appendChild(row);
    });
}

/**
 * @template {{id: string}} T
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
    renderTable(result, table, cols, null);
}

/**
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

export { searchList, renderTable, showPopup };
