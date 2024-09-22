import fackDatabase from './db/fakeDb.js';
import renderCart from './render/cart_table.js';
import renderUser from './render/user_info_table.js';

function searchUser() {
    const records_user = fackDatabase.getAllUserInfo();
    // NOTE: WTF
    const searchInput = /**@type {HTMLInputElement}*/ (document.getElementById('search-input'));
    if (!searchInput) return [];
    let valueSearchInput = searchInput.value;
    let userSearch = records_user.filter((user) => {
        return (
            user.id.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
            user.name.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
            user.email.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
            user.phone_num.toUpperCase().includes(valueSearchInput.toUpperCase())
        );
    });
    renderUser(userSearch);
    console.log('Success');
}

let input = document.getElementById('search-input');
if (input) input.oninput = searchUser;

document.getElementsByName('tab-selestion').forEach((e) => {
    e.onchange = (event) => {
        const value = /**@type {HTMLInputElement} */ (event.target).value;
        if (value == 'user') {
            renderUser(fackDatabase.getAllUserInfo());
        } else if (value == 'cart') {
            renderCart(fackDatabase.getALlCart());
        }
    };
});

renderUser(fackDatabase.getAllUserInfo());
