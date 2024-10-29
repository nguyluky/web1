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
 *
 * @param {HTMLElement} popup
 * @param {() => any} [onCancel]
 * @returns {(this: HTMLElement, ev: MouseEvent) => any}
 */
function HandleClickOutSideBuilder(popup, onCancel) {
    /**
     *
     * @this {HTMLElement}
     * @param {MouseEvent} event
     */
    function handleClickOutSide(event) {
        const target = /** @type {HTMLElement} */ (event.target);

        console.log('click');

        if (target.isSameNode(popup) || !target.contains(popup)) return;
        target?.removeEventListener('click', handleClickOutSide);
        this.innerHTML = '';
        if (onCancel) onCancel();
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
 */
export function showPopup(title, context, onOk, onCancel) {
    const parder = getPopupWrapper();

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
    );

    parder.appendChild(popup);

    parder.addEventListener(
        'click',
        HandleClickOutSideBuilder(popup, onCancelDeclaration),
    );
}

/**
 * @param {string} imgSrc
 * @param {(base64: string) => void} [onChangeImg]
 * @param {(base64: string) => void} [onOk]
 * @param {() => void} [onCancel]
 */
export function showImgPreviewPopup(imgSrc, onChangeImg, onOk, onCancel) {
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

    const popup = createImgPreviewPopup(
        imgSrc,
        onChangeImgDeclaration,
        onOkDeclaration,
        onCancelDeclaration,
    );

    parder.appendChild(popup);

    parder.addEventListener(
        'click',
        HandleClickOutSideBuilder(popup, onCancelDeclaration),
    );
}
