/**
 * @param {string} title
 * @param {string | HTMLElement} context
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
    if (typeof context === 'string') popupContext.textContent = context;
    else popupContext.appendChild(context);
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

/**
 * @param {string} imgSrc
 * @param {((base64: string) => void)?} onChangeImg
 * @param {((base64: string) => void)?} onOk
 * @param {(() => void)?} onCancel
 * @returns {HTMLDivElement}
 */
export function createImgPreviewPopup(imgSrc, onChangeImg, onOk, onCancel) {
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
        onCancel,
    );

    return popup;
}

/**
 *
 */
export function createCategoryPopup() {}
