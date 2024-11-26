/**
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email) ? true : false;
};

/**
 * @param {string} numberPhone
 * @returns {boolean}
 */
export const validateNumberPhone = (numberPhone) => {
    const regex = /(84[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return /^\d+$/.test(numberPhone) && regex.test(numberPhone);
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
 * @param {string} value 
 * @returns {'Visa' | 'MasterCard' | 'JCB' | false}
 */
export function isCreditCard(value) {
    const regexVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const regexMC = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;
    const regexJCB = /^(?:2131|1800|35\d{3})\d{11}$/;
    // if (regexJCB.test(value) || regexMC.test(value) || regexVisa.test(value)) {
    //     return true;
    // }
    if (regexJCB.test(value))
        return 'JCB';
    else if (regexMC.test(value))
        return 'MasterCard';
    else if (regexVisa.test(value))
        return 'Visa';
    return false;
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} selector 
 * @returns {HTMLElement | null | undefined}
 */
export function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
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
        // const parentElement = inputElement.parentElement;
        const parentElement = getParent(inputElement, '.input-group');
        if (!parentElement) {
            console.error('Không tìm thấy phần tử em. file validator.js');
            return false;
        }
        const errorElement = parentElement.nextElementSibling;

        if (!errorElement) {
            console.error('Không tìm thấy phần tử em. file validator.js');
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

validator.checkNum = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /^[0-9\s]*$/;
            return regex.test(value) ? 'Vui lòng chỉ nhập số' : undefined;
        }
    }
}

validator.checkCreditCard = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            return isCreditCard(value) ? undefined : 'Số thẻ không hợp lệ';
        }
    }
}

validator.checkEXP = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!regex.test(value)) {
                return 'Ngày hết hạn không hợp lệ';
            }

            const [month, year] = value.split('/').map(num => parseInt(num, 10));

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear() % 100;

            if (year > currentYear || (year === currentYear && month >= currentMonth)) {
                return undefined;
            }

            return 'Ngày hết hạn không hợp lệ';
        }
    }
}

validator.checkCVV = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            return /^\d{3}$/.test(value) ? undefined : 'Mã CVV không hợp lệ';
        }
    }
}
