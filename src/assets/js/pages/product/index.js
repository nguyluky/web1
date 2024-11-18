import fakeDatabase from '../../db/fakeDBv1.js';
import { createPagination, setupPaginationListeners } from '../home/renderProduct.js';
/**
 *
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function initializationProductPage(params, query) {
    const main = document.querySelector('main');
    if (!main) return;

    const style = document.createElement('style');
    style.id = 'product-page-style';
    style.innerHTML = `
    .main_wapper {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 15px;
    }

    .left-section,
    .right-section {
        padding: 15px;
    }
    .left-section{
        background-color: #ffffff;
        border-radius: 8px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: sticky;
        top: 0px;
    }
    .product-title {
        font-size: 22px;
        font-weight: bold;
    }
    .price-number {
        color: #ff4141;
        font-weight: 700;
    }

    .total{
        font-size: 20px;
    }

    .sale{
        font-size: 25px;
    }

    .regular{
        text-decoration: line-through;
        color: #888;
        font-weight: 400;
    }

    .discount{
        background-color: rgb(255, 0, 0);
        color: white;
        border-radius: 10px;
        font-size: 12px;
        padding: 5px 5px;
        width: fit-content;
    }

    .other-sale{
        color: #ff4141;
        font-weight: 700;
        font-size: 16px;
    }

    .other-regular{
        text-decoration: line-through;
        color: #888;
        font-weight: 400;
        font-size: 12px;
    }

    .buy-now {
        border: none;
        background-color: #fa3333;
        color: white;
    }
    #add-to-cart-btn {
        border: solid rgba(0, 96, 255, 1) 2px;
        background-color: rgb(255, 255, 255);
        color: rgba(0, 96, 255, 1);
    }

    .total-price__header{
        font-size: 16px;
        font-weight: 600;
    }

    .quantity-header{
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .quantity-form {
        display: inline-flex;
        align-items: center;
        border: 1px solid rgb(200, 200, 200);
        border-radius: 2px;
        overflow: hidden;
    }

    .quantity-form .quantity-num {
        width: 32px;
        font-size: 14px;
        height: 24px;
        text-align: center;
        border-top: 0;
        border-bottom: 0;
        outline: none;
        border-left: 1px solid rgb(200, 200, 200);
        border-right: 1px solid rgb(200, 200, 200);
    }

    .dscr-quantity,
    .inc-quantity {
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 18px;
        background-color: transparent;
        cursor: pointer;
        color: rgb(171, 170, 170);
        font-size: 20px;
        font-weight: 300;
        outline: none;
        border: none;
    }

    .dscr-quantity:hover,
    .inc-quantity:hover{
        color: #189eff;
    }
    .buttons-section {
        display: flex;
        gap: 10px;
        justify-content: right;
        min-width: 260px;
        flex-direction: column;
    }
    .buttons-section > button{
        padding: 10px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }

    .buttons-section > button:hover{
        opacity: 0.9;
    }

    .left-section__product-img{
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border: solid 1px rgba(128, 128, 128, 0.405);
        position: relative;
    }

    .left-section__product-img > img{
        max-width: 100%;
        max-height: 100%;
        width: fit-content;
        object-fit: cover;
        position: relative;
    }

    .center-section{
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .product-title-container, .description-container, .other-product-container{
        height: 100%;
        background-color: white;
        border-radius: 8px;
        padding: 15px;
    }
    .product-title-container{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .remaining-sold-container{
        display: flex;
        gap: 20px;
    }

    .remaining-sold-container > div{
        opacity: 0.5;
        font-size: 18px;
    }

    .price-number-container{
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .description-container{
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .description-container > h4{
        font-size: 20px;
    }

    .description-details{
        line-height: 22px;
        max-height: 250px;
        overflow: auto;
    }

    .product-price-detail{
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .products{
        display: flex;
        gap: 10px;
    }
    `

    document.head.appendChild(style);

    main.innerHTML = `
    <div class="main_wapper">
        <div class="left-section">
            <div class="left-section__product-img">
                <img src="https://nhasachphuongnam.com/images/detailed/267/ly-thuyet-tro-choi.jpg" alt="Lý thuyết trò chơi" width="100%">
            </div>
            <div class="quantity">
                <div class="quantity-header">
                    Số lượng:
                </div>
                <div class="quantity-form">
                    <button class="dscr-quantity">
                        -
                    </button>
                    <input type="text" value="1" class="quantity-num">
                    <button class="inc-quantity">
                        +
                    </button>
                </div>
            </div>
            <div class="total-container">
                <div class="total-price__header">Tạm tính:</div>
                <span class="price-number total">
                    20000 <sup>₫</sup>
                </span>
            </div>
            <div class="buttons-section"> 
                <button class="buy-now">Mua ngay</button>
                <button class="add-to-cart" id="add-to-cart-button">Thêm giỏ hàng</button>
            </div>
        </div>

        <div class="center-section">
            <div class="product-title-container">
                <div class="product-title">
                    Pháp luật đại cương (Dùng trong các trường đại học, cao đẳng
                    và trung cấp)
                </div>
                <div class="remaining-sold-container">
                    <div class="sold-product">đã bán: 10</div>
                    <div class="remaining-product">còn lại: 1</div>
                </div>
                <div class="price-number-container">
                    <span class="price-number sale">
                        20000 <sup>₫</sup>
                    </span>
                    <div class="discount">-15%</div>
                    <span class="price-number regular">
                        25000 <sup>₫</sup>
                    </span>
                </div>
            </div>
            <div class="description-container">
                <h4>Mô tả sản phẩm</h4>
                <p class="description-details">
                    Ở bất cứ quốc gia, xã hội nào, pháp luật có vai trò rất
                    quan trọng trong đời sống xã hội.Đối với Nhà nước,pháp
                    luật được coi là công cụ hữu hiệu nhất để quản lý tất cả
                    các vấn đề trong xã hội bởi pháp luật là một khuôn mẫu
                    và có tính bắt buộc chung nên mọi người trong xã hội đều
                    cần phải tuân thủ theo các quy định của pháp luật. Nếu
                    như không chấp hành hoặc chấp hành không đúng các quy
                    định của pháp luật thì sẽ bị áp dụng các chế tài tương
                    ứng tùy thuộc vào hành vi vi phạm.Đối với công dân,
                    pháp luật là phương tiện quan trọng để mọi người dân bảo
                    vệ được các quyền và lợi ích hợp pháp của mình. Thông
                    qua pháp luật đảm bảo cho người dân được thực hiện các
                    quyền cũng như nghĩa vụ của mình theo quy định và quyền
                    lợi này sẽ được quy định và bảo vệ một cách tốt
                    nhất.Đối với toàn xã hộinói chung thì pháp luật đã thể
                    hiện được vai trò của mình trong việc đảm bảo sự vận
                    hành của toàn xã hội, tạo lập và duy trì sự bình đẳng
                    trong cộng đồng để đảm bảo cho xã hội phát triển một
                    cách ổn định và bền vững nhất thì pháp luật có vai trò
                    rất quan trọng để mọi người trong xã hội thực hiện. Ở
                    Việt Nam, trong những năm qua, Đảng và Nhà nước ta đã
                    chủ trương tăng cường giáo dục pháp luật trong các nhà
                    trường thông qua các chương trình môn học, giáo trình,
                    tài liệu giảng dạy pháp luật bảo đảm đúng tinh thần và
                    nội dung của Hiến pháp và pháp luật hiện hành.
                    Ở bất cứ quốc gia, xã hội nào, pháp luật có vai trò rất
                    quan trọng trong đời sống xã hội.Đối với Nhà nước,pháp
                    luật được coi là công cụ hữu hiệu nhất để quản lý tất cả
                    các vấn đề trong xã hội bởi pháp luật là một khuôn mẫu
                    và có tính bắt buộc chung nên mọi người trong xã hội đều
                    cần phải tuân thủ theo các quy định của pháp luật. Nếu
                    như không chấp hành hoặc chấp hành không đúng các quy
                    định của pháp luật thì sẽ bị áp dụng các chế tài tương
                    ứng tùy thuộc vào hành vi vi phạm.Đối với công dân,
                    pháp luật là phương tiện quan trọng để mọi người dân bảo
                    vệ được các quyền và lợi ích hợp pháp của mình. Thông
                    qua pháp luật đảm bảo cho người dân được thực hiện các
                    quyền cũng như nghĩa vụ của mình theo quy định và quyền
                    lợi này sẽ được quy định và bảo vệ một cách tốt
                    nhất.Đối với toàn xã hộinói chung thì pháp luật đã thể
                    hiện được vai trò của mình trong việc đảm bảo sự vận
                    hành của toàn xã hội, tạo lập và duy trì sự bình đẳng
                    trong cộng đồng để đảm bảo cho xã hội phát triển một
                    cách ổn định và bền vững nhất thì pháp luật có vai trò
                    rất quan trọng để mọi người trong xã hội thực hiện. Ở
                    Việt Nam, trong những năm qua, Đảng và Nhà nước ta đã
                    chủ trương tăng cường giáo dục pháp luật trong các nhà
                    trường thông qua các chương trình môn học, giáo trình,
                    tài liệu giảng dạy pháp luật bảo đảm đúng tinh thần và
                    nội dung của Hiến pháp và pháp luật hiện hành.
                </p>
            </div>
            <div class="other-product-container">
                <div class="products">
                    <div class="product-card" data-id="0">
                        <div class="product-img">
                            <div class="discount-tag">-15%</div>
                            <img src="https://nhasachphuongnam.com/images/detailed/267/ly-thuyet-tro-choi.jpg" alt="">
                        </div>
                        <div class="product-title"><p>Hàng ngàn slide, sách bài tập các môn kinh tế, quản lý...</p></div>
                        <div class="product-footer">
                            <div class="product-price-detail">
                                <span class="other-sale">8500 <sup>₫</sup></span>
                                <span class="other-regular">10000 <sup>₫</sup></span>
                            </div>
                        </div>
                    
                    </div>
                    <div class="product-card" data-id="0">
                        <div class="product-img">
                            <div class="discount-tag">-15%</div>
                            <img src="https://nhasachphuongnam.com/images/detailed/267/ly-thuyet-tro-choi.jpg" alt="">
                        </div>
                        <div class="product-title"><p>Hàng ngàn slide, sách bài tập các môn kinh tế, quản lý...</p></div>
                        <div class="product-footer">
                            <div class="product-price-detail">
                                <span class="other-sale">8500 <sup>₫</sup></span>
                                <span class="other-regular">10000 <sup>₫</sup></span>
                            </div>
                        </div>
                    
                    </div>
                    <div class="product-card" data-id="0">
                        <div class="product-img">
                            <div class="discount-tag">-15%</div>
                            <img src="https://nhasachphuongnam.com/images/detailed/267/ly-thuyet-tro-choi.jpg" alt="">
                        </div>
                        <div class="product-title"><p>Hàng ngàn slide, sách bài tập các môn kinh tế, quản lý...</p></div>
                        <div class="product-footer">
                            <div class="product-price-detail">
                                <span class="other-sale">8500 <sup>₫</sup></span>
                                <span class="other-regular">10000 <sup>₫</sup></span>
                            </div>
                        </div>
                    
                    </div>
                    <div class="product-card" data-id="0">
                        <div class="product-img">
                            <div class="discount-tag">-15%</div>
                            <img src="https://nhasachphuongnam.com/images/detailed/267/ly-thuyet-tro-choi.jpg" alt="">
                        </div>
                        <div class="product-title"><p>Hàng ngàn slide, sách bài tập các môn kinh tế, quản lý...</p></div>
                        <div class="product-footer">
                            <div class="product-price-detail">
                                <span class="other-sale">8500 <sup>₫</sup></span>
                                <span class="other-regular">10000 <sup>₫</sup></span>
                            </div>
                        </div>
                    
                    </div>
                </div>
                <div class="pagination">
                    <button class="pagination__btns arrows disable">
                        <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <div class="pagination__page">
                        <button class="pagination__btns page active-page">1</button>
                        <button class="pagination__btns page ">2</button>
                    </div>
                    <button class="pagination__btns arrows">
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            </div>
    </div>
    `
}

/**
 *
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function updateProductPage(params, query) {

}

/**
 * 
 * @param {{[key: string]: string}} params 
 * @param {URLSearchParams} query 
 */
export async function removeProductPage(params, query) {
    document.getElementById('product-page-style')?.remove();
}

const Product_Data = await fakeDatabase.getAllBooks();
let data = [];
let Current_Page = 1;
let Products_Per_page = 4;

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
        Math.round(product.base_price * (1 - product.discount)),
    )} <sup>₫</sup>`;
    productPrice.appendChild(salePrice);

    const regularPrice = document.createElement('span');
    regularPrice.classList.add('other-regular');
    if (product.discount == 0) regularPrice.classList.add('hide');
    regularPrice.innerHTML = `${String(product.base_price)} <sup>₫</sup>`;
    productPrice.appendChild(regularPrice);

    // productItem.addEventListener('click', (event) => {
    //     const target = /**@type {HTMLInputElement}*/(event.target);
    //     //if (addToCart.isSameNode(target)) return;
    //     location.hash = `#/product/${product.id}`;
    // });

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
    // if (data.length == 0) {
    //     header.style.display = 'none';
    //     noProduct.style.display = '';
    //     return;
    // }
    //noProduct.style.display = 'none';
    header.style.display = '';
    const start = (Current_Page - 1) * Products_Per_page;
    const end = start + Products_Per_page;
    const Products_To_Display = data.slice(start, end);

    for (const product of Products_To_Display) {
        const productItem = await createProduct(product);
        productlist.appendChild(productItem);
    }
}

const product_categories = /**@type {NodeListOf<HTMLElement>} */(document.querySelectorAll('.product-category'));

product_categories.forEach(category => {
    Product_Data.forEach(sach => {
        sach.category.forEach(sachcate => {
            if (sachcate == category.dataset.category) {
                console.log(sach.category);
                data.push(sach);
            }
        });
    });
});

let totalPages = Math.ceil(data.length / Products_Per_page);

// displayProducts();
// createPagination();
// setupPaginationListeners();