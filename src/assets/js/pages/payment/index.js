import { getOrder, rendeOrder, changeCart, closeDeal, showCreditCard, closeCreditForm } from "./payment.js";
import { handleAddressPopup } from "../../index.js";

export async function initializationPayment() {
    const main = document.querySelector('main');
    if (!main) return;

    const cssRep1 = await fetch('./assets/css/cart.css');
    const style1 = document.createElement('style');
    style1.textContent = await cssRep1.text();
    style1.id = 'cart-style';
    document.head.appendChild(style1);



    const cssRep = await fetch('./assets/css/payment.css');
    const style = document.createElement('style');
    style.textContent = await cssRep.text();
    style.id = 'payment-style';
    document.head.appendChild(style);
    main.classList.add('main-payment');

    // const searchBar = document.querySelector('.center');
    // searchBar?.classList.add('hide')

    main.innerHTML = `
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
                                        ></span
                                    >
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
                                        id="cash-option"
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
                                        id="momo-option"
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
                                        id="zaloPay-option"
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
                                        id="creditCard-option"
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
                                <div class="credit-info hide">

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
                            <span>Có thể chọn 2</span>
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
                            <span id="show-order-info"
                                >Xem thông tin<i
                                    class="fa-solid fa-angle-up"
                                ></i
                            ></span>
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
        </div>`;

    await rendeOrder();
    console.log(getOrder());
}


export async function updatePayment() {
    changeCart();
    closeDeal();
    document.querySelector('#change-address-btn')?.addEventListener('click', handleAddressPopup)
    showCreditCard();
    // closeCreditForm();
}

export async function removePayment() {
    const main = document.querySelector('main');
    if (!main) return;

    main.classList.remove('main-payment');

    document.getElementById('payment-style')?.remove();
    document.getElementById('cart-style')?.remove();

}