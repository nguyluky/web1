import { showImgPreviewPopup } from '../popupRender.js';

/**
 * @template T
 * @type {{
 *   name: string,
 *   creater: Function,
 *   editOn: (td: HTMLTableCellElement) => any,
 *   editOff: (td: HTMLTableCellElement) => any
 * }[]}
 */
const customCells = [];

// ===================Create element function==================

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {(nv: string) => any} [onchange]
 * @param {boolean} [canEditable]
 * @param {string} [placeholder]
 * @returns {HTMLTableCellElement} td
 */
export function createTextTableCell(key, value, onchange, canEditable = true, placeholder = '') {
    const td = document.createElement('td');
    td.textContent = value;
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'text');
    td.setAttribute('default-value', value);
    if (placeholder) td.setAttribute('placeholder', placeholder);

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    if (!value && placeholder) {
        td.setAttribute('showPlaceholder', '')
    }

    td.addEventListener('input', () => {
        onchange && onchange(td.textContent || '');

        if (td.textContent == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');

        if (placeholder) {
            if (td.textContent)
                td.removeAttribute('showPlaceholder');
            else
                td.setAttribute('showPlaceholder', '');
        }
    });

    return td;
}

/**
 * @param {HTMLTableCellElement} td
 */
function textTableCellEditOn(td) {
    if (td.getAttribute('can-editable') == 'false') return;
    td.setAttribute('contenteditable', 'true');
}

/**
 * @param {HTMLTableCellElement} td
 */
function textTableCellEditOff(td) {
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('default-value', td.textContent || '');
    td.setAttribute('ischange', 'false');
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
 * @returns {HTMLTableCellElement} td
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

    // ==============================================================
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
    // ==============================================================

    const divClickable = document.createElement('div');
    divClickable.className = 'input-clickable';

    td.appendChild(divClickable);

    // ==============================================================

    return td;
}

/**
 *
 * @param {HTMLTableCellElement} td
 */
function dateTimeTableCellEditOn(td) {
    if (td.getAttribute('can-editable') == 'false') return;

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

    const date = new Date(input.value);
    td.setAttribute('default-value', String(date));
    td.setAttribute('ischange', 'false');

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
 * @returns {HTMLTableCellElement} td
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
    if (td.getAttribute('can-editable') == 'false') return;

    td.setAttribute('contenteditable', 'true');
}

/**
 * @param {HTMLTableCellElement} td
 */
function numberTableCellEditOff(td) {
    td.setAttribute('contenteditable', 'false');

    td.setAttribute('default-value', td.textContent || '');
    td.setAttribute('ischange', 'false');
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
 * @param {boolean} [canEditable=true]
 * @returns {HTMLTableCellElement} td
 */
export function createOptionTabelCell(
    key,
    value,
    options,
    onchange,
    canEditable = true,
) {
    const td = document.createElement('td');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'option');
    td.setAttribute('default-value', value);

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    // ==============================================================

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

    // ==============================================================

    const divClickable = document.createElement('div');
    divClickable.className = 'input-clickable';

    td.appendChild(divClickable);

    // ==============================================================

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

    td.setAttribute('default-value', select.value);
    td.setAttribute('ischange', 'false');
}
/**
 *
 * @param {HTMLTableCellElement} td
 */
function optionTableCellEditOn(td) {
    if (td.getAttribute('can-editable') == 'false') return;
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
 * @param {boolean} [canEditable=true]
 * @param {string} [placeholder]
 * @returns {HTMLTableCellElement} td
 */
export function createBlockTextTabelCell(
    key,
    value,
    onchange,
    canEditable = true,
    placeholder = '',
) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'block-text');
    td.setAttribute('default-value', value);
    if (placeholder) td.setAttribute('placeholder', placeholder);

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    const details_wrapper = document.createElement('div');
    details_wrapper.className = 'details-wrapper';
    details_wrapper.insertAdjacentHTML('beforeend', value);

    if (!value && placeholder) {
        td.setAttribute('showPlaceholder', '')
    }

    details_wrapper.addEventListener('input', () => {
        onchange && onchange(details_wrapper.textContent || '');

        if (details_wrapper.textContent == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');

        if (placeholder) {
            if (details_wrapper.textContent)
                td.removeAttribute('showPlaceholder');
            else
                td.setAttribute('showPlaceholder', '');
        }
    });

    td.appendChild(details_wrapper);
    return td;
}

/**
 * @param {HTMLTableCellElement} td
 */
function blockTextTableCellEditOn(td) {
    if (td.getAttribute('can-editable') == 'false') return;

    const block = td.querySelector('div');
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

    td.setAttribute('default-value', block.textContent || '');
    td.setAttribute('ischange', 'false');
}

customCells.push({
    name: 'block-text',
    creater: createBlockTextTabelCell,
    editOff: blockTextTableCellEditOff,
    editOn: blockTextTableCellEditOn,
});

/**
 * @typedef {{title: string, value: string}} Tag
 */

/**
 * hello
 *
 * @param {string} key
 * @param {string[]} values
 * @param {Tag[]} tags
 * @param {(tags: string[]) => any} onchange
 * @param {boolean} [canEditable]
 * @returns {HTMLTableCellElement}
 */
export function createTagInputCell(
    key,
    values,
    tags,
    onchange,
    canEditable = true,
) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'tag');
    td.setAttribute('default-value', values.sort().join(','));

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    const tagContainer = document.createElement('div');
    tagContainer.className = 'tag-container';
    td.appendChild(tagContainer);

    const tagsCopy = [...values];

    /**
     * @param {(tag: Tag) => any} callback
     * @returns {HTMLDivElement}
     */
    function createTagPop(callback) {
        const tagPopup = document.createElement('div');
        tagPopup.className = 'tag-popup';

        tags.forEach((tag) => {
            if (values.includes(tag.value)) return;

            const span = document.createElement('span');
            span.textContent = tag.title;
            span.addEventListener('click', (event) => {
                event.stopPropagation();
                callback(tag);
            });

            tagPopup.appendChild(span);
        });

        return tagPopup;
    }

    /**
     *
     * @param {Tag | undefined} tag
     * @returns {HTMLDivElement}
     */
    function createTagElement(tag) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'tag-ele';
        categoryDiv.setAttribute('tag-id', tag?.value || '');

        const s = document.createElement('span');
        s.textContent = tag?.title || '';
        categoryDiv.appendChild(s);

        const i = document.createElement('i');
        i.className = 'fa-solid fa-xmark';
        categoryDiv.appendChild(i);

        i.addEventListener('click', () => {
            if (tag) handleRemoveTag(tag.value);
        });

        return categoryDiv;
    }

    /**
     *
     * @param {string | undefined} categoryId
     */
    function handleRemoveTag(categoryId) {
        console.log('remove', categoryId);

        tagContainer
            .querySelector('.tag-ele[tag-id="' + categoryId + '"]')
            ?.remove();
        const index = tagsCopy.findIndex((e) => e == categoryId);
        if (index >= 0) {
            tagsCopy.splice(index, 1);
            onchange(tagsCopy);
        }

        if (tagsCopy.sort().join(',') == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    }

    /**
     *
     * @param {Tag} tag
     */
    function handleAddTag(tag) {
        tagContainer.querySelector('.tag-popup')?.remove();
        const categoryAdd = tagContainer.querySelector('.tag-ele.add');

        tagsCopy.push(tag.value);
        onchange(tagsCopy);

        const categoryDiv = createTagElement(tag);
        tagContainer.insertBefore(categoryDiv, categoryAdd);

        if (tagsCopy.sort().join(',') == td.getAttribute('default-value'))
            td.setAttribute('ischange', 'false');
        else td.setAttribute('ischange', 'true');
    }

    tagsCopy.forEach((tag) => {
        const category = tags.find((e) => e.value == tag);
        const categoryDiv = createTagElement(category);

        tagContainer.appendChild(categoryDiv);
    });

    // nút thêm category
    const tagAdd = document.createElement('div');
    tagAdd.className = 'tag-ele add';
    const span = document.createElement('span');
    span.textContent = 'Thêm';
    tagAdd.appendChild(span);
    const i = document.createElement('i');
    i.className = 'fa-solid fa-plus';
    tagAdd.appendChild(i);

    tagAdd.addEventListener('click', function () {
        if (this.querySelector('.tag-popup')) return;

        const addPopup = createTagPop(handleAddTag);

        this.appendChild(addPopup);
    });

    tagContainer.contentEditable = 'false';
    tagContainer.appendChild(tagAdd);

    return td;
}

/**
 *
 *
 * @param {HTMLTableCellElement} td
 */
function TagInputCellOn(td) {
    if (td.getAttribute('can-editable') == 'false') return;

    const container = td.querySelector('.tag-container');
    container?.classList.add('on');
}

/**
 *
 * @param {HTMLTableCellElement} td
 */
function TagInputCellOff(td) {
    const container = document.querySelector('.tag-container');
    container?.classList.remove('on');

    const tag = Array.from(td.querySelectorAll('.tag-ele')).map((e) =>
        e.getAttribute('tag-id'),
    );

    td.setAttribute('default-value', tag.sort().join(','));
    td.setAttribute('ischange', 'false');
}

customCells.push({
    name: 'tag',
    creater: createTagInputCell,
    editOff: TagInputCellOff,
    editOn: TagInputCellOn,
});

/**
 *
 * @param {string} key
 * @param {string} base64
 * @param {(base64: string) => any} onchange
 * @param {boolean} [canEditable=true]
 * @returns {HTMLTableCellElement}
 */
export function createThumbnailCell(key, base64, onchange, canEditable = true) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'img-thumbnail');

    if (!canEditable) td.setAttribute('can-editable', 'false');
    else td.setAttribute('can-editable', 'true');

    // tạo div bao ảnh
    const img_wrapper = document.createElement('div');
    img_wrapper.className = 'img-wrapper';
    // tạo thẻ img hiển thị ảnh
    const img = document.createElement('img');
    img.src = base64;
    img_wrapper.appendChild(img);
    img_wrapper.addEventListener('click', () => {
        if (td.getAttribute('contenteditable') !== 'true') return;
        showImgPreviewPopup(
            img.src,
            () => { },
            (base64) => {
                onchange && onchange(base64);
                img.src = base64;
            },
            () => {
                onchange && onchange('../assets/img/default-image.png');
                img.src = '../assets/img/default-image.png';
            },
        );
    });

    td.appendChild(img_wrapper);

    return td;
}

/**
 * @param {HTMLTableCellElement} td
 */
function thumbnailCellEditOn(td) {
    if (td.getAttribute('can-editable') == 'false') return;
    td.setAttribute('contenteditable', 'true');
}

/**
 * @param {HTMLTableCellElement} td
 */
function thumbnailCellEditOff(td) {
    td.setAttribute('contenteditable', 'false');
}

customCells.push({
    name: 'img-thumbnail',
    creater: createThumbnailCell,
    editOff: thumbnailCellEditOff,
    editOn: thumbnailCellEditOn,
});

// ========================================================
/**
 * @param {NodeListOf<HTMLTableCellElement>} cells
 */
export function tableEditOn(cells) {
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
 * @param {NodeListOf<HTMLTableCellElement>} cells
 */
export function tableEditOff(cells) {
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
