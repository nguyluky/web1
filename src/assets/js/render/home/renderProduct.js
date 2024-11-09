import fakeDatabase from '../../db/fakeDBv1.js';
import urlConverter from '../../until/urlConverter.js';

const Product_Data = await fakeDatabase.getAllBooks();
let data = Product_Data;
let Current_Page = 1;
let Products_Per_page = 8;
let totalPages = Math.ceil(Product_Data.length / Products_Per_page);

/**
 *
 * @returns {void}
 */
export function createPagination() {
    const pagination = /**@type {HTMLElement}*/ (
        document.querySelector('.pagination')
    );
    if (totalPages < 2) {
        pagination.innerHTML = ``;
        return;
    }
    pagination.innerHTML = `<button class="pagination__btns arrows disable">
        <i class="fa-solid fa-angle-left"></i>
    </button>
    <div class="pagination__page"></div>
    <button class="pagination__btns arrows">
        <i class="fa-solid fa-angle-right"></i>
    </button>`;
    const paginationPage = /**@type {HTMLElement}*/ (
        document.querySelector('.pagination__page')
    );
    paginationPage.innerHTML = ``;
    for (let i = 1; i <= (totalPages < 5 ? totalPages : 5); i++) {
        paginationPage.innerHTML += `<button class="pagination__btns page ${
            i == 1 ? 'active-page' : ''
        }">${i}</button>`;
    }
}

/**
 *
 * @param {import('../../until/type.js').Sach} product
 * @returns {Promise<HTMLElement>}
 */
export async function createProduct(product) {
    const Product_Item = document.createElement('div');
    Product_Item.classList.add('product-card');
    Product_Item.setAttribute('data-id', product.id);
    const img = await fakeDatabase.getImgById(product.thumbnail);
    let source = './assets/img/default-image.png';
    if (img) source = img.data;
    Product_Item.innerHTML = `
        <div class="product-img">
            <div class="discount-tag ${
                product.discount == 0 ? 'hide' : ''
            }">-${String(product.discount * 100)}%</div>
            <img
                src="${source}"
                alt=""
            />
        </div>
        <div class="product-title">
            <p>${product.title}</p>
        </div>
        <div class="product-footer">
            <div class="product-price">
                <span class="sale-price">
                    ${String(
                        Math.round(product.base_price * (1 - product.discount)),
                    )} <sup>₫</sup></span>
                <span class="regular-price ${
                    product.discount == 0 ? 'hide' : ''
                }">
                    ${String(product.base_price)} <sup>₫</sup></span>
            </div>
            <img
                class="add-to-cart" data-book-id = ${product.id}
                src="./assets/img/add-to-cart.png"
                alt=""
            />
        </div>
        `;
    return Product_Item;
}
/**
 * render products
 * @returns {Promise<void>}
 */
export async function displayProducts() {
    const productlist = /**@type {HTMLElement}*/ (
        document.querySelector('.product-container')
    );
    const header = /**@type {HTMLElement}*/ (
        document.querySelector('.article-header')
    );
    productlist.innerHTML = '';
    if (data.length == 0) {
        header.style.display = 'none';
        return;
    }
    header.style.display = '';
    const start = (Current_Page - 1) * Products_Per_page;
    const end = start + Products_Per_page;
    const Products_To_Display = data.slice(start, end);

    for (const product of Products_To_Display) {
        const productItem = await createProduct(product);
        productlist.appendChild(productItem);
    }
}

/**
 *
 * @param {number} page
 */
export function updatePagination(page) {
    Current_Page = page;
    let firstPage = 1;
    if (totalPages > 5) {
        if (Current_Page > totalPages - 2) firstPage = totalPages - 4;
        else if (Current_Page > 3) firstPage = Current_Page - 2;
    }
    const getAllPage = document.querySelectorAll('.pagination__btns.page');
    const getAllArrow = document.querySelectorAll('.pagination__btns.arrows');
    getAllArrow.forEach((e) => {
        e.classList.remove('disable');
    });
    if (Current_Page == 1) getAllArrow[0].classList.add('disable');
    if (Current_Page == totalPages) getAllArrow[1].classList.add('disable');
    getAllPage.forEach((e, i) => {
        e.innerHTML = `${firstPage + i}`;
        e.classList.remove('active-page');
        if (e.innerHTML == String(Current_Page)) e.classList.add('active-page');
    });
}

/**
 * Chuyển đến trang trước đó
 */
function prevPage() {
    if (Current_Page > 1) {
        Current_Page--;

        const { page, query } = urlConverter(location.hash);
        query.set('p', Current_Page + '');
        location.hash = page + '?' + query.toString();
    }
}

/**
 * Chuyển đến trang tiếp theo
 */
function nextPage() {
    if (Current_Page < totalPages) {
        Current_Page++;

        const { page, query } = urlConverter(location.hash);
        query.set('p', Current_Page + '');
        location.hash = page + '?' + query.toString();
    }
}

/**
 * Chuyển đến trang cụ thể
 * @param {number} page
 */
function goToPage(page) {
    if (Current_Page != page) {
        Current_Page = page;

        const { page: page_, query } = urlConverter(location.hash);
        query.set('p', Current_Page + '');
        location.hash = page_ + '?' + query.toString();
    }
}

/**
 * Thêm sự kiện cho các nút phân trang
 */
export function setupPaginationListeners() {
    const Page_Nums = document.querySelectorAll('.pagination__btns');
    Page_Nums.forEach((page) => {
        page.addEventListener('click', () => {
            if (page.classList.contains('page')) {
                goToPage(Number(page.innerHTML));
            } else {
                if (page.innerHTML.includes('fa-angle-left')) {
                    prevPage();
                } else if (page.innerHTML.includes('fa-angle-right')) {
                    nextPage();
                }
            }
        });
    });
}

/**
 *
 * @param {string[]} [categories ]
 * @param {string} [searchText='']
 */
export function selectionConditional(categories, searchText = '') {
    if (categories && categories.length > 0) {
        data = Product_Data.filter((e) => {
            return (
                categories.every((category_id) =>
                    e.category.includes(category_id),
                ) && e.title.toLowerCase().includes(searchText.toLowerCase())
            );
        });
    } else {
        data = Product_Data.filter((e) => {
            return e.title.toLowerCase().includes(searchText.toLowerCase());
        });
    }
    totalPages = Math.ceil(data.length / Products_Per_page);
    Current_Page = 1;
}
