import fackDatabase from './db/fakeDb.js';
import { defaultRenderRow, showPopup } from './render/reader_table.js';
import userRender from './render/user_table.js';
import cartRender from './render/cart_table.js';
import sachRender from './render/sach_table.js';
import categoryRender from './render/category_table.js';
import uuidv4 from './until/uuid.js';

/**
 __             __        
/\ \__         /\ \       
\ \ ,_\    __  \ \ \____  
 \ \ \/  /'__`\ \ \ '__`\ 
  \ \ \_/\ \L\.\_\ \ \L\ \
   \ \__\ \__/.\_\\ \_,__/
    \/__/\/__/\/_/ \/___/ 
 */

/**
 * @type {string}
 */
let tab = 'user';

/**
 * @type {{[key: string]: import('./render/reader_table.js').intefaceRender<?>}}
 */
const tabManagement = {
    user: userRender,
    cart: cartRender,
    sach: sachRender,
    category: categoryRender,
};

const fakeDBManagement = {
    user: fackDatabase.getAllUserInfo,
    cart: fackDatabase.getALlCart,
    sach: fackDatabase.getAllSach,
    category: fackDatabase.getAllCategory,
};

function renderManagement() {
    const title = document.getElementById('table-title-header');
    const input = /**@type {HTMLInputElement} */ (
        document.getElementById('search-input')
    );
    input.value = '';
    if (!title || !input) return;

    const titleTabs = {
        user: 'User',
        cart: 'Cart',
        sach: 'Sách',
        category: 'Category',
    };

    const data = fakeDBManagement[tab] ? fakeDBManagement[tab]() : [];
    tabManagement[tab].renderTable(data);
    input.oninput = () => tabManagement[tab].search(data);
}

function updateMangement() {
    tabManagement[tab].doSave();
}

function main() {
    document.getElementsByName('tab-selestion').forEach((e) => {
        e.onchange = (event) => {
            tab = /**@type {HTMLInputElement} */ (event.target).value;
            renderManagement();
        };
    });

    const input = document.getElementById('search-input');
    const data = fakeDBManagement['user'] ? fakeDBManagement['user']() : [];
    tabManagement['user'].renderTable(data);
    input && (input.oninput = () => tabManagement['user'].search(data));

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
        btnSave.onclick = function () {
            if (!btnSave.classList.contains('canedit')) {
                btnSave.innerHTML =
                    '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>';
                btnSave.classList.add('canedit');
                document
                    .querySelectorAll('#content_table td[key]')
                    .forEach((td) => {
                        td.setAttribute('contenteditable', 'true');
                    });

                return;
            }

            const popupWrapper = document.getElementById('popup-wrapper');
            if (popupWrapper)
                showPopup(
                    popupWrapper,
                    'Xác nhận sửa',
                    'Bạn có chắc là muốn sửa không',
                    () => {
                        // đổi cái icon và text
                        btnSave.classList.remove('canedit');
                        btnSave.innerHTML =
                            '<i class="fa-solid fa-pen"></i><span>Edit</span>';
                        document
                            .querySelectorAll('#content_table td[key]')
                            .forEach((td) => {
                                td.setAttribute('contenteditable', 'false');
                            });

                        updateMangement();
                        // NOTE: chưa biết là gì
                        // renderManagement();
                    },
                    () => {},
                );
        };

    const btnAdd = document.getElementById('add-btn');
    if (btnAdd && btnSave)
        btnAdd.onclick = () => {
            if (btnAdd.classList.contains('btn-warning')) {
                btnAdd.classList.remove('btn-warning');
                btnAdd.classList.add('btn-primary');
                btnAdd.innerHTML =
                    '<i class="fa-solid fa-plus"></i><span>Thêm</span>';

                btnSave.classList.remove('canedit');
                btnSave.innerHTML =
                    '<i class="fa-solid fa-pen"></i><span>Edit</span>';

                // hủy
                tabManagement[tab].cancelAdd();
            } else {
                btnAdd.classList.add('btn-warning');
                btnAdd.classList.remove('btn-primary');
                btnAdd.innerHTML =
                    '<i class="fa-solid fa-ban"></i><span>Hủy</span>';

                btnSave.innerHTML =
                    '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>';
                btnSave.classList.add('canedit');

                // thêm
                tabManagement[tab].addRow();
            }
        };
}

main();
