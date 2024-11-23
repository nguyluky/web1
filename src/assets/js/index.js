import fakeDatabase from './db/fakeDBv1.js';
import {
    inputFill,
    showCreateAccount,
    showInputPassword,
    showSignIn,
} from './popupAccount.js';
import { validateEmail, validator } from './until/validator.js';
import { initializationHomePage, updateHomePage } from './pages/home/index.js';
import urlConverter, { navigateToPage, urlIsPage } from './until/urlConverter.js';
import { initializationPageNotFound } from './pages/pageNotFound/index.js';
import {
    initializationSearchPage,
    removeSearchBar,
    updateSearchPage,
} from './pages/search/search.js';
import { updateCartQuantity } from './pages/cart/cart.js';
import { initializationUserInfoPage, updateUserInfoPage } from './pages/user-info/index.js';
import { initializationProductPage, removeProductPage, updateProductPage } from './pages/product/index.js';
import { initializationCart, removeCart, updateCart } from './pages/cart/index.js';
import { showListShippingAddressPopup } from './render/addressPopup.js';
import { initializationPayment, updatePayment, removePayment } from './pages/payment/index.js';
import { toast } from './render/popupRender.js';
//#region khai bao page
/**
 * @type {{
 *  pagePath: string,
 *  init: (params: {[key: string] : string}, query: URLSearchParams) => Promise<*>,
 *  update: (params: {[key: string] : string}, query: URLSearchParams) => Promise<*>,
 *  remove: (params: {[key: string] : string}, query: URLSearchParams) => Promise<*>
 * }[]}
 */
const PAGES = [
    {
        pagePath: 'home',
        init: initializationHomePage,
        update: updateHomePage,
        remove: async () => { },
    },
    {
        pagePath: 'search',
        init: initializationSearchPage,
        update: updateSearchPage,
        remove: removeSearchBar,
    },
    {
        // :?tab có nghĩa là tab có thể có hoặc không
        pagePath: 'user/:?tab',
        init: initializationUserInfoPage,
        update: updateUserInfoPage,
        remove: async () => { },
    },
    {
        pagePath: 'product/:id',
        init: initializationProductPage,
        update: updateProductPage,
        remove: removeProductPage,
    },
    {
        pagePath: 'cart',
        init: initializationCart,
        update: updateCart,
        remove: removeCart
    },
    {
        pagePath: '404',
        init: initializationPageNotFound,
        update: async () => { },
        remove: async () => { },
    },
    {
        pagePath: 'payment',
        init: initializationPayment,
        update: updatePayment,
        remove: removePayment,
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
                validator.isRequired('#input-password'),
                validator.isCorrectPassword('#input-password', userInfo.passwd),
            ],
            onSubmit: () => {
                localStorage.setItem('user_id', userInfo.id);
                MODAL?.classList.remove('show-modal');
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
                validator.isRequired('#input-password'),
                validator.minLength('#input-password', 8),
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
                        data['#input-password'],
                        data['#input-name'],
                        phone_num,
                        email,
                    )
                    .then((e) => {
                        localStorage.setItem('user_id', e.id);
                        MODAL?.classList.remove('show-modal');
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
        const dropDown = document.createElement('div');
        dropDown?.classList.add(
            'dropdown-btn-content',
            'dropdown-pos-left-bottom',
        );

        const p1 = document.createElement('p');
        p1.textContent = 'Thông tin tài khoản';
        p1.onclick = () => {
            navigateToPage('user');
        }

        const p2 = document.createElement('p');
        p2.textContent = 'Đơn hàng của tôi';
        p2.onclick = () => {
            navigateToPage('user/dhct');
        }

        const p3 = document.createElement('p');
        p3.textContent = 'Đăng xuất';
        p3.onclick = (event) => {
            event.stopPropagation();
            localStorage.removeItem('user_id');
            navigateToPage('home')
            // location.reload();
        }

        dropDown.appendChild(p1);
        dropDown.appendChild(p2);
        dropDown.appendChild(p3);

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
        BUTTON_ACCOUNT.click();
        if (localStorage.getItem('user_id')) {
            location.hash = `#/cart`
        }
    })

    if (localStorage.getItem('user_id')) {
        showDropDown();
    }

}

/**
 * Khởi tạo xử lý URL cho ứng dụng.
 *
 * Hàm này thiết lập các trình nghe sự kiện và trình xử lý cần thiết để quản lý
 * các thay đổi URL trong ứng dụng. Nó đảm bảo rằng ứng dụng có thể phản hồi các
 * đường dẫn và tham số URL khác nhau, cho phép điều hướng và quản lý trạng thái
 * dựa trên URL.
 *
 * Cách hoạt động:
 *
 * 1. Thêm một trình nghe sự kiện cho sự kiện 'hashchange' để xử lý các thay đổi
 *    hash của URL.
 * 2. Phân tích cú pháp hash của URL hiện tại để xác định trạng thái ban đầu của
 *    ứng dụng.
 * 3. Thiết lập các trình nghe sự kiện hoặc trình xử lý bổ sung cần thiết cho các
 *    thay đổi URL.
 *
 * Cách sử dụng:
 *
 * InitializeUrlHandling();
 *
 * Ví dụ:
 *
 * // Gọi hàm này một lần khi khởi động ứng dụng initializeUrlHandling();
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
 */
async function initializeUrlHandling() {
    let { page: curr_page, query } = urlConverter(location.hash);
    /**
     * @type {PAGES[number] | undefined}
     */
    let oldPage;
    for (const page of PAGES) {
        const param = urlIsPage(curr_page.replace('#/', ''), page.pagePath);
        if (param) {
            await page.init(param, query);
            await page.update(param, query);
            oldPage = page;
            break;
        }
    }


    function showLoading() {
        const main = document.querySelector('main');
        if (!main) return;
        main.innerHTML = `<div style="height: 100vh">
                <div class="dot-spinner-wrapper">
                    <div class="dot-spinner">
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                        <div class="dot-spinner__dot"></div>
                    </div>

                    <p style="margin-left: 10px">Đang tải dữ liệu</p>
                </div>
            </div>`
    }

    /** Khi hash thai đổi */
    async function handleHashChange() {
        let { page, query } = urlConverter(location.hash);
        page = page.replace('#/', '');

        for (const p of PAGES) {
            const param = urlIsPage(page, p.pagePath);
            if (!param) { continue; }

            if (oldPage?.pagePath !== p.pagePath) {
                console.log('remove', oldPage?.pagePath);
                await oldPage?.remove(param, query);

                showLoading();

                console.log('init', p.pagePath);
                await p.init(param, query);
                oldPage = p;
            }

            console.log('update', p.pagePath);
            await p.update(param, query);
        }
    }

    window.addEventListener('hashchange', handleHashChange);

    if (!oldPage) {
        navigateToPage('home');
        return;
    };
}

export function handleAddressPopup(e) {
    if (!localStorage.getItem('user_id')) {
        alert('Vui lòng đăng nhập để thêm địa chỉ mới');
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    showListShippingAddressPopup();
}

/**
 * 
 */
function initializationAddress() {
    document.getElementById('btn-location')?.addEventListener('click', handleAddressPopup);
}

function initializationSearch() {
    document.querySelector('.search-bar')?.addEventListener('keydown', (e) => {
        if (/** @type {KeyboardEvent} */ (e).key === 'Enter') {
            navigateToPage('search', { t: /** @type {HTMLInputElement} */ (e.target).value });
        }
    });
}

/** Main */
function main() {
    initializationAddress();
    initializeAccountPopup();
    initializeUrlHandling();
    initializationSearch();
}

main();

// =====================================================================================
