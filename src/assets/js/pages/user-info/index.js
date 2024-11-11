/**
 * 
 * khởi tạo trang thông tin người dùng
 * @param {Object} params
 * @param {URLSearchParams} query
 * @returns {void}
 */
export function initializeUserInfoPage(params, query) {
    const main = document.querySelector('main');
    if (!main) return;

    main.innerHTML = `
    <div class="main_wapper">
                <aside class="aside">
                    <div class="aside-box box1 card">
                        <div class="user-info__header">
                            <div class="user-info__img">
                                <img src="assets/img/Default_pfp.svg.png" alt="">
                            </div>
                            <div class="user-info__name">Tên tài khoản</div>
                        </div>
                        <div class="user-info__content">
                            <div class="user-info__row">
                                <div class="user-info__row--icon"><i class="fa-solid fa-user"></i></div>
                                <div class="user-info__row--name">Thông tin tài khoản</div>
                            </div>
                            <div class="user-info__row">
                                <div class="user-info__row--icon"><i class="fa-solid fa-box-archive"></i></div>
                                <div class="user-info__row--name">Đơn hàng của tôi</div>
                            </div>
                        </div>
                    </div>
                </aside>
                <article class="user">
                    
                </article>
            </div>
            `

}

function updateUserInfoPage() {

}