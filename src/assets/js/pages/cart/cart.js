import fakeDatabase from '../../db/fakeDBv1.js';
import uuidv from '../../until/uuid.js';
import { toast } from '../../render/popupRender.js';
import { navigateToPage } from '../../until/router.js';
import { formatNumber } from '../../until/format.js';
import { showListShippingAddressPopup, showShippingFromeAddressPopup } from '../../render/addressPopup.js';

/**
 * 
 * @param {number} index 
 * @returns 
 */
export async function showUserAddressInfo(index = 0) {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
        return;
    }
    document.querySelector('.info-content')?.setAttribute('data-index', index + '');
    const userInfo = (await fakeDatabase.getUserInfoByUserId(user_id))?.address;
    const userName = document.querySelector('.contact-info__name');
    const userTel = document.querySelector('.contact-info__phone-num');
    const userAddress = document.querySelector('.address-info');
    if (!userName || !userTel || !userAddress) return;

    let style = document.getElementById('no-info');
    if (!style) {
        style = document.createElement('style');
        style.id = 'no-info';
        document.head.appendChild(style);
    }
    if (userInfo && userInfo?.length > 0) {
        userName.innerHTML = userInfo[index].name;
        userTel.innerHTML = userInfo[index].phone_num;
        userAddress.innerHTML = `${userInfo[index].street}<br>${userInfo[index].address.replace(/ - /g, ', ')}`;
        style.innerHTML = `.contact-info__name::after {content: ''}`;
    } else {
        userName.innerHTML = 'Chưa có thông tin giao hàng';
        style.innerHTML = `.contact-info {justify-content: center}`;
    }
}

/**
 *
 * @returns {Promise<void>}
 */

export async function renderCart() {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
        return;
    }

    const carts = await fakeDatabase.getCartByUserId(user_id);
    const container = document.querySelector('.left-content-body');
    const cartItems = document.querySelector('.cart-items');

    const totalCartQuantity = document.getElementById('total-cart-quantity');
    if (totalCartQuantity) {
        totalCartQuantity.innerHTML = `Tất cả (${carts.length} sản phẩm)`;
    }

    if (container && cartItems) {
        if (carts.length === 0) {
            showEmptyCart();
            return;
        }
        const mainContent = document.querySelector('.main-cart-content');
        mainContent?.classList.remove('hide');
        cartItems.innerHTML = '';

        for (const cart of carts) {
            console.log(cart);
            const cartItem = await createCartItem(cart);
            if (cartItem) {
                cartItems.appendChild(cartItem);
            }
        }

        const titleBooks = document.querySelectorAll('.book-title');
        titleBooks.forEach(titleBook => {
            titleBook.addEventListener('click', () => {
                const parentElement = getParent(titleBook, '.cart-item');
                // @ts-ignore
                const book_id = parentElement.dataset.bookId;
                console.log(parentElement)
                location.hash = `#/product/${book_id}`;
            })
        })
        handlePlus();
        handleMinus();
        initDeleteCartItem();
        isCheckBox();
        changeQuantity();

    }
}


export function getDeliveryTime() {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const dayName = today.toLocaleDateString("vi-VN", { weekday: 'long' });
    const date = {
        date: dayName,
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear
    }
    return date;
}


/**
 *
 * @param {import('../../until/type.js').Cart} cart
 * @returns {Promise<HTMLElement | undefined>}
 */
async function createCartItem(cart) {
    const book = await fakeDatabase.getSachById(cart.sach);

    if (book) {
        let source = './assets/img/default-image.png';
        const img = await fakeDatabase.getImgById(book.thumbnail);
        if (img) {
            source = img.data;
        }

        const deliveryDay = getDeliveryTime();
        const deliveryText = `Giao ${deliveryDay.date}, ${deliveryDay.day}/${deliveryDay.month} `
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'item-grid');
        cartItem.dataset.cartId = cart.id;
        cartItem.dataset.bookId = book.id;
        let html = `
            <div class="cart-item-figure">
                <label>
                    <input
                        type="checkbox"
                        name="check-book"
                        class="check-book"
                        data-cart-id = ${cart.id}
                    />
                </label>
                <dic class="book-pic">
                    <img
                    src="${source}"
                    />
                </dic>
                <div class="book-info">
                    <div class="book-title">
                        ${book.title}
                    </div>
                    <div class="book-delivery-time">
                        <img
                            src="./assets/img/car.png"
                            class="car-icon"
                        />
                        <span class="delivery-text"
                            >${deliveryText}</span
                        >
                    </div>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="discount-price"
                    >${formatNumber(Math.round(
            book.base_price * (1 - book.discount)),
        )} <sup>₫</sup></span
                >
                <span class="original-price ${book.discount === 0 ? 'hide' : ''
            }"
                    > ${formatNumber(book.base_price)}
                    <sup>₫</sup>
                </span>
                
            </div>
            <div class="cart-item-quantity">
                <div class="quantity-form">
                    <button class="dscr-quantity">
                        -
                    </button>
                    <input
                        type="text"
                        value="${cart.quantity}"
                        class="quantity-num"
                    />
                    <button class="inc-quantity">
                        +
                    </button>
                </div>
            </div>
            <div class="cart-item-amount ">
                ${formatNumber(cart.quantity * (book.base_price * (1 - book.discount)))}
                <sup>₫</sup>
            </div>
            <div class="cart-item-delete-btn" data-cart-id =${cart.id}>
                <i
                    class="fa-regular fa-trash-can"
                ></i>
            </div>
        `;
        cartItem.innerHTML = html;

        return cartItem;
    }
}

/**
 * 
 * @param {Element} element 
 * @param {string} selector 
 * @returns {HTMLElement | undefined}
 */
function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}

/**
 * 
 */
function changeQuantity() {
    const quantityInputs = /**@type {NodeListOf<HTMLInputElement>} */ (
        document.querySelectorAll('.quantity-num')
    );

    quantityInputs.forEach((quantityInput) => {
        // @ts-ignore
        quantityInput.addEventListener('change', async (e) => {
            console.log(quantityInput.value);

            const parentElement = getParent(quantityInput, '.cart-item');
            if (!parentElement) return;
            const cartAmount = parentElement.querySelector('.cart-item-amount');
            if (!cartAmount) return;
            if (!quantityInput.value || !+quantityInput.value || parseInt(quantityInput.value) < 1) {
                quantityInput.value = '1';
            }
            const cart = await fakeDatabase.getCartById(
                parentElement?.dataset.cartId || '',
            );
            if (!cart) return;
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) return;
            cart.quantity = +(quantityInput.value || '1');

            await fakeDatabase.updateCart(cart);
            cartAmount.innerHTML = `${formatNumber(cart.quantity * (book.base_price * (1 - book.discount)))
                } <sup>₫</sup>`;
            updatePaymentSummary();
        });
    });
}

/**
 * 
 */
function handlePlus() {
    const incrButtons = document.querySelectorAll('.inc-quantity');
    incrButtons.forEach((incrButton) => {
        incrButton.addEventListener('click', async () => {
            const parentElement = getParent(incrButton, '.cart-item');
            if (!parentElement) { return; }
            const cart_id = parentElement.dataset.cartId;
            const cart = await fakeDatabase.getCartById(cart_id || '');
            if (!cart) {
                return;
            }
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) {
                return;
            }
            cart.quantity++;
            await fakeDatabase.updateCart(cart);
            // @ts-ignore
            parentElement.querySelector('.quantity-num').value = cart.quantity;
            // @ts-ignore
            parentElement.querySelector('.cart-item-amount').innerHTML = `
                ${formatNumber(cart.quantity * (book.base_price * (1 - book.discount)))}
                <sup>₫</sup>
            `;
            updatePaymentSummary();
        });
    });
}

/**
 * 
 */
function handleMinus() {
    const dcrsButtons = document.querySelectorAll('.dscr-quantity');
    dcrsButtons.forEach((dcrsButton) => {
        dcrsButton.addEventListener('click', async () => {
            const parentElement = getParent(dcrsButton, '.cart-item');
            // @ts-ignore
            const cart_id = parentElement.dataset.cartId;
            // @ts-ignore
            const cart = await fakeDatabase.getCartById(cart_id);
            if (!cart) {
                return;
            }
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) {
                return;
            }
            if (cart.quantity > 1) {
                cart.quantity--;
                await fakeDatabase.updateCart(cart);
                // @ts-ignore
                parentElement.querySelector('.quantity-num').value =
                    cart.quantity;
                // @ts-ignore
                parentElement.querySelector('.cart-item-amount').innerHTML = `
                    ${formatNumber(cart.quantity * (book.base_price * (1 - book.discount)))}
                    <sup>₫</sup>
                `;
            }
            updatePaymentSummary();
        });
    });
}

/**
 * 
 * @param {string} bookId 
 * @param {number} [incrQuantity=1]
 * @returns {Promise<void>}
 */
export async function pushCartItemIntoCart(bookId, incrQuantity = 1) {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        toast({
            title: 'Vui lòng đăng nhập để xem giỏ hàng',
            type: 'error',
        });
        return;
    }
    const carts = await fakeDatabase.getCartByUserId(user_id);
    let cart_id, quantity;
    let cart = carts.find((cart) => {
        return cart.sach === bookId;
    });
    if (!cart) {
        // NOTE: 
        cart_id = uuidv(10);
        quantity = incrQuantity;
    } else {
        cart_id = cart.id;
        quantity = cart.quantity + incrQuantity;
    }
    await fakeDatabase.createCartItem(cart_id, user_id, bookId, quantity);
    toast({
        title: 'Thành công',
        message: 'Đã thêm vào giỏ hàng',
        type: 'success'
    });
    updateCartQuantity();
}

/**
 * Hiển thị thông báo khi giỏ hàng trống
 */
function showEmptyCart() {
    const mainContent = document.querySelector('.main-cart-content');
    const mainComponent = document.querySelector('.main-component');
    if (mainComponent && mainContent) {
        mainContent.classList.add('hide');
        while (mainComponent.querySelector('.empty-cart')) {
            mainComponent.querySelector('.empty-cart')?.remove();
        }
        const emptyCart = document.createElement('div');
        emptyCart.classList.add('empty-cart');
        emptyCart.innerHTML = `  
            <img src="./assets/img/emptyCart.png" alt="" />
            <span>Giỏ hàng trống</span>         
        `;
        mainComponent.appendChild(emptyCart);
    }
}

/**
 * 
 */
async function initAddToCartOnButton() {
    const btnAddCarts = /**@type {NodeListOf<HTMLElement>} */ (
        document.querySelectorAll('.add-to-cart')
    );
    // @ts-ignore
    let arr = [];
    btnAddCarts.forEach((btnAddCart) => {
        btnAddCart.addEventListener('click', () => {
            console.log(btnAddCart);
            const bookId = btnAddCart.dataset.bookId || '';
            pushCartItemIntoCart(bookId, 1);
        });
    });
    updateCartQuantity();
}

/**
 * 
 */
async function initDeleteCartItem() {
    const user_id = localStorage.getItem('user_id');
    const deleteButtons = /**@type {NodeListOf<HTMLElement>} */ (
        document.querySelectorAll('.cart-item-delete-btn')
    );

    console.log(deleteButtons);
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            if (!user_id) {
                toast({
                    title: 'Vui lòng đăng nhập để xem giỏ hàng',
                    type: 'error',
                });
                return;
            }

            console.log(deleteButton);
            const cart_id = deleteButton.dataset.cartId;
            if (!cart_id) return
            fakeDatabase
                .deleteCartById(cart_id)
                // @ts-ignore
                .then(async (e) => {
                    deleteButton.parentElement?.remove();
                    const carts = await fakeDatabase.getCartByUserId(user_id);
                    if (carts.length === 0) {
                        showEmptyCart();
                    }
                    updateCartQuantity();
                    updatePaymentSummary();
                    const totalCartQuantity = document.getElementById('total-cart-quantity');
                    if (totalCartQuantity) {
                        totalCartQuantity.innerHTML = `Tất cả (${carts.length} sản phẩm)`;
                    }
                })
                // @ts-ignore
                .catch((e) => { });
        });
    });
    const deleteAllButton = document.getElementById('delete-all-cart');
    const checkAll = /**@type {HTMLInputElement} */ (document.getElementById('check-all'));
    deleteAllButton?.addEventListener('click', () => {
        if (checkAll.checked !== true) {
            const checkBoxes = /**@type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll(".check-book"));
            const trueChecks = Array.from(checkBoxes).filter(checkBox => {
                return checkBox.checked === true;
            })

            if (trueChecks.length === 0) {
                console.log('failed')
                toast({ title: 'Vui lòng chọn sản phẩm cần xóa', type: 'error' });
            }
            else {
                console.log("success")
                for (const trueCheck of trueChecks) {
                    const parentElement = getParent(trueCheck, ".cart-item");
                    // @ts-ignore
                    const deleteButton = parentElement.querySelector('.cart-item-delete-btn');
                    // @ts-ignore
                    deleteButton.click();
                }
            }
        }
        else {
            deleteButtons.forEach(deleteButton => {
                deleteButton.click();
            });
        }
    });
}

/**
 *
 * upadte số lượng sản phẩm trong giỏ hàng
 * at the top right corner of the page
 * 
 * @returns {Promise<void>}
 */
export async function updateCartQuantity() {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) return;
    const carts = await fakeDatabase.getCartByUserId(user_id);
    console.log(carts);
    const cartQuantity = document.querySelector('.cart-count');
    if (cartQuantity) {
        cartQuantity.innerHTML = String(carts.length);
    }
}

/**
 *
 * @returns {void}
 */
function isCheckBox() {
    const mainCheckBox = /**@type {HTMLInputElement}*/ (
        document.querySelector('#check-all')
    );
    const otherCheckBoxes = /**@type {NodeListOf<HTMLInputElement>} */ (
        document.querySelectorAll('.check-book')
    );
    if (!mainCheckBox) return;
    // Đặt trạng thái của checkBox phụ theo trạng thái của checkBox chính
    mainCheckBox.addEventListener('change', () => {
        otherCheckBoxes.forEach((checkBox) => {
            checkBox.checked = mainCheckBox.checked;
        });
        updatePaymentSummary();
    });

    otherCheckBoxes.forEach((checkBox) => {
        checkBox.addEventListener('change', () => {
            // Nếu 1 checkBox phụ bỏ tích thì checkBox chính cũng bỏ
            if (!checkBox.checked) {
                mainCheckBox.checked = false;
            } else {
                // Kiểm tra xem tất cả checkbox phụ có được tích không
                const allChecked = Array.from(otherCheckBoxes).every(
                    (cb) => cb.checked,
                );
                mainCheckBox.checked = allChecked;
            }
            updatePaymentSummary();
        });
    });
}


/**
 * update total amount when change quantity of product
 */
async function updatePaymentSummary() {

    const otherCheckBoxes = /**@type {NodeListOf<HTMLInputElement>} */ (
        document.querySelectorAll('.check-book')
    );
    let totalAmount = 0,
        originalAmount = 0,
        numberOfItems = 0;

    for (const checkBox of otherCheckBoxes) {
        if (checkBox.checked) {
            console.log(checkBox);
            const cart = await fakeDatabase.getCartById(
                checkBox.dataset.cartId || '',
            );
            if (!cart) continue;
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) continue;
            numberOfItems++;
            totalAmount +=
                cart.quantity * (book.base_price * (1 - book.discount));
            originalAmount += cart.quantity * book.base_price;
        }
    }

    const amount = document.querySelector('#original-amount');

    if (amount) amount.innerHTML = `${formatNumber(originalAmount)} <sup>₫</sup>`;
    const discountAmount = document.querySelector('#discount-amount');
    if (discountAmount)
        discountAmount.innerHTML = `${formatNumber(totalAmount - originalAmount)
            } <sup>₫</sup>`;

    const totalAmountElement = document.querySelector('#total-amount');
    if (totalAmountElement) {
        totalAmountElement.innerHTML = `${formatNumber(totalAmount)} <sup>₫</sup>`;
    }


    const num = document.querySelector('.prices__button__center button');
    if (num) num.innerHTML = `Mua Hàng (${formatNumber(numberOfItems)})`;
}

/**
 * 
 * @returns {Promise<void>}
 */
export async function buyBooks() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        return;
    }
    const buyBtn = document.querySelector('.btn-danger');

    // @ts-ignore
    buyBtn?.addEventListener('click', async (e) => {
        const userInfo = await fakeDatabase.getUserInfoByUserId(user_id);
        const orders = /**@type {NodeListOf<HTMLInputElement>} */(document.querySelectorAll('input[name="check-book"]:checked'))
        const orderItems = [];
        for (const order of orders) {
            orderItems.push(order.dataset.cartId);
        }
        if (orderItems.length === 0) {
            toast({ title: 'Vui lòng chọn sản phẩm cần mua', type: 'error' });
            return
        }
        else if (userInfo && userInfo.status === 'block') {
            toast({ title: 'Tài khoản của bạn đã bị chặn', type: 'error' });
            return
        }
        else if (userInfo?.address.length === 0) {
            showShippingFromeAddressPopup(async (address, bool) => {
                if (bool)
                    userInfo?.address.unshift(address);
                else
                    userInfo?.address.push(address);
                await fakeDatabase.updateUserAddress(user_id, userInfo?.address);
                return;
            }, () => { });
            return;
        }

        navigateToPage('payment', { carts: orderItems.join(','), a: /**@type {HTMLElement} */ (document.querySelector('.info-content'))?.dataset.index || '' });
    })
}

/**
 * 
 */
export function initChangeAddressEvent() {
    document.getElementById('change-address-btn')
        ?.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const index = /**@type {HTMLElement} */ (document.querySelector('.info-content'))?.dataset.index;
            showListShippingAddressPopup(Number(index), (i) => {
                showUserAddressInfo(i);
            });
        });
}

// mainCart();

export default initAddToCartOnButton;
