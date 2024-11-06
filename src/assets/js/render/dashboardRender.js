import fakeDatabase from '../db/fakeDBv1.js';
import { dateToString } from '../until/formatDate.js';

const chartValues = [
    { value: 25 },
    { value: 60 },
    { value: 45 },
    { value: 50 },
    { value: 40 },
];
const orders = await fakeDatabase.getAllOrder();
const books = await fakeDatabase.getAllBooks();
/**
 * @param {{value: number}[]} values
 */
function formatLineChartData(values = chartValues) {
    const maxValue = (values) => {
        let max = 0;
        values.forEach((e) => {
            max = max > e.value ? max : e.value;
        });
        return max;
    };
    const radiansToDegrees = (rads) => rads * (180 / Math.PI);

    function createListItem(item) {
        return `
      <div class="data-point" data-value="${item.value}"></div>
      <div class="line-segment" style="--hypotenuse: ${item.hypotenuse}; --angle:${item.angle};"></div>
      `;
    }

    function getPointData(point) {
        const popup = document.createElement('div');
        popup.innerHTML = point.getAttribute('data-value');
        return popup;
    }

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

    const container = document.getElementById('line-chart');
    if (!container) return;
    const widgetHeight = container.clientHeight;
    const widgetWidth = container.clientWidth;
    container.style.cssText = `--widgetHeight: ${widgetHeight}px; --widgetWidth: ${widgetWidth}px`;
    const pointSize = 16;

    const base = (widgetWidth - pointSize * 2) / (values.length - 1);

    const topMostPoint = maxValue(values);
    let leftOffset = pointSize; //padding for left axis labels
    let nextPoint = 0;
    let rise = 0;
    let cssValues = [];

    for (var i = 0, len = values.length - 1; i < len; i++) {
        var currentValue = {
            left: 0,
            bottom: 0,
            hypotenuse: 0,
            angle: 0,
            value: 0,
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
    head.innerHTML = `<div>Mã sách</div><div>Số lượng</div>`;
    details.appendChild(head);
    order.items.forEach((item) => {
        let product = document.createElement('div');
        product.innerHTML = `<div>${item.sach}</div><div>${item.quantity}</div>`;
        details.appendChild(product);
    });
    return details;
}

async function renderLeaderboard() {
    let array = [];
    const data = orders.filter((e) => e.state == 'giaohangthanhcong');
    data.forEach((e) => {
        const index = array.findIndex((element) => element.id == e.user_id);
        if (index != -1) {
            array[index].total += e.total;
            array[index].order.push(e.id);
        } else array.push({ id: e.user_id, total: e.total, order: [e.id] });
    });
    array.sort((a, b) => b.total - a.total);
    array.slice(0, 5).forEach(async (e, i) => {
        const user = await fakeDatabase.getUserInfoByUserId(e.id);
        const name = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(2)`,
        );
        const total = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(3)`,
        );
        if (user && name && total) {
            e['name'] = user.name;
            name.textContent = user.name;
            total.textContent = e.total;
        }
    });
    const showOrder = document.querySelector('.info-order__user');
    const name = document.getElementById('user-name');
    const text = name?.innerText;
    document.querySelectorAll('.leaderboard-body > div').forEach((e, i) => {
        e.addEventListener('click', () => {
            if (name)
                name.innerHTML = `${text}<br><strong>${array[i].name}</strong>`;
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
 * @param {{name: String; quantify: Number; total: Number}} product
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
        const date = new Date(order.date);
        if (
            from.getTime() <= date.getTime() &&
            date.getTime() <= to.getTime()
        ) {
            order.items.forEach((e) => {
                if (data[e.sach]) {
                    data[e.sach].push({
                        orderId: order.id,
                        quantify: e.quantity,
                        user: order.user_id,
                    });
                } else
                    data[e.sach] = [
                        {
                            orderId: order.id,
                            quantify: e.quantity,
                            user: order.user_id,
                        },
                    ];
            });
        }
    });
    books.forEach((e) => {
        let quantify = 0;
        if (data[e.id]) {
            data[e.id].forEach((x) => {
                quantify += x.quantify;
            });
        }
        array.push({
            id: e.id,
            name: e.title,
            quantify: quantify,
            total: e.base_price * (1 - e.discount) * quantify,
        });
    });
    array.sort((a, b) => {
        if (a.quantify != b.quantify) return b.quantify - a.quantify;
        return b.total - a.total;
    });
    const chart = document.querySelector('.product-rank__body');
    while (chart?.firstChild) chart.removeChild(chart.firstChild);
    let sum = 0;
    array.forEach((value, index) => {
        sum += value.total;
        chart?.appendChild(createARow(value, index));
    });
    const footer = document.querySelector('.product-rank__footer span');
    if (footer) footer.innerHTML = String(sum) + ' VNĐ';
    const showOrder = document.querySelector('.info-order__product');
    const name = document.getElementById('product-name');
    const text = name?.innerText;
    document.querySelectorAll('.rank-body-row').forEach((row, i) => {
        row.addEventListener('click', () => {
            const top = /**@type {HTMLElement} */ (showOrder).offsetTop - 70;
            document.querySelector('.dashboard-wrapper')?.scrollTo({
                top: top,
                behavior: 'smooth',
            });
            if (name)
                name.innerHTML = `${text}<br><strong>${
                    row.querySelector('.rank-name')?.innerHTML
                }</strong>`;
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
    summary.innerHTML = `<div>Mã đơn: ${order.orderId}</div><div>Số lượng: ${order.quantify}</div>`;
    let user = await fakeDatabase.getUserInfoByUserId(order.user);
    let userInfo = document.createElement('div');
    userInfo.innerHTML = `Khách mua hàng:<br>${user?.name}`;
    details.appendChild(userInfo);
    return details;
}
function renderProductRank() {
    const chooseDate = document.querySelector('#product-rank .choose-date');
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
    productRank(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);
    chooseDate?.addEventListener('change', () => {
        productRank(new Date(from.value), new Date(to.value));
    });
}

function count() {}
function dashboardRender() {
    renderLeaderboard();
    renderProductRank();
    formatLineChartData();
    window.addEventListener('resize', () => formatLineChartData());
}
export default dashboardRender;
