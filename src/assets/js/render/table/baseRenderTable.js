import { BaseTableCell, StringTableCell } from './CustomElement.js';

/**
 *
 * @param {string} value_id
 * @returns {HTMLTableCellElement}
 */
export function createCheckBox(value_id) {
    const col = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = value_id;
    checkbox.className = 'table-check-box';
    col.appendChild(checkbox);
    return col;
}

/**
 * @abstract
 * @template {{id: string}} T
 */
export class baseRenderTable {
    cacheAdd = [];
    cacheEdit = [];

    /**
     * @type {{key: string, title: string}[]}
     */
    cols = [];

    /**
     * @type {{[key in keyof T]?: (value: T, key: string) => BaseTableCell}}
     */
    cellOverrides = {};

    constructor(tableSelection, loaderSelection) {
        this.tableSelection = tableSelection;
        this.loaderSelection = loaderSelection;
    }

    /**
     *
     * @param {string} value
     * @param {string} key
     * @returns {BaseTableCell}
     */
    defaultCell(value, key) {
        const cell = /**@type {StringTableCell} */ (
            document.createElement('td', { is: 'string-cell' })
        );
        cell.disable = true;
        cell.canEditable = false;
        cell.key = key;
        cell.value = value;
        cell.defaultValue = value;

        return cell;
    }

    onCellChange(defaultValue, key, newValue) {
        if (this.cacheEdit.some((e) => e.id == defaultValue.id)) {
            this.cacheEdit = this.cacheEdit.map((e) => {
                if (e.id == defaultValue.id) {
                    e[key] = newValue;
                }
                return e;
            });
        } else {
            this.cacheEdit.push({ ...defaultValue, [key]: newValue });
        }
    }

    onAddCellChange(defaultValue, key, newValue) {
        // TODO: Implement this method
    }

    /**
     *
     * @returns {HTMLTableRowElement}
     */
    createHeader() {
        const tableHeader = document.createElement('tr');

        const col = document.createElement('th');
        col.insertAdjacentHTML('beforeend', 'Check');
        tableHeader.appendChild(col);

        this.cols.forEach((col) => {
            const th = document.createElement('th');

            th.insertAdjacentHTML('beforeend', col.title);

            tableHeader.appendChild(th);
        });

        return tableHeader;
    }

    /**
     * @param {T} value
     * @returns {HTMLTableRowElement}
     */
    createRow(value) {
        const row = document.createElement('tr');
        row.setAttribute('id-row', value.id);

        const col = createCheckBox(value['id']);
        row.appendChild(col);

        this.cols.forEach((col) => {
            const key = col.key;
            const cell = this.cellOverrides[key]
                ? this.cellOverrides[key](value, key)
                : this.defaultCell(value[key], key);

            cell.addEventListener('change', () => {
                this.onCellChange(value, key, cell.value);
            });

            row.appendChild(cell);
        });

        return row;
    }

    /**
     * @returns {Promise<T[]>}
     * @abstract
     */
    async getData() {
        return [];
    }

    /**
     * @abstract
     */
    async addData() {}

    async renderTable() {
        const table = document.querySelector(this.tableSelection);
        const loader = document.querySelector(this.loaderSelection);

        if (!table || !loader) return;

        loader.style.display = 'flex';
        const data = await this.getData();
        loader.style.display = 'none';

        table.innerHTML = '';
        table.appendChild(this.createHeader());

        data.forEach((e) => {
            table.appendChild(this.createRow(e));
        });
    }

    /**
     * @abstract
     */
    renderRow() {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * @abstract
     */
    doSave() {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * @abstract
     */
    search() {}

    /**
     * @abstract
     */
    addRow() {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * @abstract
     */
    removeRows() {
        throw new Error('must be implemented by subclass!');
    }

    /**
     * @abstract
     */
    cancelAdd() {
        throw new Error('must be implemented by subclass!');
    }
}
