import fakeDatabase from "./db/fakeDBv1.js";
import order from "./render/table/orderTabel.js";


const user_option = document.querySelectorAll('.user-info__row');
const article = /**@type {HTMLElement}*/(document.getElementById('article'));

async function create_user_info(option) {
    if (option.dataset.value === "dhct") {
        article.className = "user-package";
        article.innerHTML = `
                    <div class="package-category">
                        <div class = "package-category-header">Tất cả</div>
                        <div class = "package-category-header">Chờ xử lý</div>
                        <div class = "package-category-header">Đã xác nhận</div>
                        <div class = "package-category-header">Vận chuyển</div>
                        <div class = "package-category-header">Đã giao</div>
                        <div class = "package-category-header">Đã hủy</div>
                    </div>
                    <div class="package-search">
                        <label class="input-search">
                            <div class="icon-input"><i class="fa-solid fa-magnifying-glass"></i></div>
                            <input type="text" placeholder="Tìm kiếm theo tên sản phẩm, Mã đơn hàng">
                        </label>
                    </div>
                    <div class="package-content">
                    </div>
                        `;
        renderorder();

        const package_catagory = document.querySelectorAll('.package-category-header');
        console.log(package_catagory);
        package_catagory.forEach(catagory => {
            catagory.addEventListener('click', e => {
                console.log(catagory.innerHTML);
                typeofOrder(catagory.innerHTML);
            });
        });
    }
    else {
        if (option.dataset.value === "tttk") {
            article.className = "user-personal-info";
            displayInfo();
        }
    }
}

async function displayInfo() {
    article.innerHTML = `
                    <div class="article-header">
                        <span>Thông tin tài khoản</span>
                    </div>
                    <div class="user-personal__container">
                    </div>
            `;

    const user_container = /**@type {HTMLElement}*/(document.querySelector('.user-personal__container'));
    if (await renderinfo()) {
        user_container.innerHTML = await renderinfo();
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
    // const user_id = localStorage.getItem('user_id');
    // if (!user_id) {
    //     return;
    // }
    //console.log(user_id);
    const personal_info_data = await fakeDatabase.getUserInfoByUserId(String(2));
    const container = document.createElement('div');

    container.innerHTML = `
                    <div class="user-personal">
                        <div class="user-header">Họ và tên:</div>
                        <div class="user-info">${personal_info_data?.name}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Giới tính:</div>
                        <div class="user-info">${create_user_gender(2)}</div>
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

    return container.innerHTML;
}

const status = {
    daxacnhan: {
        text: 'Đã xác nhận',
        color: 'rgba(219, 198, 38, 1)'
    },
    doixacnhan: {
        text: 'Chờ xác nhận',
        color: 'rgba(208, 128, 8, 1)'
    },
    danggiaohang: {
        text: 'Đang vận chuyển',
        color: 'rgba(0, 158, 129, 1)'
    },
    giaohangthanhcong: {
        text: 'Đã giao',
        color: 'rgba(4, 170, 9, 1)'
    },
    huy: {
        text: 'Đã hủy',
        color: 'rgba(212, 13, 13, 1)'
    }
}

async function renderorder() {
    const order_data = await fakeDatabase.getOrdertByUserId(String(3));
    const container = /**@type {HTMLElement}*/(document.querySelector('.package-content'));

    container.innerHTML = ``;

    order_data.forEach(order => {
        const package_details = document.createElement('div');
        package_details.className = "package-details";

        const all_items_detail = document.createElement('div');
        all_items_detail.className = "package-details__container";

        order.items.forEach(async item => {
            const item_detail = document.createElement('div');
            const sach = await fakeDatabase.getSachById(item.sach);
            let source = './assets/img/default-image.png';
            if (sach) {
                const thumbnail = await fakeDatabase.getImgById(sach.thumbnail);
                if (thumbnail)
                    source = thumbnail.data;
            }
            item_detail.className = "package-details__general";
            item_detail.innerHTML = `
                            <div class="package-details__img">
                                <img src="${source}" alt="">
                            </div>
                            <div class="package-details__details">
                                <div class="package-details__title">${sach?.title}</div>
                                <div class="package-details__quantity">x${item.quantity}</div>
                                <div class="package-details__price">
                                    <span class="package-details__total--number">
                                        ${item.total} <sup>₫</sup>
                                    </span>
                                </div>
                            </div>
            `;

            all_items_detail.appendChild(item_detail);
        });

        package_details.innerHTML = `
                            <div class="package-details__top">
                                <div class="package-details__id">Mã đơn hàng: ${order.id}</div>
                                <div class="package-details__total">
                                    <div class="package-details__total--header">Thành tiền:</div>
                                    <span class="package-details__total--number">
                                        ${order.total} <sup>₫</sup>
                                    </span>
                                </div>
                                <div class="package-details__status">
                                    <div class="package-details__status--header">Trạng thái:</div>
                                    <div class="package-details__status--text" style="color:${status[order.state].color}">${status[order.state].text}</div>
                                </div>
                            </div>
        `;

        const package_detail_bottom = document.createElement('div');
        package_detail_bottom.className = "package-details__bottom";
        package_detail_bottom.appendChild(all_items_detail);

        package_details.appendChild(package_detail_bottom);

        container.appendChild(package_details);
    });
}

async function typeofOrder(state) {
    const order_data = await fakeDatabase.getOrdertByUserId('3');
    switch (state) {
        case "":

            break;

        default:
            break;
    }

}

displayInfo();


