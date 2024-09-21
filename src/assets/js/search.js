import renderUser from './render/user_info_table.js';
import fackDatabase from './db/fakeDb.js';

var records = fackDatabase.getAllUserInfo();
function searchUser() {
    // @ts-ignore
    let valueSearchInput = document.getElementById('search-input').value;
    let userSearch = records.filter((user) => {
        return (
            user.id.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
            user.name.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
            user.email.toUpperCase().includes(valueSearchInput.toUpperCase()) ||
            user.phone_num.toUpperCase().includes(valueSearchInput.toUpperCase())
        );
    });
    renderUser(userSearch);
    console.log('Success');
}

export default searchUser;
