const chartValues = [
    { value: 25 },
    { value: 60 },
    { value: 45 },
    { value: 50 },
    { value: 40 },
];

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
            point.appendChild(getPointData(point));
        });
        point.addEventListener('mouseout', () => {
            if (point.firstChild) point.removeChild(point.firstChild);
        });
    });
}
export { formatLineChartData, hoverPoint };
