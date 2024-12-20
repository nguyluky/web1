import fakeDatabase from '../db/fakeDBv1.js';
import { createImgPreviewPopup, createOrderIdList, createOrderPopup, createPopupBase } from './popupFactory.js';

function getPopupWrapper(id = 'popup-wrapper') {
    let parder = document.getElementById(id);
    if (!parder) {
        parder = document.createElement('div');
        parder.id = id;
        document.body.appendChild(parder);
    }
    return parder;
}

/**
 *
 * @param {HTMLElement} popup
 * @param {() => any} [onClose]
 * @returns {(this: HTMLElement, ev: MouseEvent) => any}
 */
export function HandleClickOutSideBuilder(popup, onClose) {
    /**
     *
     * @this {HTMLElement}
     * @param {MouseEvent} event
     */
    function handleClickOutSide(event) {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.isSameNode(popup) || !target.contains(popup)) return;
        target?.removeEventListener('click', handleClickOutSide);
        this.innerHTML = '';
        if (onClose) onClose();
    }
    return handleClickOutSide;
}

/**
 * Tạo và hiển thị một popup xác nhận.
 *
 * @param {string} title - Tiêu đề của popup.
 * @param {string} context - Nội dung của popup.
 * @param {() => void} [onOk] - Hàm gọi lại khi người dùng nhấn OK.
 * @param {() => void} [onCancel] - Hàm gọi lại khi người dùng nhấn Cancel.
 * @param {() => void} [onClose] - Khi nhấn thoát
 */
export function showPopup(title, context, onOk, onCancel, onClose) {
    const parder = getPopupWrapper();
    if (parder.querySelector('.popup')) return;
    const onCloseDeclaration = () => {
        parder.innerHTML = '';
        if (onClose) onClose();
    };
    const onCancelDeclaration = () => {
        parder.innerHTML = '';
        if (onCancel) onCancel();
    };

    const onOkDeclaration = () => {
        parder.innerHTML = '';
        if (onOk) onOk();
    };

    const popup = createPopupBase(
        title,
        context,
        onOkDeclaration,
        onCancelDeclaration,
        onCloseDeclaration,
    );

    parder.appendChild(popup);

    parder.addEventListener(
        'click',
        HandleClickOutSideBuilder(popup, onCloseDeclaration),
    );
}

/**
 * @param {string} imgSrc
 * @param {(base64: string) => void} [onChangeImg]
 * @param {(base64: string) => void} [onOk]
 * @param {() => void} [onCancel]
 * @param {() => void} [onClose]
 */
export function showImgPreviewPopup(
    imgSrc,
    onChangeImg,
    onOk,
    onCancel,
    onClose,
) {
    const parder = getPopupWrapper();

    const onChangeImgDeclaration = (base64) => {
        if (onChangeImg) onChangeImg(base64);
    };

    const onOkDeclaration = (base64) => {
        parder.innerHTML = '';
        if (onOk) onOk(base64);
    };

    const onCancelDeclaration = () => {
        parder.innerHTML = '';
        if (onCancel) onCancel();
    };

    const onCloseDeclaration = () => {
        parder.innerHTML = '';
        if (onClose) onClose();
    };

    const popup = createImgPreviewPopup(
        imgSrc,
        onChangeImgDeclaration,
        onOkDeclaration,
        onCancelDeclaration,
        onCloseDeclaration,
    );

    parder.appendChild(popup);

    parder.addEventListener(
        'click',
        HandleClickOutSideBuilder(popup, onCancelDeclaration),
    );
}

/**
 * @param {{title?: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error', duration?: number}} param0
 */
export function toast({
    title = '',
    message = '',
    type = 'info',
    duration = 3000,
}) {
    const main = document.getElementById('toast');
    if (main) {
        const toast = document.createElement('div');

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (/**@type {HTMLElement}*/ (e.target).closest('.toast__close')) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: 'fas fa-check-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-circle',
            error: 'fas fa-exclamation-circle',
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInRight ease .7s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                      <div class="toast__icon">
                          <i class="${icon}"></i>
                      </div>
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                          <i class="fas fa-times"></i>
                      </div>
                  `;
        main.appendChild(toast);
    }
}
/**
 * 
 * @param {string | import('../until/type.js').Order} order 
 */
export async function showOrderPopup(order) {
    let order_;
    if (typeof order === 'string') {
        order_ = await fakeDatabase.getOrderById(order);
    } else {
        order_ = order;
    }
    const btnSave = document.getElementById('save-btn');
    if (btnSave && btnSave.classList.contains('canedit')) return;
    const parder = getPopupWrapper('info-wrapper')
    const popup = createPopupBase(
        `Đơn hàng #${order_?.id.toUpperCase()}`,
        createOrderPopup(order_),
        undefined,
        undefined,
        () => { parder.removeChild(popup) });
    parder.appendChild(popup);

    parder.addEventListener(
        'click',
        (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            if (target.isSameNode(popup) || !target.contains(popup)) return;
            parder.removeChild(popup);
        }
    );
}

export function showOrderIdList(orders, name, forUser = true) {
    const parder = getPopupWrapper('info-wrapper')
    const popup = createPopupBase(
        'Danh sách mã đơn',
        createOrderIdList(orders, name, forUser),
        undefined,
        undefined,
        () => { parder.innerHTML = '' });
    parder.appendChild(popup);

    parder.addEventListener(
        'click',
        (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            if (target.isSameNode(popup) || !target.contains(popup) || parder.childNodes.length !== 1) return;
            parder.removeChild(popup);
        }
    );
}