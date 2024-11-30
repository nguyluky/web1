import fakeDatabase from './db/fakeDBv1.js';
import {
    inputFill,
    showCreateAccount,
    showInputPassword,
    showSignIn,
} from './popupAccount.js';
import { validateEmail, validator } from './until/validator.js';
import { initializationHomePage, updateHomePage } from './pages/home/index.js';
import { initializeUrlHandling, navigateToPage } from './until/router.js';
import {
    initializationSearchPage,
    removeSearchBar,
    updateSearchPage,
} from './pages/search/search.js';
import { updateCartQuantity } from './pages/cart/cart.js';
import { initializationUserInfoPage, removeUserInfoPage, updateUserInfoPage } from './pages/user-info/index.js';
import { initializationProductPage, removeProductPage, updateProductPage } from './pages/product/index.js';
import { initializationCart, removeCart, updateCart } from './pages/cart/index.js';
import { initializationPayment, updatePayment, removePayment } from './pages/payment/index.js';
import { toast } from './render/popupRender.js';
import { showPass } from './admin_login.js';

//#region khai bao page
/**
 * @type {import('./until/router.js').PAGE[]}
 */
const PAGES = [
    {
        pagePath: 'home',
        init: initializationHomePage,
        update: updateHomePage,
        remove: async () => { },
        title: 'Home | WebSellBooks',
    },
    {
        pagePath: 'search',
        init: initializationSearchPage,
        update: updateSearchPage,
        remove: removeSearchBar,
        title: (p, q) => {
            return `Tìm kiếm: ${q.get('t')} | WebSellBooks`
        },
    },
    {
        // :?tab có nghĩa là tab có thể có hoặc không
        pagePath: 'user/:tab/:?info',
        init: initializationUserInfoPage,
        update: updateUserInfoPage,
        remove: removeUserInfoPage,
        title: (param, q) => {
            switch (param.tab) {
                case 'account':
                    switch (param.info) {
                        case 'profile':
                            return 'Hồ sơ tài khoản | We sell books';
                        case 'address':
                            return 'Địa chỉ giao hàng | We sell books';
                        default:
                            return '404 | We sell books';
                    }
                case 'purchase':
                    return 'Đơn hàng của tôi | We sell books';
                default:
                    return '404 | We sell books';
            }
        }
    },
    {
        pagePath: 'product/:id',
        init: initializationProductPage,
        update: updateProductPage,
        remove: removeProductPage,
        title: (param) => {
            return `Sản phẩm ${param.id} | WebSellBooks`
        }
    },
    {
        pagePath: 'cart',
        init: initializationCart,
        update: updateCart,
        remove: removeCart,
        title: 'Giỏ hàng | WebSellBooks'
    },
    {
        pagePath: 'payment',
        init: initializationPayment,
        update: updatePayment,
        remove: removePayment,
        title: 'Thanh toán | WebSellBooks',
    }
]

//#region khai bao bien

const BUTTON_CART = document.querySelector('.cart');
const BUTTON_ACCOUNT = document.getElementById('btn-account');
const MODAL = document.querySelector('.js-modal');

// #endregion

/** Sử lý login và nhữ tư tự như vậy */
function initializeAccountPopup() {
    if (
        !BUTTON_ACCOUNT ||
        !MODAL ||
        !BUTTON_CART
    ) {
        console.log('có gì đó không đúng');
        return;
    }
    /**
     * Validates the phone number or email input in the authentication form.
     * 
     * This function sets up validation rules for the input field with the ID 
     * '#input-phone-email' and handles the form submission. On submission, it 
     * retrieves user information based on the provided phone number or email.
     * 
     * If the user information is found, it proceeds to show the password input 
     * modal and validates the password. If the user information is not found, 
     * it shows the create account modal and validates the creation of a new account.
     * 
     * The function also handles the back sign-in and close sign-in modal actions.
     * 
     * @function
     */
    function validatePhoneNum() {
        validator({
            form: '.input-auth-form',
            rules: [
                validator.isValidInput('#input-phone-email'),
                validator.isRequired('#input-phone-email'),
            ],
            onSubmit: (data) => {
                fakeDatabase
                    .getUserInfoByPhoneOrEmail(data['#input-phone-email'])
                    .then((userInfo) => {
                        console.log(userInfo);
                        if (userInfo) {
                            showInputPassword(MODAL);
                            validatePassword(userInfo);
                        } else {
                            showCreateAccount(MODAL);
                            validateCreateNewAccount(data['#input-phone-email']);
                        }
                        document.getElementById('show-hide-icon')?.addEventListener('click', showPass);
                        backSignIn();
                        // @ts-ignore
                        closeSignIn(MODAL);
                    })
            },
        });
    }

    // kiểm tra người dùng có nhập password vào đúng mật khẩu không
    /**
     * 
     * @param {import('./until/type.js').UserInfo} userInfo 
     */
    function validatePassword(userInfo) {
        validator({
            form: '.input-auth-form',
            rules: [
                validator.isRequired('#password'),
                validator.isCorrectPassword('#password', userInfo.passwd),
            ],
            onSubmit: () => {
                localStorage.setItem('user_id', userInfo.id);
                if (userInfo.rule === 'admin') {
                    localStorage.setItem('admin_id', userInfo.id);
                }
                MODAL?.classList.remove('show-modal');
                if (MODAL) {
                    // @ts-ignore
                    MODAL.onclick = undefined;
                    MODAL.innerHTML = '';
                }
                toast({ title: 'Đăng nhập thành công', type: 'success' })
                showDropDown();
                updateCartQuantity();

            },
        });
    }

    /**
     * kiểm tra người dùng có nhập tên vào mật khẩu
     * 
     * @param {string} userPhoneOrEmail 
     */
    function validateCreateNewAccount(userPhoneOrEmail) {
        validator({
            form: '.input-auth-form',
            rules: [
                validator.isRequired('#input-name'),
                validator.checkName('#input-name'),
                validator.isRequired('#password'),
                validator.minLength('#password', 8),
            ],
            onSubmit: (data) => {
                let email = '',
                    phone_num = '';
                if (validateEmail(userPhoneOrEmail)) {
                    email = userPhoneOrEmail;
                } else {
                    phone_num = userPhoneOrEmail;
                }
                fakeDatabase
                    .createUserInfo(
                        data['#password'],
                        data['#input-name'],
                        phone_num,
                        email ? email : undefined,
                    )
                    .then((e) => {
                        localStorage.setItem('user_id', e.id);
                        MODAL?.classList.remove('show-modal');
                        if (MODAL) {
                            // @ts-ignore
                            MODAL.onclick = undefined;
                            MODAL.innerHTML = '';
                        }
                        showDropDown();
                        toast({ title: 'Tạo tài khoản thành công', type: 'success' })
                    })
                    .catch(() => {
                        alert('Tạo tài khoản không thành công');
                    });
            },
        });
    }

    /**
     * thêm dropdown cho nút đăng nhập
     */
    function showDropDown() {
        const userName = BUTTON_ACCOUNT?.querySelector('span');
        const user_id = localStorage.getItem('user_id')
        if (!user_id || !userName) return;
        fakeDatabase.getUserInfoByUserId(user_id)
            .then(userInfo => {
                userName.innerHTML = userInfo?.name || '';
            })
            .catch(() => { })


        const dropDown = document.createElement('div');
        dropDown?.classList.add(
            'dropdown-btn-content',
            'dropdown-pos-left-bottom',
        );

        const p1 = document.createElement('p');
        p1.textContent = 'Tài khoản của tôi';
        p1.onclick = () => {
            navigateToPage('user/account/profile');
        }

        const p2 = document.createElement('p');
        p2.textContent = 'Đơn hàng của tôi';
        p2.onclick = () => {
            navigateToPage('user/purchase');
        }

        const p3 = document.createElement('p');
        p3.textContent = 'Chuyển đến admin';
        p3.onclick = () => {
            location.href = '/admin/index.html';
        }

        const p4 = document.createElement('p');
        p4.textContent = 'Đăng xuất';
        p4.onclick = (event) => {
            event.stopPropagation();
            localStorage.removeItem('user_id');
            localStorage.removeItem('admin_id');
            sessionStorage.removeItem('admin_id');
            navigateToPage('home')
            toast({ title: 'Đăng xuất thành công', type: 'success' })
            userName.innerHTML = 'Tài khoản';
            updateCartQuantity();
            dropDown.remove();

        }

        dropDown.appendChild(p1);
        dropDown.appendChild(p2);
        if (localStorage.getItem('admin_id')) {
            dropDown.appendChild(p3);
        }
        dropDown.appendChild(p4);

        BUTTON_ACCOUNT?.appendChild(dropDown);
    }



    /**
     * 
     * @param {Element} [modal]
     */
    function closeSignIn(modal) {
        const btnExit = document.getElementById('btn-exit');
        const modalDemo = document.querySelector('.modal-demo');
        if (btnExit)
            btnExit.onclick = () => {
                modal?.classList.remove('show-modal');

                if (modal) {
                    modal.innerHTML = '';
                    // @ts-ignore
                    modal.onclick = undefined
                }

            };
        if (modal)
            // NOTE: không nên đổi thành addevntListener
            // @ts-ignore
            modal.onclick = (e) => {
                if (!e.target) return;
                if (!modalDemo?.contains(/**@type {HTMLElement}*/(e.target))) {
                    btnExit?.click();
                }
            };
    }

    /** */
    function backSignIn() {
        const btnBack = document.getElementById('back-btn');
        if (btnBack && BUTTON_ACCOUNT) {
            btnBack.onclick = (e) => {
                e.stopPropagation();
                BUTTON_ACCOUNT.click();
            };
        }
    }




    BUTTON_ACCOUNT.addEventListener('click', () => {
        if (!localStorage.getItem('user_id')) {
            MODAL.classList.add('show-modal');
            // document.querySelector('.dropdown-btn-content')?.remove();
            showSignIn(MODAL);
            closeSignIn(MODAL);
            inputFill();
            validatePhoneNum();
        }
    });

    BUTTON_CART.addEventListener('click', () => {
        if (!localStorage.getItem('user_id')) {
            BUTTON_ACCOUNT.click();
        }
        else {
            location.hash = `#/cart`
        }
    })

    if (localStorage.getItem('user_id')) {
        showDropDown();
    }

}

/** Khởi tạo chức năng tìm kiếm */
function initializationSearch() {

    const input = /**@type {HTMLInputElement} */ (document.querySelector('.search-bar'));
    input?.addEventListener('keydown', (e) => {
        if (/** @type {KeyboardEvent} */ (e).key === 'Enter') {
            navigateToPage('search', { t: /** @type {HTMLInputElement} */ (e.target).value });
        }
    });

    document.querySelector('header div.center div.input_text')?.addEventListener('click', () => {
        if (input?.value)
            navigateToPage('search', { t: input?.value });
    });
}



/** Main */
function main() {
    initializeAccountPopup();
    initializeUrlHandling(PAGES);
    initializationSearch();
    updateCartQuantity();
}

main();

// =====================================================================================
