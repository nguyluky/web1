import fakeDatabase from '../../db/fakeDBv1.js';
import uuidv from '../../until/uuid.js';
import {
    createBlockTextCell,
    createCheckBox,
    createImgThumbnailCell,
    createTagsCell,
    createTextSell,
    renderTable,
    searchList,
} from './baseRender.js';
import { showImgPreviewPopup } from '../popupRender.js';

/**
 * @typedef {import('../../until/type.js').Sach} Sach
 *
 * @typedef {import('../../until/type.js').imgStore} imgStore
 *
 * @typedef {import('../../until/type.js').Category} Category
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
 * @param {Sach} value
 * @param {import('./baseRender.js').OnChange<Sach>?} onchange
 * @returns {HTMLTableRowElement} Row
 */
function createRow(value, onchange = null) {
    const row = document.createElement('tr');
    row.setAttribute('id-row', value.id);

    const col = createCheckBox(value['id']);
    row.appendChild(col);

    const title = createTextSell('title', value['title'], (nv) => {
        onchange && onchange(value, 'title', nv);
    });
    title.style.minWidth = '100px';
    row.appendChild(title);

    const base_price = createTextSell(
        'base_price',
        value['base_price'] + '',
        (nv) => {
            onchange && onchange(value, 'base_price', +nv);
        },
    );
    row.appendChild(base_price);

    const category = createTagsCell('category', value['category'], [], (nv) => {
        // onchange && onchange(value, 'category', nv);
        console.log(nv);
    });
    fakeDatabase.getAllCategory().then((allCategory) => {
        category.allTags = allCategory.map((e) => {
            return {
                value: e.id,
                title: e.name,
            };
        });
    });
    row.appendChild(category);

    const details = createBlockTextCell('details', value['details'], (nv) => {
        onchange && onchange(value, 'details', nv);
    });
    row.appendChild(details);

    const thumbnail = createImgThumbnailCell('thumbnail', '', (a) => {});
    fakeDatabase.getImgById(value.thumbnal).then((img) => {
        thumbnail.value = img?.data || '';
    });
    row.appendChild(thumbnail);

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
        discount: 0,
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
