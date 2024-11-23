
import fakeDatabase from "../../db/fakeDBv1.js";
import { getDeliveryTime, showUserInfo } from "../cart/cart.js";
import order from "../../render/table/orderTabel.js";
import uuidv from "../../until/uuid.js";
import address from "../../db/addressDb.js";
import { toast } from "../../render/popupRender.js";
import { formatNumber } from "../../until/format.js";
import { validator, isCreditCard, getParent } from "../../until/validator.js";
import { navigateToPage } from "../../until/router.js";
import { getSearchParam } from "../../until/router.js";


/**
 * 
 * @returns @typedef {import("../../until/type.js").Credit} Credit 
 */


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


    const orders = getOrder() || [];
    const deliveryTime = getDeliveryTime();


    if (deliveryText) {
        deliveryText.innerHTML = `Đảm bảo nhận hàng trước ${deliveryTime.date}, ${deliveryTime.day}/${deliveryTime.month}`;
    }

    showUserInfo();

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
    purchaseBtn?.addEventListener('click', async () => {
        const selectedPaymentOption = document.querySelector('input[name="payment-option"]:checked')
        if (selectedPaymentOption) {
            if (selectedPaymentOption.id === 'cash-option') {
                console.log('hihi')
                await pushOrder(selectedPaymentOption.id);
            }
            else if (selectedPaymentOption.id === 'creditCard-option') {
                // TODO: 
                // showCreditForm();
                // validateCreditCard();
            }
            else {
                showQR(selectedPaymentOption.id).then(pushOrder);
            }
        }
    })
}


function validateCreditCard() {
    validator({
        form: '.add-card-form',
        rules: [
            validator.isRequired('#input-creditID'),
            validator.checkCreditCard('#input-creditID'),
            validator.isRequired('#input-credit-user'),
            validator.checkName('#input-credit-user'),
            validator.isRequired('#EXP__date'),
            validator.checkEXP('#EXP__date'),
            validator.isRequired('#input-cvv'),
            validator.checkCVV('#input-cvv'),
        ],
        onSubmit: async (data) => {
            console.log(data);
            const user_id = localStorage.getItem('user_id');
            const modal = document.querySelector('.js-modal');

            if (!modal || !user_id) {
                return;
            }
            modal.classList.remove('show-modal');

            const credit = {
                id: data['#input-creditID'],
                name: data['#input-credit-user'],
                exp: new Date(data['#EXP__date']),
                cvv: +data['#input-cvv']
            }

            await fakeDatabase.addCreditCardToUser(credit, user_id)

            createCredit(credit);
        }
    });
}

/**
 * 
 * @param {Credit} data 
 * @returns {void}
 */
function createCredit(data) {
    const parentElement = document.querySelector('.credit-info');
    const addCreditBtn = document.getElementById('add-credit');
    if (!parentElement || !addCreditBtn)
        return;
    const type = isCreditCard(data.id);
    const creditInfo = document.createElement('div');
    creditInfo.classList.add('credit__info');
    let img;
    if (!type)
        return;
    else if (type === 'Visa')
        img = './assets/img/visa.png';
    else if (type === 'MasterCard')
        img = './assets/img/masterCard.svg';
    else
        img = './assets/img/jcb.svg'
    creditInfo.innerHTML = `
                <label for="">
                    <input type="radio" name='check-credit'/>
                    <div class="credit__text">
                        <span>
                            <img
                                src= ${img}
                                alt= ""
                            />
                        </span>
                        <div class="credit-name">
                            ${type}
                        </div>
                        <div>****${parseInt(data.id) % 10000}</div>
                    </div>
                </label>`;

    parentElement.insertBefore(creditInfo, addCreditBtn);

    creditInfo.querySelector('input')?.addEventListener('change', () => {
        const creditCardOption = /**@type {HTMLInputElement} */ (document.getElementById('creditCard-option'))
        if (!creditCardOption.checked) {
            creditCardOption.checked = true;
        }
        // if ()
    })

}

export async function showCreditCard() {
    const user_id = localStorage.getItem('user_id') || ' ';
    const userInfo = await fakeDatabase.getUserInfoByUserId(user_id);
    if (!userInfo || !userInfo.credits)
        return;
    userInfo.credits.forEach(credit => {
        createCredit(credit);
    })



}

export function addCreditCard() {
    const addCreditBtn = document.getElementById('add-credit');
    addCreditBtn?.addEventListener('click', () => {
        console.log('success')
        showCreditForm();
        closeCreditForm();
        validateCreditCard();
    })

    // NOTE: tôi thêm cái bà nói ở đây nha
    // code hơi xấu tí thông cảm
    document.getElementsByName('payment-option').forEach(element => {
        element.addEventListener('change', (e) => {
            if (element.id === 'creditCard-option') {
                // @ts-ignore
                document.querySelector('.credit__info:first-child input')?.click();
            }
            else {
                // @ts-ignore
                document.querySelector('.credit__info input:checked').checked = false;
            }
        })
    })

}

export function closeCreditForm() {
    document.getElementById('back-payment')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.js-modal')?.classList.remove('show-modal');
    })
}

async function pushOrder(option) {
    const items = [];
    const orders = getOrder();
    let total = 0;

    const user_id = localStorage.getItem('user_id');
    if (!user_id)
        return;
    const userInfo = await fakeDatabase.getUserInfoByUserId(user_id);
    if (!userInfo)
        return;

    if (!orders)
        return;

    const is_pay = option === 'cash-option' ? false : true;
    for (const order of orders) {
        const cart = await fakeDatabase.getCartById(order);
        if (!cart)
            return;

        const book = await fakeDatabase.getSachById(cart.sach);
        if (!book)
            return;

        const item = { sach: book.id, quantity: cart.quantity, total: book.base_price * (1 - book.discount) };
        total += item.total;
        items.push(item);
        await fakeDatabase.deleteCartById(order);
    }
    const data = {
        id: uuidv(10),
        user_id: user_id,
        items,
        date: new Date(),
        state: 'doixacnhan',
        last_update: new Date(),
        is_pay,
        total,
        address: {
            name: userInfo.name,
            phone_num: userInfo.phone_num,
            email: userInfo.email,
            street: userInfo.address[0].street,
            address: userInfo.address[0].address
        }
    };
    fakeDatabase.addOrder(data).then(e => {
        toast({ title: 'Đặt hàng thành công', type: 'success' });
        fakeDatabase.getOrdertByUserId(user_id).then(e => {
            console.log(e);
        })
            .catch(() => { });
        navigateToPage('cart')
    }).catch(() => { })
}

export function showCreditForm() {
    const modal = document.querySelector('.js-modal');
    if (!modal)
        return;
    modal.classList.add('show-modal');
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="credit-content modal-demo">
            <div class="credit-title">
                <h4>Thêm Thẻ Tín dung/Ghi nợ</h4>
                <div class="card-icon">
                    <img src="./assets/img/masterCard.svg" alt="" />
                    <img src="./assets/img/visa.png" alt="" />
                    <img src="./assets/img/jcb.svg" alt="" />
                </div>
            </div>
            <form class="add-card-form">
                <div class="input-credit">
                    <div for="" class="input-title">Số thẻ</div>
                    <div class="input-text">
                        <input
                            type="number"
                            placeholder="VD: 4123 4567 8901 2345"
                            id="input-creditID"
                        />
                    </div>
                    <span class="form-error"></span>
                </div>

                <div class="input-credit">
                    <div class="input-title">Tên in trên thẻ</div>

                    <div class="input-text">
                        <input
                            type="text"
                            name=""
                            id="input-credit-user"
                            placeholder="VD: NGUYEN VAN A"
                        />
                    </div>
                    <span class="form-error"></span>
                </div>

                <div class="input-credit2">
                    <div class="input-credit" style="margin-right: 15px">
                        <div class="input-title">Ngày hết hạn:</div>
                        <div class="input-text">
                            <input
                                type="text"
                                name=""
                                placeholder="MM/YY"
                                id="EXP__date"
                            />
                        </div>
                        <span class="form-error"></span>
                    </div>

                    <div class="input-credit">
                        <div class="input-title">Mã bảo mật:</div>
                        <div class="input-text">
                            <input
                                type="number"
                                name=""
                                id="input-cvv"
                                placeholder="VD: 123"
                                maxlength="3"
                            />
                        </div>
                        <span class="form-error"></span>
                    </div>
                </div>
                <div class="btn-form">
                    <button class="button_1" id="back-payment">
                        Trở lại
                    </button>
                    <input
                        type="submit"
                        value="Xác nhận"
                        class="button_1"
                        id="credit-btn"
                    />
                </div>
            </form>
        </div> 
    `
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
    return new Promise((resolve) => {
        setTimeout(() => {
            modal.classList.remove('show-modal');
            resolve(option);
        }, 5000);
    });
}




export function changeCart() {
    const buttonChangeCart = document.getElementById('change-cart');
    if (!buttonChangeCart)
        return;
    buttonChangeCart.addEventListener('click', () => {
        navigateToPage('cart')
    })
}







