import addressData from './addressDb.js';

/**
 * @typedef {import('../until/type.js').Cart} Cart
 *
 * @typedef {import('../until/type.js').Category} Category
 *
 * @typedef {import('../until/type.js').Sach} Sach
 *
 * @typedef {import('../until/type.js').UserInfo} UserInfo
 *
 * @typedef {import('../until/type.js').imgStore} ImgStore
 *
 * @typedef {import('../until/type.js').Order} Order
 */

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

    /** @param {ObjectStoreName} objectStoreName */
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

    /**
     * @param {string} user_id
     * @returns {Promise<UserInfo | undefined>}
     */
    async getUserInfoByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.get(user_id));
    }

    /** @returns {Promise<UserInfo[]>} */
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

    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<UserInfo>}
     */
    async getUserInfoByEmailAndPassword(email, password) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(
            userStore.index('email_and_pass').get([email, password]),
        );
    }

    /**
     * @param {string} phone_num
     * @returns {Promise<UserInfo>}
     */
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

    /**
     * @param {UserInfo} userInfo
     * @returns {Promise<?>}
     */
    async addUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.add(userInfo));
    }

    /**
     * @param {UserInfo} userInfo
     * @returns {Promise<?>}
     */
    async updateUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return this.requestToPromise(userStore.put(userInfo));
    }

    /** @returns {Promise<Sach[]>} */
    async getAllSach() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readonly');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.getAll());
    }

    /**
     * @param {string} sach_id
     * @returns {Promise<Sach | undefined>}
     */
    async getSachById(sach_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readonly');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.get(sach_id));
    }

    /**
     * @param {Sach} bookInfo
     * @returns {Promise<?>}
     */
    async addSach(bookInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.add(bookInfo));
    }

    /**
     * @param {Sach} bookInfo
     * @returns {Promise<?>}
     */
    async updateSach(bookInfo) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.put(bookInfo));
    }

    /**
     * @param {string} sach_id
     * @returns {Promise<?>}
     */
    async deleteSachById(sach_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readwrite');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return this.requestToPromise(bookStore.delete(sach_id));
    }

    /** @returns {Promise<Cart[]>} */
    async getALlCart() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(cartStore.getAll());
    }

    /**
     * @param {string} user_id
     * @returns {Promise<Cart[]>}
     */
    async getCartByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(
            cartStore.index('user_id').getAll(user_id),
        );
    }

    /**
     * @param {string} cart_id
     * @returns {Promise<Cart | undefined>}
     */
    async getCartById(cart_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(cartStore.get(cart_id));
    }

    /**
     * @param {Cart} cart_data
     * @returns {Promise<?>}
     */
    async updateCart(cart_data) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readwrite');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return this.requestToPromise(cartStore.put(cart_data));
    }

    /** @returns {Promise<Category[]>} */
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

    /**
     * @param {string} id
     * @returns {Promise<Category | undefined>}
     */
    async getCategoryById(id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CATEGORY);
        const transaction = db.transaction(
            ObjectStoreName.CATEGORY,
            'readonly',
        );
        const categoryStore = transaction.objectStore(ObjectStoreName.CATEGORY);
        return this.requestToPromise(categoryStore.get(id));
    }

    /** @returns {Promise<ImgStore[]>} */
    async getAllImgs() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readonly');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.getAll());
    }

    /**
     * @param {string} id
     * @returns {Promise<ImgStore>}
     */
    async getImgById(id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readonly');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.get(id));
    }

    /**
     * @param {ImgStore} img
     * @returns {Promise<?>}
     */
    async addImg(img) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readwrite');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.add(img));
    }

    /**
     * @param {ImgStore} img
     * @returns {Promise<?>}
     */
    async updateImg(img) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readwrite');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return this.requestToPromise(imgStore.put(img));
    }

    /** @returns {Promise<string[]>} */
    async getAllTinhThanPho() {
        return addressData.map((e) => e.Name);
    }

    /**
     * @param {string} name
     * @returns {Promise<string[]>}
     */
    async getAllTinhThanhByThanPho(name) {
        return (
            addressData
                .find((e) => e.Name == name)
                ?.Districts.map((e) => e.Name) || []
        );
    }

    /**
     * @param {string} pt
     * @param {string} quan
     * @returns {Promise<string[]>}
     */
    async getAllpxByThinhTpAndQh(pt, quan) {
        const pts = addressData.find((e) => e.Name == pt);
        if (!pts) return [];
        const qh = pts.Districts.find((e) => e.Name == quan);
        if (!qh) return [];
        return qh.Wards.map((e) => e.Name || '') || [];
    }

    /** @returns {Promise<Order[]>} */
    async getAllOrder() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readonly');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.getAll());
    }

    /**
     * @param {string} order_id
     * @returns {Promise<Order | undefined>}
     */
    async getOrderById(order_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readonly');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.get(order_id));
    }

    /**
     * @param {Order} order
     * @returns {Promise<?>}
     */
    async addOrder(order) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readwrite');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.add(order));
    }

    /**
     * @param {Order} order
     * @returns {Promise<?>}
     */
    async updateOrder(order) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readwrite');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return this.requestToPromise(orderStore.put(order));
    }

    /**
     * @param {string} order_id
     * @returns {Promise<?>}
     */
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
