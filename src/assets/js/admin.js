import fackDatabase from './db/fakeDb.js';
import renderCart from './render/cart_table.js';
import renderCategory from './render/category_table.js';
import renderSach from './render/sach_table.js';
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
        const tab = /**@type {HTMLInputElement} */ (event.target).value;
        const title = document.getElementById('table-title-header');
        if (tab == 'user') {
            renderUser(fackDatabase.getAllUserInfo());
            if (title) title.textContent = 'User';
        } else if (tab == 'cart') {
            renderCart(fackDatabase.getALlCart());
            if (title) title.textContent = 'Cart';
        } else if (tab == 'sach') {
            renderSach(fackDatabase.getAllSach());
            if (title) title.textContent = 'Sách';
        } else if (tab == 'category') {
            renderCategory(fackDatabase.getAllCategory());
            if (title) title.textContent = 'category';
        }
    };
});

renderUser(fackDatabase.getAllUserInfo());
