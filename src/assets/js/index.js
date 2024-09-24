console.log('Popup function success');
const openPopup = document.getElementById('btn-location');
const closePopup = document.getElementById('btn-close');
const popup_wrapper = document.getElementById('popup-wrapper');
if (openPopup && closePopup && popup_wrapper) {
    openPopup.addEventListener('click', () => {
        console.log('open');
        popup_wrapper.classList.add('show');
    });
    closePopup.addEventListener('click', () => {
        console.log('close');
        popup_wrapper.classList.remove('show');
    });
}
