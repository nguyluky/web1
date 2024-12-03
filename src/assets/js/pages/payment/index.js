import { showListShippingAddressPopup } from "../../render/addressPopup.js";
import { addStyle, navigateToPage, removeStyle } from "../../until/router.js";
import { showUserAddressInfo } from "../cart/cart.js";
import { getOrder, rendeOrder, changeCart, closeDeal, showCreditCard, closeCreditForm, addCreditCard, showConfirmForm, initChangeAddressEvent } from "./payment.js";
// import { getOrder, rendeOrder, changeCart, closeDeal } from "./payment.js";

const html = `
<div class="main-component main_wapper">
    <div class="main-cart-content">
        <div class="left-content">
            <div class="left-content-body card">
                <div class="ship-title">
                    Chọn hình thức giao hàng
                </div>
                <div class="ship-option">
                    <label>
                        <input
                            type="radio"
                            name="ship-option"
                            id=""
                            checked
                        />
                        <span class="ship-text"
                            >Giao tiết kiệm</span
                        >
                    </label>

                    <div id="quantity-ship">
                        <div class="delivery-time">
                            <img
                                src="./assets/img/car.png"
                                alt=""
                                width="24px"
                            />
                            <span
                                ></span>
                        </div>
                        <div id="total-ship-quantity"></div>
                    </div>
                </div>

                <div class="order-col order-grid">
                    <div>Sản phẩm</div>
                    <div>Số lượng</div>
                    <div>Thành tiền</div>
                </div>
                <div class="order-items"></div>                                  
            </div>

            <div class="payment-type">
                <h3 class="payment-title">
                    Chọn hình thức thanh toán
                </h3>

                <div>
                    <div>
                        <label class="payment-option">
                            <input
                                type="radio"
                                name="payment-option"
                                id="cod"
                                checked
                            />
                            <span class="payment-text">
                                <img
                                    src="./assets/img/payCash.png"
                                    alt=""
                                    
                                />
                                <div class="method-content__title">
                                    <span>Thanh toán tiền mặt</span>
                                </div>                                
                            </span>
                        </label>
                    </div>

                    <div>
                        <label class="payment-option">
                            <input
                                type="radio"
                                name="payment-option"
                                id="momo"
                            />
                            <span class="payment-text">
                                <img
                                    src="./assets/img/momo.jpg"
                                    alt=""
                                />
                                <div class="method-content__title">
                                    <span>Ví Momo</span>
                                </div>
                            </span>
                        </label>
                    </div>

                    <div>
                        <label class="payment-option">
                            <input
                                type="radio"
                                name="payment-option"
                                id="zalopay"
                            />
                            <span class="payment-text">
                                <img
                                    src="./assets/img/zaloPay.png"
                                    alt=""
                                />
                                <div class="method-content__title">
                                    <span>Ví ZaloPay</span>
                                </div>
                            </span>
                        </label>
                    </div>

                    <div>
                        <label class="payment-option">
                            <input
                                type="radio"
                                name="payment-option"
                                id="credit"
                            />
                            <span class="payment-text">
                                <img
                                    src="./assets/img/credit.png"
                                    alt=""
                                />
                                <div class="method-content">
                                    <div
                                        class="method-content__title"
                                    >
                                        <span
                                            >Thẻ tín dụng/Ghi
                                            nợ</span
                                        >
                                    </div>
                                    <div class="card-icon">
                                        <img
                                            src="./assets/img/masterCard.svg"
                                            alt=""
                                        />
                                        <img
                                            src="./assets/img/visa.png"
                                            alt=""
                                        />
                                        <img
                                            src="./assets/img/jcb.svg"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </span>
                        </label>
                        <div class="credit-info">

                            <button
                                id="add-credit"
                                class="button_1"
                            >
                                + Thêm thẻ mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="right info-user card">
            <div class="info-header">
                <span>Giao tới</span>
                <button id="change-address-btn">Thay đổi</button>
            </div>
            <div class="info-content">
                <div class="contact-info">
                    <div class="contact-info__name"></div>
                    <div class="contact-info__phone-num"></div>
                </div>
                <div class="address-info"></div>
            </div>
        </div>
        <div class="right coupon card">
            <div class="coupon-header">
                <div class="coupon-header__title">Khuyến mãi</div>
                <div class="coupon-header__usage">
                    <span>Hiện không có khuyến mãi nào</span>
                </div>
            </div>
            <div class="coupon-list"></div>
            <div class="show-more">
                <i class="fa-solid fa-ticket"></i>
                <span>Chọn hoặc nhập Khuyến mãi khác</span>
            </div>
        </div>
        <div class="right price-summary card">
            <div class="price-summary-header">
                <div class="info-header">
                    <span>Đơn hàng</span>
                    <button id="change-cart">Thay đổi</button>
                </div>
                <div class="order-quantity">
                    <span id="total-quantity">2 sản phẩm.</span>
                </div>
            </div>
            <div class="price-summary-body">
                <ul class="prices__items">
                    <li class="prices__item">
                        <div class="prices__text">
                            Tổng tiền hàng
                        </div>
                        <div
                            class="prices__value"
                            id="original-amount"
                        >
                            0
                            <sup>₫</sup>
                        </div>
                    </li>
                    <li class="prices__item">
                        <div class="prices__text">
                            Phí vân chuyển
                        </div>
                        <div
                            class="prices__value"
                            id="delivery-amount"
                        >
                            0 <sup>₫</sup>
                        </div>
                    </li>
                    <li class="prices__item">
                        <div class="prices__text">Giảm giá</div>
                        <div
                            class="prices__value"
                            id="discount-amount"
                        >
                            0 <sup>₫</sup>
                        </div>
                    </li>
                </ul>
                <div class="prices__total">
                    <span>Tổng tiền thanh toán</span>
                    <div class="prices__content">
                        <div
                            class="prices__value"
                            id="total-amount"
                        >
                            0 <sup>₫</sup>
                        </div>
                        <div class="prices__value--note">
                            (Đã bao gồm VAT nếu có)
                        </div>
                    </div>
                </div>
                <div class="prices__button__center">
                    <button class="button_1 btn-danger" id="purchase-btn">
                        Đặt hàng
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`

export async function initializationPayment() {

    const user_id = localStorage.getItem('user_id');
    if (!user_id) { navigateToPage('home'); return; }

    const main = document.querySelector('main');
    if (!main) return;

    await addStyle('./assets/css/cart.css');
    await addStyle('./assets/css/payment.css');

    const searchBar = document.querySelector('.center');
    searchBar?.classList.add('hide')

    main.innerHTML = html;

    await rendeOrder();
    getOrder().then(e => {
        console.log(e)
    })
    changeCart();
    showConfirmForm();
    addCreditCard();
    initChangeAddressEvent();
    // showCreditCard();

}

export async function updatePayment() {

    // closeCreditForm();
}

export async function removePayment() {
    const main = document.querySelector('main');
    main?.classList.remove('main-payment');

    const searchBar = document.querySelector('.center');
    searchBar?.classList.remove('hide')

    await removeStyle('./assets/css/cart.css');
    await removeStyle('./assets/css/payment.css');

}
