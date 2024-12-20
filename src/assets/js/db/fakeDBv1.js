import uuidv from '../until/uuid.js';
import { validateEmail } from '../until/validator.js';
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
    /** @type {string} */(window.localStorage.getItem('dataLoaded')),
) || {
    [ObjectStoreName.USER]: false,
    [ObjectStoreName.IMG]: false,
    [ObjectStoreName.CATEGORY]: false,
    [ObjectStoreName.BOOK]: false,
    [ObjectStoreName.CART]: false,
    [ObjectStoreName.ORDER]: false,
};

/** @type {{ [Key: ObjectStoreName]: string }} */
const fileData = {
    [ObjectStoreName.USER]: '/assets/data/user.json',
    [ObjectStoreName.IMG]: '/assets/data/img.json',
    [ObjectStoreName.CATEGORY]: '/assets/data/category.json',
    [ObjectStoreName.BOOK]: '/assets/data/book.json',
    [ObjectStoreName.CART]: '/assets/data/cart.json',
    [ObjectStoreName.ORDER]: '/assets/data/order.json',
};

/**
 * @template T
 * @param {IDBRequest<T>} request
 * @returns {Promise<T>}
 */
async function requestToPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        // @ts-ignore
        request.onerror = (event) => reject(event.target?.error);
    });
}

/**
 * 
 * @param {string} storeName 
 */
function updateDataLoaded(storeName) {
    dataLoaded[storeName] = true;
    window.localStorage.setItem('dataLoaded', JSON.stringify(dataLoaded));
}

/** Import { */

/** @param {IDBDatabase} db_ */
function createObjectStore(db_) {
    /**
     * @type {{
     *     name: ObjectStoreName;
     *     keypath: string;
     *     keys: {
     *         keypath: string[] | string;
     *         option?: IDBIndexParameters;
     *     }[];
     * }[]}
     */
    const objectStoreItems = [
        {
            name: ObjectStoreName.USER,
            keypath: 'id',
            keys: [
                { keypath: 'email', option: { unique: true } },
                { keypath: 'name' },
                { keypath: 'passwd' },
                { keypath: 'phone_num', option: { unique: true } },
                { keypath: 'rule' },
                { keypath: 'datecreated' },
                { keypath: 'address' },
                { keypath: ['email', 'passwd'], option: { unique: true } },
            ],
        },
        {
            name: ObjectStoreName.CART,
            keypath: 'id',
            keys: [
                { keypath: 'user_id' },
                { keypath: 'sach' },
                { keypath: 'quantity' },
                { keypath: 'timecreate' },
            ],
        },
        {
            name: ObjectStoreName.BOOK,
            keypath: 'id',
            keys: [
                { keypath: 'title' },
                { keypath: 'details' },
                { keypath: 'thumbnail' },
                { keypath: 'base_price' },
                { keypath: 'discount' },
                { keypath: 'category' },
            ],
        },
        {
            name: ObjectStoreName.CATEGORY,
            keypath: 'id',
            keys: [{ keypath: 'name' }, { keypath: 'long_name' }],
        },
        {
            name: ObjectStoreName.IMG,
            keypath: 'id',
            keys: [{ keypath: 'data' }],
        },
        {
            name: ObjectStoreName.ORDER,
            keypath: 'id',
            keys: [
                { keypath: 'user_id' },
                { keypath: 'items' },
                { keypath: 'date' },
                { keypath: 'state' },
                { keypath: 'last_update' },
                { keypath: 'is_pay' },
                { keypath: 'total' },
            ],
        },
    ];
    // ==================== Tạo các objectStore trong cơ sở dữ liệu ==================

    objectStoreItems.forEach((obj) => {
        const objStore = db_.createObjectStore(obj.name, {
            keyPath: obj.keypath,
            autoIncrement: true,
        });

        obj.keys.forEach((index) => {
            let nameKey = '';
            if (typeof index.keypath == 'string') {
                nameKey = index.keypath;
            } else {
                nameKey = index.keypath.join('_');
            }

            objStore.createIndex(nameKey, index.keypath, index.option);
        });

        console.log(`tạo ${obj.name} thành công`);
    });
}

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

    async awaitUntilReady() {
        while (!db) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    /** @param {ObjectStoreName} objectStoreName */
    async ensureDataLoaded(objectStoreName) {
        if (!dataLoaded[objectStoreName]) {
            const data = await fetch(fileData[objectStoreName]).then((res) =>
                res.json(),
            );
            const transaction = db.transaction(objectStoreName, 'readwrite');
            const userStore = transaction.objectStore(objectStoreName);
            data.data.forEach((e) => {
                Object.keys(e).forEach((key) => {
                    if (
                        typeof e[key] == 'string' &&
                        e[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
                    ) {
                        console.log(e[key]);
                        e[key] = new Date(e[key]);
                    }
                });
                userStore.add(e);
            });
            // await requestToPromise(transaction);
            updateDataLoaded(objectStoreName);
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
        return requestToPromise(userStore.get(user_id));
    }

    /** @returns {Promise<UserInfo[]>} */
    async getAllUserInfo() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readonly');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return requestToPromise(userStore.getAll());
    }

    async deleteUserById(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        return requestToPromise(userStore.delete(user_id));
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
        return requestToPromise(
            userStore.index('email_and_pass').get([email, password]),
        );
    }

    /**
     * Được dùng cho người dùng khi tạo tài khoản
     *
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string | undefined} email Không được để email là string rỗng
     * @returns {Promise<UserInfo>}
     */
    async createUserInfo(password, display_name, std, email) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);

        const user_id = uuidv(10);

        /** @type {UserInfo} */
        const data = {
            id: user_id,
            name: display_name,
            email,
            fullname: '',
            gender: '',
            passwd: password,
            phone_num: std,
            rule: 'user',
            status: 'active',
            datecreated: new Date(),
            address: [],
            credits: [],
        };

        const data_ = db
            .transaction(ObjectStoreName.USER, 'readwrite')
            .objectStore(ObjectStoreName.USER);

        await requestToPromise(data_.add(data));
        return data;
    }

    async getUserInfoByPhoneOrEmail(phone_email) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);

        const data = db
            .transaction(ObjectStoreName.USER, 'readonly')
            .objectStore(ObjectStoreName.USER);
        let userget;
        if (validateEmail(phone_email)) {
            userget = data.index('email').get(phone_email);
        } else {
            userget = data.index('phone_num').get(phone_email);
        }
        return await requestToPromise(userget);
    }

    async addCreditCardToUser(credit_info, user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);

        const userInfo = await this.getUserInfoByUserId(user_id);
        if (userInfo) {
            userInfo.credits.push(credit_info);
            const data = db.transaction(ObjectStoreName.USER, 'readwrite').objectStore(ObjectStoreName.USER);
            return await requestToPromise(data.put(userInfo));
        }
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
        return requestToPromise(userStore.index('phone_num').get(phone_num));
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
        return requestToPromise(userStore.add(userInfo));
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
        return requestToPromise(userStore.put(userInfo));
    }

    /** @returns {Promise<Sach[]>} */
    async getAllBooks() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.BOOK);
        const transaction = db.transaction(ObjectStoreName.BOOK, 'readonly');
        const bookStore = transaction.objectStore(ObjectStoreName.BOOK);
        return requestToPromise(bookStore.getAll());
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
        return requestToPromise(bookStore.get(sach_id));
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
        return requestToPromise(bookStore.add(bookInfo));
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
        return requestToPromise(bookStore.put(bookInfo));
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
        return requestToPromise(bookStore.delete(sach_id));
    }

    /** @returns {Promise<Cart[]>} */
    async getALlCart() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readonly');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return requestToPromise(cartStore.getAll());
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
        return requestToPromise(cartStore.index('user_id').getAll(user_id));
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
        return requestToPromise(cartStore.get(cart_id));
    }

    async createCartItem(cart_id, user_id, bookId, quantity) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readwrite');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        const cart_data = {
            id: cart_id,
            user_id,
            sach: bookId,
            quantity,
            timecreate: new Date(),
        };
        await requestToPromise(cartStore.put(cart_data));
        return cart_data;
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
        return requestToPromise(cartStore.put(cart_data));
    }

    /**
     * @param {Omit<Cart, 'id'>} cart_data
     * @returns {Promise<IDBValidKey>}
     */
    async addCart(cart_data) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readwrite');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return requestToPromise(cartStore.add(cart_data));
    }

    /**
     * 
     * @param {string} cart_id 
     * @returns 
     */
    async deleteCartById(cart_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.CART);
        const transaction = db.transaction(ObjectStoreName.CART, 'readwrite');
        const cartStore = transaction.objectStore(ObjectStoreName.CART);
        return requestToPromise(cartStore.delete(cart_id));
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
        return requestToPromise(categoryStore.getAll());
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
        return requestToPromise(categoryStore.get(id));
    }

    /** @returns {Promise<ImgStore[]>} */
    async getAllImgs() {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.IMG);
        const transaction = db.transaction(ObjectStoreName.IMG, 'readonly');
        const imgStore = transaction.objectStore(ObjectStoreName.IMG);
        return requestToPromise(imgStore.getAll());
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
        return requestToPromise(imgStore.get(id));
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
        return requestToPromise(imgStore.add(img));
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
        return requestToPromise(imgStore.put(img));
    }

    /** @returns {Promise<string[]>} */
    async getAllTinhThanPho() {
        return addressData.map((e) => e.Name);
    }

    /**
     * @param {string} name
     * @returns {Promise<string[]>}
     */
    async getAllQuanHuyenByTinhThanhPho(name) {
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
    async getAllPhuongXaByQuanHuyenAndThinThanhPho(pt, quan) {
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
        return requestToPromise(orderStore.getAll());
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
        return requestToPromise(orderStore.get(order_id));
    }

    /**
     * @param {any} order
     * @returns {Promise<?>}
     */
    async addOrder(order) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readwrite');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return requestToPromise(orderStore.add(order));
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
        return requestToPromise(orderStore.put(order));
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
        return requestToPromise(orderStore.delete(order_id));
    }

    /**
     * 
     * @param {string} user_id 
     * @returns {Promise<Order[]>}
     */
    async getOrdertByUserId(user_id) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.ORDER);
        const transaction = db.transaction(ObjectStoreName.ORDER, 'readonly');
        const orderStore = transaction.objectStore(ObjectStoreName.ORDER);
        return requestToPromise(orderStore.index('user_id').getAll(user_id));
    }

    /**
     * 
     * @param {string} user_id 
     * @param {import('../until/type.js').UserAddress} address 
     * @returns 
     */

    async addUserAddress(user_id, address) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        const user = await requestToPromise(userStore.get(user_id));
        if (user.address == undefined) user.address = [];
        user.address.push(address);
        return requestToPromise(userStore.put(user));
    }

    /**
     * 
     * @param {string} user_id 
     * @param {import('../until/type.js').UserAddress[]} addressArray 
     * @returns 
     */
    async updateUserAddress(user_id, addressArray) {
        if (!db) await this.awaitUntilReady();
        await this.ensureDataLoaded(ObjectStoreName.USER);
        const transaction = db.transaction(ObjectStoreName.USER, 'readwrite');
        const userStore = transaction.objectStore(ObjectStoreName.USER);
        const user = await requestToPromise(userStore.get(user_id));
        user.address = [];
        addressArray.forEach((e) => {
            user.address.push(e);
        });
        return requestToPromise(userStore.put(user));
    }
}

const fakeDatabase = new FakeDatabase();
export default fakeDatabase;
