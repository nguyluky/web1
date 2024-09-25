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
        const popup = /**@type {HTMLElement}*/ (event.target).querySelector('.popup');
        if (popup) popup_wrapper.classList.remove('show');
    };

    closePopup.addEventListener('click', () => {
        console.log('close');
        popup_wrapper.classList.remove('show');
    });
}
