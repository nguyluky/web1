import fackDatabase from '../db/fakeDb.js';
import { searchList } from './reader_table.js';

function searchUser() {
    searchList(fackDatabase.getAllUserInfo(), {
        id: 'Id',
        name: 'Name',
        passwd: 'Pass',
        email: 'Email',
        phone_num: 'Phone',
        rule: 'Rule',
    });
}

export default searchUser;
