import fackDatabase from './db/fakeDb.js';
import { showPopup } from './render/reader_table.js';
import { renderUser, searchUser, userDoSave } from './render/user_table.js';
import { renderCart, searchCart } from './render/cart_table.js';
import { renderSach, searchSach } from './render/sach_table.js';
import { renderCategory, searchCategory } from './render/category_table.js';

/**
 __             __        
/\ \__         /\ \       
\ \ ,_\    __  \ \ \____  
 \ \ \/  /'__`\ \ \ '__`\ 
  \ \ \_/\ \L\.\_\ \ \L\ \
   \ \__\ \__/.\_\\ \_,__/
    \/__/\/__/\/_/ \/___/ 
 */

// lol

/**
 * @type {string}
 */
let tab = 'user';

function renderManagement() {
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
}

document.getElementsByName('tab-selestion').forEach((e) => {
    e.onchange = (event) => {
        tab = /**@type {HTMLInputElement} */ (event.target).value;
        renderManagement();
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

let canEdit = false;
const btnSave = document.getElementById('save-btn');
if (btnSave)
    btnSave.onclick = function () {
        if (!canEdit) {
            btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>';
            document.querySelectorAll('#content_table td[key]').forEach((td) => {
                td.setAttribute('contenteditable', 'true');
            });
            canEdit = !canEdit;

            return;
        }

        canEdit = !canEdit;

        btnSave.innerHTML = '<i class="fa-solid fa-pen"></i><span>Edit</span>';
        document.querySelectorAll('#content_table td[key]').forEach((td) => {
            td.setAttribute('contenteditable', 'false');
        });

        console.log(tab);

        switch (tab) {
            case 'user': {
                userDoSave();
                break;
            }
            case 'cart': {
                break;
            }
            case 'sach': {
                break;
            }
            case 'category': {
                break;
            }
        }

        renderManagement();
    };
