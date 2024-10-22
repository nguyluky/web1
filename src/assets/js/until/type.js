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
 *
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
 *
 * @typedef {{
 *     Id: string;
 *     Name: string;
 *     Wards: Ward[];
 * }} District
 *
 *
 * @typedef {{
 *     Id?: string;
 *     Name?: string;
 *     Level: Level;
 * }} Ward
 */

/**
 * @param {UserInfo} userInfo
 * @returns {{
 *     key: string;
 *     msg: string;
 * }[]}
 */
export function validateUserInfo(userInfo) {
    const errors = [];
    if (!userInfo.name)
        errors.push({ key: 'name', msg: 'Tên không được để trống' });

    if (!userInfo.email)
        errors.push({ key: 'email', msg: 'Email không được để trống' });

    if (!userInfo.passwd)
        errors.push({ key: 'passwd', msg: 'Mật khẩu không được để trống' });

    if (!userInfo.phone_num)
        errors.push({
            key: 'phone_num',
            msg: 'Số điện thoại không được để trống',
        });

    if (userInfo.rule && !['admin', 'user'].includes(userInfo.rule))
        errors.push({ key: 'rule', msg: 'Quyền không hợp lệ' });

    if (!validateEmail(userInfo.email))
        errors.push({ key: 'email', msg: 'Email không hợp lệ' });

    if (!validateNumberPhone(userInfo.phone_num))
        errors.push({ key: 'phone_num', msg: 'Số điện thoại không hợp lệ' });

    return errors;
}

/**
 * @readonly
 * @enum {string}
 */
export const Level = {
    Phuong: 'Phường',
    ThiTran: 'Thị trấn',
    Xa: 'Xã',
};
