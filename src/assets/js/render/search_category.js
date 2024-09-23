import fackDatabase from '../db/fakeDb.js';
import { searchList } from './reader_table.js';

function searchCategory() {
    searchList(fackDatabase.getAllCategory(), {
        id: 'Id ',
        name: 'Name',
        long_name: 'Long Name',
    });
}

export default searchCategory;
