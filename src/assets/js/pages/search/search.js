import { navigateToPage } from '../../until/urlConverter.js';
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
        .filter((e) => /**@type {HTMLInputElement} */(e).checked)
        .map((e) => /**@type {HTMLElement} */(e).dataset.category);



    const minPrice = Number(/**@type {HTMLInputElement} */(document.querySelector('.input-min'))?.value);
    const maxPrice = Number(/**@type {HTMLInputElement} */(document.querySelector('.input-max'))?.value);
    navigateToPage('./', (query) => {

        if (categories.length > 0) {
            const a = categories.join(',');
            if (query.get('cs') != a) {
                query.set('cs', categories.join(','));
                query.delete('p');
            }
        } else {
            query.delete('cs');
        }

        query.set('minPrice', minPrice + '');
        query.set('maxPrice', maxPrice + '');

        return query;
    })
}

/**
 *
 * @param {string[]} categories_
 */
function updateFilter(categories_) {
    const categories =
        /** @type {NodeListOf<HTMLInputElement>} */
        (document.querySelectorAll('.filter-checkbox input'));

    categories.forEach((e) => {
        if (categories_.includes(e.dataset.category || '')) {
            e.checked = true;
        } else {
            e.checked = false;
        }
    });
}

/**
 * @returns {void}
 */
function setupFilterListeners() {
    // khi nhập text tìm kiếm
    inputSearch?.addEventListener('keydown', (e) => {
        if (/**@type {KeyboardEvent} */ (e).key === 'Enter') {

            navigateToPage('./', (query) => {
                query.delete('cs');
                query.delete('minPrice');
                query.delete('maxPrice');
                query.set('t', inputSearch.value);
                return query;
            });
        }
    });
    // khi lọc theo category
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
            <div id="filter-btn"><i class="fa-solid fa-sliders"></i></div>
        </div>
        <div class="product-container"></div>
        <div class="pagination"></div>
        <div class="no-product">
            <img src="./assets/img/empty-product.png">
        </div>
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
                                <div class="checkbox-column_1">
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
                                </div>
                                <div class="checkbox-column_2">
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
                            </div>
                            <div class="filter-slider">
                                <div class="filter-header">Khoảng giá</div>
                                <div class="price-input">
                                    <div class="field">
                                        <span>Từ</span>
                                        <input type="number" class="input-min" value="25000">
                                    </div>
                                    <div class="separator">-</div>
                                    <div class="field">
                                        <span>Đến</span>
                                        <input type="number" class="input-max" value="50000">
                                    </div>
                                </div>
                                <div class="slider">
                                    <div class="progress"></div>
                                </div>
                                <div class="range-input">
                                    <input type="range" class="range-min" min="0" max="100000" value="25000" step="1000">
                                    <input type="range" class="range-max" min="0" max="100000" value="50000" step="1000">
                                </div>
                                <div class="price-range">
                                    <span>0</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                        <div class="filter-footer">
                            <button class="popup-btn">LỌC</button>
                        </div>
                    </div>`;

    const rangeInput = /**@type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll(".range-input input")),
        priceInput =  /**@type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll(".price-input input")),
        range =  /**@type {HTMLElement} */ (document.querySelector(".slider .progress"));

    if (!range) {
        console.error("Không tìm thấy range");
        return;
    }
    let priceGap = 10000;
    // biếng JSDoc quá

    // khi nhập số tiền
    priceInput.forEach((input) => {
        input.addEventListener("input", (e) => {
            let minPrice = parseInt(/**@type {HTMLInputElement} */(priceInput[0]).value),
                maxPrice = parseInt(/**@type {HTMLInputElement} */(priceInput[1]).value);
            // nếu nhập đúng điều kiện
            if (maxPrice - minPrice >= priceGap && maxPrice <= Number(/**@type {HTMLInputElement} */(rangeInput[1]).max)) {
                if (/**@type {HTMLElement} */ (e.target).className === "input-min") {

                    rangeInput[0].value = minPrice + '';

                    range.style.left = (minPrice / +rangeInput[0].max) * 100 + "%";
                } else {

                    rangeInput[1].value = maxPrice + '';

                    range.style.right = 100 - (maxPrice / +rangeInput[1].max) * 100 + "%";
                }
            }
        });
    });

    rangeInput.forEach((input) => {
        input.addEventListener("input", (e) => {
            const target = /**@type {HTMLElement} */ (e.target);
            if (!target) return;

            let minVal = parseInt(rangeInput[0].value),

                maxVal = parseInt(rangeInput[1].value);



            if (maxVal - minVal < priceGap) {

                if (target.className === "range-min") {

                    rangeInput[0].value = (maxVal - priceGap) + '';
                } else {

                    rangeInput[1].value = (minVal + priceGap) + '';
                }


                range.style.left = (minVal / +rangeInput[0].max) * 100 + "%";

                range.style.right = 100 - (maxVal / +rangeInput[1].max) * 100 + "%";
            } else {

                priceInput[0].value = minVal + '';

                priceInput[1].value = maxVal + '';

                range.style.left = (minVal / +rangeInput[0].max) * 100 + "%";

                range.style.right = 100 - (maxVal / +rangeInput[1].max) * 100 + "%";
            }
        });
    });

}

/**
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function initializationSearchPage(params, query) {
    initializationMain();
    initializationArticle();
    initializationAside();
    setupFilterListeners();
}

/**
 * @param {{[key: string]: string}} page
 * @param {URLSearchParams} query
 */
export async function updateSearchPage(page, query) {
    const p = query.get('p') || '';
    const t = query.get('t') || '';
    const cs = query.get('cs')?.split(',') || [];
    const from = NaN || Number(query.get('minPrice'));
    const to = Number(query.get('maxPrice')) || NaN;
    const searchFor = document.querySelector('.article-header span span');
    if (searchFor) searchFor.textContent = t;
    updateFilter(cs);
    selectionConditional(cs, t, from, to);
    createPagination();
    setupPaginationListeners();
    if (p) {
        updatePagination(+p);
    }
    displayProducts();
}
