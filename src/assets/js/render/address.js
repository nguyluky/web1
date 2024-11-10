import fakeDatabase from '../db/fakeDBv1.js';
import removeDiacritics from '../until/removeDiacritics.js';

class AddressFrom extends HTMLElement {
    static observedAttributes = ['placeholder', 'type', 'name'];

    /**
     * @private
     * @type {string}
     */
    _name = '';

    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        this.setAttribute('name', value);
    }

    /**
     * @private
     * @type {'TTP' | 'QH' | 'PX'}
     */
    _type = 'TTP';

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
        this.setAttribute('type', value);
    }

    _placeholder = '';

    get placeholder() {
        return this._placeholder;
    }

    set placeholder(value) {
        this._placeholder = value;
        this.setAttribute('placeholder', value);
    }

    /**
     * @private
     * @type {string}
     */
    _value = '';

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    /**
     * @private
     * @type {{ title: string; value: string }[]}
     */
    _opstions = [];

    get options() {
        return this._opstions;
    }

    set options(value) {
        this._opstions = value;

        const content = this.querySelector('.Address__dropdown-content');
        const input = this.querySelector('input');
        if (!content || !input) return;

        if (this._opstions.length == 0) {
            input.disabled = true;
            input.placeholder = this._placeholder;
            content.innerHTML = '';
            return;
        }

        input.disabled = false;
        input.placeholder = this._placeholder;

        content.innerHTML = '';

        this._opstions.forEach((e, index) => {
            const div = document.createElement('div');
            div.textContent = e.title || '';
            div.setAttribute('value', e.value || '');
            div.setAttribute('selection', index == 0 ? 'true' : 'false');

            div.addEventListener('click', () => {
                input.placeholder = e.title;
                this._value = e.title;

                content
                    .querySelector('div[selection="true"]')
                    ?.setAttribute('selection', 'false');
                div.setAttribute('selection', 'true');

                const event = new CustomEvent('change');
                this.dispatchEvent(event);

                const [ttp, qh, px] = document.getElementsByName(this._name);

                if (this._type == 'TTP' && qh instanceof AddressFrom)
                    qh.update();
                else if (this._type == 'QH' && px instanceof AddressFrom)
                    px.update();
            });
            content.appendChild(div);
        });
    }

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'type': {
                this._type = newValue;
                break;
            }
            case 'placeholder': {
                this._placeholder = newValue;
                this.querySelector('input')?.setAttribute(
                    'placeholder',
                    newValue,
                );
                break;
            }
            case 'name': {
                this._name = newValue;
                this.querySelector('input')?.setAttribute('value', newValue);
                break;
            }
        }
    }

    setLoading() {
        const content = this.querySelector('.Address__dropdown-content');

        if (!content) return;

        content.innerHTML = `
        <div class="dot-spinner-wrapper">
            <div class="dot-spinner">
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
                <div class="dot-spinner__dot"></div>
            </div>
        </div>
        `;
    }

    update() {
        this.setLoading();

        const [ttp, qh, px] = document.getElementsByName(this._name);

        switch (this._type) {
            case 'TTP': {
                if (qh instanceof AddressFrom) qh.update();
                fakeDatabase.getAllTinhThanPho().then((e) => {
                    this.options = e.map((e) => ({ title: e, value: e }));
                });
                break;
            }
            case 'QH': {
                if (px instanceof AddressFrom) px.update();
                if (ttp instanceof AddressFrom) {
                    fakeDatabase
                        .getAllQuanHuyenByTinhThanhPho(ttp.value)
                        .then((e) => {
                            // console.log(e);
                            this.options = e.map((e) => ({
                                title: e,
                                value: e,
                            }));
                        });
                }
                break;
            }
            case 'PX': {
                if (qh instanceof AddressFrom && ttp instanceof AddressFrom) {
                    fakeDatabase
                        .getAllPhuongXaByQuanHuyenAndThinThanhPho(
                            ttp.value,
                            qh.value,
                        )
                        .then((e) => {
                            this.options = e.map((e) => ({
                                title: e,
                                value: e,
                            }));
                        });
                }
                break;
            }
        }
    }

    /**
     * @private
     * @param {MouseEvent} event
     * @param {HTMLElement} button
     * @param {HTMLElement} contentDropdowContent
     */
    handleClickOutsideDropdown(event, button, contentDropdowContent) {
        const target = /** @type {HTMLElement} */ (event.target);
        const isClickInsideDropdown =
            button?.contains(target) || button?.isSameNode(target);

        if (isClickInsideDropdown) return;
        contentDropdowContent?.classList.remove('show');
        document.removeEventListener('click', (event) =>
            this.handleClickOutsideDropdown(
                event,
                button,
                contentDropdowContent,
            ),
        );
    }

    /**
     * @private
     * @param {HTMLInputElement} input
     * @param {HTMLDivElement} contentDropdowContent
     */
    handleSearchInput(input, contentDropdowContent) {
        const value = input?.value || '';

        contentDropdowContent?.querySelectorAll('div').forEach((e) => {
            if (value == '') {
                e.classList.remove('hide');
            } else if (
                !removeDiacritics(e.textContent || '').includes(
                    removeDiacritics(value),
                )
            ) {
                e.classList.add('hide');
            } else {
                e.classList.remove('hide');
            }
        });

        // NOTE: nếu cái selection nó bị ẩn thì tìm cái không bị ẩn đầu tiện rồi chọn
        let curr = contentDropdowContent?.querySelector(
            "div[selection='true']",
        );

        if (curr?.classList.contains('hide')) {
            const a = contentDropdowContent?.querySelector('div:not(.hide)');
            if (a) {
                a.setAttribute('selection', 'true');
                curr.setAttribute('selection', 'false');
            }
        }
    }

    /**
     * @private
     * @param {HTMLInputElement} input
     * @param {HTMLElement} button
     * @param {HTMLDivElement} contentDropdowContent
     * @returns {void}
     */
    showDropdown(input, button, contentDropdowContent) {
        if (input?.disabled) return;
        contentDropdowContent?.classList.add('show');
        document.addEventListener('click', (event) =>
            this.handleClickOutsideDropdown(
                event,
                button,
                contentDropdowContent,
            ),
        );
    }

    /**
     * @private
     * @param {HTMLInputElement} input
     * @param {HTMLDivElement} contentDropdowContent
     * @returns {void}
     */
    resetDropdownOnBlur(input, contentDropdowContent) {
        if (!input) return;
        input.value = '';

        contentDropdowContent?.querySelectorAll('div').forEach((e) => {
            e.classList.remove('hide');
        });
    }

    /**
     * @private
     * @param {KeyboardEvent} event
     * @param {HTMLInputElement} input
     * @param {HTMLDivElement} contentDropdowContent
     */
    handleKeyboardNavigation(event, input, contentDropdowContent) {
        if (!input) return;

        const validkey = ['ArrowDown', 'ArrowUp', 'Enter'];
        if (!validkey.includes(event.code)) return;

        event.preventDefault();

        /** @type {Element | undefined | null} */
        let curr = contentDropdowContent?.querySelector(
            "div[selection='true']",
        );

        if (event.code == 'Enter') {
            /** @type {HTMLElement} */ (curr)?.click();
            input.value = '';
            return;
        }

        /** @type {Element | undefined | null} */
        let next;
        /** @type {Element | undefined | null} */
        let temp = curr;

        // NOTE: tìm phần tử không bị ẩn gần nhất
        if (contentDropdowContent?.querySelector('div:not(.hide)'))
            do {
                if (event.code == 'ArrowDown') {
                    next =
                        temp?.nextElementSibling ||
                        temp?.parentElement?.firstElementChild;
                } else if (event.code == 'ArrowUp') {
                    next =
                        temp?.previousElementSibling ||
                        temp?.parentElement?.lastElementChild;
                }

                temp = next;
            } while (next?.classList.contains('hide'));

        if (next) {
            // console.log(next);
            curr?.setAttribute('selection', 'false');
            next?.setAttribute('selection', 'true');
            next?.scrollIntoView({
                inline: 'nearest',
                block: 'nearest',
            });
        }
    }

    connectedCallback() {
        this._placeholder = this.getAttribute('placeholder') || '';
        // @ts-ignore
        this._type = this.getAttribute('type') || 'TTP';
        this._name = this.getAttribute('name') || '';

        this.classList.add('dropdown-container');

        const button = document.createElement('label');
        button.classList.add('Address__dropdown-btn');
        this.appendChild(button);

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', this._placeholder);
        button.appendChild(input);
        input.disabled = this._type != 'TTP';

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-angle-down');
        button.appendChild(icon);

        const content = document.createElement('div');
        content.classList.add('Address__dropdown-content');
        this.appendChild(content);

        button.addEventListener('click', () => {
            this.showDropdown(input, button, content);
        });

        input.addEventListener('input', () => {
            this.handleSearchInput(input, content);
        });

        input.addEventListener('focusout', () => {
            this.resetDropdownOnBlur(input, content);
        });

        /**
         * - NOTE: Xử lý sự kiện khi người dùng nhấn các phím điều hướng
         *   (ArrowDown, ArrowUp) và Enter trong dropdown.
         * - NOTE: Điều này cho phép người dùng điều hướng giữa các mục trong
         *   dropdown và chọn mục bằng phím Enter.
         */
        input.addEventListener('keydown', (event) => {
            this.handleKeyboardNavigation(event, input, content);
        });

        this.update();
    }
}

customElements.define('address-form', AddressFrom);
