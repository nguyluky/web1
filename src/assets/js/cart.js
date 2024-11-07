// @ts-nocheck
import fakeDatabase from './db/fakeDBv1.js';
import user_ from './render/table/userTable.js';
import uuidv from './until/uuid.js';
const user_id = localStorage.getItem('user_id');
// const books = await fakeDatabase.getAllBooks();
console.log(user_id);
// console.log('haf thanh dung');
// main();
// function main() {
//     if (user_id) {
//         // addToCartOnButton();
//         deleteCartItemOnButton();
//         updateCartQuantity();
//         renderCart();
//     }
// }
mainCart();

function mainCart() {
    updateCartQuantity();
    renderCart().then(() => {
        handlePlus();
        handleMinus();
        deleteCartItemOnButton();
    });

    // deleteCartItemOnButton();
}

async function renderCart() {
    if (user_id) {
        const carts = await fakeDatabase.getCartByUserId(user_id);
        const container = document.querySelector('.left-content-body');
        const cartItems = document.querySelector('.cart-items');
        if (container && cartItems) {
            if (carts.length === 0) {
                showEmptyCart();
            } else {
                const mainContent =
                    document.querySelector('.main-cart-content');
                mainContent?.classList.remove('hide');
                cartItems.innerHTML = '';
                // carts.forEach(async (cart) => {
                //     console.log(cart);
                //     const cartItem = await createCartItem(cart);
                //     if (cartItem) {
                //         cartItems.appendChild(cartItem);
                //     }
                // });

                for (const cart of carts) {
                    console.log(cart);
                    const cartItem = await createCartItem(cart);
                    if (cartItem) {
                        cartItems.appendChild(cartItem);
                    }
                }
                // handlePlus();
                // handleMinus();
                // deleteCartItemOnButton();
            }
        }
    }
}

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
        let html = `
            <div class="cart-item-figure">
                <label>
                    <input
                        type="checkbox"
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
                    <button class="dscr-quantity" data-cart-id = ${cart.id}>
                        -
                    </button>
                    <input
                        type="text"
                        value="${cart.quantity}"
                        class="quantity-num"
                    />
                    <button class="inc-quantity" data-cart-id = ${cart.id}>
                        +
                    </button>
                </div>
            </div>
            <div class="cart-item-amount">
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

function handlePlus() {
    const incrButtons = document.querySelectorAll('.inc-quantity');
    incrButtons.forEach((incrButton) => {
        incrButton.addEventListener('click', async () => {
            console.log(incrButton);
            const quantityInput = incrButton.previousElementSibling;
            const cart_id = incrButton.dataset.cartId;
            const cart = await fakeDatabase.getCartById(cart_id);
            if (cart && quantityInput) {
                cart.quantity++;
                fakeDatabase
                    .updateCart(cart)
                    .then((e) => {
                        quantityInput.value = cart.quantity;
                    })
                    .catch((e) => {
                        alert('loi chuong trinh');
                    });
            }
        });
    });
}

function handleMinus() {
    const dcrsButtons = document.querySelectorAll('.dscr-quantity');
    dcrsButtons.forEach((dcrsButton) => {
        dcrsButton.addEventListener('click', async () => {
            console.log(dcrsButton);
            const quantityInput = dcrsButton.nextElementSibling;
            const cart_id = dcrsButton.dataset.cartId;
            const cart = await fakeDatabase.getCartById(cart_id);
            if (cart && quantityInput && cart.quantity > 1) {
                cart.quantity--;
                fakeDatabase
                    .updateCart(cart)
                    .then((e) => {
                        quantityInput.value = cart.quantity;
                    })
                    .catch((e) => {
                        alert('loi chuong trinh');
                    });
            }
        });
    });
}

// function pushCartItemIntoCart(carts, bookId, incrQuantity) {
//     let cart_id, quantity, tmp;
//     let cart = carts.find((cart) => {
//         return cart.sach === bookId;
//     });
//     if (!cart) {
//         cart_id = uuidv();
//         quantity = incrQuantity;
//     } else {
//         cart_id = cart.id;
//         quantity = cart.quantity + incrQuantity;
//     }
//     fakeDatabase
//         .createCartItem(cart_id, user_id, bookId, quantity)
//         .then((e) => {
//             console.log(e);
//             updateCartQuantity();
//         })
//         .catch((e) => {
//             console.error('bùn ngủ quá ...zzz');
//         });
// }
// const cart_test = await fakeDatabase.getCartByUserId(user_id);
// console.log(cart_test);
async function pushCartItemIntoCart(bookId, incrQuantity) {
    if (user_id) {
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
        fakeDatabase
            .createCartItem(cart_id, user_id, bookId, quantity)
            .then((e) => {
                console.log(e);
                updateCartQuantity();
            })
            .catch((e) => {
                console.error('bùn ngủ quá ...zzz');
            });
    }
}

function showEmptyCart() {
    const mainContent = document.querySelector('.main-cart-content');
    const mainComponent = document.querySelector('.main-component');
    if (mainComponent && mainContent) {
        mainContent.classList.add('hide');
        const emptyCart = document.createElement('div');
        emptyCart.classList.add('empty-cart');
        if (!emptyCart.value) {
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

async function addToCartOnButton() {
    if (user_id) {
        const btnAddCarts = document.querySelectorAll('.add-to-cart');
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
}

// function deleteCartItemOnButton() {
//     const deleteButtons = document.querySelectorAll('.cart-item-delete-btn');
//     console.log(deleteButtons);
//     deleteButtons.forEach((deleteButton) => {
//         deleteButton.addEventListener('click', () => {
//             console.log(deleteButton);
//             const cart_id = deleteButton.dataset.cartId;
//             fakeDatabase
//                 .deleteCardById(cart_id)
//                 .then(async (e) => {
//                     updateCartQuantity();
//                 })
//                 .catch((e) => {
//                     alert('error');
//                 });
//             renderCart();
//         });
//     });
// }

function deleteCartItemOnButton() {
    const deleteButtons = document.querySelectorAll('.cart-item-delete-btn');
    console.log(deleteButtons);
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            console.log(deleteButton);
            const cart_id = deleteButton.dataset.cartId;
            fakeDatabase
                .deleteCardById(cart_id)
                .then(async (e) => {
                    deleteButton.parentElement?.remove();
                    const carts = await fakeDatabase.getCartByUserId(user_id);
                    if (carts.length === 0) {
                        showEmptyCart();
                    }
                    updateCartQuantity();
                })
                .catch((e) => {
                    alert('error');
                });

            // renderCart();
        });
    });
}

async function updateCartQuantity() {
    if (user_id) {
        const carts = await fakeDatabase.getCartByUserId(user_id);
        console.log(carts);
        const cartQuantity = document.querySelector('.cart-count');
        const totalCartQuantity = document.getElementById(
            'total-cart-quantity',
        );
        if (cartQuantity) {
            cartQuantity.innerHTML = String(carts.length);
        }
        if (totalCartQuantity) {
            totalCartQuantity.innerHTML = `Tất cả (${carts.length} sản phẩm)`;
        }
    }
}
export default addToCartOnButton;
