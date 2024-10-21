import fakeDatabase from './db/fakeDb.js';

const btnAccount = document.getElementById('btn-account');
const modal = document.getElementById('js-modal');
const btnExit = document.getElementById('btn-exit');
const btnSubmit = document.querySelector('input[type="submit"]');
const btnBack = document.getElementById('back-btn');
const modalDemo = document.querySelector('.modal-demo');
const form = document.querySelector('form');
const btnBackHTML = document.createElement('button');
btnBackHTML.id = 'back-btn';
btnBackHTML.innerHTML = `<img src="./assets/img/back.png" alt="" />`;
const formHeading = document.querySelector('.auth-form .heading');
const inputContainer = document.querySelector('.input-group');

const inputPass = {
    isBack: true,
    heading: {
        title: 'Nhập mật khẩu',
        content: 'Vui lòng nhập mật khẩu của số điện thoại',
    },
    input: {
        type: 'password',
        id: 'login-password',
        placeholder: 'Mật khẩu',
    },
    submit: {
        id: 'btn-login-password',
        value: 'Đăng nhập',
    },
    link: {},
};

const inputPhone = {
    isBack: false,
    heading: {
        title: 'Xin chào,',
        content: 'Đăng nhập hoặc <a href="sign_up.html">Tạo tài khoản</a>',
    },
    input: {
        type: 'tel',
        id: 'input-phone',
        placeholder: 'Số điện thoại',
    },
    submit: {
        id: 'btn-submit',
        value: 'Tiếp tục',
    },
    link: {
        url: 'loginEmail.html',
        content: 'Đăng nhập bằng email',
    },
};

function changePopup(popupInfo) {
    // add back button
    if (popupInfo.isBack != true) btnBack?.classList.add('hide');
    else btnBack?.classList.remove('hide');
    // change text
    let title = formHeading?.querySelector('h4');
    let content = formHeading?.querySelector('p');
    if (title && content) {
        title.innerHTML = popupInfo.heading.title;
        content.innerHTML = popupInfo.heading.content;
    }
    // change input
    let input = inputContainer?.querySelector('input');
    if (input) {
        input.type = popupInfo.input.type;
        input.id = popupInfo.input.id;
        input.placeholder = popupInfo.input.placeholder;
        input.value = '';
    }
    // change submit
    if (btnSubmit) {
        btnSubmit.setAttribute('value', popupInfo.submit.value);
        btnSubmit.id = popupInfo.submit.id;
    }
    // remove link to emial
    let link = document.querySelector('.link');

    if (link)
        if (Object.keys(popupInfo.link).length == 0)
            link.querySelector('a')?.remove();
        else
            link.innerHTML = `<a href=${popupInfo.link.url}>${popupInfo.link.content}</a>`;
}

if (btnAccount && modal && btnExit && modalDemo) {
    // nhấn button "Tài khoản" => hiện popup
    btnAccount?.addEventListener('click', () => {
        modal?.classList.add('show-modal');
        window.sessionStorage.setItem('isOnLogIn', 'true');
    });
    // nhấn X icon => ẩn popup
    btnExit?.addEventListener('click', () => {
        window.sessionStorage.setItem('isOnLogIn', 'false');
        modal?.classList.remove('show-modal');
    });
    // click ngoài popup thì ẩn
    modal?.addEventListener('click', (e) => {
        if (!e.target) return;
        if (!modalDemo?.contains(/** @type {HTMLElement} */ (e.target))) {
            btnExit?.click();
        }
    });
}

const inputs = document.querySelectorAll('input');
// inputs.forEach((input) => {
//     input.oninput = () => {
//         in
//     };
// });

function showError(input, message) {
    let parent = input.parentElement.parentElement;
    let small = parent.querySelector('.form-error');
    parent.classList.add('input-error');
    small.innerText = message;
}

function showSuccess(input) {
    let parent = input.parentElement.parentElement;
    let small = parent.querySelector('.form-error');
    parent.classList.remove('input-error');
    small.innerText = '';
}

async function checkPhoneNum(input) {
    let isCorrect = '';
    let phone = input.value.trim();
    let user_info = await fakeDatabase.getUserInfoByPhoneNum(phone);
    if (!phone) showError(input, 'Vui lòng không để trống');
    else if (phone.length != 10)
        showError(input, 'Số điện thoại phải có 10 chữ số');
    else if (user_info == undefined)
        showError(input, 'Số điện thoại chưa đăng ký tài khoản');
    else {
        showSuccess(input);
        isCorrect = phone;
    }
    return isCorrect;
}

function checkEmailError(input) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    input.value = input.value.trim();

    let isEmailError = !regex.test(input.value);
    if (!isEmailError) {
        showSuccess(input);
    } else {
        showError(input, 'Vui long nhap lai');
    }
    return isEmailError;
}

function checkLengthError(input, min) {
    input.value = input.value.trim();
    if (input.value.length < min) {
        showError(input, `Vui long nhap toi thieu ${min} ky tu`);
        return true;
    } else {
        showSuccess(input);
        return false;
    }
}
/**
 * @param {string} passwordInput
 * @param {string} cfPasswordInput
 * @returns
 */
function checkMatchpassword(passwordInput, cfPasswordInput) {
    if (passwordInput !== cfPasswordInput) {
        showError(cfPasswordInput, 'Mat khau khong trung khop');
        return true;
    }
    return false;
}

// form?.addEventListener('input', (e) => {
//     e.preventDefault();
// });
form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const tel = document.querySelector('#input-phone');
    if (tel) {
        let isPhoneCorrect = await checkPhoneNum(tel);
        if (isPhoneCorrect != '') changePopup(inputPass);
    }
});
btnBack?.addEventListener('click', () => {
    changePopup(inputPhone);
});
