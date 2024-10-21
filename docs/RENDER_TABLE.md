### Summary of `renderTable` Function

The `renderTable` function is responsible for rendering a table with multiple rows of data. It takes the following parameters:
- `values`: The data to be displayed in the table.
- `table`: The HTML table element where the data will be rendered.
- `cols`: The column definitions for the table.
- `onchange` (optional): A callback function that is called whenever the data changes.
- `cRenderRow` (optional): A custom function to render each row.

### Functionality
1. Clears the existing content of the table.
2. Creates and appends the table header using the column definitions.
3. Iterates over the data and renders each row using either the custom row render function (`cRenderRow`) or a default row render function.

### Example Implementations
- **User Table**: [user_table.js](https://github.com/nguyluky/web1/blob/ae331c7785becef4b1d85dab4cea36003ece1109/src/assets/js/render/user_table.js#L1-L92)
- **Cart Table**: [cart_table.js](https://github.com/nguyluky/web1/blob/ae331c7785becef4b1d85dab4cea36003ece1109/src/assets/js/render/cart_table.js#L1-L55)
- **Category Table**: [category_table.js](https://github.com/nguyluky/web1/blob/ae331c7785becef4b1d85dab4cea36003ece1109/src/assets/js/render/category_table.js#L1-L50)
- **Sach Table**: [sach_table.js](https://github.com/nguyluky/web1/blob/ae331c7785becef4b1d85dab4cea36003ece1109/src/assets/js/render/sach_table.js#L1-L115)

You can view more details and the complete code by visiting the links above. If you need further explanation on any specific part, let me know!


