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

const validateNumberPhone = (phone) => {
    return !!String(phone).match(/^[0-9]{10,11}$/);
};

export { validateEmail, validateNumberPhone };
