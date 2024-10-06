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
