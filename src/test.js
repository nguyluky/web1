class RequiredCheckbox extends HTMLElement {
    static formAssociated = true;

    constructor() {
        super();
        this._internals = this.attachInternals();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 10px 0;
                }
                label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                }
            </style>
            <label>
                <input type="checkbox" />
                <span><slot>Agree to terms</slot></span>
            </label>
        `;

        this._checkbox = shadow.querySelector('input[type="checkbox"]');

        // Lắng nghe thay đổi checkbox
        this._checkbox.addEventListener('change', () => this.checkValidity());
    }

    get value() {
        return this._checkbox.checked ? 'on' : '';
    }

    set value(val) {
        this._checkbox.checked = val === 'on';
        this._internals.setFormValue(this.value);
    }

    checkValidity() {
        if (!this._checkbox.checked) {
            this._internals.setValidity(
                { valueMissing: true },
                'You must agree to continue.'
            );
            return false;
        }

        this._internals.setValidity({});
        return true;
    }

    reportValidity() {
        return this._internals.reportValidity();
    }

    formResetCallback() {
        this._checkbox.checked = false;
        this._internals.setValidity({});
    }
}

customElements.define('required-checkbox', RequiredCheckbox);

// HTML sử dụng
document.body.innerHTML = `
    <form id="myForm">
        <required-checkbox name="userConsent">
            I agree to the terms and conditions
        </required-checkbox>
        <button type="submit">Submit</button>
    </form>
`;
