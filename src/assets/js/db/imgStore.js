import defaultImgsData from './data/img.json' with { type: "json"};

/**
 * @type {import("./fakeDb").imgStore[]}
 */
// @ts-ignore
const imgs = defaultImgsData.data;

function loadImg() {
    // TODO tải hình ảnh từ localStorage
}

loadImg();

export default imgs;
