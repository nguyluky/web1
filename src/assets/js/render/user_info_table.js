/**
 *
 * @param {import("../db/fakeDb").UserInfo[]} list
 */
function renderUser(list) {
    let element = `<tr>
        <th>Check<i class="fa-solid fa-filter"></i></th>
        <th>ID<i class="fa-solid fa-filter"></i></th>
        <th>Name<i class="fa-solid fa-filter"></i></th>
        <th>Email<i class="fa-solid fa-filter"></i></th>
        <th>Phone number<i class="fa-solid fa-filter"></i></th>
        <th>Rule<i class="fa-solid fa-filter"></i></th>
    </tr>`;
    list.forEach((user, index) => {
        element += `<tr id="row-${index % 2}">
            <td><input type="checkbox" style="margin-left: 20px"></td>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone_num}</td>
            <td>${user.rule || 'user'}</td>
        </tr>`;
    });

    const table = document.getElementById('content_table');
    if (table) table.innerHTML = element;
}

export default renderUser;
