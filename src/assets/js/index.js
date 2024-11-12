import fakeDatabase from './db/fakeDBv1.js';
import {
    inputFill,
    showCreateAccount,
    showInputPassword,
    showSignIn,
} from './popupAccount.js';
import { validateEmail, validator } from './until/validator.js';
import { initializationHomePage, updateHomePage } from './pages/home/index.js';
import urlConverter, { urlIsPage } from './until/urlConverter.js';
import { initializationPageNotFound } from './pages/pageNotFound/index.js';
import {
    initializationSearchPage,
    updateSearchPage,
} from './pages/search/search.js';
import { updateCartQuantity } from './cart.js';
import { initializeUserInfoPage } from './pages/user-info/index.js';
import { initializationProductPage, removeProductPage } from './pages/product/index.js';
import { initializationCart, removeCart, updateCart } from './pages/cart/index.js';

//#region khai bao page
/**
 * @type {{
 *  pagePath: string,
 *  init: (params: object, query: URLSearchParams) => Promise<*>,
 *  update: (params: object, query: URLSearchParams) => Promise<*>,
 *  remove: (params: object, query: URLSearchParams) => Promise<*>
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
        remove: async () => { },
    },
    {
        // :?tab có nghĩa là tab có thể có hoặc không
        pagePath: 'user/:?tab',
        init: initializeUserInfoPage,
        update: async () => { },
        remove: async () => { },
    },
    {
        pagePath: 'product/:id',
        init: initializationProductPage,
        update: async () => { },
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
]

//#region khai bao bien

const BUTTON_LOCATION = document.getElementById('btn-location');
const CLOSE_POPUP = document.getElementById('btn-close');
const POPUP_WRAPPER = document.getElementById('popup-wrapper');

const BUTTON_ACCOUNT = document.getElementById('btn-account');
const MODAL = document.querySelector('.js-modal');

const ADDRESS_DISPLAY = /** @type {HTMLInputElement} */ (
    document.getElementById('address_display')
);
const ADDRESS_FORM = document.getElementById('Address-form');

// #endregion

/** Khỏi tại hàm sử lý popup đại trỉ */

function initializeLocationPopup() {
    /** Hiện popup */
    function showPopupLocation() {
        POPUP_WRAPPER?.classList.add('show');
    }

    /** @param {MouseEvent} event */
    function HandleClickOutSidePopup(event) {
        const popup = /** @type {HTMLElement} */ (event.target).querySelector(
            '.popup',
        );
        if (popup) POPUP_WRAPPER?.classList.remove('show');
    }

    /** */
    function showCustomLocation() {
        if (ADDRESS_DISPLAY.checked) ADDRESS_FORM?.classList.add('show');
        else ADDRESS_FORM?.classList.remove('show');
    }

    // hiện popup
    BUTTON_LOCATION?.addEventListener('click', showPopupLocation);
    // ẩn popup
    POPUP_WRAPPER?.addEventListener('click', HandleClickOutSidePopup);

    // show address fill
    // người khi người dùng chọn "chọn khu vực giao khac"
    document
        .getElementsByName('select_address')
        .forEach((e) => e.addEventListener('change', showCustomLocation));

    // xử lý khi người dùng nhập địa chỉ
}

/** Sử lý login và nhữ tư tự như vậy */
function initializeAccountPopup() {
    if (
        !BUTTON_LOCATION ||
        !CLOSE_POPUP ||
        !POPUP_WRAPPER ||
        !BUTTON_ACCOUNT ||
        !MODAL
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
                // ch sửa lai lấy thông tin người dùng băng email hoặc sdt
                fakeDatabase
                    .getUserInfoByPhoneOrEmail(data['#input-phone-email'])
                    .then((userInfo) => {
                        console.log(userInfo);
                        if (userInfo) {
                            showInputPassword(MODAL);
                            validatePassword(userInfo);
                        } else {
                            showCreateAccount(MODAL);
                            validateCrateNewAccount(data['#input-phone-email']);
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
    function validateCrateNewAccount(userPhoneOrEmail) {
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

        const p2 = document.createElement('p');
        p2.textContent = 'Đơn hàng của tôi';

        const p3 = document.createElement('p');
        p3.textContent = 'Đăng xuất';

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

    BUTTON_LOCATION.addEventListener('click', () => {
        POPUP_WRAPPER.classList.add('show');
    });

    // NOTE: nếu mà nhấn mà nó nó chứa thằng popup thì là nhấn bên ngoài
    POPUP_WRAPPER.onclick = (event) => {
        const popup = /** @type {HTMLElement} */ (event.target).querySelector(
            '.popup',
        );
        if (popup) POPUP_WRAPPER.classList.remove('show');
    };

    CLOSE_POPUP.addEventListener('click', () => {
        POPUP_WRAPPER.classList.remove('show');
    });

    BUTTON_ACCOUNT.addEventListener('click', () => {
        if (!localStorage.getItem('user_id')) {
            MODAL.classList.add('show-modal');
            showSignIn(MODAL);
            closeSignIn(MODAL);
            inputFill();
            validatePhoneNum();
        }
    });
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
     * @param {string} page
     * @param {URLSearchParams} query 
     */
    async function pageInit(page, query) {
        for (const { pagePath, init } of PAGES) {
            const params = urlIsPage(page.replace('#/', ''), pagePath);
            if (params) {
                await init(params, query);
                return;
            }
        }

        initializationPageNotFound({}, query);
    }

    /**
     * @param {string} curr_page
     * @param {URLSearchParams} query
     */
    async function pageUpdate(curr_page, query) {
        for (const { pagePath, update } of PAGES) {
            const params = urlIsPage(curr_page.replace('#/', ''), pagePath);
            if (params) {
                await update(params, query);
                return;
            }
        }
    }

    /**
     * 
     * @param {string} page 
     * @param {URLSearchParams} query
     * @returns {void}
     */
    function pageRemove(page, query) {
        for (const { pagePath, remove } of PAGES) {
            const params = urlIsPage(page.replace('#/', ''), pagePath);
            if (params) {
                remove(page, query);
                return;
            }
        }
    }

    /** Khi hash thai đổi */
    async function handleHashChange() {
        const { page, query } = urlConverter(location.hash);
        console.log(page, query);

        if (page != curr_page) {
            await pageRemove(curr_page, query);
            await pageInit(page, query);

            curr_page = page;
        }

        await pageUpdate(page, query);
    }

    window.addEventListener('hashchange', handleHashChange);

    if (!curr_page) location.hash = '#/home';
    document.querySelector('.search-bar')?.addEventListener('keydown', (e) => {
        if (/** @type {KeyboardEvent} */ (e).key === 'Enter') {
            console.log('enter');
            location.hash =
                '#/search?t=' +
                /** @type {HTMLInputElement} */ (e.target).value;
        }
    });


    await pageInit(curr_page, query);
    await pageUpdate(curr_page, query);
}

/** Main */
function main() {
    initializeLocationPopup();
    initializeAccountPopup();

    initializeUrlHandling();
}

main();

// =====================================================================================
