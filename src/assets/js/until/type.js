import { validateEmail, validateNumberPhone } from './validator.js';

/**
 * @typedef {{
 *     id: string;
 *     title: string;
 *     details: string;
 *     thumbnail: string;
 *     imgs: string[];
 *     base_price: number;
 *     discount: number;
 *     category: string[];
 * }} Sach
 */

/**
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
 *     sach: string;
 *     quantity: number;
 *     timecreate: Date | string;
 * }} Cart
 *
 *
 * @typedef {{
 *     id: string;
 *     email: string;
 *     name: string;
 *     passwd: string;
 *     phone_num: string;
 *     rule: 'admin' | 'user';
 *     status: 'active' | 'block';
 *     datecreated: Date;
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
 * @typedef {{
 *     id: string;
 *     user_id: string;
 *     items: Omit<Cart, 'id'| 'user_id' | 'timecreate'>[];
 *     date: Date;
 *     state: 'doixacnhan' | 'daxacnhan' | 'danggiaohang' | 'giaohangthanhcong' | 'huy';
 *     last_update: Date;
 *     is_pay: boolean;
 *     total: number;
 *     address: string;
 * }} Order
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
 *
 * @param {Cart} cart
 * @returns {{
 *     key: string;
 *     msg: string;
 * }[]}
 */
export function validataCart(cart) {
    const errors = [];

    if (cart.quantity <= 0) {
        errors.push({
            key: 'quantity',
            msg: 'số lượng sách không được bé hơn 1',
        });
    }

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
