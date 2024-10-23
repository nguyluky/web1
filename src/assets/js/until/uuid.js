/**
 * @param {number} length
 * @returns {string} Id
 */
function uuidv(length = 36) {
    const pattern = '00000000-0000-0000-0000-000000000000'.replace(
        /[0]/g,
        (c) =>
            (
                +c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] &
                    (15 >> (+c / 4)))
            ).toString(16),
    );
    return pattern.slice(0, length);
}

export default uuidv;
