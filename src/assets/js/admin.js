import fakeDatabase from './db/fakeDb.js';
import { showPopup } from './render/baseRender.js';
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
//#region định nghĩa kiểu dữ liệu

/**
 * Định nghĩa các kiểu dữ liệu sử dụng trong project
 *
 * @typedef {import('./until/type.js').Cart} Cart
 *
 * @typedef {import('./until/type.js').Category} Category
 *
 * @typedef {import('./until/type.js').Sach} Sach
 *
 * @typedef {import('./until/type.js').UserInfo} UserInfo
 *
 * @typedef {import('./until/type.js').imgStore} imgStore
 */
//#endregion

/** @type {string} */
let tab = 'user';

/**
 * Quản lý các hàm render và cập nhật dữ liệu cho từng tab
 *
 * @type {{
 *     [Key: string]: import('./render/baseRender.js').IntefaceRender<?>;
 * }}
 */
const tabManagement = {
    user: userRender,
    cart: cartRender,
    sach: sachRender,
    category: categoryRender,
};

/**
 * Lấy dữ liệu từ database giả lập cho từng tab
 *
 * @type {{ [key: string]: () => Promise<?> }}
 */
const fakeDBManagement = {
    user: () => fakeDatabase.getAllUserInfo(),
    cart: () => fakeDatabase.getALlCart(),
    sach: () => fakeDatabase.getAllSach(),
    category: () => fakeDatabase.getAllCategory(),
};

//#region Các biến DOM quan trọng
const btnMenu = document.getElementById('menu-btn');
const btnAdd = document.getElementById('add-btn');
const btnSave = document.getElementById('save-btn');
const btnDelete = document.getElementById('delete-btn');
// eslint-disable-next-line jsdoc/no-undefined-types
const tabElements = /** @type {NodeListOf<HTMLInputElement>} */ (
    document.getElementsByName('tab-selestion')
);
const popupWrapper = document.getElementById('popup-wrapper');
const loadingTable = document.getElementById('loading');

const buttonAddState = {
    /* Thay đổi nút thành nút "Thêm" */
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
    /* Thay đổi nút thành "Hủy" */
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
    /* Đổi trạng thái nút thành "Chỉnh sửa" */
    edit: () => {
        btnSave &&
            (btnSave.innerHTML =
                '<i class="fa-solid fa-pen"></i><span>Edit</span>');
        document.querySelectorAll('#content_table td[key]').forEach((td) => {
            td.setAttribute('contenteditable', 'false');
        });
    },
    /* Đổi trạng thái nút thành "Lưu" và cho phép chỉnh sửa */
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

/** Xử lý render dữ liệu tương ứng với tab hiện tại */
async function renderManagement() {
    const title = document.getElementById('table-title-header');
    const input = /** @type {HTMLInputElement} */ (
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

    loadingTable && (loadingTable.style.display = 'flex');
    const data = fakeDBManagement[tab] ? await fakeDBManagement[tab]() : [];
    loadingTable && (loadingTable.style.display = 'none');
    tabManagement[tab].renderTable(data);
    input.oninput = () => tabManagement[tab].search(data);
}

/** Không biết ghi gì */
function updateMangement() {
    tabManagement[tab].doSave();
}

/**
 * @param {MouseEvent} event
 * @this {HTMLElement}
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
 * @param {MouseEvent} event
 * @this {HTMLElement}
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
 * @param {MouseEvent} event
 * @this {HTMLElement}
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
 * @param {MouseEvent} event
 * @this {HTMLElement}
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
 * Xử lý khi chuyển giữa các tab khác nhau
 *
 * @param {MouseEvent} event
 * @this {HTMLInputElement}
 */
function HandleSwitchTab(event) {
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

function initializeMainButton() {
    btnDelete?.addEventListener('click', buttonDeleteHandle);
    btnSave?.addEventListener('click', buttonSaveHandle);
    btnAdd?.addEventListener('click', buttonAddHandle);
}

function initializeSideBar() {
    tabElements.forEach((e) => e.addEventListener('click', HandleSwitchTab));

    // show side bar where in mobile ui
    btnMenu?.addEventListener('click', buttonMenuHandle);
    const drop_menu = document.getElementById('drop-list');
    document.getElementById('drop-list')?.addEventListener('click', () => {
        drop_menu?.classList.remove('show');
        // NOTE: không xóa dòng này -_-
        btnMenu?.classList.remove('active');
    });

    document.addEventListener('click', (event) => {
        const isClickInsideDropdown = /** @type {HTMLElement} */ (
            event.target
        ).closest('#drop-list');
        const isClickInsideMenu = /** @type {HTMLElement} */ (
            event.target
        ).closest('#menu-btn');
        if (!isClickInsideDropdown && !isClickInsideMenu) {
            drop_menu?.classList.remove('show');
            btnMenu?.classList.remove('active');
        }
    });
}

function handleContentOverflow() {
    const width = window.innerWidth;
    const contentDiv = document.querySelector('table > tr > th');
    if (!contentDiv) return;
    // Thay đổi nội dung dựa trên độ rộng
    if (width < 820) contentDiv.innerHTML = '...';
    else contentDiv.innerHTML = 'Check<i class="fa-solid fa-filter">';

    Array.from(document.getElementsByClassName('details-wrapper')).forEach(
        (e) => {
            if (e.scrollHeight > e.clientHeight) e.classList.add('isOverFlow');
            else e.classList.remove('isOverFlow');
        },
    );
}

/** Main funstion */
async function main() {
    //
    initializeSideBar();
    initializeMainButton();

    renderManagement();
}

window.addEventListener('resize', handleContentOverflow);
window.addEventListener('load', main);
