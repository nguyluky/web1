import fackDatabase from './db/fakeDb.js';
import { showPopup } from './render/reader_table.js';
import userRender from './render/user_table.js';
import cartRender from './render/cart_table.js';
import sachRender from './render/sach_table.js';
import categoryRender from './render/category_table.js';

/*  ------- ADMIN -------
 ______  ____             ______   __  __     
/\  _  \/\  _`\   /'\_/`\/\__  _\ /\ \/\ \    
\ \ \L\ \ \ \/\ \/\      \/_/\ \/ \ \ `\\ \   
 \ \  __ \ \ \ \ \ \ \__\ \ \ \ \  \ \ , ` \  
  \ \ \/\ \ \ \_\ \ \ \_/\ \ \_\ \__\ \ \`\ \ 
   \ \_\ \_\ \____/\ \_\\ \_\/\_____\\ \_\ \_\
    \/_/\/_/\/___/  \/_/ \/_/\/_____/ \/_/\/_/
 */

/**
 * @typedef {import('./db/fakeDb.js').UserInfo} UserInfo
 * @typedef {import('./db/fakeDb.js').Cart} Cart
 * @typedef {import('./db/fakeDb.js').Sach} Sach
 * @typedef {import('./db/fakeDb.js').Category} Category
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
 * @typedef {{
 *  user: UserInfo,
 *  cart: Cart,
 *  sach: Sach,
 *  category: Category,
 * }} Templay
 */

/**
 * @type {{[key in keyof Templay]: import('./render/reader_table.js').intefaceRender<Templay[key]>}}
 */
const tabManagement = {
    user: userRender,
    cart: cartRender,
    sach: sachRender,
    category: categoryRender,
};

/**
 * @type {{[key in keyof Templay]: () => Promise<Templay[key][]>}}
 */
const fakeDBManagement = {
    user: fackDatabase.getAllUserInfo,
    cart: fackDatabase.getALlCart,
    sach: fackDatabase.getAllSach,
    category: fackDatabase.getAllCategory,
};
const btnMenu = document.getElementById('menu-btn');
const btnAdd = document.getElementById('add-btn');
const btnSave = document.getElementById('save-btn');
const btnDelete = document.getElementById('delete-btn');
const tabElements = /** @type {NodeListOf<HTMLInputElement>} */ (
    document.getElementsByName('tab-selestion')
);
const popupWrapper = document.getElementById('popup-wrapper');

const buttonAddState = {
    /**
     * chuyển button thành button add
     * với btn-warning var icon x
     */
    add: () => {
        btnAdd?.classList.remove('btn-warning');
        btnAdd?.classList.add('btn-primary');
        btnAdd &&
            (btnAdd.innerHTML =
                '<i class="fa-solid fa-plus"></i><span>Thêm</span>');

        btnSave?.classList.remove('canedit');
        btnSave &&
            (btnSave.innerHTML =
                '<i class="fa-solid fa-pen"></i><span>Edit</span>');
    },
    /**
     * chuyển thành button thêm
     */
    cancel: () => {
        btnAdd?.classList.add('btn-warning');
        btnAdd?.classList.remove('btn-primary');
        btnAdd &&
            (btnAdd.innerHTML =
                '<i class="fa-solid fa-ban"></i><span>Hủy</span>');

        btnSave &&
            (btnSave.innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>');
        btnSave?.classList.add('canedit');
    },
};

const buttonSaveState = {
    edit: () => {
        btnSave &&
            (btnSave.innerHTML =
                '<i class="fa-solid fa-pen"></i><span>Edit</span>');
        document.querySelectorAll('#content_table td[key]').forEach((td) => {
            td.setAttribute('contenteditable', 'false');
        });
    },
    save: () => {
        btnSave &&
            (btnSave.innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>');
        btnSave?.classList.add('canedit');
        document.querySelectorAll('#content_table td[key]').forEach((td) => {
            td.setAttribute('contenteditable', 'true');
        });
    },
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
    const isEditMod = this.classList.contains('canedit');
    // nhấn nút Edit
    if (!isEditMod) {
        buttonSaveState.save();
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
                buttonAddState.add();
                buttonSaveState.edit();

                updateMangement();
            },
            null,
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
                tabManagement[tab].removeRows();
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
    const isAddMode = this.classList.contains('btn-warning');

    if (isAddMode) {
        buttonAddState.add();
        tabManagement[tab].cancelAdd();
    } else {
        buttonAddState.cancel();
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
    const tabElements = /** @type {NodeListOf<HTMLInputElement>} */ (
        document.getElementsByName('tab-selestion')
    );

    const isEditMode = btnSave?.classList.contains('canedit');

    if (isEditMode) {
        this.checked = false;
        popupWrapper &&
            showPopup(
                popupWrapper,
                'Xác nhận sửa',
                'Bạn có chắc là muốn sửa không',
                () => {
                    buttonAddState.add();
                    buttonSaveState.edit();
                    updateMangement();

                    tabElements.forEach((e) => (e.checked = false));
                    this.checked = true;
                    tab = this.value;
                    renderManagement();
                },
                null,
            );

        return;
    }

    tabElements.forEach((e) => (e.checked = false));
    this.checked = true;
    tab = this.value;
    renderManagement();
}

async function main() {
    tabElements.forEach((e) => e.addEventListener('click', tabHandle));

    const input = document.getElementById('search-input');

    const data = fakeDBManagement['user']
        ? await fakeDBManagement['user']()
        : /**@type {UserInfo[]}*/ ([]);
    tabManagement['user'].renderTable(data);
    input && (input.oninput = () => tabManagement['user'].search(data));

    btnDelete?.addEventListener('click', buttonDeleteHandle);
    btnSave?.addEventListener('click', buttonSaveHandle);
    btnAdd?.addEventListener('click', buttonAddHandle);
    btnMenu?.addEventListener('click', buttonMenuHandle);

    document.getElementById('drop-list')?.addEventListener('click', () => {
        document.getElementById('drop-list')?.classList.remove('show');
        // NOTE: không xóa dòng này -_-
        document.getElementById('menu-btn')?.classList.remove('active');
    });
}

main();
