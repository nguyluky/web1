import fakeDatabase from '../../db/fakeDBv1.js';
import uuidv from '../../until/uuid.js';
import {
    createRow,
    defaultAddRow,
    getAllRowsSeletion,
    removeRowById,
    renderTable,
    searchList,
} from './baseRender.js';
import {
    createBlockTextTabelCell,
    createTagInputCell,
    createThumbnailCell,
    tableEditOn,
} from './customCell.js';
import { createTextTableCell } from './customCell.js';

/**
 * @typedef {import('../../until/type.js').Sach} Sach
 * @typedef {import('../../until/type.js').imgStore} imgStore
 * @typedef {import('../../until/type.js').Category} Category
 */

const cols = {
    title: 'Title',
    base_price: 'Price',
    discount: 'Discount',
    category: 'Category',
    details: 'Details',
    thumbnail: 'Thumbnail',
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
 * @returns {HTMLTableCellElement}
 */
function createCategoryCell(key, value, onchange) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'category');

    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-container';
    td.appendChild(categoryContainer);
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

    return td;
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {(base64: string) => any} onchange
 * @returns {HTMLTableCellElement}
 */
function createThumbnail(key, value, onchange) {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'false');
    td.setAttribute('key', key);
    td.setAttribute('ctype', 'img-thumbnail');

    // tạo div bao ảnh
    const img_wrapper = document.createElement('div');
    img_wrapper.className = 'img-wrapper';
    // tạo thẻ img hiển thị ảnh
    const img = document.createElement('img');
    fakeDatabase.getImgById(value).then((imgS) => {
        img.src = imgS?.data || '../assets/img/default-image.png';
    });
    img_wrapper.appendChild(img);
    img_wrapper.addEventListener('click', () => {
        if (td.getAttribute('contenteditable') !== 'true') return;
        showImgPreviewPopup(
            img.src,
            () => {},
            (base64) => {
                onchange && onchange(base64);
                img.src = base64;
            },
            () => {},
        );
    });

    td.appendChild(img_wrapper);

    return td;
}

/**
 * @param {HTMLTableRowElement} row
 * @param {Sach} value
 * @param {import('./baseRender.js').OnChange<Sach>?} onchange
 */
function renderRow(row, value, onchange = null) {
    Object.keys(cols).forEach((key) => {
        switch (key) {
            case 'category': {
                const td = createTagInputCell('category', [], [], () => {});
                row.appendChild(td);

                fakeDatabase.getAllCategory().then((allCategory) => {
                    const tag = allCategory.map((e) => {
                        return {
                            title: e.name,
                            value: e.id,
                        };
                    });

                    const category = createTagInputCell(
                        'category',
                        value.category,
                        tag,
                        (nv) => {
                            console.log(nv);
                            onchange && onchange(value, 'category', nv);
                        },
                    );

                    const isEdit = td
                        .querySelector('.tag-container')
                        ?.classList.contains('on');
                    td.replaceWith(category);
                    if (isEdit) {
                        // @ts-ignore
                        tableEditOn([category]);
                    }
                });

                break;
            }
            case 'details': {
                const detail = createBlockTextTabelCell(
                    'details',
                    value.details,
                    (nv) => {
                        onchange && onchange(value, 'details', nv);
                    },
                );
                row.appendChild(detail);
                break;
            }
            case 'thumbnail': {
                const td = createThumbnailCell('thumbnail', '', () => {});

                row.appendChild(td);

                fakeDatabase.getImgById(value.thumbnail).then((img) => {
                    const imgThumbnail = createThumbnailCell(
                        'thumbnail',
                        img.data || '../assets/img/default-image.png',
                        (e) => {
                            console.log(e);
                        },
                    );
                    const isEdit = td.getAttribute('contenteditable') == 'true';
                    td.replaceWith(imgThumbnail);

                    if (isEdit) {
                        imgThumbnail.setAttribute('contenteditable', 'true');
                    }
                });
                // const imgThumbnail = createThumbnail(
                //     'thumbnail',
                //     value.thumbnail,
                //     (base64) => {
                //         // onchange && onchange(value, 'thumbnail', base64);
                //         cacheImg[value.thumbnail] = base64;
                //         // TODO: thêm kiểm tran thay đôi rồi thêm ischange
                //     },
                // );

                // row.appendChild(imgThumbnail);

                break;
            }
            case 'title': {
                const col = createTextTableCell('title', value.title, (nv) => {
                    onchange && onchange(value, 'title', nv);
                });
                col.style.minWidth = '100px';
                row.appendChild(col);
                break;
            }
            default: {
                const col = createTextTableCell(key, value[key], (nv) => {
                    // @ts-ignore
                    onchange && onchange(value, key, nv);
                });
                row.appendChild(col);
            }
        }
    });
}

/** @param {Sach[]} list */
function renderSach(list) {
    const table = /** @type {HTMLTableElement} */ (
        document.getElementById('content_table')
    );
    if (!table) return;

    renderTable(list, table, cols, handleOnChange, renderRow);
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
        thumbnail: 'default',
        imgs: [],
        base_price: 0,
        discount: 0,
        category: [],
    };
    cacheAdd.push(data);
    let row = createRow(
        data,
        cols,
        (data, key, values) => {
            cacheAdd[0][key] = values;
        },
        renderRow,
    );

    defaultAddRow(table, row);
}

function cancelAdd() {
    document.querySelector(`tr[id-row="${cacheAdd[0].id}"]`)?.remove();
    cacheAdd = [];
}
function removeRows() {
    const selections = getAllRowsSeletion();
    selections.forEach((id) => {
        fakeDatabase.deleteUserById(id);
        removeRowById(id);
    });
}

async function saveBook() {
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
            e.thumbnail = uuidv(36);
            let img_id = e.thumbnail;
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
}

function removeAllChange() {
    cacheSave = {};
    cacheAdd = [];
    document.querySelectorAll('tr').forEach((e) => {
        let cb = /** @type {HTMLInputElement | null} */ (
            e.querySelector('input[type="checkbox"]')
        );
        if (cb?.checked) {
            cb.checked = false;
        }
    });
}
// chuyển qua file popupFactory.js

/** @type {import('./baseRender.js').IntefaceRender<Sach>} */
const Sach_ = {
    cols,
    renderTable: renderSach,
    search: searchSach,
    doSave: saveBook,
    addRow,
    removeRows,
    cancelAdd,
    removeAllChange,
};

export default Sach_;
