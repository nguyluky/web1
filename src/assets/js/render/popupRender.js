/**
 * @param {string} title
 * @param {string} context
 * @param {(() => void)?} onOk
 * @param {(() => void)?} onCancel
 * @returns {HTMLDivElement}
 */
export function createPopupBase(title, context, onOk, onCancel) {
    // Create the main popup div
    const popup = document.createElement('div');
    popup.className = 'popup';

    // Create the header
    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';

    const title_ = document.createElement('h1');
    title_.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.className = 'button_1';
    closeButton.onclick = onCancel;
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeButton.appendChild(closeIcon);

    // Append header elements
    popupHeader.appendChild(title_);
    popupHeader.appendChild(closeButton);
    popup.appendChild(popupHeader);

    // Create the context
    const popupContext = document.createElement('div');
    popupContext.className = 'pupop-context';
    popupContext.textContent = context;
    popup.appendChild(popupContext);

    // Create the footer
    const popupFooter = document.createElement('div');
    popupFooter.className = 'popup-footer';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'button_1 btn-primary';
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = onCancel;

    const okButton = document.createElement('button');
    okButton.className = 'button_1 btn-ouline-primary';
    okButton.textContent = 'OK';
    okButton.onclick = onOk;

    // Append footer elements
    popupFooter.appendChild(cancelButton);
    popupFooter.appendChild(okButton);
    popup.appendChild(popupFooter);

    return popup;
}

export function showImgPreviewPopup(imgSrc) {
    const popup = document.createElement('div');
    popup.id = 'img-preview-popup';

    const img = document.createElement('img');
    img.src = imgSrc;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'button_1';
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => {
        popup.remove();
    };

    popup.appendChild(img);
    popup.appendChild(closeBtn);

    document.body.appendChild(popup);
}
