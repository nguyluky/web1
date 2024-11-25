import fakeDatabase from '../../db/fakeDBv1.js';
import { toast } from '../../render/popupRender.js';
import { formatNumber, text2htmlElement } from '../../until/format.js';
import { addStyle, errorPage, navigateToPage, removeStyle } from '../../until/router.js';
import uuidv from '../../until/uuid.js';
import { buyBooks, pushCartItemIntoCart, updateCartQuantity } from '../cart/cart.js';

let SPtt = [];
let Current_Page = 1;
let Products_Per_page = 4;

let Product_Data = [];

/**
 *
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function initializationProductPage(params, query) {
    const main = document.querySelector('main');
    if (!main) return;


    await addStyle('./assets/css/product.css');

    const product_id = params.id;

    const general_info = await fakeDatabase.getSachById(product_id);
    if (!general_info) {
        errorPage(404, "Sản phẩm bạn đang tìm kiếm hiện không tồn tại vui lòng thử lại sau vài phút hoặc liên hệ với chúng tôi để được hỗ trợ");
        return;
    }
    const container = rendergeneralInfo(general_info);

    main.innerHTML = `
    <div class="main_wapper">
        <div class="left-section">
            ${await renderleftsection(general_info)}
        </div>

        <div class="center-section">
            <div class="product-title-container">
                ${container.innerHTML}
            </div>
            <div class="description-container">
                <h4>Mô tả sản phẩm</h4>
                <p class="description-details">
                    ${general_info?.details}
                </p>
            </div>
            <div class="other-product-container">
                <div class="products-header">Sản phẩm tương tự</div>
                <div class="products">
                </div>
            </div>
    </div>
    `;

    let cates = general_info.category

    if (Product_Data.length == 0) {
        Product_Data = await fakeDatabase.getAllBooks();
    }
    SPtt = Product_Data.filter((book) => {
        return cates.some(e => { return book.category.includes(String(e)) && book.id != product_id })
    })

    console.log(SPtt);


    setEventListener(product_id);
    shuffle(SPtt); // trước khi display sản phẩm tương tự thì sẽ shuffle lại mảng
    displayProducts();
    globalThis.scrollTo({ top: 0, behavior: "smooth" }); // kéo lên đầu trang mỗi khi tạo trang product
}

/**
 *
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function updateProductPage(params, query) {
    initializationProductPage(params, query);
}

/**
 * 
 * @param {{[key: string]: string}} params 
 * @param {URLSearchParams} query 
 */
export async function removeProductPage(params, query) {
    await removeStyle('./assets/css/product.css');
}

function addquantity(total, quantity, sale_price) {
    quantity.value++;
    sale_price = sale_price * quantity.value;
    quantity.innerHTML = quantity.value;
    total.innerHTML = formatNumber(sale_price * 1000);
}

function minusquantity(total, quantity, sale_price) {
    if (quantity.value > 1) {
        quantity.value--;
        sale_price = sale_price * quantity.value;
        quantity.innerHTML = quantity.value;
        total.innerHTML = formatNumber(sale_price * 1000);
    }
}

function changequantity(total, quantity, sale_price) {
    sale_price = sale_price * quantity.value;
    total.innerHTML = formatNumber(sale_price * 1000);
}

// hàm sắp xếp random
function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

async function createCategory(category_id) {
    const categories = await fakeDatabase.getAllCategory();
    const product_category = document.createElement('div');

    let category_name = '';
    categories.forEach(cate => {
        if (cate.id == category_id) {
            category_name = cate.name;
        }
    });
    product_category.className = "product-category";
    product_category.setAttribute('data-category', category_id);
    product_category.innerHTML = category_name;

    return product_category;
}

/**
 *
 * @param {import('../../until/type.js').Sach} general_info
 * @returns {HTMLDivElement}
 */
function rendergeneralInfo(general_info) {
    const product_container = document.createElement('div');
    product_container.className = "product-title-container";

    const product_title = document.createElement('div');
    product_title.className = "product-title";
    product_title.innerHTML = String(general_info?.title);
    product_container.appendChild(product_title);

    const category_container = document.createElement('div');
    category_container.className = "product-category-container";
    general_info?.category.forEach(async category => {
        const inner_category = await createCategory(category);
        category_container.appendChild(inner_category);
    });

    product_container.appendChild(category_container);

    const price_container = document.createElement('div');
    price_container.className = "price-number-container";

    const discount = document.createElement('div');
    discount.className = "discount";
    if (general_info?.discount == 0) discount.classList.add('hide');
    discount.innerHTML = `-${String(Number(general_info?.discount) * 100)}%`;

    const sale_price = document.createElement('span');
    sale_price.className = "price-number sale";
    sale_price.innerHTML = `${String(
        formatNumber(Math.round(Number(general_info?.base_price) * (1 - Number(general_info?.discount)))),
    )} <sup>₫</sup>`;
    price_container.appendChild(sale_price);
    price_container.appendChild(discount);

    const regular_price = document.createElement('span');
    regular_price.className = "price-number regular";
    if (general_info?.discount == 0) regular_price.classList.add('hide');
    regular_price.innerHTML = `${String(formatNumber(general_info?.base_price))} <sup>₫</sup>`
    price_container.appendChild(regular_price);

    product_container.appendChild(price_container);

    return product_container;
}

async function renderleftsection(general_info) {

    const thumbnail = await fakeDatabase.getImgById(String(general_info?.thumbnail));
    let source = './assets/img/default-image.png';
    if (thumbnail) source = thumbnail.data;

    const sale_price = Math.round(Number(general_info?.base_price) * (1 - Number(general_info?.discount)));

    return `
            <div class="left-section__product-img">
                <img src=${source} alt="">
            </div>
            <div class="quantity">
                <div class="quantity-header">
                    Số lượng:
                </div>
                <div class="quantity-form">
                    <button class="dscr-quantity">
                        -
                    </button>
                    <input type="number" value="1" class="quantity-num">
                    <button class="inc-quantity">
                        +
                    </button>
                </div>
            </div>
            <div class="total-container">
                <div class="total-price__header">Tạm tính:</div>
                <span class="price-number total">
                    <span>${formatNumber(sale_price)}</span> <sup>₫</sup>
                </span>
            </div>
            <div class="buttons-section"> 
                <button class="buy-now">Mua ngay</button>
                <button class="add-to-cart" id="add-to-cart-button">Thêm giỏ hàng</button>
            </div>
    `;
}
function showImage(src) {
    const wrapper = document.getElementById('popup-wrapper');
    const html = `<div class="popup" id="popup-img">
            <div>
                <img src="${src}" alt>
            </div>
        </div>`;
    const element = /**@type {HTMLElement} */ (text2htmlElement(html));
    if (!wrapper) return
    wrapper.appendChild(element);
    const close = (ev) => {
        if ((ev.target).closest('.popup') === null) {
            element.remove();
            wrapper?.removeEventListener('click', close);
        }
    }
    wrapper.addEventListener('click', close);
    function changeSize() {
        let h = window.innerHeight;
        let w = window.innerWidth;
        console.log(h, w);
        const img = /**@type {HTMLImageElement} */ (element.querySelector('.popup img'));
        if (!img) return;
        let imgH = img.height;
        let imgW = img.width;
        if (imgH && imgW) {
            if (imgH / h > imgW / w)
                img.setAttribute('style', `height: ${0.9 * h < 700 ? '90vh' : '700px'}`);
            else
                img.setAttribute('style', `width: ${0.9 * w < 800 ? '90vw' : '800px'}`);
        }
    }
    changeSize();
    window.addEventListener('resize', () => changeSize());
}

function setEventListener(product_id) {
    const decrebtn = /**@type {HTMLElement}*/(document.querySelector('.dscr-quantity'));
    const increbtn = /**@type {HTMLElement}*/(document.querySelector('.inc-quantity'));
    let inputquantity = /**@type {HTMLInputElement}*/(document.querySelector('.quantity-num'));
    let total = /**@type {HTMLElement}*/(document.querySelector('.price-number.total span'));
    let sale_price = Number(total.innerHTML);

    if (!inputquantity) return;
    document.querySelector('.left-section__product-img')
        ?.addEventListener('click', (e) => {
            showImage(/**@type {HTMLImageElement}*/(e.target).src);
        });
    decrebtn.addEventListener('click', e => {
        minusquantity(total, inputquantity, sale_price);
    });
    increbtn.addEventListener('click', e => {
        addquantity(total, inputquantity, sale_price);
    });

    inputquantity.addEventListener('change', e => {
        if (Number(inputquantity.value) < 1) {
            inputquantity.value = '1';
            toast({ message: 'Số lượng phải lớn hơn 0', type: 'warning' });
        }
        else {
            changequantity(total, inputquantity, sale_price);
        }
    });

    const add_to_cart = document.querySelector('.add-to-cart');
    add_to_cart?.addEventListener('click', e => {
        pushCartItemIntoCart(product_id, Number(inputquantity.value));
    });

    const categories = /**@type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.product-category'));
    categories.forEach(category => {
        category.addEventListener('click', e => {
            navigateToPage('home', { c: String(category.dataset.category) });
        });
    });

    const buy_now = document.querySelector('.buy-now');
    buy_now?.addEventListener('click', e => {

        if (!localStorage.getItem('user_id')) {
            toast({
                title: 'Vui lòng đăng nhập để xem giỏ hàng',
                type: 'error',
            });
            return;
        }

        // TODO: fuckk
        navigateToPage('payment', { payment: product_id + '-' + inputquantity.value });

    });

}

/**
 * 
 * @param {import('../../until/type.js').Sach} product 
 * @returns {Promise<HTMLDivElement>}
 */

async function createProduct(product) {
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
    productPrice.classList.add('product-price-detail');
    productFooter.appendChild(productPrice);

    const salePrice = document.createElement('span');
    salePrice.classList.add('other-sale');
    salePrice.innerHTML = `${String(
        formatNumber(Math.round(product.base_price * (1 - product.discount))),
    )} <sup>₫</sup>`;
    productPrice.appendChild(salePrice);

    const regularPrice = document.createElement('span');
    regularPrice.classList.add('other-regular');
    if (product.discount == 0) regularPrice.classList.add('hide');
    regularPrice.innerHTML = `${String(formatNumber(product.base_price))} <sup>₫</sup>`;
    productPrice.appendChild(regularPrice);

    // productItem.addEventListener('click', (event) => {
    //     const target = /**@type {HTMLInputElement}*/(event.target);
    //     //if (addToCart.isSameNode(target)) return;
    //     location.hash = `#/product/${product.id}`;
    // });

    productItem.addEventListener('click', e => {
        navigateToPage(`product/${product.id}`)
    });

    return productItem;
}

async function displayProducts() {
    //const noProduct = /**@type {HTMLElement}*/ (document.querySelector('.no-product'));

    const productlist = /**@type {HTMLElement}*/ (
        document.querySelector('.products')
    );
    const header = /**@type {HTMLElement}*/ (
        document.querySelector('.products-header')
    );
    productlist.innerHTML = '';
    header.style.display = '';
    const start = (Current_Page - 1) * Products_Per_page;
    const end = start + Products_Per_page;
    const Products_To_Display = SPtt.slice(start, end);

    for (const product of Products_To_Display) {
        const productItem = await createProduct(product);
        productlist.appendChild(productItem);
    }
}
