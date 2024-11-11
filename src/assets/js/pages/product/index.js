
/**
 *
 * @param {object} params
 * @param {URLSearchParams} query
 */
export function initializationProductPage(params, query) {
    const main = document.querySelector('main');
    if (!main) return;

    const style = document.createElement('style');
    style.id = 'product-page-style';
    style.innerHTML = `
    .container {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        max-width: 800px;
        border: 0px;
        padding: 20px;
        gap: 10px;
    }
    .left-section,
    .center-section,
    .right-section {
        padding: 10px;
    }
    .left-section,
    .right-section {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
    .center-section img {
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        width: 100px;
        height: auto;
    }
    .center-section .description {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
        margin-top: 10px;
        font-size: 14px;
    }
    .product-title {
        font-size: 18px;
        font-weight: bold;
    }
    .price {
        color: red;
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
    }
    .shipping-info {
        font-size: 12px;
        color: gray;
        margin-top: 10px;
    }
    .quantity-section {
        margin-top: 10px;
    }
    .quantity-section input {
        width: 50px;
        text-align: center;
    }
    .total-price {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
    }
    .buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    .buttons button {
        width: max-content;
        border-radius: 5px;
        padding: 10px;
        border: none;
        color: #fff;
        cursor: pointer;
    }
    .buy-now {
        background-color: red;
    }
    .add-to-cart {
        background-color: gray;
    }
    `

    document.head.appendChild(style);

    main.innerHTML = `
    <div class="main_wapper">
        <div class="left-section">
                <img
                    src="https://nhasachphuongnam.com/images/detailed/267/ly-thuyet-tro-choi.jpg"
                    alt="Lý thuyết trò chơi"
                    height="250px"
                />
                <p>Đặc điểm nổi bật:</p>
                <ul>
                    <li>Có ghi chép đầu đủ</li>
                    <li>Kèm chú thích</li>
                    <li>Sách đẹp còn nguyên 90%</li>
                </ul>
            </div>

            <div class="center-section">
                <p class="product-title">
                    Pháp luật đại cương (Dùng trong các trường đại học, cao đẳng
                    và trung cấp)
                </p>
                <p class="price">10.000đ</p>
                <div class="description">
                    <h4>Mô tả sản phẩm</h4>
                    <p>
                        Ở bất cứ quốc gia, xã hội nào, pháp luật có vai trò rất
                        quan trọng trong đời sống xã hội.Đối với Nhà nước,pháp
                        luật được coi là công cụ hữu hiệu nhất để quản lý tất cả
                        các vấn đề trong xã hội bởi pháp luật là một khuôn mẫu
                        và có tính bắt buộc chung nên mọi người trong xã hội đều
                        cần phải tuân thủ theo các quy định của pháp luật. Nếu
                        như không chấp hành hoặc chấp hành không đúng các quy
                        định của pháp luật thì sẽ bị áp dụng các chế tài tương
                        ứng tùy thuộc vào hành vi vi phạm.Đối với công dân,
                        pháp luật là phương tiện quan trọng để mọi người dân bảo
                        vệ được các quyền và lợi ích hợp pháp của mình. Thông
                        qua pháp luật đảm bảo cho người dân được thực hiện các
                        quyền cũng như nghĩa vụ của mình theo quy định và quyền
                        lợi này sẽ được quy định và bảo vệ một cách tốt
                        nhất.Đối với toàn xã hộinói chung thì pháp luật đã thể
                        hiện được vai trò của mình trong việc đảm bảo sự vận
                        hành của toàn xã hội, tạo lập và duy trì sự bình đẳng
                        trong cộng đồng để đảm bảo cho xã hội phát triển một
                        cách ổn định và bền vững nhất thì pháp luật có vai trò
                        rất quan trọng để mọi người trong xã hội thực hiện. Ở
                        Việt Nam, trong những năm qua, Đảng và Nhà nước ta đã
                        chủ trương tăng cường giáo dục pháp luật trong các nhà
                        trường thông qua các chương trình môn học, giáo trình,
                        tài liệu giảng dạy pháp luật bảo đảm đúng tinh thần và
                        nội dung của Hiến pháp và pháp luật hiện hành.
                    </p>
                </div>
                <div class="reviews">
                    <h4>Khách hàng đánh giá</h4>
                </div>
            </div>

            <div class="right-section">
                <h4>Thông tin vận chuyển:</h4>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLsxwaJCU8a7ksWpC4YY29UKpcSJvyEcj8-g&s"
                    alt="Ship ngay"
                    height="30px"
                />
                <p class="shipping-info">
                    Giao hàng siêu nhanh sau giờ hành chính
                </p>
                <p class="shipping-info">Giao hàng siêu nhanh</p>
                <p class="shipping-info">Miễn phí</p>
                <div class="quantity-section">
                    <label for="quantity">Số lượng:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value="2"
                        min="1"
                    />
                </div>
                <p class="total-price">Tạm tính: 20.000đ</p>
                <div class="buttons">
                    <button class="buy-now">Mua ngay</button>
                    <button class="add-to-cart">Thêm giỏ hàng</button>
                </div>
            </div>
    </div>
    `
}

/**
 *
 * @param {object} params
 * @param {URLSearchParams} query
 */
export async function updateProductPage(params, query) {

}

export function removeProductPage() {
    document.getElementById('product-page-style')?.remove();
}