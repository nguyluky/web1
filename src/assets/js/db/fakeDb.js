/**
 *
 * @typedef {{
 *  id: string;
 *  title: string;
 *  details: string;
 *  thumbnal: string;
 *  imgs: string[];
 *  base_price: number;
 *  category: string[];
 *  option?: Option[]
 * }} Sach
 *
 * @typedef {{
 *   id: string;
 *   short_name: string;
 *   long_name: string;
 *   img?: string
 *   price: number
 *  }} Option
 *
 * @typedef {{
 *  id: string;
 *  name: string;
 *  long_name?: string;
 * }} Category
 *
 * @typedef {{
 *  id: string;
 *  user_id: string;
 *  sach: number;
 *  option_id?: number;
 *  quantity: number;
 *  status: "suly" | "doixacnhan" | "thanhcong";
 *  timecreate: Date
 * }} Cart
 *
 * @typedef {{
 *  id: string;
 *  email: string;
 *  name: string;
 *  passwd: string;
 *  phone_num: string;
 *  rule?: 'admin' | 'user';
 * }} UserInfo
 * 
 * 
 * @typedef {{
 *  id: string,
 *  data: string
 * }} imgStore
 *

 */

/**
 * @enum {string}
 */
const ObjectStoreName = {
    USER: 'userStore',
    CART: 'cartStore',
    BOOK: 'bookStore',
    CATEGORY: 'categoryStore',
    IMG: 'imgStore',
};

import uuidv4 from '../until/uuid.js';
import sanhs from './sachDb.js';
// @ts-ignore
import imgs from './imgStore.js';

/**
 * @type {IDBDatabase}
 */
let db;
const req = window.indexedDB.open('fakedb', 1);

req.onupgradeneeded = () => {
    db = req.result;

    // ==================== create object ==================

    // create user objectStore
    const userObjStore = db.createObjectStore(ObjectStoreName.USER, {
        keyPath: 'id',
        autoIncrement: true,
    });
    userObjStore.createIndex('email', 'email', { unique: true });
    userObjStore.createIndex('name', 'name', { unique: true });
    userObjStore.createIndex('passwd', 'passwd', { unique: false });
    userObjStore.createIndex('phone_num', 'phone_num', { unique: false });
    userObjStore.createIndex('rule', 'rule', { unique: false });
    userObjStore.createIndex('email_and_pass', ['email', 'passwd'], {
        unique: true,
    });

    // create cart object store
    const cartObjStore = db.createObjectStore(ObjectStoreName.CART, {
        keyPath: 'id',
        autoIncrement: true,
    });
    cartObjStore.createIndex('user_id', 'user_id', { unique: false });
    cartObjStore.createIndex('sach', 'sach', { unique: false });
    cartObjStore.createIndex('option_id', 'option_id', { unique: false });
    cartObjStore.createIndex('quantity', 'quantity', { unique: false });
    cartObjStore.createIndex('status', 'status', { unique: false });
    cartObjStore.createIndex('timecreate', 'timecreate', { unique: false });

    const bookObjStore = db.createObjectStore(ObjectStoreName.BOOK, {
        keyPath: 'id',
        autoIncrement: true,
    });
    bookObjStore.createIndex('title', 'title', { unique: false });
    bookObjStore.createIndex('details', 'details', { unique: false });
    bookObjStore.createIndex('thumbnal', 'thumbnal', { unique: false });
    bookObjStore.createIndex('imgs', 'imgs', { unique: false });
    bookObjStore.createIndex('base_price', 'base_price', { unique: false });
    bookObjStore.createIndex('category', 'category', { unique: false });
    bookObjStore.createIndex('option', 'option', { unique: false });

    const categoryStore = db.createObjectStore(ObjectStoreName.CATEGORY, {
        keyPath: 'id',
        autoIncrement: true,
    });
    categoryStore.createIndex('name', 'name', { unique: false });
    categoryStore.createIndex('long_name', 'long_name', { unique: false });

    const imgStore = db.createObjectStore(ObjectStoreName.IMG, {
        keyPath: 'id',
        autoIncrement: true,
    });
    imgStore.createIndex('data', 'data');

    // ==================== init data (default data) ============

    userObjStore.transaction.oncomplete = async () => {
        const userinfodata = await import('./data/user.json', {
            with: { type: 'json' },
        });

        let userInfo = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        // vscode lỏ
        userinfodata.default.data.forEach((e) => {
            userInfo.add(e);
        });
    };

    imgStore.transaction.oncomplete = async () => {
        const imgdata = await import('./data/img.json', {
            with: { type: 'json' },
        });

        let img = db
            .transaction(ObjectStoreName.IMG, 'readwrite')
            .objectStore(ObjectStoreName.IMG);

        // @ts-ignore
        imgdata.default.data.forEach((e) => {
            img.add(e);
        });
    };

    categoryStore.transaction.oncomplete = async () => {
        const categorydata = await import('./data/category.json', {
            with: { type: 'json' },
        });

        let categoryInfo = db
            .transaction(ObjectStoreName.CATEGORY, 'readwrite')
            .objectStore(ObjectStoreName.CATEGORY);

        categorydata.default.data.forEach((e) => {
            categoryInfo.add(e);
        });
    };

    bookObjStore.transaction.oncomplete = async () => {
        const bookdata = await import('./data/book.json', {
            with: { type: 'json' },
        });

        let bookInfo = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);

        bookdata.default.data.forEach((e) => {
            bookInfo.add(e);
        });
    };
};

req.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
req.onsuccess = (event) => {
    db = req.result;

    db.onerror = (ev) => {
        console.error(ev);
    };
};

/**
 *
 * lưu toàn bộ thông tin
 *
 * @type {{
 * user_info: UserInfo[];
 * category: Category[];
 * cart: Cart[];
 * sach: Sach[];
 * imgs: imgStore[];
 * }}
 */
const cache = {
    user_info: [],
    category: [],
    cart: [],
    sach: sanhs,
    imgs: imgs,
};

/**
 * lấy
 * lấy tất cả
 * delete
 * update
 * thêm
 */

class FakeDatabase {
    /**
     *
     * @param {string} user_id
     * @returns {Promise<UserInfo | undefined>}
     */
    async getUserInfoByUserId(user_id) {
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.USER, 'readonly')
                .objectStore(ObjectStoreName.USER);

            const userget = data.get(user_id);
            userget.onsuccess = () => {
                resolve(userget.result);
            };
        });
    }

    /**
     *
     * @returns {Promise<UserInfo[]>}
     */
    async getAllUserInfo() {
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.USER, 'readonly')
                .objectStore(ObjectStoreName.USER);

            const userget = data.getAll();
            userget.onsuccess = () => {
                resolve(userget.result);
            };
        });
    }

    /**
     *
     * @param {string} user_id
     */
    async deleteUserById(user_id) {
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);
        const userget = data.delete(user_id);
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<UserInfo | undefined>}
     */
    async getUserInfoByEmailAndPassword(email, password) {
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.USER, 'readonly')
                .objectStore(ObjectStoreName.USER);

            const userget = data.index('email_and_pass').get([email, password]);
            userget.onsuccess = () => {
                resolve(userget.result);
            };
        });
    }

    /**
     * admin dùng để trực tiếp thêm vào database
     *
     * @param {UserInfo} userInfo
     */
    async addUserInfo(userInfo) {
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);
        data.add(userInfo);
    }

    /**
     *
     * được dùng cho người dùng khi tạo tài khoản
     *
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    async createUserInfo(password, display_name, std, email) {
        const user_id = uuidv4();
        cache.user_info.push({
            id: user_id,
            name: display_name,
            email,
            passwd: password,
            phone_num: std,
            rule: 'user',
        });
    }

    async updateUserInfo(userInfo) {
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);
        data.put(userInfo);
    }

    /**
     *
     * @returns {Promise<Sach[]>}
     */
    async getAllSach() {
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.BOOK, 'readonly')
                .objectStore(ObjectStoreName.BOOK);

            const bookget = data.getAll();
            bookget.onsuccess = () => {
                resolve(bookget.result);
            };
        });
    }

    /**
     *
     * @param {string} sach_id
     * @returns {Promise<Sach | undefined>}
     */
    async getSachById(sach_id) {
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.BOOK, 'readonly')
                .objectStore(ObjectStoreName.BOOK);

            const bookget = data.get(sach_id);
            bookget.onsuccess = () => {
                resolve(bookget.result);
            };
        });
    }

    /**
     *
     * @param {Sach} bookInfo
     */
    async addSach(bookInfo) {
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);
        data.add(bookInfo);
    }

    async updateSach(bookInfo) {
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);
        data.put(bookInfo);
    }

    /**
     *
     * @param {string} sach_id
     */
    async deleteSachById(sach_id) {
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);
        data.delete(sach_id);
    }

    /**
     *
     * @returns {Promise<Cart[]>}
     */
    async getALlCart() {
        return cache.cart;
    }

    /**
     *
     * @param {string} user_id
     * @returns {Promise<Cart[]>}
     */
    async getCartByUserId(user_id) {
        return cache.cart.filter((e) => e.user_id == user_id);
    }

    /**
     *
     * @param {string} cart_id
     * @param {"suly" | "doixacnhan" | "thanhcong"} status
     */
    async updateCartStatus(cart_id, status) {
        const index = cache.cart.findIndex((e) => e.id == cart_id);
        cache.cart[index].status = status;
    }

    /**
     *
     * @returns {Promise<Category[]>}
     */
    async getAllCategory() {
        return cache.category;
    }

    /**
     *
     * @returns {Promise<imgStore[]>}
     */
    async getAllImgs() {
        return cache.imgs;
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<imgStore | undefined>}
     */
    async getImgById(id) {
        return cache.imgs.find((e) => e.id == id);
    }

    /**
     *
     * @param {imgStore} img
     */
    async addImg(img) {
        const id = uuidv4();
        img.id = id;
        cache.imgs.push(img);
    }

    /**
     *
     * @param {imgStore} img
     */
    async updateImg(img) {
        const index = cache.imgs.findIndex((e) => (e.id = img.id));
        cache.imgs[index] = img;
    }
}

const fackDatabase = new FakeDatabase();
export default fackDatabase;
