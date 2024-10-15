// const btnOpen = document.getElementById('btn-account');
// const modal = document.getElementById('js-modal');
// const btnExit = document.getElementById('btn-exit');
// const modalDemo = document.querySelector('.modal-demo');
// const form = document.querySelector('form');
// if (btnOpen && modal && btnExit && modalDemo) {
// btnOpen.addEventListener('click', () => {
// modal.classList.add('show-modal');
// });
// btnExit.addEventListener('click', () => {
// modal.classList.remove('show-modal');
// });
// modal.addEventListener('click', (e) => {
// if (!modalDemo.contains(e.target)) {
// btnExit.click();
// }
// });
// }

// const inputs = document.querySelectorAll('input');
// inputs.forEach((input) => {
//     input.oninput = () => {
//         in
//     };
// });

// const tel = document.querySelector('#input-phone');

// function showError(input, message) {
//     let parent = input.parentElement.parentElement;
//     let small = parent.querySelector('.form-error');
//     parent.classList.add('input-error');
//     small.innerText = message;
// }

// function showSuccess(input) {
//     let parent = input.parentElement.parentElement;
//     let small = parent.querySelector('.form-error');
//     parent.classList.remove('input-error');
//     small.innerText = '';
// }

// function checkEmptyError(listInput) {
//     let isEmptyError = false;
//     listInput.forEach((input) => {
//         input.value = input.value.trim();

//         if (!input.value) {
//             isEmptyError = true;
//             showError(input, 'Khong duoc de trong');
//         } else {
//             showSuccess(input);
//         }
//     });
//     return isEmptyError;
// }

// function checkEmailError(input) {
//     const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     input.value = input.value.trim();

//     let isEmailError = !regex.test(input.value);
//     if (!isEmailError) {
//         showSuccess(input);
//     } else {
//         showError(input, 'Vui long nhap lai');
//     }
//     return isEmailError;
// }

// function checkLengthError(input, min) {
//     input.value = input.value.trim();
//     if (input.value.length < min) {
//         showError(input, `Vui long nhap toi thieu ${min} ky tu`);
//         return true;
//     } else {
//         showSuccess(input);
//         return false;
//     }
// }

// function checkMatchpassword(passwordInput, cfPasswordInput) {
//     if (passwordInput !== cfPasswordInput) {
//         showError(cfPasswordInput, 'Mat khau khong trung khop');
//         return true;
//     }
//     return false;
// }

// form?.addEventListener('submit', function (e) {
//     e.preventDefault();
//     let isEmptyError = checkEmptyError([tel]);
// let isEmailError = checkEmailError (email);
// if (!isEmptyError) {
//     let isUsernameLengthError = checkLengthError (username,6);
//     let isPasswordLengthError = checkLengthError (password,6);
// }
// let isMatchError = checkMatchpassword(password, confirmPassword);
// });
