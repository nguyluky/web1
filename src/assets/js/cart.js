import fakeDatabase from './db/fakeDBv1.js';
import uuidv from './until/uuid.js';
import { toast } from './render/popupRender.js';

/**
 *
 *
 * @returns {void}
 */
function mainCart() {
    updateCartQuantity();
    renderCart().then(() => {
        handlePlus();
        handleMinus();
        initDeleteCartItem();
        isCheckBox();
        changeQuantity();
    });
}

/**
 *
 * @returns {Promise<void>}
 */
async function renderCart() {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
        return;
    }

    const carts = await fakeDatabase.getCartByUserId(user_id);
    const container = document.querySelector('.left-content-body');
    const cartItems = document.querySelector('.cart-items');
    if (container && cartItems) {
        if (carts.length === 0) {
            showEmptyCart();
        } else {
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
        }
    }
}

/**
 *
 * @param {import('./until/type.js').Cart} cart
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
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'item-grid');
        cartItem.dataset.cartId = cart.id;
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
                            >Giao thứ 7, 02/11</span
                        >
                    </div>
                </div>
            </div>
            <div class="cart-item-price">
                <span class="discount-price"
                    >${Math.round(
                        book.base_price * (1 - book.discount),
                    )} <sup>₫</sup></span
                >
                <span class="original-price ${
                    book.discount === 0 ? 'hide' : ''
                }"
                    > ${book.base_price}
                    <sup>₫</sup>
                </span>
                <div class="cart-price-note">
                    Giá chưa áp dụng khuyến mãi
                </div>
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
                ${cart.quantity * (book.base_price * (1 - book.discount))}
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

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}

function changeQuantity() {
    const quantityInputs = /**@type {NodeListOf<HTMLInputElement>} */ (
        document.querySelectorAll('.quantity-num')
    );

    quantityInputs.forEach((quantityInput) => {
        quantityInput.addEventListener('change', async (e) => {
            console.log(quantityInput.value);

            const parentElement = getParent(quantityInput, '.cart-item');
            const cartAmount = parentElement.querySelector('.cart-item-amount');
            if (!quantityInput.value) {
                quantityInput.value = '1';
            }
            const cart = await fakeDatabase.getCartById(
                parentElement.dataset.cartId,
            );
            if (!cart) return;
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) return;
            cart.quantity = +(quantityInput.value || '1');

            await fakeDatabase.updateCart(cart);
            cartAmount.innerHTML = `${
                cart.quantity * (book.base_price * (1 - book.discount))
            } <sup>₫</sup>`;
            renderPaymentSummary();
        });
    });
}

function handlePlus() {
    const incrButtons = document.querySelectorAll('.inc-quantity');
    incrButtons.forEach((incrButton) => {
        incrButton.addEventListener('click', async () => {
            const parentElement = getParent(incrButton, '.cart-item');
            const cart_id = parentElement.dataset.cartId;
            const cart = await fakeDatabase.getCartById(cart_id);
            if (!cart) {
                return;
            }
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) {
                return;
            }
            cart.quantity++;
            await fakeDatabase.updateCart(cart);
            parentElement.querySelector('.quantity-num').value = cart.quantity;
            parentElement.querySelector('.cart-item-amount').innerHTML = `
                ${cart.quantity * (book.base_price * (1 - book.discount))}
                <sup>₫</sup>
            `;
            renderPaymentSummary();
        });
    });
}

function handleMinus() {
    const dcrsButtons = document.querySelectorAll('.dscr-quantity');
    dcrsButtons.forEach((dcrsButton) => {
        dcrsButton.addEventListener('click', async () => {
            const parentElement = getParent(dcrsButton, '.cart-item');
            const cart_id = parentElement.dataset.cartId;
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
                parentElement.querySelector('.quantity-num').value =
                    cart.quantity;
                parentElement.querySelector('.cart-item-amount').innerHTML = `
                    ${cart.quantity * (book.base_price * (1 - book.discount))}
                    <sup>₫</sup>
                `;
            }
            renderPaymentSummary();
        });
    });
}

async function pushCartItemIntoCart(bookId, incrQuantity) {
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
        cart_id = uuidv();
        quantity = incrQuantity;
    } else {
        cart_id = cart.id;
        quantity = cart.quantity + incrQuantity;
    }
    await fakeDatabase.createCartItem(cart_id, user_id, bookId, quantity);
    updateCartQuantity();
}

function showEmptyCart() {
    const mainContent = document.querySelector('.main-cart-content');
    const mainComponent = document.querySelector('.main-component');
    if (mainComponent && mainContent) {
        mainContent.classList.add('hide');
        if (!mainComponent.classList.contains('empty-cart')) {
            const emptyCart = document.createElement('div');
            emptyCart.classList.add('empty-cart');
            emptyCart.innerHTML = `
            <div class="empty-cart">
                <img src="./assets/img/emptyCart.png" alt="" />
                <span>Giỏ hàng trống</span>
            </div>
        `;
            mainComponent.appendChild(emptyCart);
        }
    }
}

async function initAddToCartOnButton() {
    const btnAddCarts = /**@type {NodeListOf<HTMLElement>} */ (
        document.querySelectorAll('.add-to-cart')
    );
    let arr = [];
    btnAddCarts.forEach((btnAddCart) => {
        btnAddCart.addEventListener('click', () => {
            console.log(btnAddCart);
            const bookId = btnAddCart.dataset.bookId;
            pushCartItemIntoCart(bookId, 1);
        });
    });
    updateCartQuantity();
}

function initDeleteCartItem() {
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
            fakeDatabase
                .deleteCartById(cart_id)
                .then(async (e) => {
                    deleteButton.parentElement?.remove();
                    const carts = await fakeDatabase.getCartByUserId(user_id);
                    if (carts.length === 0) {
                        showEmptyCart();
                    }
                    updateCartQuantity();
                    renderPaymentSummary();
                })
                .catch((e) => {
                    alert('error');
                });
        });
    });
}

/**
 *
 * @returns {Promise<void>}
 */
export async function updateCartQuantity() {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
        // toast({
        //     title: 'Vui lòng đăng nhập để xem giỏ hàng',
        //     type: 'error',
        // });
        return;
    }
    const carts = await fakeDatabase.getCartByUserId(user_id);
    console.log(carts);
    const cartQuantity = document.querySelector('.cart-count');
    const totalCartQuantity = document.getElementById('total-cart-quantity');
    if (cartQuantity) {
        cartQuantity.innerHTML = String(carts.length);
    }
    if (totalCartQuantity) {
        totalCartQuantity.innerHTML = `Tất cả (${carts.length} sản phẩm)`;
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
        renderPaymentSummary();
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
            renderPaymentSummary();
        });
    });
}

/**
 *
 */
async function renderPaymentSummary() {
    const otherCheckBoxes = /**@type {NodeListOf<HTMLInputElement>} */ (
        document.querySelectorAll('.check-book')
    );
    let totalAmount = 0,
        originalAmount = 0;

    for (const checkBox of otherCheckBoxes) {
        if (checkBox.checked) {
            console.log(checkBox);
            const cart = await fakeDatabase.getCartById(
                checkBox.dataset.cartId || '',
            );
            if (!cart) continue;
            const book = await fakeDatabase.getSachById(cart.sach);
            if (!book) continue;
            totalAmount +=
                cart.quantity * (book.base_price * (1 - book.discount));
            originalAmount += cart.quantity * book.base_price;
        }
    }

    const amount = document.querySelector('#original-amount');

    if (amount) amount.innerHTML = `${originalAmount} <sup>₫</sup>`;

    const discountAmount = document.querySelector('#discount-amount');
    if (discountAmount)
        discountAmount.innerHTML = `${
            originalAmount - totalAmount
        } <sup>₫</sup>`;

    const totalAmountElement = document.querySelector('#total-amount');

    if (totalAmountElement)
        totalAmountElement.innerHTML = `${totalAmount} <sup>₫</sup>`;
}

mainCart();

export default initAddToCartOnButton;
