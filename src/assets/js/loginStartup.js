/**
 * File này chạy ngay khi được tải xong nên không nên thêm bất cứ sử lý DOM nào
 * ở đây
 */

// key: isAdmin là tài khoản admin
// key: isUser là tài khoản User

function checkadmin() {
    // nếu có remember
    if (
        localStorage.getItem('isAdmin') !== null ||
        sessionStorage.getItem('isAdmin') !== null
    )
        return;
    // nếu chưa remember
    location.href = '/admin/login.html';
}

checkadmin();
