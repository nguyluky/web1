import fakeDatabase from "../db/fakeDBv1.js";
import { method } from "../pages/user-info/index.js";
import { dateToString, formatNumber } from "../until/format.js";
import { showOrderPopup } from "./popupRender.js";

/**
 * @param {string} title
 * @param {string | HTMLElement} context
 * @param {(() => void)} [onOk]
 * @param {(() => void)} [onCancel]
 * @param {(() => void)} [onClose]
 * @returns {HTMLDivElement}
 */
export function createPopupBase(title, context, onOk, onCancel, onClose) {
    // Create the main popup div
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Create the header
    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    const title_ = document.createElement('h1');
    title_.innerHTML = title;

    const xMark = document.createElement('button');
    xMark.className = 'button_1';
    xMark.onclick = onClose || null;
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    xMark.appendChild(closeIcon);

    // Append header elements
    popupHeader.appendChild(title_);
    popupHeader.appendChild(xMark);
    popup.appendChild(popupHeader);

    // Create the context
    const popupContext = document.createElement('div');
    popupContext.className = 'popup-context';
    if (typeof context === 'string') popupContext.textContent = context;
    else popupContext.appendChild(context);
    popup.appendChild(popupContext);

    // Create the footer
    const popupFooter = document.createElement('div');
    popupFooter.className = 'popup-footer';

    if (onOk) {
        const okButton = document.createElement('button');
        okButton.className = 'button_1 btn-primary';
        okButton.textContent = 'Lưu';
        okButton.onclick = onOk;
        popupFooter.appendChild(okButton);
    }

    if (onCancel) {
        const cancelButton = document.createElement('button');
        cancelButton.className = 'button_1 btn-ouline-primary';
        cancelButton.textContent = 'Bỏ';
        cancelButton.onclick = onCancel;
        popupFooter.appendChild(cancelButton);
    }

    if (onClose) {
        const closeButton = document.createElement('button');
        closeButton.className = 'button_1 btn-ouline-primary';
        closeButton.textContent = 'Thoát';
        closeButton.onclick = onClose;
        popupFooter.appendChild(closeButton);
    }

    popup.appendChild(popupFooter);

    return popup;
}

/**
 * @param {string} imgSrc
 * @param {((base64: string) => void)?} onChangeImg
 * @param {((base64: string) => void)?} onOk
 * @param {(() => void)?} onCancel
 * @param {(() => void)?} onClose
 * @returns {HTMLDivElement}
 */
export function createImgPreviewPopup(
    imgSrc,
    onChangeImg,
    onOk,
    onCancel,
    onClose,
) {
    let isChange = false;

    const imgPreviewWrapper = document.createElement('div');
    imgPreviewWrapper.setAttribute('class', 'img-preview-wrapper');

    const imgPreview = document.createElement('img');
    imgPreviewWrapper.appendChild(imgPreview);
    imgPreview.src = imgSrc;

    const buttonUpload = document.createElement('label');
    buttonUpload.setAttribute('class', 'file-upload-btn');
    imgPreviewWrapper.appendChild(buttonUpload);

    const icon = document.createElement('i');
    icon.setAttribute('class', 'fa-solid fa-file-arrow-up');
    buttonUpload.appendChild(icon);

    const text = document.createElement('span');
    buttonUpload.appendChild(text);
    text.textContent = 'Upload Image';

    // const clearButton =

    const inputUpload = document.createElement('input');
    inputUpload.setAttribute('type', 'file');
    inputUpload.setAttribute('id', 'img');
    inputUpload.setAttribute('accept', 'image/*');
    buttonUpload.appendChild(inputUpload);

    inputUpload.addEventListener('change', () => {
        let file = inputUpload.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                isChange = true;
                imgPreview.src = /** @type {string} */ (event.target?.result);
                if (onChangeImg) onChangeImg(imgPreview.src);
            };

            reader.readAsDataURL(file);
        }
    });

    const popup = createPopupBase(
        'Upload Image',
        imgPreviewWrapper,
        () => {
            onOk?.(isChange ? imgPreview.src : '');
        },
        onCancel || undefined,
        onClose || undefined,
    );

    return popup;
}

/**
 *
 */
export function createCategoryPopup() { }
/**
 * 
 * @param {import("../until/type").Order | undefined} order
 */
export function createOrderPopup(order) {
    console.log('order popup', order?.id);
    const container = document.createElement('div');
    container.className = 'order-info-container';

    if (!order) {
        container.textContent = 'Không tìm thấy đơn hàng';
        return container;
    }
    const header = document.createElement('div');
    header.className = 'order-info-header';
    container.appendChild(header);

    const top = document.createElement('div');
    top.className = 'order-info-header__top';
    header.appendChild(top);
    top.innerHTML = `
        <div>
            <span>Mã KH: </span>
            <span>${order.user_id}</span>
        </div>
        <div>
            <span>Ngày đặt: </span>
            <span>${dateToString(order.date, 'vi-VN', true)}</span>
        </div>`

    const bottom = document.createElement('div');
    bottom.className = 'order-info-header__bottom';
    header.appendChild(bottom);
    const address = order?.address;
    bottom.innerHTML = `
        <span>Giao đến: </span>
        <div>
            <span><b>${address.name}</b> ${address.phone_num}</span>
            <div>
                <span>${address.street}</span>
                <br/>
                <span>${address.address.replaceAll(/ - /g, ", ")}</span>
            </div>
        </div>`

    const body = document.createElement('div');
    body.className = 'order-info-body';
    container.appendChild(body);

    const bill_header = document.createElement('div');
    bill_header.className = 'bill__header';
    body.appendChild(bill_header);
    bill_header.innerHTML = `
        <div><b>SL</b></div>
        <div><b>Giá bán</b></div>
        <div><b>T.Tiền</b></div>`

    const bill_body = document.createElement('div');
    bill_body.className = 'bill__body';
    body.appendChild(bill_body);
    order.items.forEach(async (product) => {
        const book = await fakeDatabase.getSachById(product.sach);
        if (!book) return;
        const item = document.createElement('div');
        item.className = 'bill__item';
        bill_body.appendChild(item);
        item.innerHTML = `
            <div>${book.title}</div>
            <div>
                <div>${product.quantity}</div>
                <div>${formatNumber(book.base_price * (1 - book.discount))}</div>
                <div>${formatNumber(product.total)}</div>
            </div>`
    });
    const bill_total = document.createElement('div');
    bill_total.className = 'bill__total';
    body.appendChild(bill_total);
    bill_total.innerHTML = `
        <div>
            <span>Tổng cộng:</span>
            <span>${formatNumber(order.total)}</span>
        </div>
        <div>
            <span>Phí vận chuyển:</span>
            <span>${formatNumber(10000)}</span>
        </div>`
    const bill_footer = document.createElement('div');
    bill_footer.className = 'bill__footer';
    body.appendChild(bill_footer);

    bill_footer.innerHTML = `
        <div>
            <span><b>Phải thanh toán:</b></span>
            <span><b>${formatNumber(order.total + 10000)}<sup>đ</sup></b></span>
        </div>
        <div>
            <span>Phương thức thanh toán:</span>
            <span>${method[order.payment_method]}</span>
        </div>
        `

    return container;
}
/**
 * Tạo danh sách các mã đơn của khách hàng hoặc của sách
 * @param {string[]} orders danh sách mã đơn hàng
 * @returns {HTMLElement | string} 
 */
export function createOrderIdList(orders, name, forUser = true) {
    if (!orders) {
        return 'Không tìm thấy đơn hàng';
    }
    const container = document.createElement('div');
    container.className = 'order-list';
    container.innerHTML = `
        <div class="order-list__header">${forUser ? 'Khách hàng' : 'Sản phẩm'} ${name}</div>
        <div class="order-list__manual">Vui lòng chọn mã đơn để xem chi tiết đơn hàng</div>
        `;
    orders.forEach((order) => {
        const item = document.createElement('div');
        item.className = 'order-list__item';
        item.textContent = 'MÃ ĐƠN: ' + order;
        container.appendChild(item);
        item.addEventListener('click', () => {
            const popup = container.parentElement?.parentElement;
            if (!popup) return;
            popup.style.cssText = 'position: absolute; z-index: -1;';
            showOrderPopup(order);
        })
    });
    return container;
}