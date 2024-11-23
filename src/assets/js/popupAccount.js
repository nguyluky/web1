export function showSignIn(modal) {
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

                    </div>
                </div>

                <div class="modal-body-right">
                    <img src="./assets/img/logov1.png" alt="" />
                </div>
            </div>`;
        // inputFill();
    }
}

export function showCreateAccount(modal) {
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
                                        id="input-name"
                                        placeholder="Không bao gồm số và kí tự đặc biệt"
                                    />
                                </div>
                                <span class="form-error"></span>
                                <div class="input-group">
                                    <label for="password">Đặt mật khẩu</label>
                                    <input
                                        type="password"
                                        id="input-password"
                                        placeholder="Nhập 8 kí tự trở lên"
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
        inputFill();
    }
}

export function showInputPassword(modal) {
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
                        <div class="heading">
                            <h4>Nhập mật khẩu</h4>
                            <p>Vui lòng nhập mật khẩu của số điện thoại</p>
                            <p></p>
                        </div>
                        <form actiọn="" class="input-auth-form">
                            <div class="input-group">
                                <input
                                    type="password"
                                    id="input-password"
                                    placeholder="Mật khẩu"
                                />
                            </div>
                            <span class="form-error"></span>

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
        inputFill();
    }
}

export function inputFill() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            const parentInput = input.parentElement;
            const errorElement = parentInput?.nextElementSibling;

            parentInput?.classList.add('input-fill');
            if (errorElement && errorElement.classList.contains('form-error')) {
                errorElement.innerHTML = '';
                parentInput?.classList.remove('input-error');
            }
            if (!input.value) {
                parentInput?.classList.remove('input-fill');
            }
        });
    });
}
