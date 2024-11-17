import fakeDatabase from "../../db/fakeDBv1.js";
import { getDeliveryTime, formatNumber, showUserInfo } from "../cart/cart.js";
import order from "../../render/table/orderTabel.js";
import { getSearchParam } from "../../until/urlConverter.js";


export function getOrder() {
    const payment = getSearchParam('payment');
    return payment?.split(',');
}

async function createOrder(cart, book) {


    let source = './assets/img/default-image.png';
    const img = await fakeDatabase.getImgById(book.thumbnail);
    if (img) {
        source = img.data;
    }

    const orderItem = document.createElement('div');
    orderItem.classList.add('order-item', 'order-grid');


    orderItem.innerHTML = `
        <div class="order-info">
            <img
                src="${source}"
                alt=""
            />
            <div class="order-title">
            ${book.title}
                
            </div>
        </div>

        <div class="cart-item-quantity">
            <div class="quantity-order">
                ${cart.quantity}
            </div>
        </div>
        <div class="cart-item-amount">
            ${formatNumber(cart.quantity * (book.base_price * (1 - book.discount)))}
            <sup>₫</sup>
        </div>`;

    return orderItem;

}


export async function rendeOrder() {
    const deliveryText = document.querySelector('.delivery-time span');
    const orderItems = document.querySelector('.order-items');
    const totalQuantity = document.getElementById('total-quantity');
    const totalShipQuantity = document.getElementById('total-ship-quantity');
    const originalPriceElement = document.getElementById('original-amount')
    const discountPriceElement = document.getElementById('discount-amount');
    const deliveryPriceElement = document.getElementById('delivery-amount');
    const totalPriceElement = document.getElementById('total-amount');


    let quantity = 0;
    let originalPrice = 0, discountPrice = 0, deliveryPrice = 10000;


    const orders = getOrder();
    const deliveryTime = getDeliveryTime();


    if (deliveryText) {
        deliveryText.innerHTML = `Đảm bảo nhận hàng trước ${deliveryTime.date}, ${deliveryTime.day}/${deliveryTime.month}`;
    }

    showUserInfo();


    if (!orders)
        return;
    for (const order of orders) {
        const cart = await fakeDatabase.getCartById(order);
        if (!cart)
            return;

        const book = await fakeDatabase.getSachById(cart.sach);
        if (!book)
            return;

        const orderItem = await createOrder(cart, book);
        if (orderItem) {
            orderItems?.appendChild(orderItem);
        }

        quantity += cart.quantity;
        originalPrice += cart.quantity * book.base_price;
        discountPrice -= cart.quantity * book.base_price * book.discount;
    }


    if (totalQuantity && totalShipQuantity && originalPriceElement
        && discountPriceElement && deliveryPriceElement && totalPriceElement) {
        totalQuantity.innerHTML = `${quantity} sản phẩm`;
        totalShipQuantity.innerHTML = `Có ${formatNumber(quantity)} sản phẩm hỗ trợ hình thức này`
        discountPriceElement.innerHTML = `${formatNumber(discountPrice)} <sup>₫</sup>`
        originalPriceElement.innerHTML = `${formatNumber(originalPrice)} <sup>₫</sup>`
        totalPriceElement.innerHTML = `${formatNumber(originalPrice + deliveryPrice + discountPrice)} <sup>₫</sup>`
        deliveryPriceElement.innerHTML = `${formatNumber(deliveryPrice)} <sup>₫</sup>`

    }
}


export function closeDeal() {
    const purchaseBtn = document.querySelector('.btn-danger');
    purchaseBtn?.addEventListener('click', () => {
        const selectedPaymentOption = document.querySelector('input[name="payment-option"]:checked')
        if (selectedPaymentOption) {
            if (selectedPaymentOption.id === 'cash-option') {
                // TODO: Add to order table
            }
            else {
                showQR(selectedPaymentOption.id);
            }
        }
    })
}



async function showQR(option) {
    console.log('success');
    let price = 0;
    const orders = getOrder();
    if (!orders)
        return;
    for (const order of orders) {
        const cart = await fakeDatabase.getCartById(order);
        if (!cart)
            return;

        const book = await fakeDatabase.getSachById(cart.sach);
        if (!book)
            return;
        price += cart.quantity * (1 - book.discount) * book.base_price;
    }
    const modal = document.querySelector('.js-modal');
    if (!modal)
        return;
    modal.classList.add('show-modal');

    let tmp, img;
    if (option === 'momo-option') {
        tmp = 'MoMo';
        img = './assets/img/momo.jpg'
    }
    else {
        tmp = "ZaloPay";
        img = './assets/img/zaloPay.png'
    }

    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container modal-demo">
            <div class="header-content">
                <div class="qr-title">
                    <img src=${img} alt="" />
                    Thanh toán bằng ví ${tmp}
                </div>
                <span id="change-payment-option">Đổi phương thức khác</span>
            </div>
            <div class="body-content">
                <div class="left-payment-content">
                    <div id="qr-img">
                        <img src="./assets/img/image.png" alt="" />
                        <div class="prices__item">
                            <div class="prices__text">Tổng tiền</div>
                            <div class="prices__value" id="payment-amount">
                                ${formatNumber(price)}<sup>₫</sup>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-payment-content">
                    <div class="qr-content">
                        <h4>Quét mã QR để thanh toán</h4>
                        <ul>
                            <li class="qr-decription">
                                <span class="qr-num">1</span>
                                <div class="qr-text">
                                    Mở ứng dụng ${tmp} trên điện thoại
                                </div>
                            </li>
                            <li class="qr-decription">
                                <span class="qr-num">2</span>
                                <div class="qr-text">
                                    Trên ${tmp}, chọn biểu tượng
                                    <img
                                        src="./assets/img/scanQR.png"
                                        alt=""
                                    />
                                    <b>Quét mã QR</b>
                                </div>
                            </li>
                            <li class="qr-decription">
                                <span class="qr-num">3</span>
                                <div class="qr-text">
                                    Quét mã QR ở trang này và thanh toán
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>`;
    setTimeout(async () => {
        modal.classList.remove('show-modal');

    }, 10000);
}


export function changeCart() {
    const buttonChangeCart = document.getElementById('change-cart');
    if (!buttonChangeCart)
        return;
    buttonChangeCart.addEventListener('click', () => {
        location.hash = '#/cart';
    })
}



