import { validateEmail, validateNumberPhone } from './validata.js';

/**
 * @typedef {{
 *     id: string;
 *     title: string;
 *     details: string;
 *     thumbnal: string;
 *     imgs: string[];
 *     base_price: number;
 *     category: string[];
 *     option?: Option[];
 * }} Sach
 */

/**
 * @typedef {{
 *     id: string;
 *     short_name: string;
 *     long_name: string;
 *     img?: string;
 *     price: number;
 * }} Option
 */

/**
 *
 * @typedef {{
 *     id: string;
 *     name: string;
 *     long_name?: string;
 * }} Category
 */

/**
 * @typedef {{
 *     id: string;
 *     user_id: string;
 *     sach: number;
 *     option_id?: number;
 *     quantity: number;
 *     status: 'suly' | 'doixacnhan' | 'thanhcong';
 *     timecreate: Date;
 * }} Cart
 *
 *
 * @typedef {{
 *     id: string;
 *     email: string;
 *     name: string;
 *     passwd: string;
 *     phone_num: string;
 *     rule?: 'admin' | 'user';
 * }} UserInfo
 */

/**
 * @param {UserInfo} userInfo
 * @returns {{
 * key: string,
 * msg: string
 * } | undefined} errow message
 */
export function validateUserInfo(userInfo) {
    if (!userInfo.id) {
        return { key: 'id', msg: 'id is required' };
    }

    if (!userInfo.email) {
        return { key: 'email', msg: 'email is required' };
    }

    if (!userInfo.name) {
        return { key: 'name', msg: 'name is required' };
    }

    if (!userInfo.passwd) {
        return { key: 'passwd', msg: 'passwd is required' };
    }

    if (!userInfo.phone_num) {
        return { key: 'phone_num', msg: 'phone_num is required' };
    }

    if (
        userInfo.rule &&
        userInfo.rule !== 'admin' &&
        userInfo.rule !== 'user'
    ) {
        return { key: 'rule', msg: 'rule is valid (admin | user)' };
    }

    if (!validateEmail(userInfo.email)) {
        return { key: 'email', msg: 'email is not valid' };
    }

    if (!validateNumberPhone(userInfo.phone_num)) {
        return { key: 'phone_num', msg: 'phone_num is not valid' };
    }

    return undefined;
}
/**
 *
 * @typedef {{
 *     id: string;
 *     data: string;
 * }} imgStore
 */

/**
 * @typedef {{
 *     Id: string;
 *     Name: string;
 *     Districts: District[];
 * }} Address
 *
 * @typedef {{
 *     Id: string;
 *     Name: string;
 *     Wards: Ward[];
 * }} District
 *
 * @typedef {{
 *     Id?: string;
 *     Name?: string;
 *     Level: Level;
 * }} Ward
 */

/**
 * @readonly
 * @enum {string}
 */
export const Level = {
    Phuong: 'Phường',
    ThiTran: 'Thị trấn',
    Xa: 'Xã',
};

export default {};
