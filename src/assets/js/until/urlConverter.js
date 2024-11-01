/**
 *
 * @param {string} url
 * @returns {{
 * page: string;
 * query: URLSearchParams}}
 */
export default function urlConverter(url) {
    const query = new URLSearchParams(url.split('?')[1] || '');

    return {
        page: url.split('?')[0],
        query,
    };
}
