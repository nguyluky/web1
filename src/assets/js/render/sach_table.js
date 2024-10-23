import fakeDatabase from '../db/fakeDBv1.js';
import uuidv from '../until/uuid.js';
import { renderTable, searchList } from './baseRender.js';
import { showImgPreviewPopup } from './popupRender.js';

/**
 * @typedef {import('../until/type.js').Sach} Sach
 *
 * @typedef {import('../until/type.js').imgStore} imgStore
 */

const cols = {
    id: 'Id',
    title: 'Title',
    base_price: 'Price',
    details: 'Details',
    thumbnal: 'Thumbnal',
    // imgs: 'imgs',
    // category: 'Category',
    // option: 'Option',
};
let cacheSave = {};
let cacheAdd = [];
let cacheImg = {};
/**
 * Hàm xử lý khi có thay đổi dữ liệu trên bảng (hàm callback)
 *
 * @type {import('./baseRender.js').OnChange<Sach>}
 */
function onChangeHandle(data, key, newValue) {
    console.log('onchange called');

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
    const col = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value['id'];
    checkbox.className = 'table-check-box';
    col.appendChild(checkbox);
    row.appendChild(col);

    Object.keys(cols).forEach((key) => {
        const col = document.createElement('td');
        col.oninput = (event) => {
            if (onchange)
                onchange(
                    value,
                    // @ts-ignore
                    key,
                    /** @type {HTMLTableCellElement} */ (event.target)
                        .textContent,
                );
        };
        col.setAttribute('key', key);

        if (key == 'details') {
            const details_wrapper = document.createElement('div');
            details_wrapper.className = 'details-wrapper';

            // const pre = document.createElement('pre');
            // pre.textContent = value[key];
            details_wrapper.insertAdjacentHTML('beforeend', value[key]);
            // details_wrapper.appendChild(pre);
            col.appendChild(details_wrapper);
        } else if (key == 'thumbnal') {
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
        } else col.insertAdjacentHTML('beforeend', value[key]);
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

    renderTable(list, table, cols, onChangeHandle, createRow);
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
