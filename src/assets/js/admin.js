import fakeDatabase from './db/fakeDBv1.js';
import userRender from './render/table/userTable.js';
import cartRender from './render/table/cartTable.js';
import sachRender from './render/table/sachTable.js';
import orderRender from './render/table/orderTabel.js';
import { showPopup, toast } from './render/popupRender.js';
import dashboardRender from './render/dashboardRender.js';
import { tableEditOff, tableEditOn } from './render/table/customCell.js';

/**
 * Định nghĩa các kiểu dữ liệu sử dụng trong file
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

const urlParams = new URLSearchParams(window.location.search);
/** @type {string} */
let tab = urlParams.get('tab') || 'dashboard';

const tabElement = /** @type {HTMLInputElement | null} */ (
    document.querySelector('input[name="tab-selestion"][value="' + tab + '"]')
);
if (tabElement && !tabElement.checked) {
    tabElement.click();
}

const btnMenu = /**@type {HTMLButtonElement} */ (
    document.getElementById('menu-btn')
);
const btnAdd = /**@type {HTMLButtonElement} */ (
    document.getElementById('add-btn')
);
const btnSave = /**@type {HTMLButtonElement} */ (
    document.getElementById('save-btn')
);
const btnDelete = /**@type {HTMLButtonElement} */ (
    document.getElementById('delete-btn')
);
const btnSignOut = document.getElementById('sign-out');
// eslint-disable-next-line jsdoc/no-undefined-types
const tabElements = /** @type {NodeListOf<HTMLInputElement>} */ (
    document.getElementsByName('tab-selestion')
);
const loadingTable = document.getElementById('loading');

/**
 * Quản lý các hàm render và cập nhật dữ liệu cho từng tab
 *
 * @type {{
 *     [Key: string]: import('./render/table/baseRender.js').IntefaceRender<?>;
 * }}
 */
const tabManagement = {
    user: userRender,
    cart: cartRender,
    sach: sachRender,
    order: orderRender,
};

/**
 * Lấy dữ liệu từ database giả lập cho từng tab
 *
 * @type {{ [key: string]: () => Promise<?> }}
 */
const fakeDBManagement = {
    user: () => fakeDatabase.getAllUserInfo(),
    cart: () => fakeDatabase.getALlCart(),
    sach: () => fakeDatabase.getAllBooks(),
    order: () => fakeDatabase.getAllOrder(),
};

// đặt lại tên biến phía duối cho tôi
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

        tableEditOff(
            /**@type {NodeListOf<HTMLTableCellElement>}*/(
                document.querySelectorAll('#content_table td')
            ),
        );
    },
    /* Đổi trạng thái nút thành "Lưu" và cho phép chỉnh sửa */
    save: () => {
        btnSave &&
            (btnSave.innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>');
        btnSave?.classList.add('canedit');

        tableEditOn(
            /**@type {NodeListOf<HTMLTableCellElement>}*/(
                document.querySelectorAll('#content_table td')
            ),
        );
    },
};

/** Xử lý render dữ liệu tương ứng với tab hiện tại */
/** @param {string} inputValue */
async function renderManagement(inputValue = '') {
    const titleTabs = {
        user: 'User',
        cart: 'Cart',
        sach: 'Sách',
        dashboard: 'Dashboard',
        order: 'Order',
    };
    let web_title = document.querySelector('head title');
    if (web_title) web_title.innerHTML = `Admin Web - ${titleTabs[tab]}`;
    if (tab == 'dashboard') {
        document.querySelector('.dashboard-wrapper')?.classList.remove('hide');
        document.querySelector('.table-wrapper')?.classList.add('hide');
        dashboardRender();
        return;
    }
    document.querySelector('.dashboard-wrapper')?.classList.add('hide');
    document.querySelector('.table-wrapper')?.classList.remove('hide');

    const title = document.getElementById('table-title-header');
    const input = /** @type {HTMLInputElement} */ (
        document.getElementById('search-input')
    );
    input.value = inputValue;
    if (!title || !input) return;
    title.innerHTML = titleTabs[tab];
    loadingTable && (loadingTable.style.display = 'flex');
    const data = fakeDBManagement[tab] ? await fakeDBManagement[tab]() : [];
    loadingTable && (loadingTable.style.display = 'none');
    tabManagement[tab].renderTable(data);
    tabManagement[tab].search(data);

    input.oninput = () => tabManagement[tab].search(data);

    btnAdd.style.display = 'flex';
    btnSave.style.display = 'flex';
    btnDelete.style.display = 'flex';

    // cập nhật nút
    if (!tabManagement[tab].addRow) {
        btnAdd.style.display = 'none';
    }
    if (!tabManagement[tab].doSave) {
        btnSave.style.display = 'none';
    }
    if (!tabManagement[tab].removeRows) {
        btnDelete.style.display = 'none';
    }
}

/** Không biết ghi gì */
/** @returns {Promise<void>} */
function updateMangement() {
    return tabManagement[tab].doSave();
}

function handleContentOverflow() {
    const width = window.innerWidth;
    const contentDiv = document.querySelector('table > tr > th');
    if (!contentDiv) return;
    // Thay đổi nội dung dựa trên độ rộng
    if (width < 820) contentDiv.innerHTML = '...';
    else contentDiv.innerHTML = 'Check';

    Array.from(document.getElementsByClassName('details-wrapper')).forEach(
        (e) => {
            if (e.scrollHeight > e.clientHeight) e.classList.add('isOverFlow');
            else e.classList.remove('isOverFlow');
        },
    );
}

function setupMainButtonEvents() {
    /** @this {HTMLElement} */
    function handleButtonSave() {
        const isEditMod = this.classList.contains('canedit');
        // nhấn nút Edit
        if (!isEditMod) {
            buttonSaveState.save();
            return;
        }

        // nếu nhấn nút save
        showPopup(
            'Xác nhận sửa',
            'Bạn có muốn lưu chỉnh sửa',
            () => {
                updateMangement()
                    .then(() => {
                        buttonAddState.add();
                        buttonSaveState.edit();

                        toast({
                            title: 'Thành công!',
                            message: 'Bạn đã lưu chỉnh sửa thành công.',
                            type: 'success',
                            duration: 5000,
                        });

                    })

            },
            () => {
                tabManagement[tab].removeAllChange?.();
                renderManagement(
                    /** @type {HTMLInputElement} */(
                        document.getElementById('search-input')
                    )?.value,
                )
                    .then(() => {
                        buttonAddState.add();
                        buttonSaveState.edit();
                    })
                    .catch(() => { });
            },
        );
    }

    /** @this {HTMLElement} */
    function handleButtonDelete() {
        showPopup(
            'Xác nhận xóa',
            'Bạn có muốn xóa vĩnh viên các dòng hay không.',
            () => {
                tabManagement[tab].removeRows?.();
                toast({
                    title: 'Thành công!',
                    message: 'Bạn đã xoá thành công.',
                    type: 'success',
                    duration: 5000,
                });
            },
            () => {
                tabManagement[tab].removeAllChange?.();
            },
        );
    }

    /** @this {HTMLElement} */
    function HandleButtonAdd() {
        const isAddMode = this.classList.contains('btn-warning');

        if (isAddMode) {
            buttonAddState.add();
            tabManagement[tab].cancelAdd?.();
        } else {
            buttonAddState.cancel();
            tabManagement[tab].addRow?.();
        }
    }

    function handleButtonSignOut() {
        window.localStorage.removeItem('isAdmin');
        window.sessionStorage.removeItem('isAdmin');
        location.href = '/admin/login.html';
    }

    btnDelete?.addEventListener('click', handleButtonDelete);
    btnSave?.addEventListener('click', handleButtonSave);
    btnAdd?.addEventListener('click', HandleButtonAdd);
    btnSignOut?.addEventListener('click', handleButtonSignOut);
}

/** @param {PopStateEvent} event */
function handlePopState(event) {
    const isEditMode = btnSave?.classList.contains('canedit');

    if (isEditMode) {
        if (event.state?.tab != tab) {
            history.go(1);
            showPopup('Xác nhận sửa', 'Bạn có chắc là muốn sửa không', () => {
                updateMangement().then(() => {
                    buttonAddState.add();
                    buttonSaveState.edit();

                    toast({
                        title: 'Thành công!',
                        message: 'Bạn đã lưu chỉnh sửa thành công.',
                        type: 'success',
                        duration: 5000,
                    });

                    // @ts-ignore
                    history.back(1);

                }).then((e) => {
                    toast({
                        title: 'Lỗi!',
                        message: String(e),
                        type: 'error',
                        duration: 5000,
                    });
                });
            });
        }

        return;
    }

    tab = event.state?.tab || 'user';
    tabElements.forEach((e) => (e.checked = false));
    const tab_ = /** @type {HTMLInputElement | null} */ (
        document.querySelector(
            'input[name="tab-selestion"][value="' + tab + '"]',
        )
    );

    if (tab_) tab_.checked = true;

    renderManagement();
}

function setupSiderBar() {
    const drop_menu = document.querySelector('.aside');

    /**
     * Xử lý khi chuyển giữa các tab khác nhau
     *
     * @this {HTMLInputElement}
     */
    function handleSwitchTab() {
        const isEditMode = btnSave?.classList.contains('canedit');

        if (isEditMode) {
            this.checked = false;
            showPopup(
                'Xác nhận sửa',
                'Bạn có chắc là muốn sửa không',
                () => {

                    updateMangement().then(() => {
                        buttonAddState.add();
                        buttonSaveState.edit();
                        tabElements.forEach((e) => (e.checked = false));
                        this.checked = true;
                        tab = this.value;
                        renderManagement();
                    }).then(() => {
                    });

                },
                () => {
                    buttonAddState.add();
                    buttonSaveState.edit();
                    tabManagement[tab].removeAllChange?.();
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

        if (this.value === tab) return;
        tab = this.value;

        // cập nhật url

        history.pushState({ tab }, '', `?tab=${tab}`);

        renderManagement();
    }

    function handleClickOutside(event) {
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
    }

    // hàm này đểm làm gì vậy tuấn
    // ?
    function handleDropList() {
        drop_menu?.classList.remove('show');
        // NOTE: không xóa dòng này -_-
        btnMenu?.classList.remove('active');
    }

    /** @this {HTMLElement} */
    function handleButtonMenu() {
        if (!this.classList.contains('active')) {
            document.querySelector('.aside')?.classList.add('show');
            this.classList.add('active');
            return;
        }
        document.querySelector('.aside')?.classList.remove('show');
        this.classList.remove('active');
    }

    tabElements.forEach((e) => e.addEventListener('click', handleSwitchTab));

    // show side bar where in mobile ui
    btnMenu?.addEventListener('click', handleButtonMenu);
    document
        .getElementById('drop-list')
        ?.addEventListener('click', handleDropList);

    document.addEventListener('click', handleClickOutside);
}

/** Main funstion */
async function main() {
    //
    setupMainButtonEvents();
    setupSiderBar();
    renderManagement();

    // popstate là gì
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('resize', handleContentOverflow);
}

main();
