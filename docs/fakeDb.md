Here is the documentation for the `fakeDBv1.js` file:

---

# FakeDBv1.js Documentation

This file provides a `FakeDatabase` class that simulates a database using IndexedDB. It includes methods to manage users, books, carts, categories, images, and orders.

## Data Types
The following data types are used:

- `Cart`: Represents a shopping cart item.
- `Category`: Represents a product category.
- `Sach`: Represents a book.
- `UserInfo`: Represents user information.
- `ImgStore`: Represents an image.
- `Order`: Represents an order.

## Object Stores
The database contains the following object stores:

- `userStore`: Stores user information.
- `cartStore`: Stores shopping cart items.
- `bookStore`: Stores books.
- `categoryStore`: Stores categories.
- `imgStore`: Stores images.
- `orderStore`: Stores orders.

## Class: FakeDatabase

### Methods

#### User-related Methods
- **`isReady()`**: Checks if the database is ready.
- **`requestToPromise(request)`**: Converts an IndexedDB request to a promise.
- **`awaitUntilReady()`**: Waits until the database is ready.
- **`ensureDataLoaded(objectStoreName)`**: Ensures data is loaded for the specified object store.
- **`getUserInfoByUserId(user_id)`**: Retrieves user information by user ID.
- **`getAllUserInfo()`**: Retrieves all user information.
- **`deleteUserById(user_id)`**: Deletes a user by user ID.
- **`getUserInfoByEmailAndPassword(email, password)`**: Retrieves user information by email and password.
- **`getUserInfoByPhoneNum(phone_num)`**: Retrieves user information by phone number.
- **`checkIfUserExists(email, phone_num)`**: Checks if a user exists (not implemented).
- **`addUserInfo(userInfo)`**: Adds user information.
- **`updateUserInfo(userInfo)`**: Updates user information.

#### Book-related Methods
- **`getAllSach()`**: Retrieves all books.
- **`getSachById(sach_id)`**: Retrieves a book by ID.
- **`addSach(bookInfo)`**: Adds a book.
- **`updateSach(bookInfo)`**: Updates a book.
- **`deleteSachById(sach_id)`**: Deletes a book by ID.

#### Cart-related Methods
- **`getALlCart()`**: Retrieves all carts.
- **`getCartByUserId(user_id)`**: Retrieves carts by user ID.
- **`getCartById(cart_id)`**: Retrieves a cart by ID.
- **`updateCart(cart_data)`**: Updates a cart.

#### Category-related Methods
- **`getAllCategory()`**: Retrieves all categories.
- **`getCategoryById(id)`**: Retrieves a category by ID.

#### Image-related Methods
- **`getAllImgs()`**: Retrieves all images.
- **`getImgById(id)`**: Retrieves an image by ID.
- **`addImg(img)`**: Adds an image.
- **`updateImg(img)`**: Updates an image.

#### Address-related Methods
- **`getAllTinhThanPho()`**: Retrieves all provinces and cities.
- **`getAllTinhThanhByThanPho(name)`**: Retrieves all districts by province/city name.
- **`getAllpxByThinhTpAndQh(pt, quan)`**: Retrieves all wards by province/city and district name.

#### Order-related Methods
- **`getAllOrder()`**: Retrieves all orders.
- **`getOrderById(order_id)`**: Retrieves an order by ID.
- **`addOrder(order)`**: Adds an order.
- **`updateOrder(order)`**: Updates an order.
- **`deleteOrderById(order_id)`**: Deletes an order by ID.

## Initialization
The database is initialized and object stores are created in the `onupgradeneeded` event of the IndexedDB open request.

### Example Usage
```javascript
const fakeDatabase = new FakeDatabase();
await fakeDatabase.awaitUntilReady();
const userInfo = await fakeDatabase.getUserInfoByUserId('user1');
console.log(userInfo);
```

## Notes
- Data loading from JSON files is handled in the `loadUserData`, `loadImgData`, `loadCategoryData`, and `loadBookData` functions.
- The `dataLoaded` state is stored in `localStorage` to track whether data has been loaded into the database.

---