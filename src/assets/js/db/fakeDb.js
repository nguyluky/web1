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

// ====================================================================

/**
 * @type {IDBDatabase}
 */
let db;
// dùng để kiểm tra xem onupgradeneeded đã tải xong chưa
let isOnupgradeneeded = false;
const req = window.indexedDB.open('fakedb', 1);

//============================================================

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
        fetch('/assets/data/user.json').then((e) => e.json()),
        fetch('/assets/data/img.json').then((e) => e.json()),
        fetch('/assets/data/category.json').then((e) => e.json()),
        fetch('/assets/data/book.json').then((e) => e.json()),
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

    data[0].data.forEach((e) => {
        userObjStore.add(e);
    });

    // @ts-ignore
    data[1].data.forEach((element) => {
        imgObjStore.add(element);
    });
    data[2].data.forEach((element) => {
        categoryStore.add(element);
    });
    data[3].data.forEach((element) => {
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

    requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) =>
                reject(`Error: ${event.target.errorCode}`);
        });
    }

    /**
     *
     * @param {string} user_id
     * @returns {Promise<UserInfo | undefined>} người dùng
     */
    async getUserInfoByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');

        const userobj = transaction.objectStore(ObjectStoreName.USER);

        const userget = userobj.get(user_id);
        return await this.requestToPromise(userget);
    }

    /**
     *
     * @returns {Promise<UserInfo[]>} mảng người dùng
     */
    async getAllUserInfo() {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);

        const userget = data.getAll();
        return await this.requestToPromise(userget);
    }

    /**
     *
     * @param {string} user_id
     */
    async deleteUserById(user_id) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);
        return await this.requestToPromise(data.delete(user_id));
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<UserInfo | undefined>} nếu không tìm thấy sẽ trả về undefined
     */
    async getUserInfoByEmailAndPassword(email, password) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);

        const userget = data.index('email_and_pass').get([email, password]);
        return await this.requestToPromise(userget);
    }

    /** @param {string} phone_num */
    async getUserInfoByPhoneNum(phone_num) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);

        const userget = data.index('phone_num').get(phone_num);
        return await this.requestToPromise(userget);
    }

    /**
     * admin dùng để trực tiếp thêm vào database
     * @param {UserInfo} userInfo
     */
    async addUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        return await this.requestToPromise(data.add(userInfo));
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
        if (!db) await this.awaitUntilReady();

        const user_id = uuidv4();
        const data = {
            id: user_id,
            name: display_name,
            email,
            passwd: password,
            phone_num: std,
            rule: 'user',
        };

        const data_ = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        return await this.requestToPromise(data_.add(data));
    }

    async updateUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        return await this.requestToPromise(data.put(userInfo));
    }

    /**
     *
     * @returns {Promise<Sach[]>} array
     */
    async getAllSach() {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);

        const req = data.getAll();

        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {string} sach_id
     * @returns {Promise<Sach | undefined>} array
     */
    async getSachById(sach_id) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);

        const req = data.get(sach_id);

        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {Sach} bookInfo
     */
    async addSach(bookInfo) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        return await this.requestToPromise(objectStore.add(bookInfo));
    }

    /**
     *
     * @param {Sach} bookInfo
     * @returns
     */
    async updateSach(bookInfo) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        return await this.requestToPromise(data.put(bookInfo));
    }

    /**
     *
     * @param {string} sach_id
     */
    async deleteSachById(sach_id) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);

        return await this.requestToPromise(data.delete(sach_id));
    }

    /**
     *
     * @returns {Promise<Cart[]>} array
     */
    async getALlCart() {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.CART, 'readonly')
            .objectStore(ObjectStoreName.CART);
        const req = objectStore.getAll();
        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {string} user_id
     * @returns {Promise<Cart[]>} array
     */
    async getCartByUserId(user_id) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.CART, 'readonly')
            .objectStore(ObjectStoreName.CART);

        const req = objectStore.index('user_id').getAll(user_id);

        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {string} user_id
     * @returns {Promise<Cart | undefined>} array
     */
    async getCartById(user_id) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.CART, 'readonly')
            .objectStore(ObjectStoreName.CART);

        const req = data.get(user_id);

        return await this.requestToPromise(req);
    }

    async updateCart(cart_data) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.CART, 'readwrite')
            .objectStore(ObjectStoreName.CART);

        const req = objectStore.put(cart_data);

        return await this.requestToPromise(req);
    }

    // ừ đừng hỏi tôi

    /**
     *
     * @returns {Promise<Category[]>} array
     */
    async getAllCategory() {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.CATEGORY, 'readonly')
            .objectStore(ObjectStoreName.CATEGORY);
        const req = objectStore.getAll();
        return await this.requestToPromise(req);
    }

    /**
     *
     * @returns {Promise<imgStore[]>} array
     */
    async getAllImgs() {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readonly')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.getAll();
        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<imgStore | undefined>} item or undefinde
     */
    async getImgById(id) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readonly')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.get(id);
        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {imgStore} img
     */
    async addImg(img) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readwrite')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.add(img);
        return await this.requestToPromise(req);
    }

    /**
     *
     * @param {imgStore} img
     */
    async updateImg(img) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readwrite')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.put(img);
        return await this.requestToPromise(req);
    }
}

const fackDatabase = new FakeDatabase();
export default fackDatabase;
