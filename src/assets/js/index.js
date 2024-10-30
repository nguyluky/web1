import FakeDatabase from './db/fakeDBv1.js';
import fakeDatabase from './db/fakeDBv1.js';
import renderProduct from './render/renderProduct.js';
import removeDiacritics from './until/removeDiacritics.js';
import {
    validator,
    showSignIn,
    showInputPassword,
    showCreateAccount,
    isEmail,
    isPhone,
    inputFill,
} from './test.js';
// import validator from './test.js';
//#region khai bao bien
const btnLocation = document.getElementById('btn-location');
const closePopup = document.getElementById('btn-close');
const popup_wrapper = document.getElementById('popup-wrapper');

if (btnLocation && closePopup && popup_wrapper) {
    btnLocation.addEventListener('click', () => {
        popup_wrapper.classList.add('show');
    });

    // NOTE: nếu mà nhấn mà nó nó chứa thằng popup thì là nhấn bên ngoài
    popup_wrapper.onclick = (event) => {
        const popup = /**@type {HTMLElement}*/ (event.target).querySelector(
            '.popup',
        );
        if (popup) popup_wrapper.classList.remove('show');
    };

    closePopup.addEventListener('click', () => {
        popup_wrapper.classList.remove('show');
    });
}

const btnAccount = document.getElementById('btn-account');
const modal = document.querySelector('.js-modal');

function validatePhoneNum() {
    validator({
        form: '.input-auth-form',
        rules: [
            validator.isValidInput('#input-phone-email'),
            validator.isRequired('#input-phone-email'),
        ],
        onSubmit: (data) => {
            // ch sửa lai lấy thông tin người dùng băng email hoặc sdt
            FakeDatabase.getUserInfoByPhoneOrEmail(data['#input-phone-email'])
                .then((userInfo) => {
                    console.log(userInfo);
                    if (userInfo) {
                        showInputPassword(modal);
                        validatePassword(userInfo);
                    } else {
                        showCreateAccount(modal);
                        validateCrateNewAccount(data['#input-phone-email']);
                    }
                    backSignIn();
                    closeSignIn(modal);
                })
                .catch((e) => {
                    if (e) {
                        showCreateAccount(modal);
                        validateCrateNewAccount();
                    }
                });
        },
    });
}

function validatePassword(userInfo) {
    validator({
        form: '.input-auth-form',
        rules: [
            validator.isRequired('#input-password'),
            validator.isCorrectPassword('#input-password', userInfo.passwd),
        ],
        onSubmit: (data) => {
            localStorage.setItem('user_id', userInfo.id);
            modal?.classList.remove('show-modal');
            showDropDown();
        },
    });
}

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
            FakeDatabase.createUserInfo(
                data['#input-password'],
                data['#input-name'],
                phone_num,
                email,
            )
                .then((e) => {
                    localStorage.setItem('user_id', e.id);
                    modal?.classList.remove('show-modal');
                    showDropDown();
                })
                .catch((e) => {
                    alert('Tạo tài khoản không thành công');
                });
        },
    });
}

function showDropDown() {
    const dropDown = document.createElement('div');
    dropDown?.classList.add('dropdown-btn-content', 'dropdown-pos-left-bottom');

    const p1 = document.createElement('p');
    p1.textContent = 'Thông tin tài khoản';

    const p2 = document.createElement('p');
    p2.textContent = 'Đơn hàng của tôi';

    const p3 = document.createElement('p');
    p3.textContent = 'Đăng xuất';

    dropDown.appendChild(p1);
    dropDown.appendChild(p2);
    dropDown.appendChild(p3);

    btnAccount?.appendChild(dropDown);
}

// @ts-nocheck
const btnExit = document.getElementById('btn-exit');
const modalDemo = document.querySelector('.modal-demo');
const form = document.querySelector('form');
if (btnAccount && modal) {
    btnAccount.addEventListener('click', () => {
        if (!localStorage.getItem('user_id')) {
            modal.classList.add('show-modal');
            showSignIn(modal);
            closeSignIn(modal);
            inputFill();
            validatePhoneNum();
        }
    });
    if (localStorage.getItem('user_id')) {
        showDropDown();
    }
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
    if (btnBack && btnAccount) {
        btnBack.onclick = (e) => {
            e.stopPropagation();
            btnAccount.click();
        };
    }
}
function main() {
    initializeLocationPopup();
    initializeAccountPopup();
    renderProduct();
}

main();

const catergory_row = document.querySelectorAll('.catergory__row--header');
catergory_row.forEach((row) => {
    row.addEventListener('click', () => {
        const catergory_sub_row = row.parentElement?.querySelector(
            '.catergory__row--sub',
        );
        catergory_sub_row?.classList.toggle('show');
    });
});
