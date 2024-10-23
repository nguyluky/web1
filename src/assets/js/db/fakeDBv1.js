import uuidv4 from '../until/uuid.js';
import addressData from './addressDb.js';

/** @enum {string} */
const ObjectStoreName = {
    USER: 'userStore',
    CART: 'cartStore',
    BOOK: 'bookStore',
    CATEGORY: 'categoryStore',
    IMG: 'imgStore',
    ORDER: 'orderStore',
};
/**
 * Biến lưu trữ kết nối đến IndexedDB
 *
 * @type {IDBDatabase}
 */
let db;
let isOnupgradeneeded = false;
const req = window.indexedDB.open('fakedb', 1);

// Initialize dataLoaded state from localStorage or set default
const dataLoaded = JSON.parse(
    /** @type {string} */ (window.localStorage.getItem('dataLoaded')),
) || {
    [ObjectStoreName.USER]: false,
    [ObjectStoreName.IMG]: false,
    [ObjectStoreName.CATEGORY]: false,
    [ObjectStoreName.BOOK]: false,
};

function updateDataLoaded(storeName) {
    dataLoaded[storeName] = true;
    window.localStorage.setItem('dataLoaded', JSON.stringify(dataLoaded));
}

/** @param {IDBDatabase} db_ */
function createObjectStore(db_) {
    // ==================== Tạo các objectStore trong cơ sở dữ liệu ==================

    //#region User
    // Tạo objectStore cho user
    const userObjStore_ = db_.createObjectStore(ObjectStoreName.USER, {
        keyPath: 'id',
        autoIncrement: true,
    });
    // Tạo các index để truy vấn dữ liệu user
    userObjStore_.createIndex('email', 'email', { unique: true });
    userObjStore_.createIndex('name', 'name', { unique: true });
    userObjStore_.createIndex('passwd', 'passwd', { unique: false });
    userObjStore_.createIndex('phone_num', 'phone_num', { unique: false });
    userObjStore_.createIndex('rule', 'rule', { unique: false });
    userObjStore_.createIndex('email_and_pass', ['email', 'passwd'], {
        unique: true,
    });
    //#endregion

    //#region Tạo objectStore cho cart
    const cartObjStore_ = db_.createObjectStore(ObjectStoreName.CART, {
        keyPath: 'id',
        autoIncrement: true,
    });
    cartObjStore_.createIndex('user_id', 'user_id', { unique: false });
    cartObjStore_.createIndex('sach', 'sach', { unique: false });
    cartObjStore_.createIndex('option_id', 'option_id', { unique: false });
    cartObjStore_.createIndex('quantity', 'quantity', { unique: false });
    cartObjStore_.createIndex('status', 'status', { unique: false });
    cartObjStore_.createIndex('timecreate', 'timecreate', { unique: false });
    //#endregion

    //#region Tạo objectStore cho book
    const bookObjStore_ = db_.createObjectStore(ObjectStoreName.BOOK, {
        keyPath: 'id',
        autoIncrement: true,
    });
    bookObjStore_.createIndex('title', 'title', { unique: false });
    bookObjStore_.createIndex('details', 'details', { unique: false });
    bookObjStore_.createIndex('thumbnal', 'thumbnal', { unique: false });
    bookObjStore_.createIndex('imgs', 'imgs', { unique: false });
    bookObjStore_.createIndex('base_price', 'base_price', { unique: false });
    bookObjStore_.createIndex('category', 'category', { unique: false });
    bookObjStore_.createIndex('option', 'option', { unique: false });
    //#endregion

    //#region Tạo objectStore cho category
    const categoryStore_ = db_.createObjectStore(ObjectStoreName.CATEGORY, {
        keyPath: 'id',
        autoIncrement: true,
    });
    categoryStore_.createIndex('name', 'name', { unique: false });
    categoryStore_.createIndex('long_name', 'long_name', { unique: false });

    //#endregion
    //#region Tạo objectStore cho img
    const imgStore = db_.createObjectStore(ObjectStoreName.IMG, {
        keyPath: 'id',
        autoIncrement: true,
    });
    imgStore.createIndex('data', 'data');
    //#endregion

    // #region Tạo objectStore cho order
    const orderStore = db_.createObjectStore(ObjectStoreName.ORDER, {
        keyPath: 'id',
        autoIncrement: true,
    });
    orderStore.createIndex('user_id', 'user_id', { unique: false });
    orderStore.createIndex('items', 'items', { unique: false });
    orderStore.createIndex('data', 'data', { unique: false });
    orderStore.createIndex('state', 'state', { unique: false });
    orderStore.createIndex('last_update', 'last_update', { unique: false });
    orderStore.createIndex('is_pay', 'is_pay', { unique: false });
    orderStore.createIndex('total', 'total', { unique: false });
}
async function loadUserData() {
    if (!dataLoaded[ObjectStoreName.USER]) {
        const data = await fetch('/assets/data/user.json').then((res) =>
            res.json(),
        );
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        data.data.forEach((e) => userStore.add(e));
        // await requestToPromise(transaction);
        updateDataLoaded(ObjectStoreName.USER);
    }
}
async function loadImgData() {
    if (!dataLoaded[ObjectStoreName.IMG]) {
        const data = await fetch('/assets/data/img.json').then((res) =>
            res.json(),
        );
        const transaction = db.transaction(ObjectStoreName.IMG, 'readwrite');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        data.data.forEach((e) => imgStore.add(e));
        updateDataLoaded(ObjectStoreName.IMG);
        // await requestToPromise(transaction);
    }
}
async function loadCategoryData() {
    if (!dataLoaded[ObjectStoreName.CATEGORY]) {
        const data = await fetch('/assets/data/category.json').then((res) =>
            res.json(),
        );
        const transaction = db.transaction(
            ObjectStoreName.CATEGORY,
            'readwrite',
        );
        const categoryStore = transaction.objectStore(ObjectStoreName.CATEGORY);
        data.data.forEach((e) => categoryStore.add(e));
        // await requestToPromise(transaction);
        updateDataLoaded(ObjectStoreName.CATEGORY);
    }
}
async function loadBookData() {
    if (!dataLoaded[ObjectStoreName.BOOK]) {
        const data = await fetch('/assets/data/book.json').then((res) =>
            res.json(),
        );
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        data.data.forEach((e) => bookStore.add(e));
        // await requestToPromise(transaction);
        updateDataLoaded(ObjectStoreName.BOOK);
    }
}
async function loadOrder(params) {}

req.onupgradeneeded = (event) => {
    isOnupgradeneeded = true;
    let db_ = req.result;
    createObjectStore(db_);
    event.target.transaction.oncomplete = () => {
        isOnupgradeneeded = false;
        db = db_;
    };
};

req.onerror = (event) => {
    console.error('IndexedDB error:', event);
};
req.onsuccess = () => {
    if (!isOnupgradeneeded) db = req.result;
};

// ## hàm liên quan đến người dùng
// - getUserInfoByUserId
// - getAllUserInfo
// - deleteUserById
// - getUserInfoByEmailAndPassword
// - getUserInfoByPhoneNum              không nên dùng (chuyển qua hàm checkIfUserExists)
// - checkIfUserExists
// - addUserInfo
// - updateUserInfo
// ## hàm liên quan đến sách
// - getAllSach
// - getSachById
// - addSach
// - updateSach
// - deleteSachById
// ## hàm liên quan đến giỏ hàng
// - getALlCart
// - getCartByUserId
// - getCartById
// - updateCart
// ## hàm liên quan đến danh mục
// - getAllCategory
// ## hàm liên quan đến ảnh
// - getAllImgs
// - getImgById
// - addImg
// - updateImg
// ## hàm liên quan đến địa chỉ
// - getAllTinhThanPho
// - getAllTinhThanhByThanPho
// - getAllpxByThinhTpAndQh
// ## hàm liên quan đến đơn hàng
// - getAllOrder
// - getOrderById
// - addOrder
// - updateOrder
// - deleteOrderById
// ## hàm liên quan đến địa chỉ
// - getAllTinhThanPho
// - getAllTinhThanhByThanPho
// - getAllpxByThinhTpAndQh
class FakeDatabase {
    isReady() {
        return !!db;
    }

    async requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async awaitUntilReady() {
        while (!db) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    async ensureDataLoaded(objectStoreName) {
        switch (objectStoreName) {
            case ObjectStoreName.USER:
                await loadUserData();
                break;
            case ObjectStoreName.IMG:
                await loadImgData();
                break;
            case ObjectStoreName.CATEGORY:
                await loadCategoryData();
                break;
            case ObjectStoreName.BOOK:
                await loadBookData();
                break;
            default:
                break;
        }
    }

    async getUserInfoByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.get(user_id));
    }

    async getAllUserInfo() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.getAll());
    }

    async deleteUserById(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.delete(user_id));
    }

    async getUserInfoByEmailAndPassword(email, password) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(
            userStore.index('email_and_pass').get([email, password]),
        );
    }

    async getUserInfoByPhoneNum(phone_num) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(
            userStore.index('phone_num').get(phone_num),
        );
    }

    async checkIfUserExists(email, phone_num) {
        // TODO: Implement this function
    }

    async addUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.add(userInfo));
    }

    async createUserInfo(password, display_name, std, email) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const user_id = uuidv4();
        const userInfo = {
            id: user_id,
            name: display_name,
            email,
            passwd: password,
            phone_num: std,
            rule: 'user',
        };
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.add(userInfo));
    }

    async updateUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.put(userInfo));
    }

    async getAllSach() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readonly');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.getAll());
    }

    async getSachById(sach_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readonly');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.get(sach_id));
    }

    async addSach(bookInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.add(bookInfo));
    }

    async updateSach(bookInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.put(bookInfo));
    }

    async deleteSachById(sach_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.delete(sach_id));
    }

    async getALlCart() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(cartStore.getAll());
    }

    async getCartByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(
            cartStore.index('user_id').getAll(user_id),
        );
    }

    async getCartById(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(cartStore.get(user_id));
    }

    async updateCart(cart_data) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readwrite');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(cartStore.put(cart_data));
    }

    async getAllCategory() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CATEGORY);
        const transaction = db.transaction(
            ObjectStoreName.CATEGORY,
            'readonly',
        );
        const categoryStore = transaction.objectStore(ObjectStoreName.CATEGORY);
        return this.requestToPromise(categoryStore.getAll());
    }

    async getAllImgs() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readonly');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.getAll());
    }

    async getImgById(id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readonly');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.get(id));
    }

    async addImg(img) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readwrite');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.add(img));
    }

    async updateImg(img) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readwrite');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.put(img));
    }

    async getAllTinhThanPho() {
        return addressData.map((e) => e.Name);
    }

    async getAllTinhThanhByThanPho(name) {
        return (
            addressData
                .find((e) => e.Name == name)
                ?.Districts.map((e) => e.Name) || []
        );
    }

    async getAllpxByThinhTpAndQh(pt, quan) {
        const pts = addressData.find((e) => e.Name == pt);
        if (!pts) return [];
        const qh = pts.Districts.find((e) => e.Name == quan);
        if (!qh) return [];
        return qh.Wards.map((e) => e.Name || '') || [];
    }

    // tạo cho tôi hàm liên quan đến đơn hàng

    async getAllOrder() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readonly');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.getAll());
    }

    async getOrderById(order_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readonly');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.get(order_id));
    }

    async addOrder(order) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readwrite');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.add(order));
    }

    async updateOrder(order) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readwrite');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.put(order));
    }

    async deleteOrderById(order_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readwrite');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.delete(order_id));
    }
}

const fakeDatabase = new FakeDatabase();
export default fakeDatabase;
