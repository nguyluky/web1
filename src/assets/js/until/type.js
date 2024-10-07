/**
 *
 * @typedef {{
 *  id: string;
 *  title: string;
 *  details: string;
 *  thumbnal: string;
 *  imgs: string[];
 *  base_price: number;
 *  category: string[];
 *  option?: Option[]
 * }} Sach
 *
 */

/**
 * @typedef {{
 *   id: string;
 *   short_name: string;
 *   long_name: string;
 *   img?: string
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
 *  id: string;
 *  user_id: string;
 *  sach: number;
 *  option_id?: number;
 *  quantity: number;
 *  status: "suly" | "doixacnhan" | "thanhcong";
 *  timecreate: Date
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
 * @typedef {{
 *  id: string,
 *  data: string
 * }} imgStore
 *
 */

/**
 * 
 * @typedef {{
*     Id:        string;
*     Name:      string;
*     Districts: District[];
* }} Address 
* @typedef {{
*     Id:    string;
*     Name:  string;
*     Wards: Ward[];
* }} District
* @typedef {{
*     Id?:    string;
*     Name?:  string;
*     Level: Level;
* }} Ward

export enum Level {
   Phường = "Phường",
   ThịTrấn = "Thị trấn",
   Xã = "Xã",
}

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
