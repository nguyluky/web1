import fakeDatabase from "../../db/fakeDBv1.js";
import { showShippingFromeAddressPopup } from "../../render/addressPopup.js";
import { toast } from "../../render/popupRender.js";
import { dateToString, removeDiacritics } from "../../until/format.js";
import { errorPage, navigateToPage } from "../../until/router.js";
import { updateCartQuantity } from "../cart/cart.js";

const status = {
    daxacnhan: {
        text: 'Đã xác nhận',
        color: 'rgba(219, 198, 38, 1)'
    },
    doixacnhan: {
        text: 'Chờ xử lý',
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

/**
 * 
 * Tạo giới tính ngẫu nhiên từ user_id
 * 
 * @param {string} user_id 
 * @returns {string}
 */
function create_user_gender(user_id) {

    // hash
    /**
     * 
     * Generate a Hash 32bit from string
     * 
     * @param {string} string 
     * @returns {number}
     */
    function hashCode(string) {
        var hash = 0,
            i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    if (hashCode(user_id) % 2 == 0) {
        return "Nữ";
    }
    else {
        return "Nam";
    }
}


/**
 * 
 * tạo container chứa thông tin đơn hàng
 * 
 * @param {import("../../until/type.js").Order} order 
 * @returns {HTMLElement}
 */
function createOrderContainer(order) {
    const package_details = document.createElement('div');
    package_details.className = "package-details";
    const all_items_detail = document.createElement('div');
    all_items_detail.className = "package-details__container";
    order.items.forEach(async item => {
        all_items_detail.appendChild(await createOrderItemElement(item));
    });

    package_details.innerHTML = `
        <div class="package-details__top">
            <div class="package-details__id">Mã đơn: <span>${order.id}</span></div>
            <div class="package-details__date">Ngày đặt: <span>${dateToString(order.date)}<span></div>
            <div class="package-details__status">
                <div class="package-details__status--text" style="color:${status[order.state].color}">${status[order.state].text}</div>
            </div>
            <div class="package-details__total">
                <div class="package-details__total--header">Tổng tiền:</div>
                <span class="package-details__total--number">
                    ${order.total} ₫
                </span>
            </div>
        </div>
        <div class="package-details__bottom"></div>
        `;
    package_details.querySelector('.package-details__bottom')?.appendChild(all_items_detail);
    return package_details;
}

/**
 * tạo container chứa thông tin chi tiết từng sản phẩmz
 * 
 * @param {import("../../until/type.js").Order['items'][number]} item 
 * @returns {Promise<HTMLElement>}
 */
async function createOrderItemElement(item) {
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
        <div class="package-details__details">
            <div class="package-details__img">
                <img src="${source}" alt="">
            </div>
            <div class="package-details__info">
                <div class="package-details__title">${sach?.title}</div>
                <div class="package-details__quantity">x${item.quantity}</div>        
            </div>
        </div>
        <div class="package-details__price">
            <span class="package-details__total--number">
                ${item.total} <sup>₫</sup>
            </span>
        </div>`;
    return item_detail;
}

/**
 * 
 * @param {import("../../until/type.js").UserAddress} address 
 * @param {Number} i
 */
function createAddressContainer(address, i) {
    const address_container = document.createElement('div');
    address_container.className = "user-address__container";
    address_container.setAttribute('data-addId', '' + i)
    address_container.innerHTML = `
        <div class="user-address__info">
            <div class="user-address__contact">
                <div class="user-address__name">${address.name}</div>
                <span></span>
                <div class="user-address__phone">${address.phone_num}</div>
            </div>
            <div class="user-address__action">
                <button class="update-address">Cập nhật</button>
                ${i == 0 ? '' : '<button class="delete-address">Xóa</button>'}
            </div>
        </div>
        <div class="user-address__address">
            <div>
                <div class="user-address__street">${address.street}</div>
                <div class="user-address__details">${address.address.replaceAll(/ - /g, ', ')}</div>
            </div>
            <button class="set-default-btn ${i == 0 ? 'disable' : ''}">Thiết lập mặc định</button>
        </div>
        ${i == 0 ? '<div class="user-address__default">Mặc định</div>' : ''}
        `;
    return address_container;
}

/**
 * 
 * @param {string} option 
 * @returns {Promise<void>}
 */
async function renderOrder(option = 'all') {
    const user_id = /**@type {String} */(localStorage.getItem('user_id'));

    if (!user_id) {
        toast({ title: 'Lỗi', message: 'Vui lòng đăng nhập để xem thông tin đơn hàng', type: 'error' });
        return;
    }

    const order_data = await fakeDatabase.getOrdertByUserId(user_id);

    const container = /**@type {HTMLElement}*/(document.querySelector('.package-content'));
    container.innerHTML = '';
    let count = 0;


    order_data.forEach(order => {
        if (option === 'all' || order.state === option) {
            count++;
            container.appendChild(createOrderContainer(order));
        }
    })
    if (count === 0) {
        document.querySelector('.no-order')?.classList.remove('hide');
        document.querySelector('.package-search')?.classList.add('hide');
    }
    else {
        document.querySelector('.no-order')?.classList.add('hide');
        document.querySelector('.package-search')?.classList.remove('hide');
    }
}

/**
 * 
 * @param {string} [email] 
 * @returns {string}
 */
function checkEmail(email) {
    if (!email) {
        return "bạn chưa nhập email"
    }
    else {
        return email;
    }
}

/**
 * 
 * @param {string} user_id 
 * @returns {Promise<string>}
 */
async function renderUserInfo(user_id) {

    if (!user_id) {
        toast({ title: 'Lỗi', message: 'Vui lòng đăng nhập để xem thông tin cá nhân', type: 'error' });
        return '';
    }
    const personal_info_data = await fakeDatabase.getUserInfoByUserId(user_id);

    const user_default_address = personal_info_data?.address[0];
    console.log(user_default_address);

    return `
                    <div class="user-personal">
                        <div class="user-header">Họ và tên:</div>
                        <div class="user-info">${user_default_address?.name}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Giới tính:</div>
                        <div class="user-info">${create_user_gender(/**@type {String}*/(localStorage.getItem('user_id')))}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Email:</div>
                        <div class="user-info">${checkEmail(user_default_address?.email)}</div>
                    </div>
                    <div class="user-personal">
                        <div class="user-header">Số điện thoại:</div>
                        <div class="user-info">${user_default_address?.phone_num}</div>
                    </div>       
                    <div class="user-personal">
                        <div class="user-header">Địa chỉ giao:</div>
                        <div class="user-info">${user_default_address?.street}, ${user_default_address?.address.replace(/ - /g, ', ')}</div>
                    </div>
    `;
}

async function renderAddressInfo(address_data) {
    const container = document.querySelector('.user-all-address');
    if (!container) return;
    container.innerHTML = '';
    address_data?.forEach((address, index) => {
        container?.appendChild(createAddressContainer(address, index));
    });
    if (address_data.length === 0) {
        container.innerHTML = `<div id="no-address">
            <img src="../assets/img/no-address-found.webp">
            <h3>Không có địa chỉ nào</h3>    
        </div>`;
    }
}


/**
 * 
 * @returns {void}
 */
function initializationMain() {
    const main = document.querySelector('main');
    if (!main) return;

    main.innerHTML = `
    <div class="main_wapper">
        <aside class="aside">
        </aside>
        <article class="user-personal-info" id="article">
        </article>
    </div>
    `
}

/**
 * 
 * @param {import("../../until/type.js").UserInfo} personal_info_data 
 * @returns {void}
 */
function initializationAside(personal_info_data) {
    const aside = document.querySelector('.aside');
    if (!aside) return;
    aside.innerHTML = `
    <div class="aside-box box1 card">
        <div class="user-info__header">
            <div class="user-info__img">
                <img src="assets/img/Default_pfp.svg.png" alt="">
            </div>
            <div class="user-info__name">${personal_info_data?.name}</div>
        </div>
        <div class="user-info__content">
            <div class="user-info-tab">
                <div class="user-info__row info-tab" data-value="account/profile">
                    <div class="user-info__row--icon"><i class="fa-solid fa-user"></i></div>
                    <div class="user-info__row--name">Thông tin tài khoản</div>
                </div>
                <div class="info-tab__more"> 
                    <div class="info-tab" data-value="account/profile">Hồ sơ</div>
                    <div class="info-tab" data-value="account/address">Địa chỉ</div>
                </div>
            </div>
            <div class="user-info-tab">
                <div class="user-info__row info-tab" data-value="purchase">      
                    <div class="user-info__row--icon"><i class="fa-solid fa-box-archive"></i></div>
                    <div class="user-info__row--name">Đơn hàng của tôi</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * 
 * @returns {void}
 */
function initializationArticle__OrderInfo() {
    // const { page, query } = urlConverter(location.hash);
    const article = document.getElementById('article');
    if (!article) return;

    article.className = "user-package";
    // 'doixacnhan' | 'daxacnhan' | 'danggiaohang' | 'giaohangthanhcong' | 'huy'
    article.innerHTML = `
        <div class="package-category">
            <div class = "package-category-header selected" data-state="all">Tất cả</div>
            <div class = "package-category-header" data-state="doixacnhan">Chờ xử lý</div>
            <div class = "package-category-header" data-state="daxacnhan">Đã xác nhận</div>
            <div class = "package-category-header" data-state="danggiaohang">Vận chuyển</div>
            <div class = "package-category-header" data-state="giaohangthanhcong">Đã giao</div>
            <div class = "package-category-header" data-state="huy">Đã hủy</div>
        </div>
        <div class="package-search">
            <label class="input-search">
                <div class="icon-input"><i class="fa-solid fa-magnifying-glass"></i></div>
                <input type="text" placeholder="Tìm kiếm theo tên sản phẩm, Mã đơn hàng">
            </label>
        </div>
        <div class="no-order hide">
            <img src="../assets/img/no-order.png">
            <h3>Không có đơn hàng nào</h3>
        </div>
        <div class="package-content">
        </div>
            `;
    renderOrder();
    const package_catagory = /**@type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.package-category-header'));
    package_catagory.forEach(catagory => {
        catagory.addEventListener('click', e => {
            renderOrder(catagory.dataset.state);
            package_catagory.forEach(e => { e.classList.remove('selected') });
            catagory.classList.add('selected');
        });
    });
    const search_input = /**@type {HTMLInputElement} */ (document.querySelector('.input-search input'));
    if (search_input) {
        search_input.addEventListener('input', e => {
            const search_value = removeDiacritics(search_input.value);
            document.querySelectorAll('.package-details').forEach(detail => {
                const order_id = detail.querySelector('.package-details__id span')?.textContent;
                const order_title = detail.querySelector('.package-details__title')?.textContent;
                if (!order_id || !order_title) return;
                if (removeDiacritics(order_id).includes(search_value) || removeDiacritics(order_title).includes(search_value)) {
                    /**@type {HTMLElement} */ (detail).style.display = 'block';
                } else {
                    /**@type {HTMLElement} */ (detail).style.display = 'none';
                }
            });
        });
    }
}

/**
 * 
 * @returns {void}
 */
function initializationArticle__AccountInfo() {
    const article = document.getElementById('article');
    const user_id = localStorage.getItem('user_id');
    if (!article || !user_id) return;
    article.className = "user-personal-info";
    article.innerHTML = `
            <div class="article-header">
                <span>Hồ sơ người mua hàng</span>
            </div>
            <hr>
            <div class="user-personal__container">
                
            </div>
        `;
    const user_container = /**@type {HTMLElement}*/(document.querySelector('.user-personal__container'));

    renderUserInfo(user_id).then(data => {
        if (user_container) user_container.innerHTML = data;
    })

}
async function initializationArticle__AddressInfo() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        toast({ title: 'Lỗi', message: 'Vui lòng đăng nhập để xem thông tin địa chỉ', type: 'error' });
        return '';
    }
    const address_data = (await fakeDatabase.getUserInfoByUserId(user_id))?.address;
    const article = document.getElementById('article');
    if (!article || address_data == undefined) return;
    article.className = "user-personal-info";
    article.innerHTML = `
            <div class="article-header">
                <span>Địa chỉ của tôi</span>
                <label>
                    <i class="fa-regular fa-plus"></i>
                    <button class="btn-add-address">Thêm địa chỉ mới</button>
                </label>
            </div>
            <hr>
            <div class="user-address">
                <div class="user-all-address">
            </div>
        `;
    await renderAddressInfo(address_data);
    const btn_add_address = document.querySelector('.btn-add-address');
    const containers = document.querySelectorAll('.user-address__container');
    const all_address = document.querySelector('.user-all-address');
    if (!btn_add_address || !containers) return;
    // ấn thêm địa chỉ
    btn_add_address.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        // hiện popup cho nhập địa chỉ
        showShippingFromeAddressPopup(async (address, bool) => {
            if (bool)
                address_data.unshift(address);
            else
                address_data.push(address);
            await fakeDatabase.updateUserAddress(user_id, address_data);
            initializationArticle__AddressInfo();
            return;
        }, () => { });
    });
    containers.forEach((container, index) => {
        // nhấn cập nhật địa chỉ
        container.querySelector('.update-address')?.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            showShippingFromeAddressPopup(async (address, bool) => {
                address_data[index] = address;
                if (bool) { [address_data[0], address_data[index]] = [address_data[index], address_data[0]]; }
                await fakeDatabase.updateUserAddress(user_id, address_data);
                initializationArticle__AddressInfo();
                return;
            }, () => { }, address_data[index], index === 0);
        });
        container.querySelector('.delete-address')?.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            address_data.splice(index, 1);
            await fakeDatabase.updateUserAddress(user_id, address_data);
            initializationArticle__AddressInfo();
        });
        container.querySelector('.set-default-btn')?.addEventListener('click', async (ev) => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            [address_data[0], address_data[index]] = [address_data[index], address_data[0]];
            await fakeDatabase.updateUserAddress(user_id, address_data);
            initializationArticle__AddressInfo();
        });
    });
}


/**
 * event khi click vào thông tin người dùng
 */
function switchTab() {
    const user_option = /**@type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.info-tab'));
    user_option.forEach(option => {
        option.addEventListener('click', () => {
            navigateToPage('user/' + option.dataset.value);
        });
    });
}
/**
 * 
 * khởi tạo trang thông tin người dùng
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 * @returns {Promise<void>}
 */
export async function initializationUserInfoPage(params, query) {

    const user_id = localStorage.getItem('user_id');
    if (!user_id) { navigateToPage('home'); return; }

    const personal_info_data = await fakeDatabase.getUserInfoByUserId(user_id);
    const cssRep = await fetch('./assets/css/user_info.css');
    const style = document.createElement('style');
    style.textContent = await cssRep.text();
    style.id = 'user-info-style'
    document.head.appendChild(style);

    if (!personal_info_data) {
        navigateToPage('home');
        return;
    }

    updateCartQuantity();
    initializationMain();
    initializationAside(personal_info_data);
    switchTab();
}


/**
 * @param {{[key: string]: string}} params 
 * @param {URLSearchParams} query
 * @returns {Promise<void>}
 */
export async function updateUserInfoPage(params, query) {
    const tab = params.tab || 'account';

    const more_option = /**@type {HTMLElement} */ (document.querySelector('.user-info-tab .info-tab__more'));
    const allTabs = /**@type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.info-tab'));
    if (!more_option || !allTabs) return;
    allTabs.forEach(e => e.classList.remove('selected'));
    switch (tab) {
        case 'account':
            {
                more_option.style.display = 'flex';
                const info = params.info || 'profile';
                switch (info) {
                    case 'address':
                        allTabs[2].classList.add('selected');
                        initializationArticle__AddressInfo();
                        break;
                    case 'profile':
                        allTabs[1].classList.add('selected');
                        initializationArticle__AccountInfo();
                        break;
                    default:
                        errorPage(404);
                }
                break;
            }
        case 'purchase':
            more_option.style.display = 'none';
            allTabs[3].classList.add('selected');
            initializationArticle__OrderInfo();
            break;
        default:
            errorPage(404);
    }
}

/**
 * @param {{[key: string]: string}} params 
 * @param {URLSearchParams} query
 * @returns {Promise<void>}
 */
export async function removeUserInfoPage(params, query) {
    document.getElementById('user-info-style')?.remove();
}