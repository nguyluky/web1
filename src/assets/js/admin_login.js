// giải thích file này được sử dụng trong file admin/index.html
// file này sẽ được sử dụng để xử lý đăng nhập của admin
// khi đăng nhập thành công sẽ chuyển hướng đến trang admin/index.html
// còn nếu đăng nhập thất bại sẽ hiển thị thông báo lỗi

import fakeDatabase from './db/fakeDBv1.js';
// load tât cả thông tin user từ fakeDatabase
await fakeDatabase.getAllUserInfo();
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

document.querySelector('form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const phone = /**@type {HTMLInputElement} */ (document.getElementById('input-phone'));
    const password = /**@type {HTMLInputElement} */ (document.getElementById('password'));
    const admin = await fakeDatabase.getUserInfoByPhoneOrEmail(phone.value);

    if (admin === undefined || admin.rule !== 'admin') {
        alert('Số điện thoại không đúng');
        phone.focus();
        console.log('object');
        return;
    }
    if (admin.passwd !== password.value) {
        alert('Mật khẩu không chính xác');
        password.focus();
        return;
    }
    let rmb_btn = /** @type {HTMLInputElement} */ (
        document.querySelector('.remember input[type="checkbox"]')
    );
    if (rmb_btn.checked) localStorage.setItem('isAdmin', 'true');
    else sessionStorage.setItem('isAdmin', 'true');
    location.href = '/admin/index.html';
});
