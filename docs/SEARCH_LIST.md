The `searchList` function is used to search through a list of data based on an input search term and column definitions.

### Explanation

1. **Parameters**:
    - `values`: An array of data objects to search through.
    - `cols`: An object defining the columns of the table.

2. **Functionality**:
    - Retrieves the search input element by its ID (`search-input`).
    - Returns an empty array if the search input is not found.
    - Gets the value of the search input.
    - Filters the `values` array to include only those objects where any of the specified columns contain the search input value (case-insensitive).

### Steps:

1. **Retrieve Search Input**:
    - The function attempts to get the HTML input element for the search term using `document.getElementById('search-input')`.

2. **Validate Search Input**:
    - If the search input element is not found, the function returns an empty array.

3. **Filter Values**:
    - The function converts the search input value to uppercase for case-insensitive comparison.
    - It then filters the `values` array, checking each object to see if any of the specified columns (keys in `cols`) contain the search term.
    - If a column's value includes the search term (case-insensitive), the object is included in the result.

4. **Return Result**:
    - The function returns the filtered array of objects that match the search criteria.

This function is useful for dynamically filtering table data based on user input.