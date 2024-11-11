
export async function initializationCart(params, query) {
    const main = document.querySelector('main');
    if (!main) return;

    main.classList.add('main-cart');
    main.innerHTML = `
    <div class="main-component main_wapper">
        <div class="main-cart-title">GIỎ HÀNG</div>
        <div class="main-cart-content">
            <div class="left-content">
                <div class="left-content-heading card item-grid">
                    <label>
                        <input
                            type="checkbox"
                            id="check-all"
                            name="check-all"
                        />
                        <span id="total-cart-quantity"></span>
                    </label>
                    <div>Đơn giá</div>
                    <div>Số lượng</div>
                    <div>Thành tiền</div>
                    <i id="delete-all-cart" class="fa-regular fa-trash-can"></i>
                </div>
                <div class="left-content-body">
                    <div class="cart-items"></div>
                    <!-- <div class="cart-vouchers"></div>  -->
                </div>
            </div>
            <div class="right info-user card">
                <div class="info-header">
                    <span>Giao tới</span>
                    <button id="change-address-btn">Thay đổi</button>
                </div>
                <div class="info-content">
                    <div class="contact-info">
                        <div class="contact-info__name">Ly Lê</div>
                        <div class="contact-info__phone-num">
                            0912345678
                        </div>
                    </div>
                    <div class="address-info">
                        106,đường Nguyễn Chí Thanh, thị trấn Quảng Phú,
                        huyện Cư M’gar, Đắk Lắk
                    </div>
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
                <ul class="prices__items">
                    <li class="prices__item">
                        <div class="prices__text">Tạm tính</div>
                        <div class="prices__value" id="original-amount">
                            0
                            <sup>₫</sup>
                        </div>
                    </li>
                    <li class="prices__item">
                        <div class="prices__text">Giảm giá</div>
                        <div class="prices__value" id="discount-amount">
                            0
                            <sup>₫</sup>
                        </div>
                    </li>
                </ul>
                <div class="prices__total">
                    <span>Tổng tiền</span>
                    <div class="prices__content">
                        <div
                            class="prices__value"
                            id="total-amount"
                        ></div>
                        <div class="prices__value--note">
                            (Đã bao gồm VAT nếu có)
                        </div>
                    </div>
                </div>
                <div class="prices__button__center">
                    <button class="button_1 btn-danger">
                        Mua Hàng (0)
                    </button>
                </div>
            </div>
        </div>
    </div>
    `

    const style = document.createElement('link');
    style.rel = 'stylesheet'
    style.href = './assets/css/cart.css'
    style.id = 'cart-style'

    document.head.appendChild(style);



}

export async function updateCart(params, query) {

}

export async function removeCart(params, query) {
    const main = document.querySelector('main');
    if (!main) return;

    main.classList.remove('main-cart');
    document.getElementById('cart-style')?.remove()
}