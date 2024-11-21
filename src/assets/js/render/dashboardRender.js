import fakeDatabase from '../db/fakeDBv1.js';
import { dateToString } from '../until/format.js';

let orders = [];
let books = [];

function formatLineChartData() {
    // tạo đường biểu đồ
    function createListItem(item) {
        return `
      <div class="data-point" data-value="${item.value}" date-date=${item.date}></div>
      <div class="line-segment" style="--hypotenuse: ${item.hypotenuse}; --angle:${item.angle};"></div>
      `;
    }
    // tạo popup cho từng điểm
    function getPointData(point) {
        const popup = document.createElement('div');
        popup.innerHTML = point.getAttribute('data-value');
        return popup;
    }
    //  hover vào điểm
    function hoverPoint() {
        let timeoutId;
        let lastHover;
        document.querySelectorAll('.data-point').forEach((point, i, arr) => {
            point.addEventListener('mouseover', () => {
                if (lastHover) {
                    if (lastHover.firstChild)
                        lastHover.removeChild(lastHover.firstChild);
                }
                if (timeoutId) clearTimeout(timeoutId);
                while (point.firstChild) point.removeChild(point.firstChild);
                point.appendChild(getPointData(point));
                lastHover = arr[i];
            });
            point.addEventListener('mouseout', () => {
                timeoutId = setTimeout(() => {
                    if (point.firstChild) point.removeChild(point.firstChild);
                }, 3000);
            });
        });
    }
    //  chuyển đổi radian sang độ
    const radiansToDegrees = (rads) => rads * (180 / Math.PI);
    //  tạo dữ liệu cho biểu đồ
    const from = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    const to = new Date();
    let values = [];
    let tongthu = 0;
    for (let i = 1; i <= 30; i++) {
        values.push({ date: i, value: 0 });
    }
    orders.forEach((e) => {
        if (
            e.state != 'huy' &&
            from <= new Date(e.last_update) &&
            new Date(e.last_update) <= to
        ) {
            const date = Math.ceil(
                (new Date(e.last_update).getTime() - from.getTime()) /
                (24 * 60 * 60 * 1000),
            );
            let index = values.findIndex((element) => element.date == date);
            if (index) values[index].value += e.total;
            tongthu += e.total;
        }
    });

    const container = document.getElementById('line-chart');
    if (!container) return;
    const widgetHeight = container.clientHeight;
    const widgetWidth = container.clientWidth;
    container.style.cssText = `--widgetHeight: ${widgetHeight}px; --widgetWidth: ${widgetWidth}px`;
    const pointSize = 16;

    const base = (widgetWidth - pointSize * 2) / (values.length - 1);
    const topMostPoint = Math.ceil((Math.max(...values.map((e) => e.value))) / 100000) * 100000;
    let leftOffset = pointSize; //padding for left axis labels
    let nextPoint = 0;
    let rise = 0;
    let cssValues = [];
    const top = topMostPoint / 1000;
    const verticalAxis = document.querySelectorAll('#vertical-axis span');
    verticalAxis[0].textContent = '' + top;
    verticalAxis[1].textContent = '' + (top * 3 / 4);
    verticalAxis[2].textContent = '' + (top * 2 / 4);
    verticalAxis[3].textContent = '' + (top * 1 / 4);
    for (var i = 0, len = values.length - 1; i < len; i++) {
        var currentValue = {
            left: 0,
            bottom: 0,
            hypotenuse: 0,
            angle: 0,
            value: 0,
            date: 0,
        };

        currentValue.value = values[i].value;
        currentValue.left = leftOffset;
        leftOffset += base;

        currentValue.bottom =
            (widgetHeight - pointSize) * (currentValue.value / topMostPoint);
        nextPoint =
            (widgetHeight - pointSize) * (values[i + 1].value / topMostPoint);

        rise = currentValue.bottom - nextPoint;
        currentValue.hypotenuse = Math.sqrt(base * base + rise * rise);
        currentValue.angle = radiansToDegrees(
            Math.asin(rise / currentValue.hypotenuse),
        );

        cssValues.push(currentValue);
    }

    var lastPoint = {
        left: leftOffset,
        bottom:
            (widgetHeight - pointSize) *
            (values[values.length - 1].value / topMostPoint),
        hypotenuse: 0,
        angle: 0,
        value: values[values.length - 1].value,
        date: values[values.length - 1].date,
    };

    cssValues.push(lastPoint);
    while (container.firstChild) container.removeChild(container.firstChild);
    cssValues.forEach((item) => {
        let markup = createListItem(item);
        let listItem = document.createElement('div');
        listItem.style.cssText = `--x: ${item.left}px; --y: ${item.bottom}px`;
        listItem.innerHTML = markup;
        container.appendChild(listItem);
    });
    hoverPoint();
}

/**@param {import('../until/type.js').Order} order */
function createOderInfoForUser(order) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.appendChild(summary);
    details.appendChild(document.createElement('hr'));
    summary.innerHTML = `<div>Mã đơn: ${order.id}</div><div>Tổng đơn: ${order.total}</div>`;
    let head = document.createElement('div');
    head.innerHTML = `<div>Mã sách</div><div>Số lượng</div><div>Thành tiền</div>`;
    details.appendChild(head);
    order.items.forEach((item) => {
        let product = document.createElement('div');
        product.innerHTML = `<div>${item.sach}</div><div>${item.quantity}</div><div>${item.total}</div>`;
        details.appendChild(product);
    });
    return details;
}

async function renderLeaderboard(from, to) {
    let array = [];
    const data = orders.filter((order) => {
        const date = new Date(order.last_update);
        return (
            from.getTime() <= date.getTime() &&
            date.getTime() <= to.getTime() &&
            order.state != 'huy'
        )
    });
    data.forEach((e) => {
        const index = array.findIndex((element) => element.id == e.user_id);
        if (index != -1) {
            array[index].total += e.total;
            array[index].order.push(e.id);
        } else array.push({ id: e.user_id, total: e.total, order: [e.id] });
    });
    array = array.sort((a, b) => b.total - a.total).slice(0, 5);
    while (array.length < 5) array.push({ id: '' });
    console.log(array);
    array.forEach(async (e, i) => {
        console.log('leader');
        const user = await fakeDatabase.getUserInfoByUserId(e.id);
        const name = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(2)`,
        );
        const total = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(3)`,
        );
        if (!name || !total) return;
        if (user) {
            e['name'] = user.name;
            name.textContent = user.name;
            total.textContent = e.total;
        } else {
            name.textContent = 'Không có';
            total.textContent = '0';
        }
    });
    const showOrder = document.querySelector('.info-order__user');
    const name = document.querySelector('#user-name strong');
    document.querySelectorAll('.leaderboard-body > div').forEach((e, i) => {
        e.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            console.log(Math.random());
            console.log(array[i].order);
            if (name)
                name.innerHTML = array[i].name;
            while (
                showOrder &&
                showOrder.children.length > 1 &&
                showOrder.lastChild
            )
                showOrder.removeChild(showOrder.lastChild);
            array[i].order.forEach(async (id) => {
                let orderData = await fakeDatabase.getOrderById(id);
                if (!orderData) return;
                showOrder?.appendChild(createOderInfoForUser(orderData));
            });
        });
    });
}

/**
 *
 * @param {{name: String; quantity: Number; total: Number}} product
 * @param {Number} index
 */
function createARow(product, index) {
    const row = document.createElement('div');
    row.className = 'rank rank-body-row';
    const rank = document.createElement('div');
    row.appendChild(rank);
    rank.innerText = `${index + 1}`;
    Object.keys(product).forEach((key) => {
        if (key != 'id') {
            const cell = document.createElement('div');
            cell.className = `rank-${key}`;
            cell.innerHTML = `${product[key]}`;
            row.appendChild(cell);
        }
    });
    return row;
}

/**
 *
 * @param {Date} from
 * @param {Date} to
 */
async function productRank(from, to) {
    let data = {};
    let array = [];
    orders.forEach((order) => {
        // last_update là chỉ có admin dùng thôi
        const date = new Date(order.last_update);
        if (
            from.getTime() <= date.getTime() &&
            date.getTime() <= to.getTime() &&
            order.state != 'huy'
        ) {
            order.items.forEach((e) => {
                if (data[e.sach]) {
                    data[e.sach].push({
                        orderId: order.id,
                        quantity: e.quantity,
                        user: order.user_id,
                        total: e.total,
                    });
                } else
                    data[e.sach] = [
                        {
                            orderId: order.id,
                            quantity: e.quantity,
                            user: order.user_id,
                            total: e.total,
                        },
                    ];
            });
        }
    });
    books.forEach((e) => {
        let quantity = 0;
        let total = 0;
        if (data[e.id]) {
            data[e.id].forEach((x) => {
                quantity += x.quantity;
                total += x.total;
            });
        }
        array.push({
            id: e.id,
            name: e.title,
            quantity: quantity,
            total: total,
        });
    });
    array.sort((a, b) => {
        if (a.quantity != b.quantity) return b.quantity - a.quantity;
        return b.total - a.total;
    });
    const chart = document.querySelector('.product-rank__body');
    while (chart?.firstChild) chart.removeChild(chart.firstChild);
    let sum = 0;
    array.forEach((value, index) => {
        sum += value.total;
        chart?.appendChild(createARow(value, index));
    });
    const title = document.querySelector('.product-rank__title span');
    if (title) title.innerHTML = String(sum) + ' VNĐ';
    const showOrder = document.querySelector('.info-order__product');
    const name = document.querySelector('#product-name strong');

    document.querySelectorAll('.rank-body-row').forEach((row, i) => {
        row.addEventListener('click', () => {
            const top = /**@type {HTMLElement} */ (showOrder).offsetTop - 70;
            document.querySelector('.dashboard-wrapper')?.scrollTo({
                top: top,
                behavior: 'smooth',
            });
            if (name)
                name.innerHTML = "" + row.querySelector('.rank-name')?.innerHTML;
            while (
                showOrder &&
                showOrder.children.length > 1 &&
                showOrder.lastChild
            )
                showOrder.removeChild(showOrder.lastChild);
            if (data[array[i].id])
                data[array[i].id].forEach(async (e) => {
                    showOrder?.appendChild(await createOderInfoForProduct(e));
                });
        });
    });
}
async function createOderInfoForProduct(order) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.appendChild(summary);
    details.appendChild(document.createElement('hr'));
    summary.innerHTML = `<div>Mã đơn: ${order.orderId}</div><div>Số lượng: ${order.quantity}</div>`;
    let user = await fakeDatabase.getUserInfoByUserId(order.user);
    let userInfo = document.createElement('div');
    userInfo.innerHTML = `<strong>Khách mua hàng:</strong><br>${user?.name}`;
    details.appendChild(userInfo);
    let total = document.createElement('div');
    total.innerHTML = `<strong>Tổng tiền: </strong>${order.total}`;
    details.appendChild(total);
    return details;
}
function renderByDateRange() {
    const chooseDate = document.querySelector('.choose-date');
    const from = /**@type {HTMLInputElement} */ (
        chooseDate?.querySelector('#from-date input')
    );
    const to = /**@type {HTMLInputElement} */ (
        chooseDate?.querySelector('#to-date input')
    );
    if (!from || !to) return;
    const now = new Date();
    from.value = dateToString(
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    );
    to.value = dateToString(now);
    to.max = dateToString(now);
    let from_current = from.value;
    let to_current = to.value;
    productRank(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);
    renderLeaderboard(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);
    chooseDate?.addEventListener('change', () => {
        from.value = from.value ? from.value : from_current;
        to.value = to.value ? to.value : to_current;
        from_current = from.value;
        to_current = to.value;
        productRank(new Date(from.value), new Date(to.value));
        renderLeaderboard(new Date(from.value), new Date(to.value));
    });
}

async function count() {
    const countProduct = document.querySelector('#amount-product .num');
    const countUser = document.querySelector('#amount-user .num');
    if (!countProduct || !countUser) return;
    countProduct.innerHTML = orders.length.toString();
    const users = await fakeDatabase.getAllUserInfo();
    countUser.innerHTML = users.length.toString();
}
async function dashboardRender() {
    orders = await fakeDatabase.getAllOrder();
    books = await fakeDatabase.getAllBooks();
    count();
    renderByDateRange();
    formatLineChartData();
    window.addEventListener('resize', () => formatLineChartData());
}
export default dashboardRender;
