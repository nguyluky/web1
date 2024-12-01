
# ROUTER.JS

This file contains the implementation of a simple client-side router for handling URL changes and page navigation in a single-page application (SPA). The router provides functions to convert URLs, navigate between pages, manage styles, and handle URL changes.

## Functions

### `urlConverter(url)`

Converts a URL into a page path and query parameters.

- **Parameters:**
    - `url` (string): The URL to convert.
- **Returns:**
    - An object containing the page path and query parameters.

### `urlIsPage(path, format)`

Checks if a given path matches a specified format and extracts parameters from the path.

- **Parameters:**
    - `path` (string): The URL path to check.
    - `format` (string): The format to match against.
- **Returns:**
    - An object containing the extracted parameters if the path matches the format, otherwise `undefined`.

### `getSearchParam(key)`

Retrieves the value of a query parameter from the current URL.

- **Parameters:**
    - `key` (string): The name of the query parameter.
- **Returns:**
    - The value of the query parameter, or `null` if not found.

### `navigateToPage(page, query)`

Navigates to a specified page with optional query parameters.

- **Parameters:**
    - `page` (string): The page to navigate to.
    - `query` (object | function): An object containing query parameters or a function to modify the current query parameters.

### `addStyle(url)`

Fetches and adds a CSS style from a URL to the document.

- **Parameters:**
    - `url` (string): The URL of the CSS file to add.

### `removeStyle(url)`

Removes a CSS style from the document by URL.

- **Parameters:**
    - `url` (string): The URL of the CSS file to remove.

### `initializeUrlHandling(pages)`

Initializes URL handling for the application, setting up event listeners and handling initial URL state.

- **Parameters:**
    - `pages` (array): An array of page objects, each containing `pagePath`, `init`, `update`, `remove`, and optional `title` properties.

### `errorPage(code, message)`

Displays an error page with a specified error code and optional message.

- **Parameters:**
    - `code` (number): The error code to display.
    - `message` (string, optional): An optional error message to display.

## Types

### `PAGE`

A type representing a page object.

- **Properties:**
    - `pagePath` (string): The path of the page.
    - `init` (function): A function to initialize the page.
    - `update` (function): A function to update the page.
    - `remove` (function): A function to remove the page.
    - `title` (string | function, optional): The title of the page or a function to generate the title.


## Examples

### Example 1: Basic URL Conversion

```javascript
const url = '/home?user=123';
const result = urlConverter(url);
console.log(result);
// Output: { pagePath: '/home', queryParams: { user: '123' } }
```

### Example 2: Checking URL Path

```javascript
const path = '/user/123';
const format = '/user/:id';
const result = urlIsPage(path, format);
console.log(result);
// Output: { id: '123' }
```

### Example 3: Navigating to a Page

```javascript
navigateToPage('/profile', { user: '123' });
// Navigates to /profile?user=123
```

### Example 4: Adding and Removing Styles

```javascript
const styleUrl = 'https://example.com/styles.css';
addStyle(styleUrl);
// Adds the CSS style to the document

removeStyle(styleUrl);
// Removes the CSS style from the document
```

### Example 5: Initializing URL Handling

```javascript
const pages = [
    {
        pagePath: '/home',
        init: () => console.log('Home page initialized'),
        update: () => console.log('Home page updated'),
        remove: () => console.log('Home page removed'),
        title: 'Home'
    },
    {
        pagePath: '/profile',
        init: () => console.log('Profile page initialized'),
        update: () => console.log('Profile page updated'),
        remove: () => console.log('Profile page removed'),
        title: 'Profile'
    }
];

initializeUrlHandling(pages);
// Sets up URL handling for the application
```

### Example 6: Displaying an Error Page

```javascript
errorPage(404, 'Page not found');
// Displays a 404 error page with the message 'Page not found'
```
