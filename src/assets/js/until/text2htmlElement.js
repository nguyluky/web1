export default function text2htmlElement(text) {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc;
}
