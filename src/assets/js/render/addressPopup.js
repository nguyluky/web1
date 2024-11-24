import fakeDatabase from "../db/fakeDBv1.js";
import { showUserAddressInfo } from "../pages/cart/cart.js";
import { text2htmlElement } from "../until/format.js";
import { validateEmail, validateNumberPhone } from "../until/validator.js";
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
 * // mới sửa lại hàm, nếu có data thì hiện lên form với dữ liệu đó
 * 
 * @param {(newAddress: import("../until/type").UserAddress, setDefault: boolean) => Promise<any>} onOk 
 * @param {() => any} onCancle
 * @param {import("../until/type").UserAddress} [data]
 * @param {boolean} [isDefault = false]
 * @returns {void}
 */
export function showShippingFromeAddressPopup(onOk, onCancle, data, isDefault = false) {
    const html = `<div class="popup">
        <button class="btn-close">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="popup-header">
            ${data ? '<h3>Thêm địa chỉ giao hàng mới</h3>' : '<h3>Cập nhật địa chỉ giao hàng</h3>'}
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
                </label>

                <div class="group-flex">
                    <label class="ct-input phone">
                        <div>
                            <input
                                required
                                type="text"
                                placeholder="Số điện thoại"
                                name="phone_num"
                            />
                        </div>
                    </label>
                    <label class="ct-input email">
                        <div><input type="text" placeholder="Email" name="email"/></div>
                    </label>
                </div>

                <label class="ct-input">
                    <input type="text" placeholder="Địa chỉ" name="street" required/>
                </label>

                <div class="group-flex">
                    <label>
                        <address-form
                            required
                            type="TTP"
                            placeholder="Tỉnh/Thành Phố"
                            name="pay_address"
                        ></address-form>
                    </label>
                    <label>
                        <address-form
                            required
                            type="QH"
                            placeholder="Quận/Huyện"
                            name="pay_address"
                        ></address-form>
                    </label>
                    <label>
                        <address-form
                            required
                            type="PX"
                            placeholder="Phường/Xã"
                            name="pay_address"
                        ></address-form>
                    </label>
                </div>
                ${isDefault ? '' : '<label class="set-default"><input type = "checkbox"/><span>Đặt làm địa chỉ mặc định</span></label>'}
            </form >
        </div >
        <div class="popup-button">
            <button class="button_1 cancel">CANCEL</button>
            <button class="button_1 btn-danger ok">OK</button>
        </div>
    </div > `;

    const element = /**@type {HTMLElement} */ (text2htmlElement(html.trim()));

    if (!element) {
        return;
    }

    const popupWrapper = document.getElementById('popup-wrapper');
    popupWrapper?.appendChild(element);

    const name = /**@type {HTMLInputElement} */ (document.getElementsByName('name')[0]);
    const phone_num = /**@type {HTMLInputElement} */ (document.getElementsByName('phone_num')[0]);
    const email = /**@type {HTMLInputElement} */ (document.getElementsByName('email')[0]);
    const street = /**@type {HTMLInputElement} */ (document.getElementsByName('street')[0]);
    const pay_address = /**@type {NodeListOf<AddressFrom>}*/ (document.getElementsByName('pay_address'));

    if (data) {
        name.value = data.name;
        phone_num.value = data.phone_num;
        email.value = data.email;
        street.value = data.street;
        const address = data.address.split(' - ');
        pay_address[0].value = address[0];
        pay_address[1].value = address[1];
        pay_address[2].value = address[2];
    }
    console.log(pay_address[0].value, pay_address[1].value, pay_address[2].value);
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


        const form = /**@type {HTMLFormElement} */ (element.querySelector('form'));

        if (!form) { return; }

        let isValid = Array.from(form.elements).some((el) => {
            // @ts-ignore
            return !el.reportValidity();
        });

        console.log(isValid);

        if (!validateNumberPhone(phone_num.value)) {
            phone_num.setCustomValidity("Số điện thoại không đúng định dạng");
            phone_num.reportValidity();
            isValid = true;
        }
        else {
            phone_num.setCustomValidity("");
        }

        if (!validateEmail(email.value) && email.value != '') {
            email.setCustomValidity("Email không đúng định dạng");
            phone_num.reportValidity();
            isValid = true;
        }
        else {
            phone_num.setCustomValidity("");
        }

        if (isValid) {
            // nhập sai thì hiện popup error
            return;
        }

        const address = {
            name: name.value,
            phone_num: phone_num.value,
            email: email.value,
            street: street.value,
            address: Array.from(pay_address).map((el) => el.value).join(' - ')
        }
        const setToDefault = /**@type {HTMLInputElement} */ (document.querySelector('.set-default input'));

        onOk(address, (!data ? setToDefault.checked : true)).then(() => {
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
 * @param {number} [i]
 * @param {boolean} [sl=false] 
 * @returns {HTMLElement | null}
 */
export function createAddressItem(address, i = NaN, sl = false) {
    if (isNaN(i)) {
        i = document.querySelectorAll('.shipping-info__item').length;
    }
    const html = `
        <div class="shipping-info__item ${sl ? 'sladd' : ''}" data-id="${i}" >
        <div class="info">
            <div class="name">
                <span>${address.name}</span><span>${i == 0 ? 'Địa chỉ mặc định' : ''}</span>
            </div>
            <div class="address">
                <span>Địa chỉ: </span>${address.street}, ${address.address.replace(/ - /g, ', ')}
            </div>
            <div class="phone">
                <span>Điện thoại: </span>${address.phone_num}
            </div>
        </div>
        <div class="action">
            <div class="action__update">Cập nhật</div>
            ${i == 0 ? '' : '<div class="action__delete">Xoá</div>'}
        </div>
    </div> `;

    return text2htmlElement(html.trim());
}
/**
 * 
 * @param {import("../until/type").UserAddress} address 
 * @param {Number} i 
 * @returns {void}
 */
export function updateAddressItem(address, i) {
    const item = document.querySelector(`.shipping-info__item[data-id="${i}"]`);
    if (!item) {
        return;
    }
    const name = item.querySelector('.name span');
    const address_ = item.querySelector('.address');
    const phone = item.querySelector('.phone');
    if (!name || !address_ || !phone) {
        return;
    }
    name.textContent = address.name;
    address_.innerHTML = `<span> Địa chỉ: </span > ${address.street}, ${address.address.replace(/ - /g, ', ')} `
    phone.innerHTML = `<span> Điện thoại: </span > ${address.phone_num} `
}
/**
 * @param {number} [indexOfAddress=0] 
 * @param {(index: number) => void} [onOk]
 * @param {() => void} [onCancle]
 * @returns {void}
 */
export function showListShippingAddressPopup(indexOfAddress = 0, onOk, onCancle) {
    const html = `
        <div class="popup" >
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
                <button class="button_1 btn-danger" id="choose-address-btn">
                    GIAO ĐẾN ĐỊA CHỈ NÀY
                </button>
            </div>
        </div> `

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
        return;
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
        <div class="select" >
            <div class="shipping-info__new">
                <span>Thêm địa chỉ mới</span>
            </div>
        </div> `;

        const select = document.querySelector('.popup-body .select');
        const shippingInfoNew = document.querySelector('.popup-body .shipping-info__new');

        addressList.forEach((address, i) => {
            const addressItem = createAddressItem(address, i, i === indexOfAddress);
            if (addressItem)
                select?.insertBefore(addressItem, shippingInfoNew);
        });
        addEvent(userId, addressList, onOk, onCancle);
    })
}

// thêm event cho các nút update, delete, thêm địa chỉ
/**
 * 
 * @param {string} userId 
 * @param {(index: number) => any} [onOk]
 * @param {() => any} [onCancle]
 * @param {import("../until/type").UserAddress[]} addressList 
 */
function addEvent(userId, addressList, onOk, onCancle) {

    const select = document.querySelector('.popup-body .select');
    const element =  /**@type {HTMLElement} */ (document.querySelector('.popup'));
    const shippingInfoNew = document.querySelector('.popup-body .shipping-info__new');
    let addressItems = /**@type {NodeListOf<HTMLElement>} */ (select?.querySelectorAll('.shipping-info__item'));

    shippingInfoNew?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        console.log('click')

        element.style.display = 'none';
        showShippingFromeAddressPopup(async (address, isDefault) => {
            element.remove();
            console.log(isDefault);
            if (isDefault)
                addressList.unshift(address);
            else
                addressList.push(address);
            await fakeDatabase.updateUserAddress(userId, addressList);
            showListShippingAddressPopup();
            return;
        }, () => {
            element.style.display = '';
        });
    });

    // handle chọn địa chỉ
    addressItems?.forEach((item) => {
        item.addEventListener('click', async (ev) => {
            addressItems.forEach((item) => {
                item.classList.remove('sladd');
            })
            item.classList.add('sladd');
        })
        // nếu nhấn update
        item.querySelector('.action__update')
            ?.addEventListener('click', (ev) => {
                //khúc này copy từ trên
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                const index = Number(item.dataset.id);
                console.log(index);
                element.style.display = 'none';
                // hiển thị địa chỉ đang chọn
                showShippingFromeAddressPopup(async (address, bool) => {
                    addressList[index] = address;
                    if (bool) {
                        [addressList[0], addressList[index]] = [addressList[index], addressList[0]];
                        await fakeDatabase.updateUserAddress(userId, addressList);
                        element.remove();
                        showListShippingAddressPopup();
                        return;
                    }

                    await fakeDatabase.updateUserAddress(userId, addressList);
                    element.style.display = '';
                    updateAddressItem(address, index);
                }, () => {
                    element.style.display = '';
                }, addressList[index], index === 0);
            })

        // nếu nhấn xóa
        item.querySelector('.action__delete')
            ?.addEventListener('click', (ev) => {
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                const index = Number(item.dataset.id);
                addressList.splice(index, 1);
                fakeDatabase.updateUserAddress(userId, addressList);
                item.remove();
                addressItems = /**@type {NodeListOf<HTMLElement>} */ (select?.querySelectorAll('.shipping-info__item'));
                addressItems.forEach((item, i) => {
                    item.dataset.id = '' + i;
                })
            })
    })

    // nếu nhấn giao đến địa chỉ
    document.getElementById('choose-address-btn')?.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        const addressItem = /**@type {HTMLElement} */ (select?.querySelector('.shipping-info__item.sladd'));
        if (!addressItem) {
            alert('Bạn chưa chọn địa chỉ');
            return;
        }
        element.remove();
        onOk && onOk(Number(addressItem.dataset.id));
    });
}