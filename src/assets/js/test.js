// @ts-nocheck

function isEmail(value) {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexEmail.test(value) ? true : false;
}

function isPhone(value) {
    const regexTel = /(84[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return regexTel.test(value) ? true : false;
}

function validator(options) {
    const form = document.querySelector(options.form);

    function validate(inputElement, rule) {
        const errorMessage = rule.test(inputElement.value);
        const errorElement = inputElement.parentElement.nextElementSibling;
        const parentElement = inputElement.parentElement;
        if (errorMessage && errorElement.classList.contains('form-error')) {
            parentElement.classList.remove('input-fill');
            parentElement.classList.add('input-error');
            errorElement.innerText = errorMessage;
        } else {
            parentElement.classList.remove('input-error');
            errorElement.innerText = '';
        }
        return !errorMessage;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValidForm = true;
            const data = {};

            options.rules.forEach((rule) => {
                const inputElement = form.querySelector(rule.selector);
                const isValid = validate(inputElement, rule);
                data[rule.selector] = inputElement?.value;
                if (!isValid) {
                    isValidForm = false;
                }
            });
            if (isValidForm) {
                options.onSubmit(data);
            }
        });
    }
}

validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Vui lòng không để trống';
        },
    };
};

validator.isValidInput = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return isPhone(value) || isEmail(value)
                ? undefined
                : 'Thông tin không đúng định dạng';
        },
    };
};

validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length > min
                ? undefined
                : `Vui lòng nhập tối thiểu ${min} kí tự`;
        },
    };
};

validator.isConfirmPass = function (selector) {
    return {
        selector: selector,
        test: function (value)
    }
}

function showSignIn(modal) {
    if (modal) {
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-body modal-demo">
                <button id="btn-exit">
                    <img src="./assets/img/exit.png" alt="" />
                </button>
                <div class="modal-body-left">
                    <div class="auth-form">
                        <div class="heading">
                            <h4>Xin chào,</h4>
                            <p>Đăng nhập hoặc Tạo tài khoản</p>
                        </div>

                        <form action class="input-auth-form">
                            <div class="input-group">
                                <input
                                    type="tel"
                                    id="input-phone-email"
                                    name="input-phone-email"
                                    placeholder="Số điện thoại hoặc email"
                                />
                            </div>
                            <span class="form-error"></span>
                            <input
                                type="submit"
                                value="Tiếp tục"
                                id="btn-submit"
                            />
                        </form>

                        <p class="login-email">
                            <!-- <a href="#">Đăng nhập bằng email</a> -->
                            Đăng nhập bằng email
                        </p>
                    </div>
                </div>

                <div class="modal-body-right">
                    <img src="./assets/img/logov1.png" alt="" />
                </div>
            </div>`;
    }
}

function showCreateAccount(modal) {
    if (modal) {
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-body modal-demo">
                <button id="btn-exit">
                    <img src="./assets/img/exit.png" alt="" />
                </button>
                <div class="modal-body-left">
                    <div class="auth-form">
                        <button id="back-btn">
                            <img src="./assets/img/back.png" alt="" />
                        </button>
                        <div class="sign-up-heading">
                            <h4>Tạo tài khoản</h4>
                        </div>

                        <form action="" class="input-auth-form">
                            <div class="input-info">
                                <div class="input-group">
                                    <label for="name"
                                        >Vui lòng cho biết tên bạn</label
                                    >
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Gồm 2 từ trở lên, không bao gồm số và kí tự đặc biệt"
                                    />
                                </div>
                                <span class="form-error"></span>
                                <div class="input-group">
                                    <label for="password">Đặt mật khẩu</label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Từ 8 đến 32 kí tự, gồm chữ và số"
                                    />
                                </div>
                                <span class="form-error"></span>
                                <input
                                    type="submit"
                                    id="btn-create-acc"
                                    value="Gửi"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal-body-right">
                    <img src="./assets/img/logov1.png" alt="" />
                </div>
            </div>
        `;
    }
}

function showInputPassword(modal) {
    if (modal) {
        modal.innerHTML = `
            <div class="modal-overlay"></div>

            <div class="modal-body modal-demo">
                <button id="btn-exit">
                    <img src="./assets/img/exit.png" alt="" />
                </button>
                <div class="modal-body-left modal-demo">
                    <div class="auth-form">
                        <button id="back-btn">
                            <img src="./assets/img/back.png" alt="" />
                        </button>
                        <div class="heading">
                            <h4>Nhập mật khẩu</h4>
                            <p>Vui lòng nhập mật khẩu của số điện thoại</p>
                            <p></p>
                        </div>
                        <form actiọn="" class="input-auth-form">
                            <div class="input-group input-fill">
                                <input
                                    type="password"
                                    id="login-password"
                                    placeholder="Mật khẩu"
                                />
                            </div>
                            <input
                                type="submit"
                                id="btn-login-password"
                                value="Đăng nhập"
                            />
                        </form>
                    </div>
                </div>

                <div class="modal-body-right">
                    <img src="./assets/img/logov1.png" alt="" />
                </div>
            </div>
        `;
    }
}

// const inputs = document.querySelectorAll('input');
// inputs.forEach((input) => {
//     input.addEventListener('input', () => {
//         const parentInput = input.parentElement;
//         const errorElement = parentInput?.nextElementSibling;
//         parentInput?.classList.add('input-fill');
//         if (errorElement) {
//             errorElement.innerHTML = '';
//         }
//         if (!input.value) {
//             parentInput?.classList.remove('input-fill');
//         }
//     });
// });
