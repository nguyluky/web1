import urlConverter from '../../until/urlConverter.js';
import renderProduct, {
    createPagination,
    displayProducts,
    selectionCatergory,
    setupPaginationListeners,
    updatePagination,
} from './renderProduct.js';
import addToCartOnButton from '../../cart.js';

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
                        data-value="bgpdf"
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
                        data-value="dtddtdaclcadt"
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
            const catergory_sub_row = row.parentElement?.querySelector(
                '.catergory__row--sub',
            );
            catergory_sub_row?.classList.toggle('show');
        });
    });

    // khi chọn danh mục
    const sub_header = document.querySelectorAll('.catergory__row--sub-header');

    sub_header.forEach((sub) => {
        sub.addEventListener('click', (ev) => {
            sub_header.forEach((e) => e.removeAttribute('selected'));
            sub.setAttribute('selected', 'true');
            const category = /**@type {HTMLElement}*/ (sub).dataset.value;

            if (!category) return;

            // selectionCatergory(category);

            const { page, query } = urlConverter(location.hash);
            query.set('c', category);
            query.delete('p');
            location.hash = page + '?' + query.toString();
            // displayProducts();
            // createPagination();
        });
    });
}

function initializationArticle() {
    const article = document.querySelector('article');
    if (!article) return;

    article.innerHTML = `
        <div class="article-header">
            <span>Danh sách tài liệu</span>
        </div>
        <div class="product-container"></div>
        <div class="pagination"></div>
    `;
}

export function initializationHomePage() {
    initializationArticle();
    initializationAside();
}

/**
 *
 * @param {string} page
 * @param {URLSearchParams} query
 */
export async function updateHomePage(page, query) {
    const category = query.get('c') || '';
    const page_num = query.get('p') || '';

    selectionCatergory(category);

    createPagination();
    setupPaginationListeners();
    if (page_num) {
        updatePagination(+page_num);
    }
    // await displayProducts();
    // addToCartOnButton();
    displayProducts().then(() => {
        addToCartOnButton();
    });
    // displayProducts();
    // addToCartOnButton();
}
