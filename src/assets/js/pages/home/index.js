import {
    createPagination,
    displayProducts,
    selectionConditional,
    setupPaginationListeners,
    updatePagination,
} from './renderProduct.js';
import { navigateToPage } from '../../until/router.js';
import fakeDatabase from '../../db/fakeDBv1.js';

/**
 *
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
 */
function initializationAside() {
    const aside = document.querySelector('aside');
    if (!aside) return;

    aside.innerHTML = `
    <div class="aside-box box1 card">
        <div class="catergory__header">Danh mục</div>
        <div class="catergory__content">
            <div class="catergory__row">
                <div class="catergory__row--header">
                    Giáo trình
                </div>
                <div class="catergory__row--sub">
                    <li
                        class="catergory__row--sub-header"
                        data-value="gtcb"
                    >
                        <span>Cơ bản</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="gtnc"
                    >
                        <span>Nâng cao</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="gtcn"
                    >
                        <span>Chuyên ngành</span>
                    </li>
                </div>
            </div>
            <div class="catergory__row">
                <div class="catergory__row--header">
                    Bài giảng
                </div>
                <div class="catergory__row--sub">
                    <li
                        class="catergory__row--sub-header"
                        data-value="bgpp"
                    >
                        <span>Powderpoint</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="bgPDF"
                    >
                        <span>PDF</span>
                    </li>
                </div>
            </div>
            <div class="catergory__row">
                <div class="catergory__row--header">
                    Đề thi và đáp án
                </div>
                <div class="catergory__row--sub">
                    <li
                        class="catergory__row--sub-header"
                        data-value="dtdaclc"
                    >
                        <span>Chất lượng cao</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="dtdadt"
                    >
                        <span>Đại trà</span>
                    </li>
                </div>
            </div>
            <div class="catergory__row">
                <div class="catergory__row--header">
                    Bài tập lớn
                </div>
                <div class="catergory__row--sub">
                    <li
                        class="catergory__row--sub-header"
                        data-value="btcn"
                    >
                        <span>Cá nhân</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="btn"
                    >
                        <span>Nhóm</span>
                    </li>
                </div>
            </div>
            <div class="catergory__row">
                <div class="catergory__row--header">
                    Tài liệu tham khảo
                </div>
                <div class="catergory__row--sub">
                    <li
                        class="catergory__row--sub-header"
                        data-value="tltks"
                    >
                        <span>Sách tham khảo</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="tltkk"
                    >
                        <span>Tài liệu điện tử</span>
                    </li>
                </div>
            </div>
            <div class="catergory__row">
                <div class="catergory__row--header">
                    Luận văn
                </div>
                <div class="catergory__row--sub">
                    <li
                        class="catergory__row--sub-header"
                        data-value="lvtn"
                    >
                        <span>Tốt nghiệp</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="lvts"
                    >
                        <span>Thạc sĩ</span>
                    </li>
                    <li
                        class="catergory__row--sub-header"
                        data-value="lvtns"
                    >
                        <span>Tiến sĩ</span>
                    </li>
                </div>
            </div>
        </div>
    </div>`;

    const catergory_row = document.querySelectorAll('.catergory__row--header');
    catergory_row.forEach((row) => {
        row.addEventListener('click', () => {

            catergory_row.forEach((e) => {
                if (!e.isSameNode(row)) {
                    const catergory_sub_row = e.parentElement?.querySelector(
                        '.catergory__row--sub',
                    );

                    catergory_sub_row?.classList.remove('show');

                }
            });

            const catergory_sub_row = row.parentElement?.querySelector(
                '.catergory__row--sub',
            );
            catergory_sub_row?.classList.toggle('show');
        });
    });

    // khi chọn danh mục
    const sub_header = document.querySelectorAll('.catergory__row--sub-header');
    sub_header.forEach((sub) => {
        sub.addEventListener('click', () => {
            sub_header.forEach((e) => e.removeAttribute('selected'));
            sub.setAttribute('selected', 'true');
            const category = /**@type {HTMLElement}*/ (sub).dataset.value;

            if (!category) return;

            navigateToPage('./', { c: category });
        });
    });
}

/**
 *
 */
function initializationArticle() {
    const article = document.querySelector('article');
    if (!article) return;

    article.innerHTML = `
        <div class="article-header">
            <span>Danh sách tài liệu</span>
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
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function initializationHomePage(params, query) {
    initializationMain();
    initializationArticle();
    initializationAside();
}

/**
 *
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function updateHomePage(params, query) {
    const category = query.get('c') || '';
    const page_num = query.get('p') || '';

    selectionConditional(category === '' ? undefined : [category]);

    const catergory_row = document.querySelectorAll('.catergory__row--sub');
    console.log(catergory_row)
    catergory_row.forEach(e => e.classList.remove('show'))


    const sub_header = document.querySelectorAll('.catergory__row--sub-header');
    sub_header.forEach((sub) => {
        sub_header.forEach((e) => e.removeAttribute('selected'));

    });

    if (category) {
        const cate = /**@type {HTMLElement} */ (category ? document.querySelector(`.catergory__row--sub-header[data-value="${category}"]`) : null);
        cate.parentElement?.classList.add('show');
        cate.setAttribute('selected', 'true');
    }
    createPagination();
    setupPaginationListeners();
    if (page_num) {
        updatePagination(+page_num);
    }

    displayProducts().then(async () => {
        const headerText = document.querySelector('.article-header span');
        if (headerText) headerText.textContent = category ?
            `Danh mục tài liệu: ${(await fakeDatabase.getCategoryById(category))?.name}` : 'Danh sách tài liệu';
    });
}
