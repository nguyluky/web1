/**
 * @param {Date} date
 * @returns {String} 'yyyy/mm/dd'
 */
export function dateToString(date) {
    return date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * - Xóa toàn bộ dấu trong chuỗi ví
 * - Dụ => vi
 * - Du dùng để tìm kiếm
 *
 * @param {string} str
 * @returns {string}
 */
export function removeDiacritics(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[Đ]/g, 'D')
        .replace(/[đ]/g, 'd')
        .toLocaleLowerCase();
}
/**
 * 
 * @param {Number} num 1000000
 * @returns {String} '1.000.000'
 */
export function formatNumber(num) {
    return num.toLocaleString('vi-VN');
}

/**
 * @param {string} text
 * @returns {HTMLElement | null} Html element
 */
export function text2htmlElement(text) {
    const template = document.createElement('template');
    template.innerHTML = text;
    const nNodes = template.content.childNodes.length;
    if (nNodes !== 1) {
        throw new Error(
            `html parameter must represent a single node; got ${nNodes}. ` +
            'Note that leading or trailing spaces around an element in your ' +
            'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
            'the element; call .trim() on your input to avoid this.',
        );
    }
    return /** @type {HTMLElement} */ (template.content.firstChild);
}