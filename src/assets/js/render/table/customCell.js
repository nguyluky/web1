/**
 * @template T
 * @type {{
 *   name: string,
 *   creater: Function,
 *   editOn: (td: HTMLTableCellElement) => any,
 *   editOff: (td: HTMLTableCellElement) => any
 * }[]}
 */
const customCells = []; // ===================Create element function==================
/**
 *
 * @param {string} key
 * @param {string} value
 * @param {(nv: string) => any} [onchange]
 * @param {boolean} [canEditable]
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
 * @param {HTMLTableCellElement} td
 */
function textTableCellEditOn(td) {
    td.setAttribute('contenteditable', 'true');
}

/**
 * @param {HTMLTableCellElement} td
 */
function textTableCellEditOff(td) {
    td.setAttribute('contenteditable', 'false');
}

customCells.push({
    name: 'text',
    creater: createTextTableCell,
    editOn: textTableCellEditOn,
    editOff: textTableCellEditOff,
});

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
    // td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'date-time');
    td.setAttribute('default-value', String(value));

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    const dateTimeInput = document.createElement('input');
    dateTimeInput.disabled = true;
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
 * @param {HTMLTableCellElement} td
 */
function dateTimeTableCellEditOn(td) {
    const input = td.querySelector('input');
    if (!input) return;

    input.disabled = false;
}

/**
 *
 * @param {HTMLTableCellElement} td
 */
function dateTimeTableCellEditOff(td) {
    const input = td.querySelector('input');
    if (!input) return;

    input.disabled = true;
}

customCells.push({
    name: 'date-time',
    creater: createDateTimeTableCell,
    editOff: dateTimeTableCellEditOff,
    editOn: dateTimeTableCellEditOn,
});

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
 * @param {HTMLTableCellElement} td
 */
function numberTableCellEditOn(td) {
    td.setAttribute('contenteditable', 'true');
}

/**
 * @param {HTMLTableCellElement} td
 */
function numberTableCellEditOff(td) {
    td.setAttribute('contenteditable', 'false');
}

customCells.push({
    name: 'number',
    creater: createNumberTableCell,
    editOff: numberTableCellEditOff,
    editOn: numberTableCellEditOn,
});

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {{title: string, value: string}[]} options
 * @param {(nv: string) => any} [onchange]
 */

export function createOptionTabelCell(key, value, options, onchange) {
    const td = document.createElement('td');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'option');
    td.setAttribute('default-value', value);

    const select = document.createElement('select');
    select.disabled = true;
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
 * @param {HTMLTableCellElement} td
 */
function optionTableCellEditOff(td) {
    const select = td.querySelector('select');
    if (!select) return;
    select.disabled = true;
}
/**
 *
 * @param {HTMLTableCellElement} td
 */
function optionTableCellEditOn(td) {
    const select = td.querySelector('select');
    if (!select) return;
    select.disabled = false;
}

customCells.push({
    name: 'option',
    creater: createOptionTabelCell,
    editOff: optionTableCellEditOff,
    editOn: optionTableCellEditOn,
});

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

/**
 * @param {HTMLTableCellElement} td
 */
function blockTextTableCellEditOn(td) {
    const block = document.querySelector('div');
    if (!block) return;
    block.setAttribute('contenteditable', 'true');
}

/**
 * @param {HTMLTableCellElement} td
 */
function blockTextTableCellEditOff(td) {
    const block = document.querySelector('div');
    if (!block) return;
    block.setAttribute('contenteditable', 'false');
}

customCells.push({
    name: 'block-text',
    creater: createBlockTextTabelCell,
    editOff: blockTextTableCellEditOff,
    editOn: blockTextTableCellEditOn,
});

/**
 * @param {string} selection
 */
export function tableEditOn(selection) {
    const cells = document.querySelectorAll(selection);

    const map = {};

    customCells.forEach((e) => {
        map[e.name] = {
            ...e,
        };
    });

    cells.forEach((e) => {
        const nameCell = e.getAttribute('ctype');
        map[nameCell]?.editOn(e);
    });
}

/**
 * @param {string} selection
 */
export function tableEditOff(selection) {
    const cells = document.querySelectorAll(selection);

    const map = {};

    customCells.forEach((e) => {
        map[e.name] = {
            ...e,
        };
    });

    cells.forEach((e) => {
        const nameCell = e.getAttribute('ctype');
        map[nameCell]?.editOff(e);
    });
}
