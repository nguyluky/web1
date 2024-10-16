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
 * gọi một lần ngay khi popup được load
 * có thể nói là ngay sau khi trang load
 * 
 * @param {(name: string) => void} [onchange] khi người dùng chọn
 * 
 */
function renderTinhThanhPho(onchange) {
    const data = fackDatabase.getAllTinhThanPho();
    const content = document.querySelector('.Address__dropdown-content.tp')
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
        `

        data.then(e => {
            content.innerHTML = ''
            e?.forEach(j => {

                const div = document.createElement('div')
                div.textContent = j || ''
                div.addEventListener('click', function () {
                    const parder = this.parentElement?.parentElement?.parentElement;
                    const input = /**@type {HTMLInputElement} */ (parder?.querySelector('.Address__dropdown-btn input'))

                    if (parder) {
                        // sr
                        const nextInput = /**@type {HTMLInputElement} */ (/**@type {HTMLElement} */ (parder.nextElementSibling).querySelector('.Address__dropdown-btn input'))
                        nextInput.disabled = false
                    }
                    if (input) input.placeholder = this.textContent || '';

                    onchange && onchange(this.textContent || '');
                });
                content.appendChild(div)
            })
        })
    }
}

/**
 * gọi khi người dùng đã cập nhật tỉnh thành phố
 * 
 * @param {string} tintp 
 * @param {(qh: string) => void} [onchange]
 */
function renderQuanHuyen(tintp, onchange) {
    const content = document.querySelector('.Address__dropdown-content.qh')
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
        `

        fackDatabase.getAllTinhThanhByThanPho(tintp).then(e => {
            content.innerHTML = ''
            e?.forEach(j => {

                const div = document.createElement('div')
                div.textContent = j || ''
                div.addEventListener('click', function () {
                    const parder = this.parentElement?.parentElement?.parentElement;
                    const input = /**@type {HTMLInputElement} */ (parder?.querySelector('.Address__dropdown-btn input'))

                    if (parder) {
                        // sr
                        const nextInput = /**@type {HTMLInputElement} */ (/**@type {HTMLElement} */ (parder.nextElementSibling).querySelector('.Address__dropdown-btn input'))
                        nextInput.disabled = false
                    }
                    if (input) input.placeholder = this.textContent || '';

                    onchange && onchange(this.textContent || '');
                });
                content.appendChild(div)
            })
        })
    }
}

/**
 * 
 * @param {string} tintp 
 * @param {string} qh 
 * @param {(px: string) => void} onchange 
 */
function renderPhuongXa(tintp, qh, onchange) {
    const content = document.querySelector('.Address__dropdown-content.xp')
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
        `

        fackDatabase.getAllpxByThinhTpAndQh(tintp, qh).then(e => {
            content.innerHTML = ''
            e?.forEach(j => {

                const div = document.createElement('div')
                div.textContent = j || ''
                div.addEventListener('click', function () {
                    const parder = this.parentElement?.parentElement?.parentElement;
                    const input = /**@type {HTMLInputElement} */ (parder?.querySelector('.Address__dropdown-btn input'))

                    if (input) input.placeholder = this.textContent || '';

                    onchange && onchange(this.textContent || '');
                });
                content.appendChild(div)
            })
        })
    }
    // const promiseData = fackDatabase.getAllpxByThinhTpAndQh(tintp, qh);

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
        if (!modalDemo?.contains(/**@type {HTMLElement}*/(e.target))) {
            btnExit?.click();
        }
    });

    //#endregion

    //#region handel address fill

    // được gọi một lần duy nhất

    renderTinhThanhPho((tinhpt) => {
        renderQuanHuyen(tinhpt, (qh) => {
            renderPhuongXa(tinhpt, qh, (xp) => {

                console.log(xp)
            })
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
