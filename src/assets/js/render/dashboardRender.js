import fakeDatabase from '../db/fakeDBv1.js';
import { dateToString, formatNumber } from '../until/format.js';
import { showOrderIdList } from './popupRender.js';

/**@typedef {import('../until/type.js').Order} Order*/
/**@typedef {import('../until/type.js').Sach} Sach*/


let orders = /**@type {Order[]} */([]);
let books = /**@type {Sach[]} */([]);

function formatLineChartData() {
    // tạo đường biểu đồ
    function createListItem(item, begin) {
        return `
      <div class="data-point" data-value="${item.value}" data-date="${dateToString(new Date(begin.getTime()
            + item.date * 24 * 60 * 60 * 1000))}"></div>
      <div class="line-segment" style="--hypotenuse: ${item.hypotenuse}; --angle:${item.angle};"></div>
      `;
    }
    // tạo popup cho từng điểm
    function getPointData(point) {
        const popup = document.createElement('div');
        popup.innerHTML = `Ngày: ${(point.getAttribute('data-date')).slice(-5)}
            <br>Thu: ${formatNumber(Number(point.getAttribute('data-value')))}`;
        popup.style.cssText = 'text-wrap: nowrap;';
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
    for (let i = 0; i < 30; i++) {
        values.push({ date: i, value: 0 });
    }
    orders.forEach((e) => {
        if (
            e.state != 'huy' &&
            from <= new Date(e.date) &&
            new Date(e.date) <= to
        ) {
            const date = Math.floor(
                (new Date(e.date).getTime() - from.getTime()) /
                (24 * 60 * 60 * 1000),
            );
            let index = values.findIndex((element) => element.date == date);
            if (index != -1) values[index].value += e.total;
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
    const topMostPoint = Math.max(50000, Math.ceil((Math.max(...values.map((e) => e.value))) / 100000) * 100000);
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
            date: values[i].date,
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
        let markup = createListItem(item, from);
        let listItem = document.createElement('div');
        listItem.style.cssText = `--x: ${item.left}px; --y: ${item.bottom}px`;
        listItem.innerHTML = markup;
        container.appendChild(listItem);
    });
    hoverPoint();
}

async function renderLeaderboard(from, to) {
    let array = [];
    const data = orders.filter((order) => {
        const date = new Date(order.date);
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
    console.log(array);
    array.forEach(async (e, i) => {
        console.log('leader');
        const user = await fakeDatabase.getUserInfoByUserId(e.id);
        const id = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(2)`,
        );
        const name = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(3)`,
        );
        const total = document.querySelector(
            `.leaderboard-body > div:nth-child(${i + 1}) > div:nth-child(4)`,
        );
        console.log(id, name, total);
        if (!id || !name || !total) return;
        if (user) {
            e['name'] = user.name;
            id.textContent = user.id;
            name.textContent = user.name;
            total.textContent = formatNumber(e.total);
        }
    });
    document.querySelectorAll('.leaderboard-body > div').forEach((e, i) => {
        if (!array[i]) return;
        e.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            showOrderIdList(array[i].order, array[i].name, true);
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
            cell.innerHTML = `${key == 'total' ? formatNumber(product[key]) : product[key]}`;
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
        const date = new Date(order.date);
        if (
            from.getTime() <= date.getTime() &&
            date.getTime() <= to.getTime() &&
            order.state != 'huy'
        ) {
            order.items.forEach((e) => {
                if (data[e.sach]) {
                    data[e.sach].orderId.push(order.id);
                    data[e.sach].quantity += e.quantity;
                    data[e.sach].total += e.total;
                }
                else
                    data[e.sach] =
                    {
                        orderId: [order.id],
                        quantity: e.quantity,
                        total: e.total,
                    }
            });
        }
    });
    books.forEach((e) => {
        if (data[e.id]) {
            array.push({
                id: e.id,
                name: e.title,
                quantity: data[e.id].quantity,
                total: data[e.id].total,
            });
        }

    });
    array.sort((a, b) => {
        if (a.quantity != b.quantity) return b.quantity - a.quantity;
        return b.total - a.total;
    });
    const topSell = /**@type {NodeListOf<HTMLElement>} */(document.querySelectorAll('.top-seller'));
    topSell.forEach(async (e, i) => {
        // get data
        e.style.background = `${i == 0 ? '#53b3f9' : '#ff6666'}`;
        const index = (i == 0 ? 0 : array.length - 1);
        const book = books.find((book) => book.id == array[index].id);
        if (!book) return;
        // render
        const content = (e.querySelector('.top-seller__content'));
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'top-seller__img';
        content?.appendChild(imgWrapper);

        const info = document.createElement('div');
        info.className = 'top-seller__info';
        info.innerHTML = `
            <div class="top-seller__name">${book.title}</div>
            <div class="top-seller__quantity">Đã bán: ${array[index].quantity}</div>
            <div class="top-seller__total">Tổng thu: ${formatNumber(array[index].total)} VNĐ</div>`;

        content?.appendChild(info);
        const img = document.createElement('img');
        img.src = (await fakeDatabase.getImgById(book.thumbnail)).data;
        imgWrapper.appendChild(img);
    })
    const chart = document.querySelector('.product-rank__body');
    if (!chart) return;
    chart.innerHTML = '';
    let sum = 0;
    array.forEach((value, index) => {
        sum += value.total;
        chart?.appendChild(createARow(value, index));
    });
    const title = document.querySelector('.product-rank__title span');
    if (title) title.innerHTML = formatNumber(sum) + ' VNĐ';
    document.querySelectorAll('.rank-body-row').forEach((row, i) => {
        row.addEventListener('click', () => {
            showOrderIdList(data[array[i].id].orderId, array[i].name, false);
        });
    });
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
    countProduct.innerHTML = books.length.toString();
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
