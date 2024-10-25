import fakeDatabase from '../db/fakeDBv1.js';
import uuidv from '../until/uuid.js';
import {
    createCheckBox,
    createTableSell,
    renderTable,
    searchList,
} from './baseRender.js';
import { showImgPreviewPopup } from './popupRender.js';

/**
 * @typedef {import('../until/type.js').Sach} Sach
 *
 * @typedef {import('../until/type.js').imgStore} imgStore
 *
 * @typedef {import('../until/type.js').Category} Category
 *
 */

const cols = {
    title: 'Title',
    base_price: 'Price',
    category: 'Category',
    details: 'Details',
    thumbnal: 'Thumbnal',
};
let cacheSave = {};
let cacheAdd = [];
let cacheImg = {};

/**
 * Hàm xử lý khi có thay đổi dữ liệu trên bảng (hàm callback)
 *
 * @type {import('./baseRender.js').OnChange<Sach>}
 */
function handleOnChange(data, key, newValue) {
    if (key == 'base_price') {
        newValue = +newValue;
    }

    if (cacheSave[data.id]) {
        cacheSave[data.id] = {
            ...cacheSave[data.id],
            [key]: newValue,
        };
    } else {
        cacheSave[data.id] = {
            ...data,
            [key]: newValue,
        };
    }
}

/**
 *
 * @param {string[]} value
 * @param {(categorys: string[]) => any} onchange
 * @returns {HTMLDivElement}
 */
function createCategoryCell(value, onchange) {
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-container';

    const categorys = [...value];

    /**
     * @param {string[]} blackList
     * @param {(category: Category) => any} callback
     * @returns {HTMLDivElement}
     */
    function createAddCategoryPopup(blackList, callback) {
        const categoryPopup = document.createElement('div');
        categoryPopup.className = 'category-popup';

        fakeDatabase.getAllCategory().then((allCategory) => {
            allCategory.forEach((category) => {
                if (blackList.includes(category.id)) return;
                const span = document.createElement('span');
                span.textContent = category.name;

                span.addEventListener('click', (event) => {
                    event.stopPropagation();
                    callback(category);
                });

                categoryPopup.appendChild(span);
            });
        });

        return categoryPopup;
    }

    /**
     *
     * @param {string | undefined} categoryId
     */
    function handleRemoveCategory(categoryId) {
        console.log('remove', categoryId);

        categoryContainer
            .querySelector('.category[category-id="' + categoryId + '"]')
            ?.remove();
        const index = categorys.findIndex((e) => e == categoryId);
        if (index >= 0) {
            categorys.splice(index, 1);
            onchange(categorys);
        }
    }

    /**
     *
     * @param {Category} category
     */
    function handleAddCategory(category) {
        categoryContainer.querySelector('.category-popup')?.remove();
        const categoryAdd = categoryContainer.querySelector('.category.add');

        categorys.push(category.id);
        onchange(categorys);

        const categoryDiv = createCategoryElement(category);
        categoryContainer.insertBefore(categoryDiv, categoryAdd);
    }

    /**
     *
     * @param {Category | undefined} category
     * @returns {HTMLDivElement}
     */
    function createCategoryElement(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.setAttribute('category-id', category?.id || '');

        const s = document.createElement('span');
        s.textContent = category?.name || '';
        categoryDiv.appendChild(s);

        const i = document.createElement('i');
        i.className = 'fa-solid fa-xmark';
        categoryDiv.appendChild(i);

        i.addEventListener('click', () => {
            if (category) handleRemoveCategory(category.id);
        });

        return categoryDiv;
    }

    fakeDatabase.getAllCategory().then((allCategory) => {
        categorys.forEach((categoryMs) => {
            const category = allCategory.find((e) => e.id == categoryMs);
            const categoryDiv = createCategoryElement(category);

            categoryContainer.appendChild(categoryDiv);
        });

        // nút thêm category
        const categoryAdd = document.createElement('div');
        categoryAdd.className = 'category add';
        const span = document.createElement('span');
        span.textContent = 'Thêm';
        categoryAdd.appendChild(span);
        const i = document.createElement('i');
        i.className = 'fa-solid fa-plus';
        categoryAdd.appendChild(i);

        categoryAdd.addEventListener('click', function () {
            if (this.querySelector('.category-popup')) return;

            const addPopup = createAddCategoryPopup(
                categorys,
                handleAddCategory,
            );

            this.appendChild(addPopup);
        });

        categoryContainer.contentEditable = 'false';
        categoryContainer.appendChild(categoryAdd);
    });

    return categoryContainer;
}

/**
 * @param {Sach} value
 * @param {import('./baseRender.js').OnChange<Sach>?} onchange
 * @returns {HTMLTableRowElement} Row
 */
function createRow(value, onchange = null) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);

    const col = createCheckBox(value['id']);
    row.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = createTableSell(key);

        switch (key) {
            case 'category': {
                const categoryContainer = createCategoryCell(
                    value['category'],
                    (category) => {
                        // @ts-ignore
                        onchange(value, 'category', category);
                    },
                );
                col.appendChild(categoryContainer);
                break;
            }
            case 'details': {
                const details_wrapper = document.createElement('div');
                details_wrapper.className = 'details-wrapper';
                details_wrapper.insertAdjacentHTML('beforeend', value[key]);
                col.addEventListener('input', () => {
                    onchange &&
                        onchange(
                            value,
                            // @ts-ignore
                            'details',
                            details_wrapper.textContent || '',
                        );

                    if (
                        details_wrapper.textContent ==
                        details_wrapper.getAttribute('default-value')
                    )
                        col.setAttribute('ischange', 'false');
                    else col.setAttribute('ischange', 'true');
                });

                details_wrapper.setAttribute('default-value', value[key]);
                col.appendChild(details_wrapper);
                break;
            }
            case 'thumbnal': {
                // tạo div bao ảnh
                const img_wrapper = document.createElement('div');
                img_wrapper.className = 'img-wrapper';
                // tạo thẻ img hiển thị ảnh
                const img = document.createElement('img');
                fakeDatabase.getImgById(value[key]).then((imgS) => {
                    img.src = imgS?.data || '../assets/img/default-image.png';
                });
                img_wrapper.appendChild(img);
                img_wrapper.addEventListener('click', () => {
                    if (col.getAttribute('contenteditable') !== 'true') return;
                    showImgPreviewPopup(
                        img.src,
                        () => {},
                        (base64) => {
                            // lưu vào cache để lưu vào db
                            cacheImg[value.thumbnal] = base64;
                            img.src = base64;
                        },
                        () => {},
                    );
                });
                col.appendChild(img_wrapper);
                break;
            }
            default: {
                col.insertAdjacentHTML('beforeend', value[key]);
                col.setAttribute('default-value', value[key] || '');
                col.oninput = (event) => {
                    const target = /** @type {HTMLTableCellElement} */ (
                        event.target
                    );

                    if (onchange)
                        onchange(
                            value,
                            // @ts-ignore
                            key,
                            target.textContent,
                        );

                    if (
                        target.textContent ==
                        target.getAttribute('default-value')
                    )
                        col.setAttribute('ischange', 'false');
                    else col.setAttribute('ischange', 'true');
                };
            }
        }
        row.appendChild(col);
    });

    return row;
}

/** @param {Sach[]} list */
function renderSach(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, handleOnChange, createRow);
    // nếu tràn ô thì thêm overflow
    Array.from(document.getElementsByClassName('details-wrapper')).forEach(
        (e) => {
            if (e.scrollHeight > e.clientHeight) e.classList.add('isOverFlow');
        },
    );
}

/** @param {Sach[]} list */
function searchSach(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    const result = searchList(list, cols).map((e) => e.id);
    document.querySelectorAll('#content_table > tr[id-row]').forEach((e) => {
        const id = e.getAttribute('id-row') || '';
        if (result.includes(id)) {
            /** @type {HTMLElement} */ (e).style.display = '';
        } else {
            /** @type {HTMLElement} */ (e).style.display = 'none';
        }
    });
}

function addRow() {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;
    /** @type {Sach} */
    const data = {
        id: uuidv(36),
        title: '',
        details: '',
        thumbnal: 'default',
        imgs: [],
        base_price: 0,
        category: [],
    };
    cacheAdd.push(data);

    let row = createRow(data, (data, key, values) => {
        cacheAdd[0][key] = values;
    });
    row.querySelectorAll('td:not(:has(input[type="checkbox"]))').forEach(
        (e) => {
            e.setAttribute('contenteditable', 'true');
        },
    );
    table.insertBefore(row, table.childNodes[1]);
    /** @type {HTMLElement} */ (table.parentNode).scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

function cancelAdd() {
    document.querySelector(`tr[id-row="${cacheAdd[0].id}"]`)?.remove();
    cacheAdd = [];
}

function removeRows() {
    document.querySelectorAll('tr').forEach((e) => {
        let cb = /** @type {HTMLInputElement | null} */ (
            e.querySelector('input[type="checkbox"]')
        );
        if (cb?.checked) {
            let rowID = e.getAttribute('id-row');
            if (rowID) fakeDatabase.deleteSachById(rowID);
            e.remove();
        }
    });
}

async function saveBook() {
    console.log(cacheSave);

    Object.keys(cacheSave).forEach((e) => {
        console.log(e);
        const data = cacheSave[e];
        fakeDatabase.updateSach(data); // Gọi hàm cập nhật người dùng trong cơ sở dữ liệu giả lập
    });

    cacheAdd.forEach((e) => {
        console.log(e);
        let source = /** @type {HTMLImageElement} */ (
            document.querySelector(`tr[id-row="${e.id}"] .img-wrapper img`)
        ).src;
        if (source != '../assets/img/default-image.png') {
            e.thumbnal = uuidv(36);
            let img_id = e.thumbnal;
            let img = {
                id: img_id,
                data: source,
            };
            fakeDatabase.addImg(img);
        }
        fakeDatabase.addSach(e);
    });

    Object.keys(cacheImg).forEach((e) => {
        let img = {
            id: e,
            data: cacheImg[e],
        };
        fakeDatabase.updateImg(img);
    });

    cacheSave = {};
    cacheAdd = [];

    document.querySelectorAll('#content_table td').forEach((e) => {
        e.setAttribute('contenteditable', 'false'); // Khóa không cho chỉnh sửa
        e.setAttribute('ischange', 'false'); // Đặt lại trạng thái là không thay đổi
        e.setAttribute('default-value', e.textContent || ''); // Cập nhật giá trị mặc định
    });
}

// chuyển qua file popupFactory.js

/** @type {import('./baseRender.js').IntefaceRender<Sach>} */
const Sach_ = {
    cols,
    renderTable: renderSach,
    renderRow: createRow,
    search: searchSach,
    doSave: saveBook,
    addRow,
    removeRows,
    cancelAdd,
};

export default Sach_;
