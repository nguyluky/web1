import fackDatabase from '../db/fakeDb.js';
import { searchList } from './reader_table.js';

function searchCart() {
    searchList(fackDatabase.getALlCart(), {
        id: 'Id',
        user_id: 'User id',
        sach: 'Sách id',
        quantity: 'Số lượng',
        option_id: 'Option',
        status: 'Trạng thái',
    });
}

export default searchCart;
