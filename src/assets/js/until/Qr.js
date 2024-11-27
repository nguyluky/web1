
/**
 * 
 * @param {number} total
 * @returns {string} // đường dẫn qr
 */
export function generatorQr(total) {

    var qrLink = `https://api.vietqr.io/image/970422-0347402306-QfHkzh4.jpg?accountName=WEBSELLBOOKS&amount=${total}&addInfo=Thanh%20toan%20don%20hang`
    return qrLink

}