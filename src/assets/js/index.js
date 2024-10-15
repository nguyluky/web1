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
