// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
/**
 * @template T
 */
export class BaseTableCell extends HTMLTableCellElement {
    static observedAttributes = [
        'default-value',
        'key',
        'value',
        'ischange',
        'disable',
        'can-edit',
    ];

    /**
     * @type {T}
     * @private
     */
    _value;

    /**
     * @returns {T}
     * @public
     */
    get value() {
        return this._value;
    }

    /**
     * @param {T} value
     * @public
     */
    set value(value) {
        this._value = value;
        this.updateValue();
    }

    /**
     * @type {T}
     * @private
     */
    _defaultValue;

    /**
     * @returns {T}
     * @public
     */
    get defaultValue() {
        return this._defaultValue;
    }

    /**
     * @param {T} value
     * @public
     */
    set defaultValue(value) {
        this._defaultValue = value;
        this.updateValue();
    }

    /**
     * @type {string}
     * @protected
     */
    _key;

    /**
     * @returns {string}
     */
    get key() {
        return this._key;
    }

    /**
     * @param {string} value
     * @public
     */
    set key(value) {
        this._key = value;
        // this.setAttribute('key', value);
    }

    /**
     * @type {boolean}
     * @private
     */
    _isChange;

    /**
     * @returns {boolean}
     * @public
     */
    get isChange() {
        return this._isChange;
    }

    /**
     * @param {boolean} value
     * @public
     */
    set isChange(value) {
        this._isChange = value;
    }

    /**
     * @type {boolean}
     * @private
     */
    _disable;

    /**
     * @returns {boolean}
     * @public
     */
    get disable() {
        return this._disable;
    }

    /**
     * @param {boolean} value
     * @public
     */
    set disable(value) {
        if (this._canEdit == false) {
            this._disable = true;
        } else this._disable = value;
        this.updateDisable();
    }

    /**
     * @type {boolean}
     * @private
     */
    _canEdit;

    /**
     * @returns {boolean}
     * @public
     */
    get canEdit() {
        return this._canEdit;
    }

    /**
     * @param {boolean} value
     * @public
     */
    set canEdit(value) {
        this._canEdit = value;
        if (this.canEdit == false) {
            this.disable = true;
        }
    }

    updateDisable() {}
    updateValue() {}

    constructor() {
        super();
    }

    /**
     *
     * @param {'change'} type
     * @param {(this: HTMLTableCellElement, ev: Event) => any} listener
     * @param {boolean | AddEventListenerOptions} [options]
     */
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
}

/** @extends {BaseTableCell<string>} */
export class StringTableCell extends BaseTableCell {
    constructor() {
        super();
    }

    updateDisable() {
        if (this.disable) {
            this.querySelector('span')?.setAttribute(
                'contenteditable',
                'false',
            );
            this.defaultValue = this.value;
        } else {
            this.querySelector('span')?.setAttribute('contenteditable', 'true');
        }
    }

    updateValue() {
        const span = this.querySelector('span');
        span && (span.textContent = this.value);
    }

    connectedCallback() {
        const span = document.createElement('span');
        span.className = 'custom-text-input';
        span.setAttribute('contenteditable', this.disable ? 'false' : 'true');
        span.textContent = this.value;
        span.addEventListener('input', () => {
            this.value = span.textContent || '';
            if (span.textContent == this.defaultValue)
                this.setAttribute('ischange', 'false');
            else this.setAttribute('ischange', 'true');

            this.dispatchEvent(new CustomEvent('change'));
        });

        this.appendChild(span);
    }

    /**
     *
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'value') {
            this.value = newValue;
            const span = this?.querySelector('span');
            span && (span.textContent = newValue);
        } else if (name == 'default-value') {
            this.defaultValue = newValue;
        } else if (name == 'key') {
            this.key = newValue;
        } else if (name == 'disable') {
            this.disable = newValue === 'true';
        }
    }
}

/** @extends {BaseTableCell<Date>} */
export class DatetimeTableCell extends BaseTableCell {
    constructor() {
        super();
    }

    updateDisable() {
        const input = this.querySelector('input');
        if (!input) return;
        if (this.disable) {
            input.disabled = true;
            this.defaultValue = this.value;
        } else {
            input.disabled = false;
        }
    }

    updateValue() {
        const dateTimeInput = this.querySelector('input');
        if (dateTimeInput)
            dateTimeInput.value = this.value.toISOString().slice(0, 16);
    }

    connectedCallback() {
        const dateTimeInput = document.createElement('input');
        dateTimeInput.className = 'custom-datetime-input';
        dateTimeInput.type = 'datetime-local';
        dateTimeInput.disabled = this.disable || !this.canEdit;
        dateTimeInput.value = this.value.toISOString().slice(0, 16);

        dateTimeInput.addEventListener('change', () => {
            const date = new Date(dateTimeInput.value);
            this.value = date;

            if (String(date) == String(this.defaultValue)) {
                this.setAttribute('ischange', 'false');
            } else {
                this.setAttribute('ischange', 'true');
            }

            this.dispatchEvent(new CustomEvent('change'));
        });

        this.appendChild(dateTimeInput);
    }

    /**
     *
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'value') {
            this.value = new Date(newValue);
            const span = this?.querySelector('span');
            span && (span.textContent = newValue);
        } else if (name == 'default-value') {
            this.defaultValue = new Date(newValue);
        } else if (name == 'key') {
            this._key = newValue;
        } else if (name == 'disable') {
            this.disable = newValue === 'true';
            if (this.disable) {
                this.querySelector('span')?.setAttribute(
                    'contenteditable',
                    'false',
                );
            } else {
                this.querySelector('span')?.setAttribute(
                    'contenteditable',
                    'true',
                );
            }
        }
    }
}

/** @extends {BaseTableCell<string>} */
export class OptionTableCell extends BaseTableCell {
    /**
     * @type {{title: string, value: string}[]}
     * @private
     */
    _values = [];

    /**
     * @returns {{title: string, value: string}[]}
     * @public
     */
    get values() {
        return this._values;
    }

    /**
     * @param {{title: string, value: string}[]} values
     * @public
     */
    set values(values) {
        this._values = values;
    }

    constructor() {
        super();
    }

    /**
     *
     * @param {HTMLSelectElement} select
     */
    renderOptions(select) {
        this.values.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.title;
            select.appendChild(optionElement);
        });
    }

    updateDisable() {
        const select = this.querySelector('select');
        if (!select) return;
        if (this.disable) {
            select.disabled = true;
            this.defaultValue = this.value;
        } else {
            select.disabled = false;
        }
    }

    updateValue() {
        const select = this.querySelector('select');
        if (select) select.value = this.value;
    }

    connectedCallback() {
        const select = document.createElement('select');
        select.disabled = this.disable || !this.canEdit;
        select.className = 'custom-select';

        this.renderOptions(select);

        select.value = this.value;
        select.addEventListener('change', () => {
            this.value = select.value;
            console.log('ok');
            if (select.value == this.defaultValue) {
                this.setAttribute('ischange', 'false');
            } else {
                this.setAttribute('ischange', 'true');
            }

            this.dispatchEvent(new CustomEvent('change'));
        });

        this.appendChild(select);
    }
}

/**
 * @typedef {{title: string, value: string}} Tag
 */
/** @extends {BaseTableCell<string[]>} */
export class TagsInputCell extends BaseTableCell {
    // TODO: implement this

    /**
     * @type {Tag[]}
     * @private
     */
    _allTags = [];

    /**
     * @returns {Tag[]}
     * @public
     */
    get allTags() {
        return this._allTags;
    }

    /**
     * @param {Tag[]} value
     * @public
     */
    set allTags(value) {
        this._allTags = value;
        this.updateValue();
    }

    removeTag(tag) {
        this.value = this.value.filter((t) => t != tag.value);
        this.querySelector('.tag[data-value="' + tag.value + '"]')?.remove();
    }

    /**
     *
     * @param {Tag} tag
     * @returns {HTMLElement}
     */
    createTag(tag) {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.dataset.value = tag.value;

        const title = document.createElement('span');
        title.textContent = tag.title;

        const remove = document.createElement('i');
        remove.className = 'fa-solid fa-xmark';

        tagElement.appendChild(title);
        tagElement.appendChild(remove);

        remove.addEventListener('click', (ev) => {
            this.removeTag(tag);
        });

        return tagElement;
    }

    addTag(tag) {
        this.value.push(tag.value);
        this.updateValue();
    }

    updateAllTags() {
        const dropdown = this.querySelector('.tag-dropdown');
        if (!dropdown) return;
        dropdown.innerHTML = '';
        this.allTags.forEach((tag) => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-dropdown-item';
            tagElement.textContent = tag.title;
            tagElement.addEventListener('click', () => {
                this.addTag(tag);
            });
            dropdown.appendChild(tagElement);
        });
    }

    updateValue() {
        const tagsContainer = this.querySelector('.tags-container');
        if (!tagsContainer) return;

        tagsContainer.innerHTML = '';

        this.value.forEach((tv) => {
            const tag = this.allTags.find((t) => t.value == tv);
            if (!tag) return;
            const tagElement = this.createTag(tag);
            tagsContainer.appendChild(tagElement);
        });

        // input
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'tag-input-wrapper';

        const buttonAdd = document.createElement('div');
        buttonAdd.className = 'tag tag-add';
        const title = document.createElement('span');
        title.textContent = 'Add Tag';
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-plus';

        const input = document.createElement('input');
        input.className = 'tag-input';

        const dropdown = document.createElement('div');
        dropdown.className = 'tag-dropdown';

        buttonAdd.appendChild(icon);
        buttonAdd.appendChild(title);

        inputWrapper.appendChild(input);
        tagsContainer.appendChild(inputWrapper);
        inputWrapper.appendChild(buttonAdd);
        inputWrapper.appendChild(dropdown);

        this.updateAllTags();

        buttonAdd.addEventListener('click', () => {
            input.style.display = 'inline-block';
            dropdown.style.display = 'block';
            buttonAdd.style.display = 'none';
            input.focus();

            function outsideClickHandler(ev) {
                if (!inputWrapper.contains(ev.target)) {
                    input.style.display = 'none';
                    dropdown.style.display = 'none';
                    buttonAdd.style.display = 'block';
                    document.removeEventListener('click', outsideClickHandler);
                }
            }
            document.addEventListener('click', outsideClickHandler);
        });
    }

    connectedCallback() {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags-container';

        this.appendChild(tagsContainer);

        // TODOL: render tags
        this.updateValue();
    }
}

/**
 * @extends {BaseTableCell<string>}
 */
export class ImgThumbnailCell extends BaseTableCell {
    constructor() {
        super();
    }

    updateValue() {
        const img = this.querySelector('img');
        if (img) img.src = this.value;
    }

    connectedCallback() {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-thumbnail-wrapper';
        const img = document.createElement('img');
        img.src = this.value;
        img.style.objectFit = 'cover';

        imgWrapper.appendChild(img);
        this.appendChild(imgWrapper);
    }
}

/**
 * @extends {BaseTableCell<string>}
 */
export class BlockTextCell extends BaseTableCell {
    constructor() {
        super();
    }

    updateDisable() {
        if (this.disable) {
            this.querySelector('span')?.setAttribute(
                'contenteditable',
                'false',
            );
            this.defaultValue = this.value;
        } else {
            this.querySelector('span')?.setAttribute('contenteditable', 'true');
        }
    }

    updateValue() {
        const span = this.querySelector('span');
        span && (span.textContent = this.value);
    }

    connectedCallback() {
        const span = document.createElement('span');
        span.className = 'block-text-input';
        span.setAttribute('contenteditable', this.disable ? 'false' : 'true');
        span.textContent = this.value;
        span.addEventListener('input', () => {
            this.value = span.textContent || '';
            if (span.textContent == this.defaultValue)
                this.setAttribute('ischange', 'false');
            else this.setAttribute('ischange', 'true');

            this.dispatchEvent(new CustomEvent('change'));
        });

        this.appendChild(span);
    }

    /**
     *
     * @param {string} name
     * @param {string} oldValue
     * @param {string} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'value') {
            this.value = newValue;
            const span = this?.querySelector('span');
            span && (span.textContent = newValue);
        } else if (name == 'default-value') {
            this.defaultValue = newValue;
        } else if (name == 'key') {
            this.key = newValue;
        } else if (name == 'disable') {
            this.disable = newValue === 'true';
        }
    }
}

customElements.define('string-cell', StringTableCell, { extends: 'td' });
customElements.define('datetime-cell', DatetimeTableCell, { extends: 'td' });
customElements.define('option-cell', OptionTableCell, { extends: 'td' });
customElements.define('tags-cell', TagsInputCell, { extends: 'td' });
customElements.define('img-thumbnail-cell', ImgThumbnailCell, {
    extends: 'td',
});

customElements.define('block-text-cell', BlockTextCell, { extends: 'td' });
