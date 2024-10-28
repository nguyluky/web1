import fakeDatabase from '../db/fakeDBv1.js';

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

    const base = (widgetWidth - pointSize / 2) / values.length;

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
    renderLeaderboard();
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
    document.querySelectorAll('.data-point').forEach((point) => {
        point.addEventListener('mouseover', () => {
            while (point.firstChild) point.removeChild(point.firstChild);
            point.appendChild(getPointData(point));
        });
        point.addEventListener('mouseout', () =>
            setTimeout(() => {
                if (point.firstChild) point.removeChild(point.firstChild);
            }, 3000),
        );
    });
}

async function renderLeaderboard() {
    const alldata = await fakeDatabase.getAllOrder();
    let array = [];
    const data = alldata.filter((e) => e.state == 'thanhcong');
    data.forEach((e) => {
        const index = array.findIndex((element) => element.id == e.user_id);
        if (index != -1) array[index].total += e.total;
        else array.push({ id: e.user_id, total: e.total });
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
            name.textContent = user.name;
            total.textContent = e.total;
        }
    });
}
export { formatLineChartData, renderLeaderboard };
