/**
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    return !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
};

/**
 * @param {string} numberPhone
 * @returns {boolean}
 */
export const validateNumberPhone = (numberPhone) => {
    return !!String(numberPhone).match(
        /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
    );
};

/**
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isDate(value) {
    // eslint-disable-next-line no-useless-escape
    const regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

    return regex.test(value) ? true : false;
}


/**
 * 
 * @param {{
 * form: string,
 * rules: {
 *   selector: string,
 *   test: (value: string) => string | undefined
 * }[],
 * onSubmit: (data: { [x: string]: string; }) => void
 * }} options 
 */
export function validator(options) {
    const form = /**@type {HTMLFormElement} */ (
        document.querySelector(options.form)
    );
    let selectorRules = {};

    /**
     * 
     * @param {HTMLInputElement} inputElement 
     * @param {{
     *   selector: string,
     *   test: (value: string) => string | undefined
     * }} rule 
     * @returns {boolean}
     */
    function validate(inputElement, rule) {
        const parentElement = inputElement.parentElement;
        if (!parentElement) {
            alert('Không tìm thấy phần tử cha. file validator.js:79');
            return false;
        }
        const errorElement = parentElement.nextElementSibling;

        if (!errorElement) {
            alert('Không tìm thấy phần tử em. file validator.js:85');
            return false;
        }

        const rules = selectorRules[rule.selector];
        /**
         * @type {string | undefined}
         */
        let errorMessage;

        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) {
                break;
            }
        }
        if (errorMessage && errorElement.classList.contains('form-error')) {
            parentElement.classList.remove('input-fill');
            parentElement.classList.add('input-error');
            errorElement.textContent = errorMessage;
        } else {
            parentElement.classList.remove('input-error');
            errorElement.textContent = '';
        }
        return !errorMessage;
    }

    /**
     * 
     * @param {SubmitEvent} e 
     */
    function handleOnSubmit(e) {
        e.preventDefault();
        let isValidForm = true;
        /**
         * @type {{ [x: string]: string }}
         */
        const data = {};
        options.rules.forEach((rule) => {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            let inputElement = form.querySelector(rule.selector);
            if (!inputElement) {
                alert('Không tìm thấy phần tử input. file validator.js:124');
                return;
            }
            const isValid = validate(/**@type {HTMLInputElement} */(inputElement), rule);
            data[rule.selector] = /**@type {HTMLInputElement} */(inputElement).value;
            if (!isValid) {
                isValidForm = false;
            }
        });

        if (isValidForm) {
            options.onSubmit(data);
            form.removeEventListener('submit', handleOnSubmit);
        }
    }

    if (form) {
        form.addEventListener('submit', handleOnSubmit);
    }
}

/**
 * 
 * @param {string} selector 
 * @returns {{selector: string, test: (value: string) => string | undefined}}
 */
validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Vui lòng không để trống';
        },
    };
};


/**
 * 
 * @param {string} selector 
 * @returns {{selector: string, test: (value: string) => string | undefined}}
 */
validator.isValidInput = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return validateNumberPhone(value) || validateEmail(value)
                ? undefined
                : 'Thông tin không đúng định dạng';
        },
    };
};

/**
 * 
 * @param {string} selector 
 * @param {number} min 
 * @returns {{selector: string, test: (value: string) => string | undefined}}
 */
validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min
                ? undefined
                : `Vui lòng nhập ít nhất ${min} kí tự`;
        },
    };
};


/**
 * 
 * @param {string} selector 
 * @param {string} userPassword 
 * @returns {{selector: string, test: (value: string) => string | undefined}}
 */
validator.isCorrectPassword = function (selector, userPassword) {
    return {
        selector: selector,
        test: function (value) {
            return value === userPassword
                ? undefined
                : 'Mật khẩu không trùng khớp';
        },
    };
};

/**
 * 
 * @param {string} selector 
 * @returns {{selector: string, test: (value: string) => string | undefined}}
 */
validator.checkName = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /[!@#$%^&*(),.?":{}|<>0-9]/g;
            return regex.test(value)
                ? 'Tên không được chứa số hoặc kí tự đặc biệt'
                : undefined;
        },
    };
};
