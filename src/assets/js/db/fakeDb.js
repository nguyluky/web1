/**
 *
 * @typedef {{
 *  id: number;
 *  title: string;
 *  details: string;
 *  thumbnal: string;
 *  base_price: number;
 *  category: string[];
 *  option?: Option
 * }} Sach
 *
 * @typedef {{
 *   opstion_id: number;
 *   short_name: string;
 *   long_name: string;
 *   price: number
 *  }} Option
 *
 * @typedef {{
 *  id: string;
 *  name: string;
 *  long_name?: string;
 * }} Category
 *
 * @typedef {{
 *  id: number;
 *  user_id: number;
 *  sach: number;
 *  option_id?: number;
 *  quantity: number;
 *  status: "suly" | "doixacnhan" | "thanhcong";
 * }} Cart
 *
 * @typedef {{
 *  id: string;
 *  email: string;
 *  name: string;
 *  passwd: string;
 *  phone_num: string;
 *  rule?: 'admin' | 'user';
 * }} UserInfo
 *
 *
 */

/**
 *
 * lưu toàn bộ thông tin
 *
 * @type {{
 * user_info: UserInfo[];
 * category: Category[];
 * cart: Cart[];
 * sach: Sach[];
 * }}
 */
const cache = {
    user_info: [
        {
            id: '54654',
            name: 'Austin Jerde',
            email: 'li.fritsch@schuppe.com',
            passwd: 'NhNuCZ5GNY9Hbny',
            phone_num: '1-453-517-4318 x07027',
        },
        {
            id: '54659',
            name: 'Priscilla Funk',
            email: 'arron@wisokygerhold.ca',
            passwd: 'YzvGNr8HeboPpbe2',
            phone_num: '(258)570-4441',
        },
        {
            id: '54664',
            name: 'Kittie Doyle',
            email: 'theodore@thompson.co.uk',
            passwd: '3RoCp0ACesU3LW',
            phone_num: '957.915.1107 x2742',
        },
        {
            id: '54669',
            name: 'Frankie Ernser',
            email: 'miriam@haleyvonname',
            passwd: 'rh_Bbkmcpo2q',
            phone_num: '783-648-2076',
        },
        {
            id: '54674',
            name: 'Roseann Murazik',
            email: 'gina_sanford@roberts.us',
            passwd: 'M_s9y6X4v1R3izY9',
            phone_num: '(987)684-9916 x3751',
        },
        {
            id: '54679',
            name: 'Sherell Stamm',
            email: 'fransisca.schaden@kozey.us',
            passwd: 'EpXeCUNyv9',
            phone_num: '1-306-635-2489',
        },
        {
            id: '54684',
            name: 'Kelvin Zemlak',
            email: 'roseanna_koss@fayyundt.com',
            passwd: 'ggXMajC6fjBJOSUy',
            phone_num: '1-936-755-9067 x581',
        },
        {
            id: '54689',
            name: 'Oma Gerlach',
            email: 'alethea@mcclure.info',
            passwd: 'mVpSJhk1dQ',
            phone_num: '1-267-975-8093 x377',
        },
        {
            id: '54694',
            name: 'Gertie Abshire',
            email: 'sean@skileskemmer.biz',
            passwd: 'fWztc6BE',
            phone_num: '(253)287-5938 x8712',
        },
        {
            id: '54699',
            name: 'Clarita Bashirian',
            email: 'latoyia_ebert@gleason.biz',
            passwd: 'qOhntsfsXX3oAaCW',
            phone_num: '984-648-0683 x5318',
        },
        {
            id: '54704',
            name: 'Julia Schumm',
            email: 'maria.grant@hagenes.co.uk',
            passwd: 'gHtYHxbrTi1Nk67m',
            phone_num: '287-273-5032',
        },
        {
            id: '54709',
            name: 'Taren Stoltenberg',
            email: 'era@christiansenconn.info',
            passwd: 'HG8J5Dcr',
            phone_num: '464.297.9957',
        },
        {
            id: '54714',
            name: 'Tilda Bernhard',
            email: 'ciara@gleichnerbeahan.co.uk',
            passwd: '43cVUnC6fJPrxu2y',
            phone_num: '447.853.6611',
        },
        {
            id: '54719',
            name: 'Zachary Hand',
            email: 'epifania_senger@quigley.ca',
            passwd: 'js6suExHovLcQSV',
            phone_num: '1-989-624-2512 x5541',
        },
        {
            id: '54724',
            name: 'Vella Kirlin',
            email: 'vita@wolf.co.uk',
            passwd: 'XfKUV_RhYW',
            phone_num: '737-901-4656 x82503',
        },
        {
            id: '54729',
            name: 'Jene Weber',
            email: 'kitty@hilpert.com',
            passwd: 'tWdWQVOfSQ7nUzpk',
            phone_num: '251-694-4800',
        },
        {
            id: '54734',
            name: 'Shawanda Bogan',
            email: 'clemmie@stiedemann.ca',
            passwd: 'KzTdv3RvYYpY',
            phone_num: '1-339-958-5156 x396',
        },
        {
            id: '54739',
            name: 'Floy Cronin',
            email: 'andrew@block.info',
            passwd: 'dQt9tmpkzeD',
            phone_num: '272.402.3431 x2898',
        },
        {
            id: '54744',
            name: 'Zula Mueller',
            email: 'roman@treutelname',
            passwd: 'U_qSAuLV54EhtD',
            phone_num: '544-968-7965 x616',
        },
        {
            id: '54749',
            name: 'Judith Lesch',
            email: 'vincenzo@lednername',
            passwd: 'iSDUhqj9',
            phone_num: '732.739.1282 x2621',
        },
        {
            id: '1123',
            name: 'Leanne Graham',
            email: 'Sincere@april.biz',
            phone_num: '1-770-736-8031 x56442',
            passwd: 'password25',
        },
        {
            id: '2853',
            name: 'Ervin Howell',
            email: 'Shanna@melissa.tv',
            phone_num: '010-692-6593 x09125',
            passwd: 'password10',
        },
        {
            id: '3123',
            name: 'Clementine Bauch',
            email: 'Nathan@yesenia.net',
            phone_num: '1-463-123-4447',
            passwd: 'password29',
        },
        {
            id: '4121',
            name: 'Patricia Lebsack',
            email: 'Julianne.OConner@kory.org',
            phone_num: '493-170-9623 x156',
            passwd: 'password17',
        },
        {
            id: '5675',
            name: 'Chelsey Dietrich',
            email: 'Lucio_Hettinger@annie.ca',
            phone_num: '(254)954-1289',
            passwd: 'password11',
        },
        {
            id: '6321',
            name: 'Mrs. Dennis Schulist',
            email: 'Karley_Dach@jasper.info',
            phone_num: '1-477-935-8478 x6430',
            passwd: 'password43',
        },
        {
            id: '7223',
            name: 'Kurtis Weissnat',
            email: 'Telly.Hoeger@billy.biz',
            phone_num: '210.067.6132',
            passwd: 'password2',
        },
        {
            id: '8321',
            name: 'Nicholas Runolfsdottir V',
            email: 'Sherwood@rosamond.me',
            phone_num: '586.493.6943 x140',
            passwd: 'password31',
        },
        {
            id: '9113',
            name: 'Glenna Reichert',
            email: 'Chaim_McDermott@dana.io',
            phone_num: '(775)976-6794 x41206',
            passwd: 'password25',
        },
        {
            id: '1023',
            name: 'Clementina DuBuque',
            email: 'Rey.Padberg@karina.biz',
            phone_num: '024-648-3804',
            passwd: 'password12',
        },
    ],
    category: [
        {
            id: 'mc',
            name: 'môn chung',
            long_name: 'môn chung',
        },
        {
            id: 'hoidap',
            name: 'hỏi đáp',
            long_name: 'hỏi đáp',
        },
        {
            id: 'QD',
            name: 'Khoa Quản trị Kinh doanh',
        },
        {
            id: 'VD',
            name: 'Khoa Văn hoá và Du lịch',
        },
        {
            id: 'KT',
            name: 'Khoa SP Kĩ thuật',
        },
        {
            id: '09',
            name: 'Phòng Giáo dục thường xuyên',
        },
        {
            id: 'CT',
            name: 'Khoa Công nghệ thông tin',
        },
        {
            id: 'TT',
            name: 'Khoa Thư viện - Văn phòng',
        },
        {
            id: 'GM',
            name: 'Khoa Giáo dục Mầm non',
        },
        {
            id: 'NN',
            name: 'Khoa Ngoại ngữ',
        },
        {
            id: 'XH',
            name: 'Khoa SP Khoa học Xã hội',
        },
        {
            id: 'TD',
            name: 'Khoa Toán - ứng dụng',
        },
        {
            id: 'TE',
            name: 'Khoa Tài chính - Kế toán',
        },
        {
            id: 'QG',
            name: 'Khoa Giáo dục',
        },
        {
            id: 'MO',
            name: 'Khoa Môi trường',
        },
        {
            id: 'TN',
            name: 'Khoa SP Khoa học Tự nhiên',
        },
        {
            id: 'GT',
            name: 'Khoa Giáo dục Tiểu học',
        },
        {
            id: 'NT',
            name: 'Khoa Nghệ thuật',
        },
        {
            id: 'LU',
            name: 'Khoa Luật',
        },
        {
            id: 'DV',
            name: 'Khoa Điện tử viễn thông',
        },
        {
            id: 'LC',
            name: 'Khoa Giáo dục chính trị',
        },
    ],
    cart: [],
    sach: [],
};

class FackDatabase {
    /**
     *
     * @param {string} user_id
     * @returns {UserInfo | undefined }
     */
    getUserInfoByUserId(user_id) {
        return cache.user_info.find((e) => e.id == user_id);
    }

    /**
     *
     * @returns {UserInfo[]}
     */
    getAllUserInfo() {
        return cache.user_info;
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {UserInfo | undefined}
     */
    getUserInfoByUserNameAndPassword(email, password) {
        const user_info = cache.user_info.find((e) => e.email == email && e.passwd == password);
        return user_info;
    }

    /**
     *
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    createUser(password, display_name, std, email) {
        const user_id = cache.user_info[cache.user_info.length - 1].id + 1;
        cache.user_info.push({
            id: user_id,
            name: display_name,
            email,
            passwd: password,
            phone_num: std,
            rule: 'user',
        });
    }

    /**
     *
     * @returns {Sach[]}
     */
    getAllSach() {
        return cache.sach;
    }

    /**
     *
     * @param {string} search
     * @param {string} category
     * @param {number} price_from
     * @param {number} price_to
     * @returns {Sach[]}
     */
    getSachWithFilter(search, category, price_from, price_to) {
        let relust = this.getAllSach();

        if (search) {
            relust = relust.filter(
                (e) =>
                    e.title.toLowerCase().includes(search.toLowerCase()) ||
                    e.details.toLowerCase().includes(search.toLowerCase()),
            );
        }

        if (category) {
            relust = relust.filter((e) => e.category.includes(category));
        }

        if (price_from) {
            relust = relust.filter((e) => e.base_price < price_from);
        }

        if (price_to) {
            relust = relust.filter((e) => e.base_price > price_to);
        }

        return relust;
    }

    /**
     *
     * @param {number} sach_id
     * @returns {Sach | undefined}
     */
    getSachById(sach_id) {
        return cache.sach.find((e) => e.id == sach_id);
    }

    /**
     *
     * @param {string} title
     * @param {string} details
     * @param {string} thumbnal
     * @param {number} base_price
     * @param {string[]} category
     * @param {Option} option
     */
    addSach(title, details, thumbnal, base_price, category, option) {
        const sach_id = cache.sach[cache.sach.length - 1].id + 1;
        cache.sach.push({
            id: sach_id,
            title,
            details,
            thumbnal,
            base_price,
            category,
            option,
        });
    }

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} details
     * @param {string} thumbnal
     * @param {number} base_price
     * @param {string[]} category
     * @param {Option} option
     */
    updateSach(id, title, details, thumbnal, base_price, category, option) {
        const new_sach = {
            id,
            title,
            details,
            thumbnal,
            base_price,
            category,
            option,
        };

        console.log(new_sach);
    }

    /**
     *
     * @param {number} sach_id
     */
    deleteSachById(sach_id) {
        const index = cache.sach.findIndex((e) => e.id == sach_id);
        cache.sach.splice(index, 1);
    }

    getALlCart() {
        return cache.cart;
    }

    /**
     *
     * @param {number} user_id
     * @returns {Cart[]}
     */
    getCartByUserId(user_id) {
        return cache.cart.filter((e) => e.user_id == user_id);
    }

    /**
     *
     * @param {number} cart_id
     * @param {"suly" | "doixacnhan" | "thanhcong"} status
     */
    updateStatus(cart_id, status) {
        const index = cache.cart.findIndex((e) => e.id == cart_id);
        cache.cart[index].status = status;
    }

    /**
     *
     * @returns {Category[]}
     */
    getAllCategory() {
        return cache.category;
    }
}

const fackDatabase = new FackDatabase();
export default fackDatabase;
