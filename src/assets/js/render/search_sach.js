import fackDatabase from '../db/fakeDb.js';
import { searchList } from './reader_table.js';

function searchSach() {
    searchList(fackDatabase.getAllSach(), {
        id: 'Id',
        title: 'Title',
        details: 'Details',
        thumbnal: 'Thumbnal',
        base_price: 'Price',
        category: 'Category',
        option: 'Option',
    });
}

export default searchSach;
