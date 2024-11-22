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
 * @param {string} format     format url 
 * 
 * @returns {{[key: string]: string}|undefined}
 * 
 * @example
 *  urlIsPage('user/123', 'user/:id') => {id: '123'}
 *  urlIsPage('user/123', 'user/:id/:name') => undefined
 *  urlIsPage('user/123', 'user/:id/:?name') => {id: '123'}
 */
export function urlIsPage(path, format) {
    const paths = path.split('/');
    const pagePaths = format.split('/');

    const isValid = pagePaths.some((p, index, arr) => {
        if (p.startsWith(':?') && arr[index + 1]) {
            if (arr[index + 1].startsWith(':?')) return true;
        }
    });

    if (isValid) {
        throw new Error('Invalid pagePath');
    }

    /**
     * @type {{[key: string]: string}}
     */
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

/**
 * 
 * @param {string} key 
 * @returns {string | null}
 */
export function getSearchParam(key) {
    const { query } = urlConverter(location.hash);
    return query.get(key);
}

/**
 * 
 * @param {string} page 
 * @param {{[key: string]: string} | ((qurey: URLSearchParams) => URLSearchParams)} [query] 
 * 
 * @example
 * // using relative path
 * navigateToPage('user', {id: '123', name: 'abc'}) => location.hash = 'user?id=123&name=abc'
 * navigateToPage('user') => location.hash = 'user'
 * 
 * // using absolute path
 * current hash: 'abc/user?id=123&name=abc'
 * navigateToPage('./profile', {id: '123'}) => location.hash = 'abc/user/profile?id=123'
 * navigateToPage('../profile', {id: '123'}) => location.hash = 'abc/profile?id=123'
 * navigateToPage('./') => location.hash = 'abc/user'
 * 
 * // using function
 * navigateToPage('user', query => {
 *      query.set('id', '123');
 *      return query;
 * }
 */
export function navigateToPage(page, query) {
    let { page: currentPage, query: currentQuery } = urlConverter(location.hash);
    currentPage = currentPage.replace('#/', '');

    if (page.startsWith('./')) {
        const paths = currentPage.split('/');
        paths.push(page.slice(2));
        page = paths.join('/');
    }
    else if (page.startsWith('../')) {
        const paths = currentPage.split('/');
        const newPaths = paths.slice(0, -1);
        newPaths.push(page.slice(3));
        page = newPaths.join('/');
    }


    let hash = '/' + page;

    if (hash.endsWith('/')) {
        hash = hash.slice(0, -1);
    }

    /**
     * @type {URLSearchParams | undefined}
     */
    let search = undefined;

    if (typeof query === 'function')
        search = query(currentQuery);
    else if (query) { search = new URLSearchParams(query) };

    if (search) {
        hash += '?' + search.toString();
    }
    location.hash = hash
}

/**
 * 
 * @param {string} url 
 */
export async function addStyle(url) {
    if (document.getElementById(encodeURIComponent(url))) return;
    const res = await fetch(url);
    const text = await res.text();

    const style = document.createElement('style');
    style.id = encodeURIComponent(url);
    style.innerHTML = text;
    document.head.appendChild(style);
}

/**
 * 
 * @param {string} url 
 */
export function removeStyle(url) {
    const style = document.getElementById(encodeURIComponent(url));
    if (style) {
        document.head.removeChild(style);
    }
}