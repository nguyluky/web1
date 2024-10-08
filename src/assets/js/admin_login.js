document.getElementById('show-hide-icon')?.addEventListener('click', () => {
    let e = /**@type {HTMLInputElement} */ (
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
    let rmb_btn = /**@type {HTMLInputElement} */ (
        document.querySelector('.remember input[type="checkbox"]')
    );
    if (rmb_btn.checked) localStorage.setItem('isAdmin', 'true');
    else sessionStorage.setItem('isAdmin', 'true');
    location.href = '/admin/index.html';
});
