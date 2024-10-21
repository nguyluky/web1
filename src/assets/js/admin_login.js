// giải thích file này được sử dụng trong file admin/index.html
// file này sẽ được sử dụng để xử lý đăng nhập của admin
// khi đăng nhập thành công sẽ chuyển hướng đến trang admin/index.html
// còn nếu đăng nhập thất bại sẽ hiển thị thông báo lỗi
// và không chuyển hướng
document.getElementById('show-hide-icon')?.addEventListener('click', () => {
    let e = /** @type {HTMLInputElement} */ (
        document.getElementById('password')
    );
    let icon = document.getElementById('show-hide-icon');
    if (e?.type == 'password') {
        e.type = 'text';
        icon?.classList.remove('fa-eye');
        icon?.classList.add('fa-eye-slash');
        return;
    }
    e.type = 'password';
    icon?.classList.remove('fa-eye-slash');
    icon?.classList.add('fa-eye');
});

document.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    let rmb_btn = /** @type {HTMLInputElement} */ (
        document.querySelector('.remember input[type="checkbox"]')
    );
    if (rmb_btn.checked) localStorage.setItem('isAdmin', 'true');
    else sessionStorage.setItem('isAdmin', 'true');
    location.href = '/admin/index.html';
});
