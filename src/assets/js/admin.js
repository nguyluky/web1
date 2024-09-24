import fackDatabase from './db/fakeDb.js';
import { showPopup } from './render/reader_table.js';
import { renderUser, searchUser, userDoSave } from './render/user_table.js';
import { renderCart, searchCart } from './render/cart_table.js';
import { renderSach, searchSach } from './render/sach_table.js';
import { renderCategory, searchCategory } from './render/category_table.js';

document.getElementsByName('tab-selestion').forEach((e) => {
    e.onchange = (event) => {
        const tab = /**@type {HTMLInputElement} */ (event.target).value;
        const title = document.getElementById('table-title-header');
        const input = /**@type {HTMLInputElement} */ (document.getElementById('search-input'));
        input.value = '';
        if (!title || !input) return;
        switch (tab) {
            case 'user': {
                renderUser(fackDatabase.getAllUserInfo());
                input.oninput = () => searchUser(fackDatabase.getAllUserInfo());
                title.textContent = 'User';
                break;
            }
            case 'cart': {
                renderCart(fackDatabase.getALlCart());
                input.oninput = () => searchCart(fackDatabase.getALlCart());
                title.textContent = 'Cart';
                break;
            }
            case 'sach': {
                renderSach(fackDatabase.getAllSach());
                input.oninput = () => searchSach(fackDatabase.getAllSach());
                title.textContent = 'Sách';
                break;
            }
            case 'category': {
                renderCategory(fackDatabase.getAllCategory());
                input.oninput = () => searchCategory(fackDatabase.getAllCategory());
                title.textContent = 'Category';
            }
        }
    };
});

renderUser(fackDatabase.getAllUserInfo());
const input = document.getElementById('search-input');
if (input) input.oninput = () => searchUser(fackDatabase.getAllUserInfo());

const btnDelete = document.getElementById('delete-btn');
if (btnDelete)
    btnDelete.onclick = (event) => {
        const popupWrapper = document.getElementById('popup-wrapper');
        if (popupWrapper) {
            showPopup(
                popupWrapper,
                'Xác nhận xóa',
                'Bạn có muốn xóa vĩnh viên các dòng hay không.',
                () => {
                    // todo
                    alert('chưa làm hàm xóa');
                    console.log('ok');
                },
                null,
            );
        }
    };

const btnSave = document.getElementById('save-btn');
if (btnSave)
    btnSave.onclick = () => {
        userDoSave();
    };
