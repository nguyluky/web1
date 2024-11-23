import fakeDatabase from "../db/fakeDBv1.js";

let oldPathPage = '';


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
 * 
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


/**
 * @typedef {{
 *  pagePath: string,
 *  init: (params: {[key: string] : string}, query: URLSearchParams) => Promise<*>,
 *  update: (params: {[key: string] : string}, query: URLSearchParams) => Promise<*>,
 *  remove: (params: {[key: string] : string}, query: URLSearchParams) => Promise<*>
 *  title?: string | ((params: {[key: string] : string}, query: URLSearchParams) => string)
 * }} PAGE
 */



/**
 * Khởi tạo xử lý URL cho ứng dụng.
 *
 * Hàm này thiết lập các trình nghe sự kiện và trình xử lý cần thiết để quản lý
 * các thay đổi URL trong ứng dụng. Nó đảm bảo rằng ứng dụng có thể phản hồi các
 * đường dẫn và tham số URL khác nhau, cho phép điều hướng và quản lý trạng thái
 * dựa trên URL.
 *
 * Cách hoạt động:
 *
 * 1. Thêm một trình nghe sự kiện cho sự kiện 'hashchange' để xử lý các thay đổi
 *    hash của URL.
 * 2. Phân tích cú pháp hash của URL hiện tại để xác định trạng thái ban đầu của
 *    ứng dụng.
 * 3. Gọi hàm render update remove phù hợp dựa trên trạng thái ban đầu.
 *
 * Cách sử dụng:
 *
 * InitializeUrlHandling();
 *
 * Ví dụ:
 *
 * // Gọi hàm này một lần khi khởi động ứng dụng initializeUrlHandling();
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
 * 
 * @param {PAGE[]} pages
 * 
 */
export async function initializeUrlHandling(pages) {

    // MAP

    let pageObject = {};
    pages.forEach(page => {
        pageObject[page.pagePath] = page;
    });

    let { page: curr_page, query } = urlConverter(location.hash);

    for (const path of Object.keys(pageObject)) {
        const param = urlIsPage(curr_page.replace('#/', ''), path);
        if (param) {
            const page = pageObject[path];
            await page.init(param, query);
            await page.update(param, query);
            page.title && (document.title = typeof page.title === 'function' ? page.title(param, query) : page.title);
            oldPathPage = path;
            break;
        }
    }

    /**
     * Hiển thị loading spinner trong khi chuyển trang.
     * @returns {void}
     */
    function showLoading() {
        const main = document.querySelector('main');
        if (!main) return;
        main.innerHTML = `<div style="height: 100vh">
                <div class="dot-spinner-wrapper">
                    <div class="dot-spinner">
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                    </div>

                    <p style="margin-left: 10px">Đang tải dữ liệu</p>
                </div>
            </div>`
    }

    /** Khi hash thai đổi */
    async function handleHashChange() {
        let { page: urlPath, query } = urlConverter(location.hash);
        urlPath = urlPath.replace('#/', '');

        let isMach = false;

        for (const path of Object.keys(pageObject)) {
            const param = urlIsPage(urlPath, path);
            if (!param) { continue; }

            isMach = true;
            const page = pageObject[path];

            if (path != oldPathPage) {
                console.log('remove page:', oldPathPage);
                await pageObject[oldPathPage]?.remove(param, query);
                showLoading();
                console.log('init page:', path);
                await page.init(param, query);
                oldPathPage = path;
            }

            console.log('update page:', path);
            await page.update(param, query);
            page.title && (document.title = typeof page.title === 'function' ? page.title(param, query) : page.title);
            break;

        }

        if (!isMach) {
            const page = pageObject[oldPathPage];
            await page.remove({}, query);
            console.log('404 page');
            errorPage(404);
        }

    }

    window.addEventListener('hashchange', handleHashChange);

    if (!oldPathPage) {
        navigateToPage('home');
        return;
    };
}

/**
 * 
 * @param {number} code 
 * @param {string} [message]
 * @returns {void}
 */
export function errorPage(code, message) {
    const main = document.querySelector('main');
    if (!main) return;
    main.innerHTML = errorPageHtml(code);
    oldPathPage = 'error';

    if (message) {
        const span = document.createElement('span');
        span.innerText = message;
        main.querySelector('span')?.replaceWith(span);
    }
}

function errorPageHtml(code) {
    switch (code) {
        case 404:
            return `
            <div class="main_wapper">
                <article class="article page-not-found">
                    <img src="/assets/img/error-illustration-1.svg" alt="404" />
                    <h1>404</h1>
                    <strong>Page not found</strong>
                    <span
                        >Chúng tôi không tìm thấy trang bạn đang cố truy cập,
                        vui lòng về lại trang chính hoặc liên hệ với admin để
                        được giúp đỡ.</span
                    >
                </article>
            </div>`
        default:
            return `
            <div class="main_wapper">
                <article class="article page-not-found">
                    <img src="/assets/img/error-illustration-1.svg" alt="404" />
                    <h1>500</h1>
                    <strong>Server Error</strong>
                    <span
                        >Đây không phải lỗi của bạn đây là lỗi ở phía chúng tôi.</span
                    >
                </article>
            </div>`
    }
}
