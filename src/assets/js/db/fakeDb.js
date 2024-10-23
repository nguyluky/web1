/**
 * @typedef {import('../until/type.js').Cart} Cart
 *
 * @typedef {import('../until/type.js').Category} Category
 *
 * @typedef {import('../until/type.js').Sach} Sach
 *
 * @typedef {import('../until/type.js').UserInfo} UserInfo
 *
 * @typedef {import('../until/type.js').imgStore} imgStore
 */
import uuidv from '../until/uuid.js';
import addressData from './addressDb.js';

/** @enum {string} */
const ObjectStoreName = {
    USER: 'userStore',
    CART: 'cartStore',
    BOOK: 'bookStore',
    CATEGORY: 'categoryStore',
    IMG: 'imgStore',
};

/**
 * Biến lưu trữ kết nối đến IndexedDB
 *
 * @type {IDBDatabase}
 */
let db;
// Cờ kiểm tra xem onupgradeneeded đã hoàn thành chưa
let isOnupgradeneeded = false;
// Tạo hoặc mở kết nối tới cơ sở dữ liệu có tên 'fakedb', version 1
const req = window.indexedDB.open('fakedb', 1);

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
    //#region
    const imgStore = db_.createObjectStore(ObjectStoreName.IMG, {
        keyPath: 'id',
        autoIncrement: true,
    });
    imgStore.createIndex('data', 'data');
    //#endregion
}

// ==================== Thêm dữ liệu mặc định vào database ====================
/** @param {IDBDatabase} db_ */
async function initDefaultData(db_) {
    console.log('Bắt đầu thêm dữ liệu mặc định');
    console.log('Đang tải dữ liệu từ file json...');

    // Lấy dữ liệu từ các file JSON
    const data = await Promise.all([
        fetch('/assets/data/user.json').then((e) => e.json()),
        fetch('/assets/data/img.json').then((e) => e.json()),
        fetch('/assets/data/category.json').then((e) => e.json()),
        fetch('/assets/data/book.json').then((e) => e.json()),
    ]);

    /** @type {IDBTransaction} */
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

    console.log('Đang thêm dữ liệu');

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
}

req.onupgradeneeded = async (event) => {
    isOnupgradeneeded = true;
    let db_ = req.result;

    // Tạo object store
    createObjectStore(db_);

    // Chờ transaction hoàn tất trước khi tiếp tục
    await new Promise((r) => {
        event.target.transaction.oncomplete = r;
    });

    await initDefaultData(db_);
};

// Xử lý lỗi khi không thể mở kết nối đến IndexedDB
req.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
    console.error(event);
};

// Xử lý khi kết nối thành công
req.onsuccess = () => {
    if (isOnupgradeneeded) return; // Nếu đang trong quá trình nâng cấp thì không làm gì thêm
    db = req.result; // Lưu kết nối cơ sở dữ liệu vào biến db
};

/**
 * FakeDatabase class provides an interface to interact with the IndexedDB
 * database. It includes methods for managing users, books, carts, categories,
 * and images.
 */
class FakeDatabase {
    /**
     * Kiểm tra xem cơ sở dữ liệu đã sẵn sàng hay chưa
     *
     * @returns {boolean} Trạng thái của cơ sở dữ liệu
     */
    isReady() {
        return !!db;
    }

    async getAllTinhThanPho() {
        return addressData.map((e) => {
            return e.Name;
        });
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

    async awaitUntilReady() {
        let id;
        return new Promise((resolve) => {
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
            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * @param {string} user_id
     * @returns {Promise<UserInfo | undefined>} Người dùng
     */
    async getUserInfoByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');

        const userobj = transaction.objectStore(ObjectStoreName.USER);

        const userget = userobj.get(user_id);
        return await this.requestToPromise(userget);
    }

    /** @returns {Promise<UserInfo[]>} Mảng người dùng */
    async getAllUserInfo() {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);

        const userget = data.getAll();
        return await this.requestToPromise(userget);
    }

    /**
     * @param {string} user_id
     * @returns {Promise<UserInfo | undefined>}
     */
    async deleteUserById(user_id) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);
        return await this.requestToPromise(data.delete(user_id));
    }

    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<UserInfo | undefined>} Nếu không tìm thấy sẽ trả về
     */
    async getUserInfoByEmailAndPassword(email, password) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);

        const userget = data.index('email_and_pass').get([email, password]);
        return await this.requestToPromise(userget);
    }

    /**
     * @param {string} phone_num
     * @returns {Promise<UserInfo | undefined>}
     */
    async getUserInfoByPhoneNum(phone_num) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);

        const userget = data.index('phone_num').get(phone_num);
        return await this.requestToPromise(userget);
    }

    /**
     * Admin dùng để trực tiếp thêm vào database
     *
     * @param {UserInfo} userInfo
     */
    async addUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        await this.requestToPromise(data.add(userInfo));
    }

    /**
     * Được dùng cho người dùng khi tạo tài khoản
     *
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    async createUserInfo(password, display_name, std, email) {
        if (!db) await this.awaitUntilReady();

        const user_id = uuidv(8);
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

        await this.requestToPromise(data_.add(data));
    }

    /** @param {UserInfo} userInfo */
    async updateUserInfo(userInfo) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        await this.requestToPromise(data.put(userInfo));
    }

    /** @returns {Promise<Sach[]>} Array */
    async getAllSach() {
        if (!db) await this.awaitUntilReady();
        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);

        const req = data.getAll();

        return await this.requestToPromise(req);
    }

    /**
     * @param {string} sach_id
     * @returns {Promise<Sach | undefined>} Array
     */
    async getSachById(sach_id) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.BOOK, 'readonly')
            .objectStore(ObjectStoreName.BOOK);

        const req = data.get(sach_id);

        return await this.requestToPromise(req);
    }

    /** @param {Sach} bookInfo */
    async addSach(bookInfo) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        await this.requestToPromise(objectStore.add(bookInfo));
    }

    /** @param {Sach} bookInfo */
    async updateSach(bookInfo) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);
        await this.requestToPromise(data.put(bookInfo));
    }

    /** @param {string} sach_id */
    async deleteSachById(sach_id) {
        if (!db) await this.awaitUntilReady();

        const data = db
            .transaction(ObjectStoreName.BOOK, 'readwrite')
            .objectStore(ObjectStoreName.BOOK);

        await this.requestToPromise(data.delete(sach_id));
    }

    /** @returns {Promise<Cart[]>} Array */
    async getALlCart() {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.CART, 'readonly')
            .objectStore(ObjectStoreName.CART);
        const req = objectStore.getAll();
        return await this.requestToPromise(req);
    }

    /**
     * @param {string} user_id
     * @returns {Promise<Cart[]>} Array
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
     * @param {string} user_id
     * @returns {Promise<Cart | undefined>} Array
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

    /** @returns {Promise<Category[]>} Array */
    async getAllCategory() {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.CATEGORY, 'readonly')
            .objectStore(ObjectStoreName.CATEGORY);
        const req = objectStore.getAll();
        return await this.requestToPromise(req);
    }

    /** @returns {Promise<imgStore[]>} Array */
    async getAllImgs() {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readonly')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.getAll();
        return await this.requestToPromise(req);
    }

    /**
     * @param {string} id
     * @returns {Promise<imgStore | undefined>} Item or undefinde
     */
    async getImgById(id) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readonly')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.get(id);
        return await this.requestToPromise(req);
    }

    /** @param {imgStore} img */
    async addImg(img) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readwrite')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.add(img);
        await this.requestToPromise(req);
    }

    /** @param {imgStore} img */
    async updateImg(img) {
        if (!db) await this.awaitUntilReady();

        const objectStore = db
            .transaction(ObjectStoreName.IMG, 'readwrite')
            .objectStore(ObjectStoreName.IMG);
        const req = objectStore.put(img);
        await this.requestToPromise(req);
    }
}

const fakeDatabase = new FakeDatabase();
export default fakeDatabase;
