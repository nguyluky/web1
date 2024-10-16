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

// const addr_drop_btns = document.getElementsByClassName('Address__dropdown-btn');
// const addr_drop_conts = document.getElementsByClassName('Address__dropdown-content');
// #endregion

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

    //#region handel address fill
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

        contentDropdowContent?.querySelectorAll('div').forEach((e) => {
            e.addEventListener('click', () => {
                input && (input.placeholder = e.textContent || '');
                const nextInput =
                    listAddressForm__row[index + 1]?.querySelector('input');
                if (nextInput) nextInput.disabled = false;
            });
        });
    });

    //#endregion
}

main();
