import urlConverter from '../../until/urlConverter.js';
import {
    createPagination,
    displayProducts,
    selectionConditional,
    setupPaginationListeners,
    updatePagination,
} from '../home/renderProduct.js';

// let categories = [];
const inputSearch = /**@type {HTMLInputElement} */ (
    document.querySelector('.search-bar')
);

/**
 * @returns {void}
 */
function searchFilter() {
    const categories = Array.from(
        document.querySelectorAll('.filter-checkbox input'),
    )
        .filter((e) => /**@type {HTMLInputElement} */ (e).checked)
        .map((e) => /**@type {HTMLElement} */ (e).dataset.category);
    // console.log(categories);

    // TODO: hehe
    // NOTE: update URL
    const { page, query } = urlConverter(location.hash);
    query.set('cs', categories.join(','));
    location.hash = page + '?' + query.toString();
}

/**
 * @returns {void}
 */
function defaultFilter() {
    const categories = [];
    Array.from(document.querySelectorAll('.filter-checkbox input')).forEach(
        (e) => {
            /**@type {HTMLInputElement} */ (e).checked = false;
        },
    );
}

function updateFilter(categories_) {
    const categories =
        /** @type {NodeListOf<HTMLInputElement>} */
        (document.querySelectorAll('.filter-checkbox input'));

    categories.forEach((e) => {
        if (categories_.includes(e.dataset.category)) {
            e.checked = true;
        }
    });
}

/**
 * @returns {void}
 */
function setupFilterListeners() {
    const { page, query } = urlConverter(location.hash);
    query.delete('p');
    inputSearch?.addEventListener('keydown', (e) => {
        if (/**@type {KeyboardEvent} */ (e).key === 'Enter') {
            // NOTE: command tạm
            // defaultFilter();
            query.set('t', inputSearch.value);
            location.hash = page + '?' + query.toString();
        }
    });
    const filterPopup = document.querySelector('#search-filter');
    filterPopup
        ?.querySelector('.popup-btn')
        ?.addEventListener('click', (event) => {
            searchFilter();

            // updateSearchPage();
        });
}

/**
 *
 * @returns {void}
 */
function initializationMain() {
    const main = document.querySelector('main');

    if (!main) return;

    main.innerHTML = `
    <div class="main_wapper">
        <aside class="aside"></aside>
        <article class="article">
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
        </article>
    </div>`;
}

/**
 *
 * @returns {void}
 */
function initializationArticle() {
    const article = document.querySelector('article');
    if (!article) return;

    article.innerHTML = `
        <div class="article-header">
            <span>Tìm kiếm cho: <span></span></span>
        </div>
        <div class="product-container"></div>
        <div class="pagination"></div>
    `;
}

/**
 *
 * @returns {void}
 */
function initializationAside() {
    const aside = document.querySelector('aside');
    if (!aside) return;

    aside.innerHTML = `<div id="search-filter">
                        <div class="filter-header">Tất cả các bộ lọc</div>
                        <div class="filter-body">
                            <div class="filter-checkbox">
                                <label for="ck-gtcb">
                                    <input
                                        type="checkbox"
                                        id="ck-gtcb"
                                        data-category="gtcb"
                                    />
                                    <span>Giáo trình cơ bản</span>
                                </label>
                                <label for="ck-gtnc">
                                    <input
                                        type="checkbox"
                                        id="ck-gtnc"
                                        data-category="gtnc"
                                    />
                                    <span>Giáo trình nâng cao</span>
                                </label>
                                <label for="ck-gtcn">
                                    <input
                                        type="checkbox"
                                        id="ck-gtcn"
                                        data-category="gtcn"
                                    />
                                    <span>Giáo trình chuyên ngành</span>
                                </label>
                                <label for="ck-bgpp">
                                    <input
                                        type="checkbox"
                                        id="ck-bgpp"
                                        data-category="bgpp"
                                    />
                                    <span>Bài giảng Powerpoint</span>
                                </label>
                                <label for="ck-bgpdf">
                                    <input
                                        type="checkbox"
                                        id="ck-bgpdf"
                                        data-category="bgPDF"
                                    />
                                    <span>Bài giảng PDF</span>
                                </label>
                                <label for="ck-dtclc">
                                    <input
                                        type="checkbox"
                                        id="ck-dtclc"
                                        data-category="dtdaclc"
                                    />
                                    <span>Đề thi chất lượng cao</span>
                                </label>
                                <label for="ck-dtdt">
                                    <input
                                        type="checkbox"
                                        id="ck-dtdt"
                                        data-category="dtdadt"
                                    />
                                    <span>Đề thi đại trà</span>
                                </label>

                                <label for="ck-btcn">
                                    <input
                                        type="checkbox"
                                        id="ck-btcn"
                                        data-category="btcn"
                                    />
                                    <span>Bài tập cá nhân</span>
                                </label>
                                <label for="ck-btn">
                                    <input
                                        type="checkbox"
                                        id="ck-btn"
                                        data-category="btn"
                                    />
                                    <span>Bài tập nhóm</span>
                                </label>
                                <label for="ck-stk">
                                    <input
                                        type="checkbox"
                                        id="ck-stk"
                                        data-category="tltks"
                                    />
                                    <span>Sách tham khảo</span>
                                </label>
                                <label for="ck-tldt">
                                    <input
                                        type="checkbox"
                                        id="ck-tldt"
                                        data-category="tltkk"
                                    />
                                    <span>Tài liệu điện tử</span>
                                </label>
                                <label for="ck-lvtn">
                                    <input
                                        type="checkbox"
                                        id="ck-lvtn"
                                        data-category="lvtn"
                                    />
                                    <span>Luận văn tốt nghiệp</span>
                                </label>
                                <label for="ck-lvts">
                                    <input
                                        type="checkbox"
                                        id="ck-lvts"
                                        data-category="lvts"
                                    />
                                    <span>Luận văn thạc sĩ</span>
                                </label>
                                <label for="ck-lvtns">
                                    <input
                                        type="checkbox"
                                        id="ck-lvtns"
                                        data-category="lvtns"
                                    />
                                    <span>Luận văn tiến sĩ</span>
                                </label>
                            </div>
                            <div class="filter-slider">
                                <div class="filter-slider__header">
                                    Chọn mức giá
                                </div>
                                <div class="price-slider">
                                    <div class="price-slider-min">1</div>
                                    <div class="price-slider-display">50</div>
                                    <div class="price-slider-min">100</div>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value="50"
                                />
                            </div>
                        </div>
                        <button class="popup-btn">LỌC</button>
                    </div>`;
}

/**
 *
 */
export async function initializationSearchPage() {
    initializationMain();
    initializationArticle();
    initializationAside();
    setupFilterListeners();
}

/**
 * @param {string} page
 * @param {URLSearchParams} query
 */
export function updateSearchPage(page, query) {
    const p = query.get('p') || '';
    const t = query.get('t') || '';
    const cs = query.get('cs')?.split(',') || [];
    const searchFor = document.querySelector('.article-header span span');
    if (searchFor) searchFor.textContent = t;
    console.log(cs);
    updateFilter(cs);
    selectionConditional(cs, t);
    createPagination();
    setupPaginationListeners();
    if (p) {
        updatePagination(+p);
    }
    displayProducts();
}
