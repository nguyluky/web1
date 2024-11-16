/**
 * @param {string} text
 * @returns {HTMLElement | null} Html element
 */
export default function text2htmlElement(text) {
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
