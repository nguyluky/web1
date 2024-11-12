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

/**
 * 
 * @param {string} path         url
 * @param {string} pagePath     format url 
 * 
 * @returns {Object|undefined}
 * 
 * @example
 *  urlIsPage('user/123', 'user/:id') => {id: '123'}
 *  urlIsPage('user/123', 'user/:id/:name') => undefined
 *  urlIsPage('user/123', 'user/:id/:?name') => {id: '123'}
 */
export function urlIsPage(path, pagePath) {
    const paths = path.split('/');
    const pagePaths = pagePath.split('/');

    const isValid = pagePaths.some((p, index, arr) => {
        if (p.startsWith(':?') && arr[index + 1]) {
            if (arr[index + 1].startsWith(':?')) return true;
        }
    });

    if (isValid) {
        throw new Error('Invalid pagePath');
    }

    const params = {};

    if (paths.length > pagePaths.length) return undefined;

    for (let i = 0; i < pagePaths.length; i++) {
        if (pagePaths[i].startsWith(':?')) {
            params[pagePaths[i].slice(2)] = paths[i];
        }
        else if (pagePaths[i].startsWith(':')) {
            if (paths[i] === undefined) return undefined
            params[pagePaths[i].slice(1)] = paths[i];
        }
        else if (pagePaths[i] !== paths[i]) {
            return undefined;
        }
    }

    return params;
}

