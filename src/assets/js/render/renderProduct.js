import fakeDatabase from '../db/fakeDBv1.js';
//get data
const Product_Data = await fakeDatabase.getAllSach();
//tính số trang
let Current_Page = 1;
const Products_Per_page = 8;
const totalPages = Math.ceil(Product_Data.length / Products_Per_page);
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
    for (let i = 1; i <= (totalPages < 5 ? totalPages : 5); i++) {
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
    let firstPage = 1;
    let lastPage = totalPages;
    if (totalPages > 5) {
        if (Current_Page > totalPages - 2) firstPage = totalPages - 4;
        else if (Current_Page > 3) {
            firstPage = Current_Page - 2;
            lastPage = firstPage + 4;
        }
    }
    const getAllPage = document.querySelectorAll('.pagination__btns.page');
    getAllPage.forEach((e, i) => {
        e.innerHTML = `${firstPage + i}`;
        e.classList.remove('active-page');
        if (e.innerHTML == String(Current_Page)) e.classList.add('active-page');
    });
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

export { setupPaginationListeners, displayProducts };
