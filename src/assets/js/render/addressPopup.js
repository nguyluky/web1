import fakeDatabase from "../db/fakeDBv1.js";
import { text2htmlElement } from "../until/format.js";
import { AddressFrom } from "./address.js";


/**
 * 
 * @param {MouseEvent} e 
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
function isClickOutSide(e, element) {
    const taget =  /** @type {HTMLElement | null} */ (e.target);

    if (!taget) {
        return true;
    }


    const clickInSide = taget.isSameNode(element) || element.contains(taget);
    return !clickInSide;
}


/**
 * 
 * @param {import("../until/type").UserAddress | undefined} data 
 * @param {(newAddress: import("../until/type").UserAddress) => Promise<any>} onOk 
 * @param {() => any} onCancle
 * @returns {void}
 */
export function showNewShippingAddressPopup(data, onOk, onCancle) {
    const html = `<div class="popup">
        <button class="btn-close">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="popup-header">
            <h3>Add new shipping Address</h3>
            <!-- <div class="popup-mess">
                Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao
                hàng cùng phí đóng gói, vận chuyển một cách chính xác
                nhất.
            </div> -->
        </div>
        <div class="popup-body">
            <form
                action=""
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    justify-content: center;
                    padding: 30px;
                    background: #fff;
                    border-radius: 5px;
                "
            >
                <label class="ct-input">
                    <input type="text" placeholder="Họ và Tên" name="name" required/>
                    <span class="form-error"></span>
                </label>

                <div class="group-flex">
                    <label class="ct-input">
                        <input
                            required
                            type="text"
                            placeholder="Số điện thoại"
                            name="phone_num"
                        />
                        <span class="form-error"></span>
                    </label>
                    <label class="ct-input">
                        <input type="text" placeholder="Email" name="email"/>
                        <span class="form-error"></span>
                    </label>
                </div>

                <label class="ct-input">
                    <input type="text" placeholder="Địa chỉ" name="street" required/>
                    <span class="form-error"></span>
                </label>

                <div class="group-flex">
                    <label>
                        <address-form
                            required
                            type="TTP"
                            placeholder="Tỉnh/Thành Phố"
                            name="pay_address"
                        ></address-form>
                        <span class="form-error"></span>
                    </label>
                    <label>
                        <address-form
                            required
                            type="QH"
                            placeholder="Quận/Huyện"
                            name="pay_address"
                        ></address-form>
                        <span class="form-error"></span>
                    </label>
                    <label>
                        <address-form
                            required
                            type="PX"
                            placeholder="Phường/Xã"
                            name="pay_address"
                        ></address-form>
                        <span class="form-error"></span>
                    </label>
                </div>
            </form>
        </div>
        <div class="popup-button">
            <button class="button_1 cancel">CANCEL</button>
            <button class="button_1 btn-danger ok">OK</button>
        </div>
    </div>`;

    const element = /**@type {HTMLElement} */ (text2htmlElement(html.trim()));

    if (!element) {
        return;
    }

    const popupWrapper = document.getElementById('popup-wrapper');
    popupWrapper?.appendChild(element);

    /**
     * 
     * @param {MouseEvent} ev 
     */
    function ev_(ev) {
        if (isClickOutSide(ev, element)) {
            element.remove();
            document.removeEventListener('click', ev_);
            onCancle();
        }
    }

    element.querySelector('.cancel')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        element.remove();
        onCancle();
    });


    element.querySelector('.ok')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();


        const from = /**@type {HTMLFormElement} */ (element.querySelector('form'));

        if (!from) { return; }

        const isValid = Array.from(from.elements).some((el) => {
            // @ts-ignore
            return !el.reportValidity();
        });

        if (isValid) {
            return;
        }

        const name = /**@type {HTMLInputElement} */ (document.getElementsByName('name')[0]);
        const phone_num = /**@type {HTMLInputElement} */ (document.getElementsByName('phone_num')[0]);
        const email = /**@type {HTMLInputElement} */ (document.getElementsByName('email')[0]);
        const street = /**@type {HTMLInputElement} */ (document.getElementsByName('street')[0]);
        const pay_address = /**@type {NodeListOf<AddressFrom>}*/ (document.getElementsByName('pay_address'));



        const address = {
            name: name.value,
            phone_num: phone_num.value,
            email: email.value,
            street: street.value,
            address: Array.from(pay_address).map((el) => el.value).join(' - ')
        }

        console.log(address);

        onOk(address).then(() => {
            element.remove();
        });
    })

    element.querySelector('.btn-close')?.addEventListener('click', () => {
        element.remove();
        onCancle();
    });
    document.addEventListener('click', ev_);

}

/**
 * 
 * @param {import("../until/type").UserAddress} address
 * @returns {HTMLElement | null}
 */
export function createAddressItem(address) {
    const html = `
    <div class="shipping-info__item">
        <div class="info">
            <div class="name">
                ${address.name}
                <span><span>Địa chỉ mặc định</span></span>
            </div>
            <div class="address">
                <span>Địa chỉ: </span>${address.street}, ${address.address.replace(/ - /g, ', ')}
            </div>
            <div class="phone">
                <span>Điện thoại: </span>${address.phone_num}
            </div>
        </div>
        <div class="action">
            Chỉnh sửa
        </div>
    </div>`

    return text2htmlElement(html.trim());
}


/**
 * 
 * @returns {void}
 */
export function showListShippingAddressPopup() {
    const html = `
        <div class="popup">
            <button class="btn-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="popup-header">
                <h3>Thông Tin giao hàng</h3>
                <div class="popup-mess">
                    Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao
                    hàng cùng phí đóng gói, vận chuyển một cách chính xác
                    nhất.
                </div>
            </div>
            <div class="popup-body">
                <div>
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

                        <p style="margin-left: 10px">Đang tải dữ liệu</p>
                    </div>
                </div>
            </div>
            <div class="popup-button">
                <button class="button_1">CANCEL</button>
                <button class="button_1 btn-danger">
                    GIAO ĐẾN ĐỊA CHỈ NÀY
                </button>
            </div>
        </div>`

    const element = /**@type {HTMLElement} */ (text2htmlElement(html.trim()));

    if (!element) {
        return;
    }

    const popupBody = element.querySelector('.popup-body');

    if (!popupBody) {
        return;
    }

    const userId = localStorage.getItem('user_id');

    if (!userId) {
        alert('Bạn cần đăng nhập để xem thông tin địa chỉ');
        return
    }

    document.querySelector('#popup-wrapper')?.appendChild(element);

    /**
     * 
     * @param {MouseEvent} ev 
     */
    function ev_(ev) {
        if (isClickOutSide(ev, element)) {
            if (element.style.display === 'none') return;
            element.remove();
            document.removeEventListener('click', ev_);
        }
    }

    element.querySelector('.btn-close')?.addEventListener('click', () => {
        element.remove();
    });
    document.addEventListener('click', ev_);

    fakeDatabase.getUserInfoByUserId(userId).then((userInfo) => {
        console.log(userInfo)
        if (!userInfo) {
            return;
        }

        const addressList = userInfo.address || [];

        if (!addressList) {
            return;
        }

        popupBody.innerHTML = `
        <div class="select">
            <div class="shipping-info__new">
                <span>Thêm địa chỉ mới</span>
            </div>
        </div>`;

        const select = popupBody.querySelector('.select');

        const shippingInfoNew = popupBody.querySelector('.shipping-info__new');

        shippingInfoNew?.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            console.log('click')

            element.style.display = 'none';
            showNewShippingAddressPopup(undefined, async (address) => {
                await fakeDatabase.addUserAddress(userId, address)
                element.style.display = '';

                const addressItem = createAddressItem(address);
                if (addressItem)
                    select?.insertBefore(addressItem, shippingInfoNew);

            }, () => {
                element.style.display = '';
            });
        });



        addressList.forEach((address) => {
            const addressItem = createAddressItem(address);
            if (addressItem)
                select?.insertBefore(addressItem, shippingInfoNew);
        })
    })
}