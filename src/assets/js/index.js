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
let default_address = /**@type {HTMLInputElement} */ (document.querySelector('input[name="select_address"]'));
default_address.checked = true;
const address_display = /**@type {HTMLInputElement}*/ (document.getElementById('address_display'));
const address_form = document.getElementById('Address-form');
document.querySelector('.select')?.addEventListener('click', () => {
    if(address_display.checked){
        address_form?.classList.add('show');
    } else {
        address_form?.classList.remove('show');
    }
})
/**
document.querySelectorAll('.Address__dropdown-btn').forEach(e => {
    e.addEventListener('click', () => {
        e.parentNode?.querySelector('.Address__dropdown-content')?.classList.add('')
    })
})
*/
//droplist city, district, ward 
const addr_drop_btns = document.getElementsByClassName('Address__dropdown-btn');
const addr_drop_conts = document.getElementsByClassName('Address__dropdown-content');

Array.from(addr_drop_btns).forEach(function (addr_drop_btn, index) {


    // addr_drop_btn.addEventListener('click', function() {
        // })
    addr_drop_btn.addEventListener("focus", function(e){
        addr_drop_conts[index].classList.add('show');
    })
    // focusout
    addr_drop_btn.addEventListener("focusout", function(e){
        addr_drop_conts[index].classList.remove('show');
    })
})

Array.from(addr_drop_conts).forEach((addr_drop_cont)=>{

})

function renderAddress() {
}
