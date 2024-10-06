/**
 * @type {IDBDatabase}
 */
let db;
const req = window.indexedDB.open('fakedb', 1);

req.onupgradeneeded = () => {
    db = req.result;

    const userObjStore = db.createObjectStore('userInfo', { keyPath: 'id' });
    userObjStore.createIndex('email', 'email', { unique: true });
    userObjStore.createIndex('name', 'name', { unique: true });
    userObjStore.createIndex('passwd', 'passwd', { unique: false });
    userObjStore.createIndex('phone_num', 'phone_num', { unique: false });
    userObjStore.createIndex('rule', 'rule', { unique: false });
};

req.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
req.onsuccess = (event) => {
    db = req.result;
};
