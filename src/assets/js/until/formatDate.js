/**
 * @param {Date} date
 * @returns {String} 'yyyy/mm/dd'
 */
function dateToString(date) {
    return date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
export { dateToString };
