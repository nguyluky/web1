import fakeDatabase from './db/fakeDBv1.js';
import {
    inputFill,
    showCreateAccount,
    showInputPassword,
    showSignIn,
} from './popupAccount.js';
import removeDiacritics from './until/removeDiacritics.js';
import { isEmail, validator } from './until/validator.js';
import { initializationHomePage, updateHomePage } from './render/home/index.js';
import urlConverter from './until/urlConverter.js';
import { initializationPageNotFound } from './render/pageNotFound/index.js';
import {
    initializationSearchPage,
    updateSearchPage,
} from './render/home/search.js';

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

/**
 * Hàm này được sử dụng để render nội dung vào một phần tử được chọn bởi
 * selector. Hàm này đầu tiên hiển thị một spinner (thể hiện trạng thái
 * loading), sau đó thay thế nó bằng nội dung sau khi promiseData được giải
 * quyết.
 * @param {Promise<string[]>} promiseData
 * @param {string} selector
 * @param {(s: string) => void} [onchange]
 */
function __contentRender__(promiseData, selector, onchange) {
    const content = document.querySelector(selector);
    if (content) {
        content.innerHTML = `
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
        </div>
        `;

        promiseData.then((e) => {
            content.innerHTML = '';
            e?.forEach((j, index) => {
                const div = document.createElement('div');
                div.textContent = j || '';
                div.setAttribute('selection', index == 0 ? 'true' : 'false');
                div.addEventListener('click', function () {
                    const parder =
                        this.parentElement?.parentElement?.parentElement;
                    const input = /** @type {HTMLInputElement} */ (
                        parder?.querySelector('.Address__dropdown-btn input')
                    );

                    if (parder) {
                        // sr
                        const nextInput = /** @type {HTMLInputElement} */ (
                            /** @type {HTMLElement} */ (
                                parder.nextElementSibling
                            )?.querySelector('.Address__dropdown-btn input')
                        );
                        nextInput && (nextInput.disabled = false);
                    }
                    if (input) input.placeholder = this.textContent || '';

                    onchange && onchange(this.textContent || '');
                });
                content.appendChild(div);
            });
        });
    }
}

/** Khỏi tại hàm sử lý popup đại trỉ */
function initializeLocationPopup() {
    /**
     * Gọi một lần ngay khi popup được load có thể nói là ngay sau khi trang load
     *
     * Render danh sách tỉnh/thành phố
     * @param {(name: string) => void} [onchange] Khi người dùng chọn
     */
    function renderTinhThanhPho(onchange) {
        __contentRender__(
            fakeDatabase.getAllTinhThanPho(),
            '.Address__dropdown-content.tp',
            onchange,
        );
    }

    /**
     * Render danh sách phường/xã khi người dùng chọn quận/huyện
     * @param {string} tintp
     * @param {(qh: string) => void} [onchange]
     */
    function renderQuanHuyen(tintp, onchange) {
        __contentRender__(
            fakeDatabase.getAllTinhThanhByThanPho(tintp),
            '.Address__dropdown-content.qh',
            onchange,
        );
    }

    /**
     * Render danh sách phường/xã khi người dùng chọn quận/huyện
     * @param {string} tintp
     * @param {string} qh
     * @param {(px: string) => void} onchange
     */
    function renderPhuongXa(tintp, qh, onchange) {
        __contentRender__(
            fakeDatabase.getAllpxByThinhTpAndQh(tintp, qh),
            '.Address__dropdown-content.xp',
            onchange,
        );
    }

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

    /**
     *
     */
    function showCustomLocation() {
        if (ADDRESS_DISPLAY.checked) ADDRESS_FORM?.classList.add('show');
        else ADDRESS_FORM?.classList.remove('show');
    }

    /**
     *
     * @param {Element} element
     */
    function initializeDropdown(element) {
        const input = element.querySelector('input');
        const contentDropdowContent = element.querySelector(
            '.Address__dropdown-content',
        );
        const button = element.querySelector('.Address__dropdown-btn');

        /**
         * Khi người dùng nhấn làm hiện cái dropdown thì sự kiện ẩn mới được bật
         *
         * @param {MouseEvent} event
         */
        function handleClickOutsideDropdown(event) {
            const target = /** @type {HTMLElement} */ (event.target);
            const isClickInsideDropdown =
                button?.contains(target) || button?.isSameNode(target);

            if (isClickInsideDropdown) return;
            contentDropdowContent?.classList.remove('show');
            document.removeEventListener('click', handleClickOutsideDropdown);
        }

        /**
         *
         */
        function handleSearchInput() {
            const value = input?.value || '';

            contentDropdowContent?.querySelectorAll('div').forEach((e) => {
                if (value == '') {
                    e.classList.remove('hide');
                } else if (
                    !removeDiacritics(e.textContent || '').includes(
                        removeDiacritics(value),
                    )
                ) {
                    e.classList.add('hide');
                } else {
                    e.classList.remove('hide');
                }
            });

            // NOTE: nếu cái selection nó bị ẩn thì tìm cái không bị ẩn đầu tiện rồi chọn
            let curr = contentDropdowContent?.querySelector(
                "div[selection='true']",
            );

            if (curr?.classList.contains('hide')) {
                const a =
                    contentDropdowContent?.querySelector('div:not(.hide)');
                if (a) {
                    a.setAttribute('selection', 'true');
                    curr.setAttribute('selection', 'false');
                }
            }
        }

        function showDropdown() {
            if (input?.disabled) return;
            contentDropdowContent?.classList.add('show');
            document.addEventListener('click', handleClickOutsideDropdown);
        }

        function resetDropdownOnBlur() {
            if (!input) return;
            input.value = '';

            contentDropdowContent?.querySelectorAll('div').forEach((e) => {
                e.classList.remove('hide');
            });
        }

        /** @param {KeyboardEvent} event */
        function handleKeyboardNavigation(event) {
            if (!input) return;

            const validkey = ['ArrowDown', 'ArrowUp', 'Enter'];
            if (!validkey.includes(event.code)) return;

            event.preventDefault();

            let curr = contentDropdowContent?.querySelector(
                "div[selection='true']",
            );

            if (event.code == 'Enter') {
                /** @type {HTMLElement} */ (curr)?.click();
                input.value = '';
                return;
            }

            /** @type {Element | undefined | null} */
            let next;
            let temp = curr;

            // NOTE: tìm phần tử không bị ẩn gần nhất
            if (contentDropdowContent?.querySelector('div:not(.hide)'))
                do {
                    if (event.code == 'ArrowDown') {
                        next =
                            temp?.nextElementSibling ||
                            temp?.parentElement?.firstElementChild;
                    } else if (event.code == 'ArrowUp') {
                        next =
                            temp?.previousElementSibling ||
                            temp?.parentElement?.lastElementChild;
                    }

                    temp = next;
                } while (next?.classList.contains('hide'));

            if (next) {
                console.log(next);
                curr?.setAttribute('selection', 'false');
                next?.setAttribute('selection', 'true');
                next?.scrollIntoView({
                    inline: 'nearest',
                    block: 'nearest',
                });
            }
        }

        // người dùng nhấn vào cái button thì hiện cái dropdown
        button?.addEventListener('click', showDropdown);
        input?.addEventListener('input', handleSearchInput);

        // cho toàn bộ hiện lại nếu dropdown bị ẩn
        input?.addEventListener('focusout', resetDropdownOnBlur);

        /**
         * - NOTE: Xử lý sự kiện khi người dùng nhấn các phím điều hướng
         *   (ArrowDown, ArrowUp) và Enter trong dropdown.
         * - NOTE: Điều này cho phép người dùng điều hướng giữa các mục trong
         *   dropdown và chọn mục bằng phím Enter.
         */
        input?.addEventListener('keydown', handleKeyboardNavigation);
    }

    // được gọi một lần duy nhất
    renderTinhThanhPho((tinhpt) => {
        renderQuanHuyen(tinhpt, (qh) => {
            renderPhuongXa(tinhpt, qh, (xp) => {
                console.log(xp);
            });
        });
    });

    // hiện popup
    BUTTON_LOCATION?.addEventListener('click', showPopupLocation);
    // ẩn popup
    POPUP_WRAPPER?.addEventListener('click', HandleClickOutSidePopup);

    // show address fill
    // người khi người dùng chọn "chọn khu vực giao khac"
    document
        .getElementsByName('select_address')
        .forEach((e) => e.addEventListener('change', showCustomLocation));

    // Dropdown handle
    document
        .querySelectorAll('#Address-form > .Address-form__row')
        .forEach(initializeDropdown);
}

/** Sử lý login và nhữ tư tự như vậy */
function initializeAccountPopup() {
    if (
        !BUTTON_LOCATION ||
        !CLOSE_POPUP ||
        !POPUP_WRAPPER ||
        !BUTTON_ACCOUNT ||
        !MODAL
    )
        return;

    // kiểm tra người dùng có nhập sđt hoặc email chưa
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
                        closeSignIn(MODAL);
                    })
                    .catch((e) => {
                        if (e) {
                            showCreateAccount(MODAL);
                            validateCrateNewAccount();
                        }
                    });
            },
        });
    }

    // kiểm tra người dùng có nhập password vào đúng mật khẩu không
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
            },
        });
    }

    // kiểm tra người dùng có nhập tên vào mật khẩu
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
                if (isEmail(userPhoneOrEmail)) {
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

    // thêm dropdown cho nút đăng nhập
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

    function closeSignIn(modal) {
        const btnExit = document.getElementById('btn-exit');
        const modalDemo = document.querySelector('.modal-demo');
        if (btnExit)
            btnExit.onclick = () => {
                modal.classList.remove('show-modal');
            };
        if (modal)
            modal.onclick = (e) => {
                if (!e.target) return;
                if (!modalDemo?.contains(/**@type {HTMLElement}*/ (e.target))) {
                    btnExit?.click();
                }
            };
    }

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
        const popup = /**@type {HTMLElement}*/ (event.target).querySelector(
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
 *
 * khởi tạo hash url handle
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 *
 */
function initializePage() {
    let { page: curr_page, query } = urlConverter(location.hash);

    /**
     * @param {string} page
     */
    function pageInit(page) {
        switch (page) {
            case '#/home':
                initializationHomePage();
                break;
            case '#/search':
                initializationSearchPage();
                break;
            default:
                initializationPageNotFound();
                break;
        }
    }

    /**
     * @param {string} curr_page
     * @param {URLSearchParams} query
     */
    function pageUpdate(curr_page, query) {
        switch (curr_page) {
            case '#/home':
                updateHomePage(curr_page, query);
                break;
            case '#/search':
                updateSearchPage();
                break;
            default:
                break;
        }
    }

    /**
     * khi hash thai đổi
     */
    function handleHashChange() {
        const { page, query } = urlConverter(location.hash);
        console.log(page, query);

        if (page != curr_page) {
            pageInit(page);
            curr_page = page;
        }

        pageUpdate(page, query);
    }

    window.addEventListener('hashchange', handleHashChange);

    if (!curr_page) location.hash = '#/home';
    document.querySelector('.search-bar')?.addEventListener('keydown', (e) => {
        if (/**@type {KeyboardEvent} */ (e).key === 'Enter') {
            console.log('enter');
            location.hash =
                '#/search?t=' + /**@type {HTMLInputElement} */ (e.target).value;
        }
    });
    pageInit(curr_page);
    pageUpdate(curr_page, query);
}

/**
 * main
 */
function main() {
    initializeLocationPopup();
    initializeAccountPopup();

    initializePage();
}

main();

// =====================================================================================
