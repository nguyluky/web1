console.log('Popup function success');
const btnLocation = document.getElementById('btn-location');
const closePopup = document.getElementById('btn-close');
const popup_wrapper = document.getElementById('popup-wrapper');

if (btnLocation && closePopup && popup_wrapper) {
    btnLocation.addEventListener('click', () => {
        popup_wrapper.classList.add('show');
    });

    // NOTE: nếu mà nhấn mà nó nó chứa thằng popup thì là nhấn bên ngoài
    popup_wrapper.onclick = (event) => {
        const popup = /**@type {HTMLElement}*/ (event.target).querySelector(
            '.popup',
        );
        if (popup) popup_wrapper.classList.remove('show');
    };

    closePopup.addEventListener('click', () => {
        popup_wrapper.classList.remove('show');
    });
}

//popup form điền địa chỉ
let default_address = /**@type {HTMLInputElement} */ (
    document.querySelector('input[name="select_address"]')
);
if (default_address) default_address.checked = true;
const address_display = /**@type {HTMLInputElement}*/ (
    document.getElementById('address_display')
);
const address_form = document.getElementById('Address-form');
document.querySelector('.select')?.addEventListener('click', () => {
    if (address_display.checked) {
        address_form?.classList.add('show');
    } else {
        address_form?.classList.remove('show');
    }
});
//droplist city, district, ward
const addr_drop_btns = document.getElementsByClassName('Address__dropdown-btn');
const addr_drop_conts = document.getElementsByClassName(
    'Address__dropdown-content',
);
const addr_input = document.querySelectorAll('#Address-form input');
Array.from(addr_drop_btns).forEach(function (addr_drop_btn, index) {
    addr_drop_btn.addEventListener('click', function (e) {
        addr_drop_conts[index].classList.toggle('show');
    });
});

Array.from(addr_drop_conts).forEach((addr_drop_cont, index) => {
    addr_drop_cont.querySelectorAll('div').forEach((e) => {
        e.addEventListener('click', () => {
            let Input = addr_drop_cont.parentElement?.querySelector('input');
            if (Input) {
                Input.placeholder = e.innerHTML;
                if (index < addr_input.length - 1)
                    /**@type {HTMLInputElement}*/ (
                        addr_input[index + 1]
                    ).disabled = false;
            }
            addr_drop_cont.classList.remove('show');
        });
    });
});

document.addEventListener('click', function (event) {
    const isClickInsideDropdown = /**@type {HTMLElement} */ (
        event.target
    ).closest('.Address__dropdown-btn');
    if (!isClickInsideDropdown) {
        Array.from(addr_drop_conts).forEach((dropdown) => {
            dropdown.classList.remove('show');
        });
    }
});

// function renderAddress() {}

const btnAccount = document.getElementById('btn-account');
const modal = document.querySelector('.modal');
const btnExit = document.getElementById('btn-exit');
const modalDemo = document.querySelector('.modal-demo');
const form = document.querySelector('form');
if (btnAccount && modal && btnExit && modalDemo) {
    btnAccount.addEventListener('click', () => {
        modal.classList.add('show-modal');
    });
    btnExit.addEventListener('click', () => {
        modal.classList.remove('show-modal');
    });
    modal.addEventListener('click', (e) => {
        if (!e.target) return;
        if (!modalDemo.contains(/**@type {HTMLElement}*/ (e.target))) {
            btnExit.click();
        }
    });
}
//
