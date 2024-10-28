import fakeDatabase from '../db/fakeDBv1.js';
//get data
const Product_Data = await fakeDatabase.getAllSach();
//tính số trang
let Current_Page = 1;
const Products_Per_page = 8;
const totalPages = 10//Math.ceil(Product_Data.length / Products_Per_page);
//nếu số trang > 1
if (totalPages > 1) createPagination();
// tạo Pagination
function createPagination() {
    const pagination = /**@type {HTMLElement}*/ (
        document.querySelector('.pagination')
    );
    pagination.innerHTML = `<button class="pagination__btns arrows">
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

    let beforepages = Current_Page - 2;
    let afterpages = Current_Page + 2;

    if(Current_Page == 2){
        beforepages = Current_Page - 1;
    }
    if(Current_Page == 1){
        beforepages = Current_Page;
    }
    if(Current_Page == totalPages - 1){
        afterpages = Current_Page + 1;
    }
    if(Current_Page == totalPages){
        afterpages = totalPages;
    }

    for (let i = beforepages; i <= afterpages; i++) {
        paginationPage.innerHTML += `<button class="pagination__btns page ${
            i == 1 ? 'active-page' : ''
        }">${i}</button>`;
    }
}
// create product card
async function createProduct(product) {
    const Product_Item = document.createElement('div');
    Product_Item.classList.add('product-card');
    const img = await fakeDatabase.getImgById(product.thumbnail);
    Product_Item.innerHTML = `
        <div class="product-img">
            <div class="discount-tag ${
                product.discount == 0 ? 'hide' : ''
            }">-${String(product.discount)}%</div>
            <img
                src="${img.data}"
                alt=""
            />
        </div>
        <div class="product-title">
            <p>${product.title}</p>
        </div>
        <div class="product-price">
            <span class="sale-price">
                ${String(
                    Math.round(
                        product.base_price * (1 - product.discount * 0.01),
                    ),
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
function displayProducts() {
    const productlist = /**@type {HTMLElement}*/ (
        document.querySelector('.product-container')
    );
    productlist.innerHTML = '';

    const start = (Current_Page - 1) * Products_Per_page;
    const end = start + Products_Per_page;
    const Products_To_Display = Product_Data.slice(start, end);

    Products_To_Display.forEach(async (product) => {
        const productItem = await createProduct(product);
        productlist.appendChild(productItem);
    });
}
//
function activePage() {
    const getAllPage = document.querySelectorAll('.pagination__btns.page');
    getAllPage.forEach((e) => {
        e.classList.remove('active-page');
    });
    getAllPage[Current_Page - 1].classList.add('active-page');
}
// Chuyển đến trang trước
function prevPage() {
    if (Current_Page > 1) {
        Current_Page--;
        displayProducts();
        activePage();
    }
}

// Chuyển đến trang sau
function nextPage() {
    if (Current_Page < totalPages) {
        Current_Page++;
        displayProducts();
        activePage();
    }
}

// Chuyển đến trang cụ thể
function goToPage(page) {
    if (Current_Page != page) {
        Current_Page = page;
        displayProducts();
        activePage();
    }
}

function setupPaginationListeners() {
    const Page_Nums = document.querySelectorAll('.pagination__btns');
    Page_Nums.forEach((page) => {
        page.addEventListener('click', () => {
            if (page.classList.contains('page')) {
                goToPage(Number(page.innerHTML));
                createPagination()
            } else {
                if (page.innerHTML.includes('fa-angle-left')) {
                    prevPage();
                    createPagination()
                } else if (page.innerHTML.includes('fa-angle-right')) {
                    nextPage();
                    createPagination()
                }
            }
        });
    });
}

export { setupPaginationListeners, displayProducts };
