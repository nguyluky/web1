/**
 * - Xóa toàn bộ dấu trong chuỗi ví
 * - Dụ => vi
 * - Du dùng để tìm kiếm
 *
 * @param {string} str
 * @returns {string}
 */
export default function removeDiacritics(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[Đ]/g, 'D')
        .replace(/[đ]/g, 'd')
        .toLocaleLowerCase();
}
