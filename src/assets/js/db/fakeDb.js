/**
 *
 * @typedef {{
 *  id: number;
 *  title: string;
 *  details: string;
 *  thumbnal: string;
 *  base_price: number;
 *  category: string[];
 *  opstion?: Opstion
 * }} Sach
 *
 * @typedef {{
 *   opstion_id: number;
 *   short_name: string;
 *   long_name: string;
 *   price: number
 *  }} Opstion
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
 *  opstion_id?: number;
 *  quantity: number;
 *  status: "suly" | "doixacnhan" | "thanhcong";
 * }} Cart
 *
 * @typedef {{
 *  user_name: string;
 *  password: string;
 *  user_id: number;
 * }} LoginInfo
 *
 *
 * @typedef {{
 *  id: number;
 *  display_name: string;
 *  std: string;
 *  email: string;
 *  role: 'adim' | 'user';
 * }} UserInfo
 */

/**
 *
 * lưu toàn bộ thông tin
 *
 * @type {{
 * user_info: UserInfo[];
 * login_info: LoginInfo[];
 * category: Category[];
 * cart: Cart[];
 * sach: Sach[];
 * }}
 */
const cache = {
    user_info: [],
    login_info: [],
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
            name: 'Khoa Văn hóa và Du lịch',
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
     * @param {number} user_id
     * @returns {UserInfo | undefined }
     */
    getUserInfoByUserId(user_id) {
        return cache.user_info.find((e) => e.id == user_id);
    }

    /**
     *
     * @param {string} user_name
     * @param {string} password
     * @returns {UserInfo | undefined}
     */
    getUserInfoByUserNameAndPassword(user_name, password) {
        const login_info = cache.login_info.find(
            (e) => e.user_name == user_name && e.password == password,
        );

        if (login_info) return this.getUserInfoByUserId(login_info.user_id);
        return undefined;
    }

    /**
     *
     * @param {string} user_name
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    createUser(user_name, password, display_name, std, email) {
        const user_id = cache.user_info[cache.login_info.length - 1].id + 1;
        cache.user_info.push({
            id: user_id,
            display_name: display_name,
            role: 'user',
            std,
            email,
        });

        cache.login_info.push({
            user_name: user_name,
            password: password,
            user_id: user_id,
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
     * @param {Opstion} opstion
     */
    addSach(title, details, thumbnal, base_price, category, opstion) {
        const sach_id = cache.sach[cache.sach.length - 1].id + 1;
        cache.sach.push({
            id: sach_id,
            title,
            details,
            thumbnal,
            base_price,
            category,
            opstion,
        });
    }

    /**
     * @param {number} id
     * @param {string} title
     * @param {string} details
     * @param {string} thumbnal
     * @param {number} base_price
     * @param {string[]} category
     * @param {Opstion} opstion
     */
    updateSach(id, title, details, thumbnal, base_price, category, opstion) {
        const new_sach = {
            id,
            title,
            details,
            thumbnal,
            base_price,
            category,
            opstion,
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
}

const fackDatabase = new FackDatabase();
export default fackDatabase;
