import fackDatabase from './db/fakeDb.js';
import { renderUser, searchUser } from './render/user_table.js';
import { renderCart, searchCart } from './render/cart_table.js';
import { renderSach, searchSach } from './render/sach_table.js';
import { renderCategory, searchCategory } from './render/category_table.js';

document.getElementsByName('tab-selestion').forEach((e) => {
    e.onchange = (event) => {
        const tab = /**@type {HTMLInputElement} */ (event.target).value;
        const title = document.getElementById('table-title-header');
        const input = /**@type {HTMLInputElement} */ (document.getElementById('search-input'));
        if (input) input.value = '';
        if (tab == 'user') {
            renderUser(fackDatabase.getAllUserInfo());
            if (input) input.oninput = () => searchUser(fackDatabase.getAllUserInfo());
            if (title) title.textContent = 'User';
        } else if (tab == 'cart') {
            renderCart(fackDatabase.getALlCart());
            if (input) input.oninput = () => searchCart(fackDatabase.getALlCart());
            if (title) title.textContent = 'Cart';
        } else if (tab == 'sach') {
            renderSach(fackDatabase.getAllSach());
            if (input) input.oninput = () => searchSach(fackDatabase.getAllSach());
            if (title) title.textContent = 'Sách';
        } else if (tab == 'category') {
            renderCategory(fackDatabase.getAllCategory());
            if (input) input.oninput = () => searchCategory(fackDatabase.getAllCategory());
            if (title) title.textContent = 'Category';
        }
    };
});

renderUser(fackDatabase.getAllUserInfo());
const input = document.getElementById('search-input');
if (input) input.oninput = () => searchUser(fackDatabase.getAllUserInfo());
