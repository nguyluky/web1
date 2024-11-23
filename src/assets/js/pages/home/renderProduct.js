import { pushCartItemIntoCart } from '../cart/cart.js';
import fakeDatabase from '../../db/fakeDBv1.js';
import { formatNumber, removeDiacritics } from '../../until/format.js';
import { navigateToPage } from '../../until/router.js';
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
        paginationPage.innerHTML += `<button class="pagination__btns page ${i == 1 ? 'active-page' : ''
            }">${i}</button>`;
    }
}

/**
 *
 * @param {import('../../until/type.js').Sach} product
 * @returns {Promise<HTMLElement>}
 */
export async function createProduct(product) {
    const productItem = document.createElement('div');
    productItem.classList.add('product-card');
    productItem.setAttribute('data-id', product.id);
    const img = await fakeDatabase.getImgById(product.thumbnail);
    let source = './assets/img/default-image.png';
    if (img) source = img.data;

    const productImg = document.createElement('div');
    productImg.classList.add('product-img');
    productItem.appendChild(productImg);

    const discountTag = document.createElement('div');
    discountTag.classList.add('discount-tag');
    if (product.discount == 0) discountTag.classList.add('hide');
    discountTag.innerHTML = `-${String(product.discount * 100)}%`;
    productImg.appendChild(discountTag);

    const imgTag = document.createElement('img');
    imgTag.src = source;
    imgTag.alt = '';
    productImg.appendChild(imgTag);

    const productTitle = document.createElement('div');
    productTitle.classList.add('product-title');
    productTitle.innerHTML = `<p>${product.title}</p>`;
    productItem.appendChild(productTitle);

    const productFooter = document.createElement('div');
    productFooter.classList.add('product-footer');
    productItem.appendChild(productFooter);

    const productPrice = document.createElement('div');
    productPrice.classList.add('product-price');
    productFooter.appendChild(productPrice);

    const salePrice = document.createElement('span');
    salePrice.classList.add('sale-price');
    salePrice.innerHTML = `${formatNumber(
        Math.round(product.base_price * (1 - product.discount)),
    )} <sup>₫</sup>`;
    productPrice.appendChild(salePrice);

    const regularPrice = document.createElement('span');
    regularPrice.classList.add('regular-price');
    if (product.discount == 0) regularPrice.classList.add('hide');
    regularPrice.innerHTML = `${formatNumber(product.base_price)} <sup>₫</sup>`;
    productPrice.appendChild(regularPrice);

    const addToCart = document.createElement('img');
    addToCart.classList.add('add-to-cart');
    addToCart.setAttribute('data-book-id', product.id);
    addToCart.src = './assets/img/add-to-cart.png';
    addToCart.alt = '';
    productFooter.appendChild(addToCart);

    addToCart.addEventListener('click', () => {

        pushCartItemIntoCart(product.id);
    })

    productItem.addEventListener('click', (event) => {
        const target = /**@type {HTMLInputElement}*/(event.target);
        if (addToCart.isSameNode(target)) return;
        location.hash = `#/product/${product.id}`;
    });

    return productItem;
}
/**
 * render products
 * @returns {Promise<void>}
 */
export async function displayProducts() {
    const noProduct = /**@type {HTMLElement}*/ (document.querySelector('.no-product'));

    const productlist = /**@type {HTMLElement}*/ (
        document.querySelector('.product-container')
    );
    const header = /**@type {HTMLElement}*/ (
        document.querySelector('.article-header')
    );
    productlist.innerHTML = '';
    if (data.length == 0) {
        header.style.display = 'none';
        noProduct.style.display = '';
        return;
    }
    noProduct.style.display = 'none';
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
    if (totalPages < 2) return;
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

        navigateToPage('./', query => {
            query.set('p', Current_Page + '');
            return query;
        });
    }
}

/**
 * Chuyển đến trang tiếp theo
 */
function nextPage() {
    if (Current_Page < totalPages) {
        Current_Page++;

        navigateToPage('./', query => {
            query.set('p', Current_Page + '');
            return query;
        });
    }
}

/**
 * Chuyển đến trang cụ thể
 * @param {number} page
 */
function goToPage(page) {
    if (Current_Page != page) {
        Current_Page = page;

        navigateToPage('./', query => {
            query.set('p', Current_Page + '');
            return query;
        });
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
 * @param {number} [from=NaN]
 * @param {number} [to=NaN]
 */
export function selectionConditional(categories, searchText = '', from = NaN, to = NaN) {
    if (categories && categories.length > 0) {
        data = Product_Data.filter((e) => {
            return e.category.some((category_id) => {
                return categories.includes(category_id);
            });
        });
    } else {
        data = Product_Data
    }
    if (!isNaN(from) && !isNaN(to)) {
        data = data.filter((e) => {
            return (e.base_price >= from && e.base_price <= to);
        });
    }
    data = data.filter((e) => {
        return removeDiacritics(e.title).includes(removeDiacritics(searchText));
    });
    totalPages = Math.ceil(data.length / Products_Per_page);
    Current_Page = 1;
}
