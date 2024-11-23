
/**
 * 
 * @param {number} total
 */
export function generatorQr(total) {

    var qrLink = `https://api.vietqr.io/image/970422-0347402306-QfHkzh4.jpg?accountName=WEBSELLBOOKS&amount=${total}&addInfo=thanh%20toan`
    return qrLink

}