import fakeDatabase from '../db/fakeDBv1.js';
import removeDiacritics from '../until/removeDiacritics.js';


const css = `

.Address-form__row {
    display: flex;
    align-items: center;
    padding: 5px 30px;
    justify-content: space-between;
}

.Address__dropdown-btn {
    background-color: white;
    border: 1px solid #dddde3;
    color: rgb(135, 135, 135);
    border-radius: 4px;
    height: 35px;
    padding-left: 10px;
    text-align: start;
    cursor: pointer;
    display: flex;
    gap: 10px;
    align-items: center;
}

.Address__dropdown-btn--text {
    white-space: nowrap;
}
.Address__dropdown-btn:hover,
.Address__dropdown-btn:focus {
    border: solid 1px rgb(7, 7, 7);
    color: rgb(7, 7, 7);
}
.Address__dropdown-btn:focus {
    box-shadow: 0px 0px 5px 1px rgba(78, 148, 254, 0.808);
}

.Address__dropdown-btn:not(:has(input:disabled)) input::placeholder {
    color: black;
}
.Address__dropdown-btn:has(input:disabled) {
    border: 1px solid #dddde3;
    color: rgb(135, 135, 135);
    background-color: #f2f2f2;
}

.fa-angle-down {
    text-align: end;
    padding-right: 10px;
}

:host {
    position: relative;
    width: 100%;
}

.Address__dropdown-content {
    max-height: 30vh;
    overflow: auto;
    background-color: white;
    width: 100%;
    border: solid 1px rgb(146, 145, 145);
    border-radius: 4px;
    box-shadow: 0px 2px 5px rgb(174, 174, 174);
    padding: 5px 0;
    margin-top: 5px;
    font-size: 15px;
    display: none;
    position: absolute;
    z-index: 10;
}

.Address__dropdown-content > div[selection='true'] {
    background: #189eff;
    color: #fff;
}

.Address__dropdown-content > div.hide {
    display: none;
}

.Address__dropdown-btn input {
    flex: 1;
    outline: none;
    border: none;
    background: none;
    width: 100%;
}

.Address__dropdown-content div {
    padding: 5px 10px;
    cursor: pointer;
}

.Address__dropdown-content div[selection='false']:hover {
    background-color: rgba(134, 182, 255, 0.5);
}

.show {
    display: block;
}

.hide {
    display: none;
}

`

export class AddressFrom extends HTMLElement {

    static formAssociated = true;

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
        this._internals.setFormValue(this._value);
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

        const shadow = this.shadowRoot;

        if (!shadow) return;

        const content = shadow.querySelector('.Address__dropdown-content');
        const input = shadow.querySelector('input');
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
                this.value = e.value;
                input.value = '';

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

    get required() {
        return this.hasAttribute('required');
    }

    set required(value) {
        if (value) {
            this.setAttribute('required', '');
        } else {
            this.removeAttribute('required');
        }
    }

    constructor() {
        super();

        this._internals = this.attachInternals();

    }

    attributeChangedCallback(name, oldValue, newValue) {



        switch (name) {
            case 'type': {
                this._type = newValue;
                break;
            }
            case 'placeholder': {
                this._placeholder = newValue;
                this.shadowRoot?.querySelector('input')?.setAttribute(
                    'placeholder',
                    newValue,
                );
                break;
            }
            case 'name': {
                this._name = newValue;
                this.shadowRoot?.querySelector('input')?.setAttribute('value', newValue);
                break;
            }
        }
    }

    setLoading() {
        const content = this.shadowRoot?.querySelector('.Address__dropdown-content');

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
     * @param {HTMLInputElement} input
     * @param {HTMLElement} button
     * @param {HTMLElement} contentDropdowContent
     */
    addClickOutSideHandle(input, button, contentDropdowContent) {

        const addressForm = this;
        function clickOutSide(event) {

            const target = /** @type {HTMLElement} */ (event.target);

            if (target.isSameNode(addressForm)) return;

            const isClickInsideDropdown =
                button.contains(target) || button.isSameNode(target);

            if (isClickInsideDropdown) return;
            contentDropdowContent?.classList.remove('show');
            input.value = '';

            contentDropdowContent?.querySelectorAll('div').forEach((e) => {
                e.classList.remove('hide');
            })



            document.removeEventListener('click', clickOutSide);
        }

        document.addEventListener('click', clickOutSide);
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
        this.addClickOutSideHandle(input, button, contentDropdowContent);
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


        const style = document.createElement('style');
        style.innerHTML = css;


        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);

        // this.classList.add('dropdown-container');

        const button = document.createElement('label');
        button.classList.add('Address__dropdown-btn');
        shadow.appendChild(button);

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', this._placeholder);
        button.appendChild(input);
        input.disabled = this._type != 'TTP';

        this._input = input;

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-angle-down');
        button.appendChild(icon);

        const content = document.createElement('div');
        content.classList.add('Address__dropdown-content');
        shadow.appendChild(content);

        button.addEventListener('click', this.showDropdown.bind(this, input, button, content));

        input.addEventListener('input', this.handleSearchInput.bind(this, input, content));

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

    checkValidity() {
        if (this.required && this._value == '' && this.options.length > 0) {
            return false;
        }

        return true;
    }

    reportValidity() {
        console.log('reportValidity')
        if (!this.checkValidity()) {
            this._internals.setValidity(
                {
                    valueMissing: true,
                },
                'choose a value',
            );
        }
        else {
            this._internals.setValidity({});
        }
        return this._internals.reportValidity();
    }

    formResetCallback() {
        this.value = '';
        this._input?.setAttribute('placeholder', this._placeholder);
        this._internals.setValidity({});
    }

}

customElements.define('address-form', AddressFrom);
