import fackDatabase from './db/fakeDb.js';

console.log('Popup function success');
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
const form = document.querySelector('form');

function validatePhoneNum() {
    validator({
        form: '.input-auth-form',
        rules: [
            validator.isRequired('#input-phone-email'),
            validator.isValidInput('#input-phone-email'),
        ],

        onSubmit: (data) => {
            // ch sửa lai lấy thông tin người dùng băng email hoặc sdt
            fackDatabase
                .getUserInfoByPhoneNum(data['#input-phone-email'])
                .then((userInfo) => {
                    console.log(userInfo);
                    if (userInfo) {
                        showInputPassword(modal);
                        validatePassword();
                    } else {
                        showCreateAccount(modal);
                        validateCrateNewAccount();
                    }
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

function validatePassword() {}

function validateCrateNewAccount() {}

if (btnAccount && modal) {
    btnAccount.addEventListener('click', () => {
        showSignIn(modal);
        closeSignIn(modal);
        modal.classList.add('show-modal');
        validatePhoneNum();
        // const btnSubmit = document.querySelector('#btn-submit');
        // btnSubmit?.addEventListener('click', (event) => {
        //     // event.preventDefault();
        //     // được rồi nè
        //     event.stopPropagation();
        //     inputPass(modal);
        // });
    });
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
