Here is the documentation for the `baseRender.js` file:

---

# baseRender.js Documentation

This file defines various functions to render data tables, perform data searches, and display confirmation popups. It uses generic types to apply to different data types based on common characteristics such as `id`.

## Functions

### createCheckBox

Creates a table cell containing a checkbox.

**Parameters:**
- `value_id` (string): The value for the checkbox.

**Returns:**
- `HTMLTableCellElement`: The table cell containing the checkbox.

**Example:**
```javascript
const checkboxCell = createCheckBox('value1');
```

### createTableSell

Creates a table cell configured to handle data changes.

**Parameters:**
- `key_name` (string): The key name associated with the cell.

**Returns:**
- `HTMLTableCellElement`: The created table cell.

**Example:**
```javascript
const tableCell = createTableSell('keyName');
```

### defaultRenderRow

Creates an HTML table row based on provided data.

**Parameters:**
- `value` (object): The data for the row.
- `cols` (object): The column definitions.
- `onchange` (function, optional): Callback function when data changes.

**Returns:**
- `HTMLTableRowElement`: The created table row.

**Example:**
```javascript
const row = defaultRenderRow({ id: '1', name: 'Sample' }, { name: 'Name' });
```

### renderTable

Renders a table based on provided data and column definitions.

**Parameters:**
- `values` (array): The data to display.
- `table` (HTMLTableElement): The HTML table element to render.
- `cols` (object): The column definitions.
- `onchange` (function, optional): Callback function when data changes.
- `cRenderRow` (function, optional): Custom row render function.

**Example:**
```javascript
renderTable(dataArray, htmlTable, { name: 'Name' });
```

### searchList

Performs a search in the list based on input and columns.

**Parameters:**
- `values` (array): The data list to search.
- `cols` (object): The column definitions.

**Returns:**
- `array`: The list of matching values.

**Example:**
```javascript
const results = searchList(dataArray, { name: 'Name' });
```

## Recent Changes

Here are some recent commits to the `baseRender.js` file:
- [d23c727](https://github.com/nguyluky/web1/commit/d23c727221467add9fc8cd5e18a8298fc1d624b8): Added card data and display (not yet saved)
- [c6e3080](https://github.com/nguyluky/web1/commit/c6e3080e8322b443a2c45028f34276f160c98c71): Formatted the `sach_table.js` file
- [56f0a22](https://github.com/nguyluky/web1/commit/56f0a22df6175e1327c6f9d4d7f9d8aba5add526): Miscellaneous updates

For more information, you can view the [baseRender.js file](https://github.com/nguyluky/web1/blob/main/src/assets/js/render/baseRender.js) in the repository.

---