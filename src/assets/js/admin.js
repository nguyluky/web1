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
 * @type {string}
 */
let state = 'none';

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
    title.innerHTML = titleTabs[tab];
    let web_title = document.querySelector('head title');
    if (web_title) web_title.innerHTML = `Admin Web - ${titleTabs[tab]}`;
    const data = fakeDBManagement[tab] ? fakeDBManagement[tab]() : [];
    tabManagement[tab].renderTable(data);
    input.oninput = () => tabManagement[tab].search(data);
}

function updateMangement() {
    tabManagement[tab].doSave();
}

/**
 * @this {HTMLElement}
 * @param {MouseEvent} event
 */
function buttonSaveHandle(event) {
    // nếu nhấn nút edit -> chuyển thành nút lưu và cho phép chỉnh sửa
    if (!this.classList.contains('canedit')) {
        this.innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>';
        this.classList.add('canedit');
        document.querySelectorAll('#content_table td[key]').forEach((td) => {
            td.setAttribute('contenteditable', 'true');
        });

        return;
    }

    // nếu nhấn nút save
    const popupWrapper = document.getElementById('popup-wrapper');
    if (popupWrapper)
        showPopup(
            popupWrapper,
            'Xác nhận sửa',
            'Bạn có chắc là muốn sửa không',
            () => {
                // nếu đang thêm thì đổi icon và text btn-warning
                const btnAdd = document.getElementById('add-btn');
                const btnSave = document.getElementById('save-btn');

                if (!btnSave) return;

                if (btnAdd && btnAdd.classList.contains('btn-warning')) {
                    btnAdd.classList.remove('btn-warning');
                    btnAdd.classList.add('btn-primary');
                    btnAdd.innerHTML =
                        '<i class="fa-solid fa-plus"></i><span>Thêm</span>';
                }

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
            },
            () => {
                const btnAdd = document.getElementById('add-btn');
                const btnSave = document.getElementById('save-btn');
                if (!btnSave) return;

                btnSave.classList.remove('canedit');
                if (btnAdd && btnAdd.classList.contains('btn-warning'))
                    btnAdd.click();
            },
        );
}

/**
 *
 * @this {HTMLElement}
 * @param {MouseEvent} event
 */
function buttonDeleteHandle(event) {
    const popupWrapper = document.getElementById('popup-wrapper');
    if (popupWrapper) {
        showPopup(
            popupWrapper,
            'Xác nhận xóa',
            'Bạn có muốn xóa vĩnh viên các dòng hay không.',
            () => {
                tabManagement[tab].removeRow();
                // console.log('ok');
            },
            null,
        );
    }
}

/**
 *
 * @this {HTMLElement}
 * @param {MouseEvent} event
 */
function buttonAddHandle(event) {
    const btnSave = document.getElementById('save-btn');
    if (!btnSave) return;

    if (this.classList.contains('btn-warning')) {
        this.classList.remove('btn-warning');
        this.classList.add('btn-primary');
        this.innerHTML = '<i class="fa-solid fa-plus"></i><span>Thêm</span>';

        btnSave.classList.remove('canedit');
        btnSave.innerHTML = '<i class="fa-solid fa-pen"></i><span>Edit</span>';

        // hủy
        tabManagement[tab].cancelAdd();
    } else {
        this.classList.add('btn-warning');
        this.classList.remove('btn-primary');
        this.innerHTML = '<i class="fa-solid fa-ban"></i><span>Hủy</span>';

        btnSave.innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>';
        btnSave.classList.add('canedit');

        // thêm
        tabManagement[tab].addRow();
    }
}
/**
 *
 * @this {HTMLElement}
 * @param {MouseEvent} event
 */
function buttonMenuHandle(event) {
    if (!this.classList.contains('active')) {
        document.getElementById('drop-list')?.classList.add('show');
        this.classList.add('active');
        return;
    }
    document.getElementById('drop-list')?.classList.remove('show');
    this.classList.remove('active');
}

/**
 * @this {HTMLInputElement}
 * @param {MouseEvent} event
 * @returns
 */
function tabHandle(event) {
    const btnSave = document.getElementById('save-btn');
    const tabElements = /** @type {NodeListOf<HTMLInputElement>} */ (
        document.getElementsByName('tab-selestion')
    );

    if (btnSave?.classList.contains('canedit')) {
        this.checked = false;
        const popupWrapper = document.getElementById('popup-wrapper');
        popupWrapper &&
            showPopup(
                popupWrapper,
                'Xác nhận sửa',
                'Bạn có chắc là muốn sửa không',
                () => {
                    // nếu đang thêm thì đổi icon và text btn-warning
                    const btnAdd = document.getElementById('add-btn');
                    const btnSave = document.getElementById('save-btn');

                    if (!btnSave) return;

                    if (btnAdd && btnAdd.classList.contains('btn-warning')) {
                        btnAdd.classList.remove('btn-warning');
                        btnAdd.classList.add('btn-primary');
                        btnAdd.innerHTML =
                            '<i class="fa-solid fa-plus"></i><span>Thêm</span>';
                    }

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

                    tabElements.forEach((e) => (e.checked = false));
                    this.checked = true;
                    tab = this.value;
                    renderManagement();
                },
                () => {
                    const btnAdd = document.getElementById('add-btn');
                    const btnSave = document.getElementById('save-btn');
                    if (!btnSave) return;

                    btnSave.classList.remove('canedit');
                    if (btnAdd && btnAdd.classList.contains('btn-warning'))
                        btnAdd.click();

                    tabElements.forEach((e) => (e.checked = false));
                    this.checked = true;
                    tab = this.value;
                    renderManagement();
                },
            );

        return;
    }

    tabElements.forEach((e) => (e.checked = false));
    this.checked = true;
    tab = this.value;
    renderManagement();
}

function main() {
    const tabElements = /** @type {NodeListOf<HTMLInputElement>} */ (
        document.getElementsByName('tab-selestion')
    );
    tabElements.forEach((e) => e.addEventListener('click', tabHandle));

    const input = document.getElementById('search-input');
    const data = fakeDBManagement['user'] ? fakeDBManagement['user']() : [];
    tabManagement['user'].renderTable(data);
    input && (input.oninput = () => tabManagement['user'].search(data));

    const btnDelete = document.getElementById('delete-btn');
    if (btnDelete) btnDelete.addEventListener('click', buttonDeleteHandle);

    const btnSave = document.getElementById('save-btn');
    if (btnSave) btnSave.addEventListener('click', buttonSaveHandle);

    const btnAdd = document.getElementById('add-btn');
    if (btnAdd) btnAdd.addEventListener('click', buttonAddHandle);

    const btnMenu = document.getElementById('menu-btn');
    if (btnMenu) btnMenu.addEventListener('click', buttonMenuHandle);

    document.getElementById('drop-list')?.addEventListener('click', () => {
        document.getElementById('drop-list')?.classList.remove('show');
        document.getElementById('menu-btn')?.classList.remove('active');
    });
}

main();
