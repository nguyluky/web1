import fakeDatabase from "./db/fakeDBv1";


const user_option = document.querySelectorAll('.user-info__row');
const article = /**@type {HTMLElement}*/(document.getElementById('article'));

async function create_user_info(option) {
    if (option.dataset.value === "dhct") {
        article.className = "user-package";
        article.innerHTML = `
                    <div class="package-category">
                        <div class="all selected">Tất cả</div>
                        <div class="waiting">Chờ xử lý</div>
                        <div class="confirmed">Đã xác nhận</div>
                        <div class="ondelivery">Vận chuyển</div>
                        <div class="finished">Đã giao</div>
                        <div class="cancle">Đã hủy</div>
                    </div>
                    <div class="package-search">
                        <label class="input-search">
                            <div class="icon-input"><i class="fa-solid fa-magnifying-glass"></i></div>
                            <input type="text" placeholder="Tìm kiếm theo tên sản phẩm, Mã đơn hàng">
                        </label>
                    </div>
                    <div class="package-content">
                        <div class="package-details">
                            <div class="package-details__left">
                                <div class="package-details__container">
                                    <div class="package-details__general">
                                        <div class="package-details__img">
                                            <img src="assets/img/default-image.png" alt="">
                                        </div>
                                        <div class="package-details__details">
                                            <div class="package-details__title">Pháp luật đại cương (Dùng trong các trường đại học, cao đẳng và trung cấp)</div>
                                            <div class="package-details__quantity">x1</div>
                                            <div class="package-details__price">
                                                <span class="package-details__total--number">
                                                    20000 <sup>₫</sup>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="package-details__general">
                                        <div class="package-details__img">
                                            <img src="assets/img/default-image.png" alt="">
                                        </div>
                                        <div class="package-details__details">
                                            <div class="package-details__title">Pháp luật đại cương (Dùng trong các trường đại học, cao đẳng và trung cấp)</div>
                                            <div class="package-details__quantity">x1</div>
                                            <div class="package-details__price">
                                                <span class="package-details__total--number">
                                                    20000 <sup>₫</sup>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="package-details__status">
                                    <div class="package-details__status--header">Trạng thái:</div>
                                    <div class="package-details__status--text">Đã giao</div>
                                </div>
                            </div>
                            <div class="package-details__right">
                                <div class="package-details__id">Mã đơn hàng: 240817H5BBB2NN</div>
                                <div class="package-details__total">
                                    <div class="package-details__total--header">Thành tiền:</div>
                                    <span class="package-details__total--number">
                                        40000 <sup>₫</sup>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="package-details">
                            <div class="package-details__left">
                                <div class="package-details__container">
                                    <div class="package-details__general">
                                        <div class="package-details__img">
                                            <img src="assets/img/default-image.png" alt="">
                                        </div>
                                        <div class="package-details__details">
                                            <div class="package-details__title">Pháp luật đại cương (Dùng trong các trường đại học, cao đẳng và trung cấp)</div>
                                            <div class="package-details__quantity">x1</div>
                                            <div class="package-details__price">
                                                <span class="package-details__total--number">
                                                    20000 <sup>₫</sup>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="package-details__status">
                                    <div class="package-details__status--header">Trạng thái:</div>
                                    <div class="package-details__status--text">Đã giao</div>
                                </div>
                            </div>
                            <div class="package-details__right">
                                <div class="package-details__id">Mã đơn hàng: 240817H5BBB2NN</div>
                                <div class="package-details__total">
                                    <div class="package-details__total--header">Thành tiền:</div>
                                    <span class="package-details__total--number">
                                        20000 <sup>₫</sup>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="package-details">
                            <div class="package-details__left">
                                <div class="package-details__container">
                                    <div class="package-details__general">
                                        <div class="package-details__img">
                                            <img src="assets/img/default-image.png" alt="">
                                        </div>
                                        <div class="package-details__details">
                                            <div class="package-details__title">Pháp luật đại cương (Dùng trong các trường đại học, cao đẳng và trung cấp)</div>
                                            <div class="package-details__quantity">x1</div>
                                            <div class="package-details__price">
                                                <span class="package-details__total--number">
                                                    20000 <sup>₫</sup>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="package-details__status">
                                    <div class="package-details__status--header">Trạng thái:</div>
                                    <div class="package-details__status--text">Đã giao</div>
                                </div>
                            </div>
                            <div class="package-details__right">
                                <div class="package-details__id">Mã đơn hàng: 240817H5BBB2NN</div>
                                <div class="package-details__total">
                                    <div class="package-details__total--header">Thành tiền:</div>
                                    <span class="package-details__total--number">
                                        20000 <sup>₫</sup>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
    }
    else {
        if (option.dataset.value === "tttk") {
            article.className = "article";
            article.innerHTML = `
                    <div class="article-header">
                        <span>Thông tin tài khoản</span>
                    </div>
                    <div class="user-personal__container">
                        <div class="user-personal">
                            <div class="user-header">Họ và tên:</div>
                            <div class="user-info">Laverne Hermiston</div>
                        </div>
                        <div class="user-personal">
                            <div class="user-header">Giới tính:</div>
                            <div class="user-info">Nam</div>
                        </div>
                        <div class="user-personal">
                            <div class="user-header">Email:</div>
                            <div class="user-info">Yesenia62@gmail.com</div>
                        </div>
                        <div class="user-personal">
                            <div class="user-header">Số điện thoại:</div>
                            <div class="user-info">0854198563</div>
                        </div>
                        <div class="user-personal">
                            <div class="user-header">Địa chỉ giao hàng:</div>
                            <div class="user-info">273 Đ. An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh</div>
                        </div>
                    </div>
            `;

            const personal_info = await renderinfo();
            if (personal_info) {
                article.appendChild(personal_info);
            }
        }
    }
}


user_option.forEach(option => {
    option.addEventListener('click', e => {
        user_option.forEach(e => e.classList.remove('selected'));
        option.classList.add('selected');
        create_user_info(option);
    });
});

function create_user_gender(user_id) {
    if (user_id % 2 == 0) {
        return "Nữ";
    }
    else {
        return "Nam";
    }
}

async function renderinfo() {

    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        return;
    }
    const personal_info_data = await fakeDatabase.getUserInfoByUserId(user_id);
    const container = document.createElement('div');

    container.innerHTML = `
                    <div class="user-personal">
                        <div class="user-header">Họ và tên:</div>
                        <div class="user-info">${personal_info_data?.name}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Giới tính:</div>
                        <div class="user-info">${create_user_gender(user_id)}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Email:</div>
                        <div class="user-info">${personal_info_data?.email}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Số điện thoại:</div>
                        <div class="user-info">${personal_info_data?.phone_num}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Địa chỉ giao hàng:</div>
                        <div class="user-info">273 Đ. An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh</div>
                    </div>        
    `;

    return container;
}

async function renderorder() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        return;
    }
    const cart_data = await fakeDatabase.getCartByUserId(user_id);
}
