import fackDatabase from './db/fakeDb.js';
import renderUser from './render/user_info_table.js';

renderUser(fackDatabase.getAllUserInfo());
