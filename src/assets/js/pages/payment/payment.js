
import fakeDatabase from "../../db/fakeDBv1.js";
import { getDeliveryTime, showUserAddressInfo, updateCartQuantity } from "../cart/cart.js";
import uuidv from "../../until/uuid.js";
import { toast } from "../../render/popupRender.js";
import { formatNumber } from "../../until/format.js";
import { validator, isCreditCard, getParent } from "../../until/validator.js";
import { getSearchParam, navigateToPage } from "../../until/router.js";


/**
 * 
 * @returns @typedef {import("../../until/type.js").Credit} Credit 
 */


export async function getOrder() {
    const a = [];

    const fromCart = getSearchParam('carts');
    if (fromCart) {
        const cartItem = fromCart.split(',').map(async e => {
            const cart = await fakeDatabase.getCartById(e);
            return {
                sachId: cart?.sach || '',
                quality: cart?.quantity || 0,
                cardId: e
            }
        })

        if (cartItem)
            a.push(... await Promise.all(cartItem))
    }

    const payment = getSearchParam('payment') || '';

    if (payment) {

        const paymentItems = payment.split(',').map(e => {
            return {
                sachId: e.split('-')[0],
                quality: +e.split('-')[1],
                cardId: undefined
            }
        })

        a.push(...paymentItems)
    }

    return a;
}


/**
 * 
 * @param {string} thumbnail 
 * @param {number} quantity
 * @param {number} base_price 
 * @param {number} discount 
 * @param {string} title 
 * @returns 
 */
async function createOrder(thumbnail, title, quantity, base_price, discount) {


    let source = './assets/img/default-image.png';
    const img = await fakeDatabase.getImgById(thumbnail);
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
            ${title}
                
            </div>
        </div>

        <div class="cart-item-quantity">
            <div class="quantity-order">
                ${quantity}
            </div>
        </div>
        <div class="cart-item-amount">
            ${formatNumber(quantity * (base_price * (1 - discount)))}
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


    const orders = await getOrder();
    const deliveryTime = getDeliveryTime();


    if (deliveryText) {
        deliveryText.innerHTML = `Đảm bảo nhận hàng trước ${deliveryTime.date}, ${deliveryTime.day}/${deliveryTime.month}`;
    }

    const indexAddress = +(getSearchParam('a') || '0');
    showUserAddressInfo(indexAddress);

    for (const order of orders) {

        const book = await fakeDatabase.getSachById(order.sachId);

        if (!book)
            return;

        const orderItem = await createOrder(book.thumbnail, book.title, order.quality, book.base_price, book.discount);
        if (orderItem) {
            orderItems?.appendChild(orderItem);
        }

        quantity += order.quality;
        originalPrice += order.quality * book.base_price;
        discountPrice -= order.quality * book.base_price * book.discount;
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
                console.log('haha')
                await pushOrder(selectedPaymentOption.id);
            }
            else if (selectedPaymentOption.id === 'creditCard-option') {
                const checkCredit = document.querySelector('input[name="check-credit"]:checked');
                if (!checkCredit) {
                    showCreditForm();
                    closeCreditForm();
                    validateCreditCard();
                }
                else {
                    pushOrder(selectedPaymentOption.id);
                }
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

            // làm tạm
            const input = document.querySelectorAll('.credit__info input')
            // @ts-ignore
            input[input.length - 1].click();

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
    creditInfo.setAttribute('data-id', data.id);
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
    const parentElement = document.querySelector('.credit-info');
    if (!userInfo || !userInfo.credits)
        return;

    if (!parentElement)
        return;

    userInfo.credits.forEach(credit => {
        const ele = document.querySelector(`.credit__info[data-id="${credit.id}"]`);
        if (!ele)
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
            console.log(element.id)
            if (element.id === 'creditCard-option') {
                // @ts-ignore
                document.querySelector('.credit__info:first-child input')?.click();
            }
            else {
                const credit = /**@type {HTMLInputElement} */ (document.querySelector('.credit__info input:checked'));
                if (credit)
                    credit.checked = false;
            }
        })
    })

}

export function closeCreditForm() {
    // document.getElementById('back-payment')?.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     document.querySelector('.js-modal')?.classList.remove('show-modal');
    // })
    const backBtn = document.getElementById('back-payment');
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.querySelector('.js-modal')?.classList.remove('show-modal');
        }
    }
}

async function pushOrder(option) {
    const items = [];
    const orders = await getOrder();
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
        const book = await fakeDatabase.getSachById(order.sachId);
        if (!book)
            return;

        const item = { sach: book.id, quantity: order.quality, total: book.base_price * (1 - book.discount) };
        total += item.total;
        items.push(item);
        if (order.cardId)
            await fakeDatabase.deleteCartById(order.cardId);
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

    updateCartQuantity();

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
    const orders = await getOrder();
    if (!orders)
        return;
    for (const order of orders) {
        const book = await fakeDatabase.getSachById(order.sachId);
        if (!book)
            return;
        price += order.quality * (1 - book.discount) * book.base_price;
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







