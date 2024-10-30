import fakeDatabase from '../db/fakeDBv1.js';

const Product_Data = await fakeDatabase.getAllSach();
let data = Product_Data;
let Current_Page = 1;
let Products_Per_page = 8;
let totalPages = Math.ceil(Product_Data.length / Products_Per_page);

function createPagination() {
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
    setupPaginationListeners();
}
// create product card
async function createProduct(product) {
    const Product_Item = document.createElement('div');
    Product_Item.classList.add('product-card');
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
        <div class="product-price">
            <span class="sale-price">
                ${String(
                    Math.round(product.base_price * (1 - product.discount)),
                )} <sup>₫</sup></span>
            <span class="regular-price ${product.discount == 0 ? 'hide' : ''}">
                ${String(product.base_price)} <sup>₫</sup></span>
            <img
                class="add-to-cart"
                src="./assets/img/add-to-cart.png"
                alt=""
            />
        </div>
        `;
    return Product_Item;
}
// render products
function displayProducts(data = Product_Data) {
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

    Products_To_Display.forEach(async (product) => {
        console.log(product);
        const productItem = await createProduct(product);
        productlist.appendChild(productItem);
    });
}
//
function updatePagination() {
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
    displayProducts(data);
}
// Chuyển đến trang trước
function prevPage() {
    if (Current_Page > 1) {
        Current_Page--;
        updatePagination();
    }
}

// Chuyển đến trang sau
function nextPage() {
    if (Current_Page < totalPages) {
        Current_Page++;
        updatePagination();
    }
}

// Chuyển đến trang cụ thể
/**@param {Number} page  */
function goToPage(page) {
    if (Current_Page != page) {
        Current_Page = page;
        updatePagination();
    }
}

function setupPaginationListeners() {
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
function renderProduct() {
    console.log('call renderProduct');
    // default
    displayProducts();
    createPagination();
    // khi chọn danh mục
    const sub_header = document.querySelectorAll('.catergory__row--sub-header');

    sub_header.forEach((sub) => {
        sub.addEventListener('click', (ev) => {
            const category = /**@type {HTMLElement}*/ (sub).dataset.value;
            if (category) {
                data = Product_Data.filter((e) => {
                    return e.category.indexOf(category) != -1;
                });
                totalPages = Math.ceil(data.length / Products_Per_page);
                console.log('data', data);
            }
            Current_Page = 1;
            displayProducts(data);
            createPagination();
        });
    });
}

export default renderProduct;
