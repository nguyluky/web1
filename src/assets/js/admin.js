import fackDatabase from './db/fakeDb.js';
import renderUser from './render/user_table.js';
import renderCart from './render/cart_table.js';
import renderSach from './render/sach_table.js';
import renderCategory from './render/category_table.js';
import searchUser from './render/search_user.js';
import searchCart from './render/search_cart.js';
import searchSach from './render/search_sach.js';
import searchCategory from './render/search_category.js';

document.getElementsByName('tab-selestion').forEach((e) => {
    e.onchange = (event) => {
        const tab = /**@type {HTMLInputElement} */ (event.target).value;
        const title = document.getElementById('table-title-header');
        const input = /**@type {HTMLInputElement} */ (document.getElementById('search-input'));
        if (input) input.value = '';
        if (tab == 'user') {
            renderUser(fackDatabase.getAllUserInfo());
            if (input) input.oninput = searchUser;
            if (title) title.textContent = 'User';
        } else if (tab == 'cart') {
            renderCart(fackDatabase.getALlCart());
            if (input) input.oninput = searchCart;
            if (title) title.textContent = 'Cart';
        } else if (tab == 'sach') {
            renderSach(fackDatabase.getAllSach());
            if (input) input.oninput = searchSach;
            if (title) title.textContent = 'Sách';
        } else if (tab == 'category') {
            renderCategory(fackDatabase.getAllCategory());
            if (input) input.oninput = searchCategory;
            if (title) title.textContent = 'Category';
        }
    };
});

renderUser(fackDatabase.getAllUserInfo());
const input = document.getElementById('search-input');
if (input) input.oninput = searchUser;
