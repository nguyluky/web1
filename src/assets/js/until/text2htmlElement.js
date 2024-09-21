/**
 *
 * @param {string} text
 * @returns {HTMLElement}
 */
export default function text2htmlElement(text) {
    const div = document.createElement('div');
    div.innerHTML = text;

    return /**@type {HTMLElement}*/ (div.firstChild);
}
