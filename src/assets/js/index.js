import fackDatabase from './db/fakeDb.js';

// #region khai bao bien
const btnLocation = document.getElementById('btn-location');
const closePopup = document.getElementById('btn-close');
const popup_wrapper = document.getElementById('popup-wrapper');

const btnAccount = document.getElementById('btn-account');
const modal = document.querySelector('.modal');
const btnExit = document.getElementById('btn-exit');
const modalDemo = document.querySelector('.modal-demo');

const address_display = /**@type {HTMLInputElement}*/ (
    document.getElementById('address_display')
);
const address_form = document.getElementById('Address-form');

// #endregion

/**
 *
 *
 *
 * @param {Promise<string[]>} promiseData
 * @param {string} selector
 * @param {(s: string) => void} [onchange]
 */
function contentRender__(promiseData, selector, onchange) {
    const content = document.querySelector(selector);
    if (content) {
        content.innerHTML = `
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
        </div>
        `;

        promiseData.then((e) => {
            content.innerHTML = '';
            e?.forEach((j, index) => {
                const div = document.createElement('div');
                div.textContent = j || '';
                div.setAttribute('selection', index == 0 ? 'true' : 'false');
                div.addEventListener('click', function () {
                    const parder =
                        this.parentElement?.parentElement?.parentElement;
                    const input = /**@type {HTMLInputElement} */ (
                        parder?.querySelector('.Address__dropdown-btn input')
                    );

                    if (parder) {
                        // sr
                        const nextInput = /**@type {HTMLInputElement} */ (
                            /**@type {HTMLElement} */ (
                                parder.nextElementSibling
                            )?.querySelector('.Address__dropdown-btn input')
                        );
                        nextInput && (nextInput.disabled = false);
                    }
                    if (input) input.placeholder = this.textContent || '';

                    onchange && onchange(this.textContent || '');
                });
                content.appendChild(div);
            });
        });
    }
}

/**
 * gọi một lần ngay khi popup được load
 * có thể nói là ngay sau khi trang load
 *
 * @param {(name: string) => void} [onchange] khi người dùng chọn
 *
 */
function renderTinhThanhPho(onchange) {
    contentRender__(
        fackDatabase.getAllTinhThanPho(),
        '.Address__dropdown-content.tp',
        onchange,
    );
}

/**
 * gọi khi người dùng đã cập nhật tỉnh thành phố
 *
 * @param {string} tintp
 * @param {(qh: string) => void} [onchange]
 */
function renderQuanHuyen(tintp, onchange) {
    contentRender__(
        fackDatabase.getAllTinhThanhByThanPho(tintp),
        '.Address__dropdown-content.qh',
        onchange,
    );
}

/**
 *
 * @param {string} tintp
 * @param {string} qh
 * @param {(px: string) => void} onchange
 */
function renderPhuongXa(tintp, qh, onchange) {
    contentRender__(
        fackDatabase.getAllpxByThinhTpAndQh(tintp, qh),
        '.Address__dropdown-content.xp',
        onchange,
    );
}

function removeDiacritics(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[Đ]/g, 'D')
        .replace(/[đ]/g, 'd')
        .toLocaleLowerCase();
}

function main() {
    //#region show & hide popup
    btnLocation?.addEventListener('click', () => {
        popup_wrapper?.classList.add('show');
    });

    // NOTE: nếu mà nhấn mà nó nó chứa thằng popup thì là nhấn bên ngoài
    popup_wrapper?.addEventListener('click', (event) => {
        const popup = /**@type {HTMLElement}*/ (event.target).querySelector(
            '.popup',
        );
        if (popup) popup_wrapper?.classList.remove('show');
    });

    closePopup?.addEventListener('click', () => {
        popup_wrapper?.classList.remove('show');
    });

    //
    btnAccount?.addEventListener('click', () => {
        modal?.classList.add('show-modal');
    });
    btnExit?.addEventListener('click', () => {
        modal?.classList.remove('show-modal');
    });
    modal?.addEventListener('click', (e) => {
        if (!e.target) return;
        if (!modalDemo?.contains(/**@type {HTMLElement}*/ (e.target))) {
            btnExit?.click();
        }
    });

    //#endregion

    //#region handel address dropdown

    // được gọi một lần duy nhất
    renderTinhThanhPho((tinhpt) => {
        renderQuanHuyen(tinhpt, (qh) => {
            renderPhuongXa(tinhpt, qh, (xp) => {
                console.log(xp);
            });
        });
    });

    // show address fill
    document.getElementsByName('select_address').forEach((e) => {
        e.addEventListener('change', () => {
            if (address_display.checked) address_form?.classList.add('show');
            else address_form?.classList.remove('show');
        });
    });

    const listAddressForm__row = document.querySelectorAll(
        '#Address-form > .Address-form__row',
    );
    listAddressForm__row.forEach((element, index) => {
        const input = element.querySelector('input');
        const contentDropdowContent = element.querySelector(
            '.Address__dropdown-content',
        );
        const button = element.querySelector('.Address__dropdown-btn');

        /**
         *
         * @param {MouseEvent} event
         * @returns
         */
        function hideDropdownHandle(event) {
            const target = /**@type {HTMLElement} */ (event.target);
            const isClickInsideDropdown =
                button?.contains(target) || button?.isSameNode(target);

            if (isClickInsideDropdown) return;
            contentDropdowContent?.classList.remove('show');
            document.removeEventListener('click', hideDropdownHandle);
        }

        button?.addEventListener('click', () => {
            if (input?.disabled) return;
            contentDropdowContent?.classList.add('show');
            document.addEventListener('click', hideDropdownHandle);
        });

        // search
        input?.addEventListener('input', () => {
            const value = input.value;

            contentDropdowContent?.querySelectorAll('div').forEach((e) => {
                if (value == '') {
                    e.classList.remove('hide');
                } else if (
                    !removeDiacritics(e.textContent).includes(
                        removeDiacritics(value),
                    )
                ) {
                    e.classList.add('hide');
                } else {
                    e.classList.remove('hide');
                }
            });

            let curr = contentDropdowContent?.querySelector(
                "div[selection='true']",
            );

            if (curr?.classList.contains('hide')) {
                const a =
                    contentDropdowContent?.querySelector('div:not(.hide)');
                if (a) {
                    a.setAttribute('selection', 'true');
                    curr.setAttribute('selection', 'false');
                }
            }
        });

        input?.addEventListener('focusout', () => {
            input.value = '';

            contentDropdowContent?.querySelectorAll('div').forEach((e) => {
                e.classList.remove('hide');
            });
        });

        input?.addEventListener('keydown', (event) => {
            if (
                !(
                    event.keyCode == 40 ||
                    event.keyCode == 38 ||
                    event.keyCode == 13
                )
            )
                return;
            event.preventDefault();
            console.log(event);
            let curr = contentDropdowContent?.querySelector(
                "div[selection='true']",
            );

            if (event.keyCode == 13) {
                /**@type {HTMLElement}*/ (curr)?.click();
                input.value = '';
                return;
            }

            /**
             * @type {Element | undefined | null}
             */
            let next;

            let temp = curr;

            if (contentDropdowContent?.querySelector('div:not(.hide)'))
                do {
                    if (event.keyCode == 40) {
                        next =
                            temp?.nextElementSibling ||
                            temp?.parentElement?.firstElementChild;
                    } else if (event.keyCode == 38) {
                        next =
                            temp?.previousElementSibling ||
                            temp?.parentElement?.lastElementChild;
                    }

                    temp = next;
                } while (next?.classList.contains('hide'));

            if (next) {
                console.log(next);
                curr?.setAttribute('selection', 'false');
                next?.setAttribute('selection', 'true');
                next?.scrollIntoView({
                    inline: 'nearest',
                    block: 'nearest',
                });
            }
        });

        // FIX: nếu là nội dung mới được render vào thì không có sự kiện này
        // NOTE: đã được chuyển qua hàm khác chắc vậy
        // contentDropdowContent?.querySelectorAll('div').forEach((e) => {
        //     e.addEventListener('click', () => {
        //         input && (input.placeholder = e.textContent || '');
        //         const nextInput = listAddressForm__row[index + 1]?.querySelector('input');
        //         if (nextInput) nextInput.disabled = false;
        //     });
        // });
    });

    //#endregion
}

main();
