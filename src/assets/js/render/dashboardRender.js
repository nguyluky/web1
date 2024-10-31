import fakeDatabase from '../db/fakeDBv1.js';
import { dateToString } from '../until/formatDate.js';

const chartValues = [
    { value: 25 },
    { value: 60 },
    { value: 45 },
    { value: 50 },
    { value: 40 },
];

/**
 *
 * @param {HTMLElement} container
 * @param {{value: number}[]} values
 */
function formatLineChartData(container, values = chartValues) {
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
/**@param {import('../until/type.js').Order} order */
function creatOrderInfo(order) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.appendChild(summary);
    summary.innerHTML = `Mã đơn: ${order.id}`;
    let head = document.createElement('div');
    let ma = document.createElement('div');
    head.appendChild(ma);
    ma.innerHTML = `Mã sách`;
    let sl = document.createElement('div');
    sl.innerHTML = `Số lượng`;
    head.appendChild(sl);
    details.appendChild(head);
    order.items.forEach((item) => {
        let product = document.createElement('div');
        let product_name = document.createElement('div');
        product.appendChild(product_name);
        product_name.innerHTML = item.sach;
        let product_quantify = document.createElement('div');
        product_quantify.innerHTML = `${item.quantity}`;
        product.appendChild(product_quantify);
        details.appendChild(product);
    });
    return details;
}
async function renderLeaderboard() {
    const alldata = await fakeDatabase.getAllOrder();
    await fakeDatabase.getAllUserInfo();
    let array = [];
    const data = alldata.filter((e) => e.state == 'giaohangthanhcong');
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
    const showOrder = document.querySelector('.info-order');
    document.querySelectorAll('.leaderboard-body > div').forEach((e, i) => {
        e.addEventListener('click', () => {
            while (showOrder?.firstChild)
                showOrder.removeChild(showOrder.firstChild);
            array[i].order.forEach(async (id) => {
                let orderData = await fakeDatabase.getOrderById(id);
                if (!orderData) return;
                showOrder?.appendChild(creatOrderInfo(orderData));
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
        const cell = document.createElement('div');
        cell.className = `rank-${key}`;
        cell.innerHTML = `${product[key]}`;
        row.appendChild(cell);
    });
    return row;
}
async function productRank() {
    const orders = await fakeDatabase.getAllOrder();
    const books = await fakeDatabase.getAllSach();
    let data = {};

    orders.forEach((order) => {
        order.items.forEach((e) => {
            if (data[e.sach]) data[e.sach] += e.quantity;
            else data[e.sach] = e.quantity;
        });
    });
    let array = [];
    books.forEach((e) => {
        const quantify = data[e.id] ? data[e.id] : 0;
        array.push({
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
    array.forEach((value, index) => {
        chart?.appendChild(createARow(value, index));
    });
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
    chooseDate?.addEventListener('change', () => {});
    productRank();
}
renderProductRank();
export { formatLineChartData, renderLeaderboard };
// String().padStart(2,'0')
