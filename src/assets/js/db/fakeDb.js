/**
 * @typedef {import('../until/type.js').Cart} Cart
 * @typedef {import('../until/type.js').Category} Category
 * @typedef {import('../until/type.js').Sach} Sach
 * @typedef {import('../until/type.js').UserInfo} UserInfo
 * @typedef {import('../until/type.js').imgStore} imgStore
 */

import uuidv4 from '../until/uuid.js';

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
/**
 * @type {IDBDatabase}
 */
let db;
// dùng để kiểm tra xem onupgradeneeded đã tải xong chưa
let isOnupgradeneeded = false;
const req = window.indexedDB.open('fakedb', 1);

req.onupgradeneeded = async (event) => {
    // không cần thiết như tôi thính nên rôi làm cái này luân =)
    isOnupgradeneeded = true;
    let db_ = req.result;

    // ==================== create object ==================

    // create user objectStore

    const userObjStore_ = db_.createObjectStore(ObjectStoreName.USER, {
        keyPath: 'id',
        autoIncrement: true,
    });
    userObjStore_.createIndex('email', 'email', { unique: true });
    userObjStore_.createIndex('name', 'name', { unique: true });
    userObjStore_.createIndex('passwd', 'passwd', { unique: false });
    userObjStore_.createIndex('phone_num', 'phone_num', { unique: false });
    userObjStore_.createIndex('rule', 'rule', { unique: false });
    userObjStore_.createIndex('email_and_pass', ['email', 'passwd'], {
        unique: true,
    });

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

    const categoryStore_ = db_.createObjectStore(ObjectStoreName.CATEGORY, {
        keyPath: 'id',
        autoIncrement: true,
    });
    categoryStore_.createIndex('name', 'name', { unique: false });
    categoryStore_.createIndex('long_name', 'long_name', { unique: false });

    const imgStore = db_.createObjectStore(ObjectStoreName.IMG, {
        keyPath: 'id',
        autoIncrement: true,
    });
    imgStore.createIndex('data', 'data');

    // ==================== init data (default data) ============
    console.log('test');

    await new Promise((r) => {
        event.target.transaction.oncomplete = r;
    });

    console.log('đang tải dữ liệu');

    const data = await Promise.all([
        import('./data/user.json', { with: { type: 'json' } }),
        import('./data/img.json', { with: { type: 'json' } }),
        // import('./data/cart.json', { with: { type: 'json' } }), // không có
        import('./data/category.json', { with: { type: 'json' } }),
        import('./data/book.json', { with: { type: 'json' } }),
    ]);

    // NOTE: indexedb chỉ được mở một transaction cừng một lúc

    /**
     * @type {IDBTransaction}
     */
    const transaction = db_.transaction(
        [
            ObjectStoreName.USER,
            ObjectStoreName.BOOK,
            ObjectStoreName.CART,
            ObjectStoreName.CATEGORY,
            ObjectStoreName.IMG,
        ],
        'readwrite',
    );

    console.log('đang thêm dữ liệu');

    const userObjStore = transaction.objectStore(ObjectStoreName.USER);
    const imgObjStore = transaction.objectStore(ObjectStoreName.IMG);
    const bookObjStore = transaction.objectStore(ObjectStoreName.BOOK);
    const categoryStore = transaction.objectStore(ObjectStoreName.CATEGORY);

    data[0].default.data.forEach((e) => {
        userObjStore.add(e);
    });

    // @ts-ignore
    data[1].default.data.forEach((element) => {
        imgObjStore.add(element);
    });
    data[2].default.data.forEach((element) => {
        categoryStore.add(element);
    });
    data[3].default.data.forEach((element) => {
        bookObjStore.add(element);
    });

    // Kiểm tra khi transaction hoàn thành
    transaction.oncomplete = function () {
        console.log('Tạo object stores và thêm dữ liệu thành công!');
        isOnupgradeneeded = false;
        db = db_;
    };

    // Kiểm tra lỗi nếu có
    transaction.onerror = function (event) {
        console.error('Lỗi trong transaction: ', event);
    };
};

req.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
req.onsuccess = (event) => {
    if (isOnupgradeneeded) return;
    db = req.result;

    db.onerror = (ev) => {
        console.error(ev);
    };
};

/**
 *
 * lưu toàn bộ thông tin
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
    sach: [],
    imgs: [],
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
     * triểm tra xem khởi tại data base thành công hay chưa
     * @returns {boolean} trạn thái data base
     */
    isReady() {
        return !!db;
    }

    async awaitUntilReady() {
        let id;
        return new Promise((resolve, reject) => {
            id = setInterval(() => {
                if (db) {
                    console.log(db);

                    resolve(true);
                    clearInterval(id);
                }
            }, 500);
        });
    }

    /**
     *
     * @param {string} user_id
     * @returns {Promise<UserInfo | undefined>} người dùng
     */
    async getUserInfoByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
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
     * @returns {Promise<UserInfo[]>} mảng người dùng
     */
    async getAllUserInfo() {
        if (!db) await this.awaitUntilReady();
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
        if (!db) await this.awaitUntilReady();
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.USER, 'readwrite')
                .objectStore(ObjectStoreName.USER);
            data.delete(user_id).onsuccess = resolve;
        });
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<UserInfo | undefined>} nếu không tìm thấy sẽ trả về undefined
     */
    async getUserInfoByEmailAndPassword(email, password) {
        if (!db) await this.awaitUntilReady();
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
     * @param {UserInfo} userInfo
     */
    async addUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        return new Promise((resolve, error) => {
            const data = db
                .transaction(ObjectStoreName.USER, 'readwrite')
                .objectStore(ObjectStoreName.USER);
            data.add(userInfo).onsuccess = resolve;
        });
    }

    /**
     *
     * được dùng cho người dùng khi tạo tài khoản
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    async createUserInfo(password, display_name, std, email) {
        // if (!db) await this.awaitUntilReady();

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
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);
        data.put(userInfo);
    }

    /**
     *
     * @returns {Promise<Sach[]>} array
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
     * @returns {Promise<Sach | undefined>} array
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
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        data.add(bookInfo);
    }

    async updateSach(bookInfo) {
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        data.put(bookInfo);
    }

    /**
     *
     * @param {string} sach_id
     */
    async deleteSachById(sach_id) {
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        data.delete(sach_id);
    }

    /**
     *
     * @returns {Promise<Cart[]>} array
     */
    async getALlCart() {
        return cache.cart;
    }

    /**
     *
     * @param {string} user_id
     * @returns {Promise<Cart[]>} array
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
     * @returns {Promise<Category[]>} array
     */
    async getAllCategory() {
        return cache.category;
    }

    /**
     *
     * @returns {Promise<imgStore[]>} array
     */
    async getAllImgs() {
        return cache.imgs;
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<imgStore | undefined>} item or undefinde
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
