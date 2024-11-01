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
 * @param {string} value
 * @returns {boolean}
 */
export function isEmail(value) {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexEmail.test(value) ? true : false;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isPhone(value) {
    const regexTel = /(84[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return regexTel.test(value) ? true : false;
}

export function validator(options) {
    const form = /**@type {HTMLFormElement} */ (
        document.querySelector(options.form)
    );
    let selectorRules = {};
    function validate(inputElement, rule) {
        const parentElement = inputElement.parentElement;
        const errorElement = parentElement.nextElementSibling;
        const rules = selectorRules[rule.selector];
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
            errorElement.innerText = errorMessage;
        } else {
            parentElement.classList.remove('input-error');
            errorElement.innerText = '';
        }
        return !errorMessage;
    }

    function handleOnSubmit(e) {
        e.preventDefault();
        let isValidForm = true;
        const data = {};
        options.rules.forEach((rule) => {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            let inputElement = form.querySelector(rule.selector);
            const isValid = validate(inputElement, rule);
            data[rule.selector] = inputElement?.value;
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

validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Vui lòng không để trống';
        },
    };
};

validator.isValidInput = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return isPhone(value) || isEmail(value)
                ? undefined
                : 'Thông tin không đúng định dạng';
        },
    };
};

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
