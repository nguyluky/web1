import search from '../src/assets/js/until/search.js';
import fackDatabase from '../src/assets/js/db/fakeDb.js';

var test = search(fackDatabase.getAllUserInfo(), {
    name: 'Funk',
});

console.log(test);
