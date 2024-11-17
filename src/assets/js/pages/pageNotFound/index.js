/**
 * @param {{[key: string]: string}} params
 * @param {URLSearchParams} query
 */
export async function initializationPageNotFound(params, query) {
    const main = document.querySelector('main');
    if (!main) return;

    main.innerHTML = `
            <div class="main_wapper">
                <article class="article page-not-found">
                    <img src="/assets/img/error-illustration-1.svg" alt="404" />
                    <h1>404</h1>
                    <strong>Page not found</strong>
                    <span
                        >Chúng tôi không tìm thấy trang bạn đang cố truy cập,
                        vui lòng về lại trang chính hoặc liên hệ với admin để
                        được giúp đỡ.</span
                    >
                </article>
            </div>`;
}
