import fackDatabase from './db/fakeDb.js';
import renderUser from './render/user_info_table.js';
import searchUser from './search.js';

renderUser(fackDatabase.getAllUserInfo());
let input = document.getElementById('search-input');
if (input) input.oninput = searchUser;
