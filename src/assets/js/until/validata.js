/**
 * @param {string} email
 * @returns {boolean}
 */
/**
 * @param {string} email
 * @returns {boolean}
 */
const validateEmail = (email) => {
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
const validateNumberPhone = (numberPhone) => {
    return !!String(numberPhone).match(
        /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
    );
};
export { validateEmail, validateNumberPhone };
