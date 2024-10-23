import { createImgPreviewPopup, createPopupBase } from './popupFactory.js';

function getPopupWrapper() {
    let parder = document.getElementById('popup-wrapper');
    if (!parder) {
        parder = document.createElement('div');
        parder.id = 'popup-wrapper';
        document.body.appendChild(parder);
    }
    return parder;
}

/**
 * Tạo và hiển thị một popup xác nhận.
 *
 * @param {string} title - Tiêu đề của popup.
 * @param {string} context - Nội dung của popup.
 * @param {(() => void)?} onOk - Hàm gọi lại khi người dùng nhấn OK.
 * @param {(() => void)?} onCancel - Hàm gọi lại khi người dùng nhấn Cancel.
 */
export function showPopup(title, context, onOk, onCancel) {
    const parder = getPopupWrapper();
    const popup = createPopupBase(
        title,
        context,
        () => {
            parder.innerHTML = '';
            if (onOk) onOk();
        },
        () => {
            parder.innerHTML = '';
            if (onCancel) onCancel();
        },
    );

    parder.appendChild(popup);

    parder.onclick = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.contains(popup)) {
            parder.innerHTML = '';
            if (onCancel) onCancel();
        }
    };
}

/**
 * @param {string} imgSrc
 * @param {((base64: string) => void)?} onChangeImg
 * @param {((base64: string) => void)?} onOk
 * @param {(() => void)?} onCancel
 */
export function showImgPreviewPopup(imgSrc, onChangeImg, onOk, onCancel) {
    const parder = getPopupWrapper();
    const popup = createImgPreviewPopup(
        imgSrc,
        onChangeImg,
        (base64) => {
            parder.innerHTML = '';
            if (onOk) onOk(base64);
        },
        () => {
            parder.innerHTML = '';
            if (onCancel) onCancel();
        },
    );

    parder.appendChild(popup);

    parder.onclick = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.contains(popup)) {
            parder.innerHTML = '';
            if (onCancel) onCancel();
        }
    };
}
