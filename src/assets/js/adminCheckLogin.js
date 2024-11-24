if (!localStorage.getItem('admin_id') && sessionStorage.getItem('admin_id')) {
    window.location.href = './admin/login.html';
}