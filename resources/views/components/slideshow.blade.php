<div class="CarouselFade mt-5">
    <div class="carousel slide carousel-fade carousel-dark">
        <div class="carousel-indicators">
            <button type="button" data-bs-target="" aria-label="Slide 1" aria-current="true" class="active"></button>
            <button type="button" data-bs-target="" aria-label="Slide 2" aria-current="false"></button>
        </div>
        <div class="carousel-inner">
            <div class="h-90 active carousel-item"><img class="d-block w-100" src="{{ url('/zippo_banner_2.jpg') }}"
                    alt="Second slide"></div>
            <div class="carousel-item"><img class="d-block w-100" src="{{ url('/zippo_banner_2.jpg') }}"
                    alt="Third slide">
            </div>
        </div>
        <a class="carousel-control-prev" role="button" tabindex="0" href="#">
            <span aria-hidden="true" class="carousel-control-prev-icon"></span>
            <span class="visually-hidden">Previous</span>
        </a>
        <a class="carousel-control-next" role="button" tabindex="0" href="#">
            <span aria-hidden="true" class="carousel-control-next-icon"></span>
            <span class="visually-hidden">Next</span>
        </a>
    </div>
</div>
<div class="container-lg mb-5">
    <div class="suggetsforu border-top">
        <div class="align-items-center justify-content-evenly row row-cols-md-1 row-cols-1 pt-3">
            <div class="d-flex align-items-center justify-content-center text-center mt-3 mb-3">
                <hr class="col-md-5" />
                <span class="border p-1 col-md-2 fs-3 fw-semibold">Thể loại zippo</span>
                <hr class="col-md-5" />
            </div>
            <div class="row row-cols-1 row-cols-lg-3 gy-2 align-items-stretch">
                <div class="col">
                    <div class="card card-cover h-100  text-bg-dark rounded-4 shadow-lg"
                        style="background-image: url('https://www.foodandwine.com/thmb/08KJJcjBuKyllCFFY7hDwvq9Z6w=/2000x1125/filters:fill(auto,1)/red-wine-blends-FT-MAG1116-2000-4f3c3e91bcd646ea8a21f2152746ef53.jpg');background-size: cover; background-position: center; min-height: 234px;">
                        <div class="d-flex h-100 p-5  text-white text-shadow-1 align-items-center align-self-center">
                            <h3 class="display-6 lh-1 fw-bold">Cao cấp</h3>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-cover h-100  text-bg-dark rounded-4 shadow-lg"
                        style="background-image: url('https://i.pinimg.com/736x/99/78/6f/99786f008c01c25bda4b744873fdb456.jpg'); background-size: cover;min-height: 234px;">
                        <div class="d-flex h-100 p-5  text-white text-shadow-1 align-items-center align-self-center">
                            <h3 class="display-6 lh-1 fw-bold">Phổ thông</h3>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-cover h-100  text-bg-dark rounded-4 shadow-lg"
                        style="background-image: url('https://us.123rf.com/450wm/alfastudio/alfastudio1708/alfastudio170800724/83369587-a-glass-of-red-wine-and-cut-ham-with-basil-and-pepper-on-a-black-background-tasty-healthy-delicious-.jpg?ver=6');background-size: cover;min-height: 234px;">
                        <div class="d-flex h-100 p-5  text-white text-shadow-1 align-items-center align-self-center">
                            <h3 class="display-6 lh-1 fw-bold">Armor</h3>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="mt-4 mb-4">
            <div class="d-flex align-items-center justify-content-center text-center p-0">
                <hr class="col-5" />
                <span class="border p-1 col-md-2 fs-3 fw-semibold">Tìm hiểu</span>
                <hr class="col-5" />
            </div>
        </div>
        <div class="g-0 row row-cols-md-2 row-cols-sm-1 row-cols-1 gy-2">
            {{-- @php
            for ($i = 0; $i < 8; $i++) {
                echo '<div class="col">
                <div class="p-2 card m-3 border-0 h-90">
                    <img class="card-img mx-auto d-block"
                        src="https://tmwine.vn/wp-content/uploads/2020/10/TMWine-San-pham-34-300x300.jpg"
                        style="object-fit: cover; width: 12rem; height: 13rem;">
                    <div class="card-body">
                        <div class="card-title h6">Wine Quinta das Arcas, Conde Villar Rose, 2019</div>
                        <small class="mb-2 card-text text-muted">Ý, Vang đỏ, Papale Primitivo di Manduria</small>
                        <p class="card-text fw-bold">12, 000, 000 đ</p>
                        <span class="btn btn-outline-primary btn-sm rounded-0 m-0">Thêm vào giỏ</span>                
                    </div>
                </div>
            </div>';
            }
        @endphp --}}
            <div class="col col-md-6 bg-dark pt-3 pt-md-5 px-md-5 text-center text-white"
                style="background-image: url('https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/red-wine-on-a-dark-background-maryana-kankulova.jpg');">
                <div class="my-3 py-3">
                    <h2 class="display-5">Screaming Eagle Cabernet 1992</h2>
                    <p class="lead">Đây là một trong những loại rượu đắt nhất thế giới nhưng được làm từ giống nho
                        phổ biến Cabernet Sauvignon năm 1992. Người thưởng thức sẽ bị ấn tượng ngay bởi mùi hương
                        phong phú và nồng nàn từ vị của quả mọng, vani và quả lý chua đen. Chua chát cân bằng đến
                        tuyệt hảo trong một trong những chai rượu vang đắt nhất thế giới. </p>
                </div>
                <div class="shadow-sm mx-auto" style="width: 80%; height: 180px; border-radius: 21px 21px 0 0;">
                    <button class="btn btn-outline-light">Tìm hiểu thêm</button>
                </div>
            </div>
            <div class="col col-md-6 bg-dark pt-3 pt-md-5 px-md-5 text-center text-white"
                style="background-image: url('https://images.unsplash.com/photo-1606767208159-1a5fb0a87841?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8d2hpdGUlMjB3aW5lfGVufDB8fDB8fA%3D%3D&w=1000&q=80');">
                <div class="my-3 py-3">
                    <h2 class="display-5">1811 Chateau d’Yquem</h2>
                    <p class="lead">Với Chateau d’Yguem năm 1811 lại là một trường hợp khác. Loại rượu này chứa
                        lượng đường dư thừa cao, làm cho nó tồn tại trong nhiều thế kỷ. Nó chứa Semillon (80%) và
                        Sauvignon Blanc (20%), giúp rượu vang tốt và giữ cho nó không bị hư hỏng qua nhiều năm.</p>
                </div>
                <div class="shadow-sm mx-auto" style="width: 80%; height: 180px; border-radius: 21px 21px 0 0;">
                    <button class="btn btn-outline-light">Tìm hiểu thêm</button>
                </div>
            </div>
            <div class="col col-md-12 bg-dark pt-3 pt-md-5 px-md-5 text-center text-white"
                style="background-size: cover; background-image: url('https://cdn.shopify.com/s/files/1/1503/3114/articles/fixed_1_of_1_-3_960x.jpg?v=1600956950');">
                <div class="my-3 py-3">
                    <h2 class="display-5">1811 Chateau d’Yquem</h2>
                    <p class="lead">Với Chateau d’Yguem năm 1811 lại là một trường hợp khác. Loại rượu này chứa
                        lượng đường dư thừa cao, làm cho nó tồn tại trong nhiều thế kỷ. Nó chứa Semillon (80%) và
                        Sauvignon Blanc (20%), giúp rượu vang tốt và giữ cho nó không bị hư hỏng qua nhiều năm.</p>
                </div>
                <div class="shadow-sm mx-auto" style="width: 80%; height: 180px; border-radius: 21px 21px 0 0;">
                    <button class="btn btn-outline-light">Tìm hiểu thêm</button>
                </div>
            </div>
        </div>
        <div class="introduces row row-cols-md-1 row-cols-1 justify-content-between p-3 mt-3">
            <div class=" mb-3 bg-white">
                <div class="d-flex align-items-center justify-content-center text-center p-0">
                    <hr class="col-md-4" />
                    <span class="border p-1 col-md-4 fs-3 fw-semibold">Về LuxuryWine Flix</span>
                    <hr class="col-md-4" />
                </div>
            </div>
            <div class="introducesText col-md-7 mb-2">
                <span class="lh-lg lead">Thương hiệu Winemart được thành lập vào năm
                    2015 với mục tiêu đem lại cho người tiêu dùng những dịch vụ và sản phẩm tốt nhất. Winemart
                    chuyên cung cấp các loại rượu vang, rượu mạnh, bia nhập khẩu cùng với các loại thực phẩm cao
                    cấp khác như Chocolate, trà, cà phê, mứt, trái cây sấy khô,… từ các nhãn hiệu cao cấp, thiết
                    kế riêng phục vụ từng đối tượng khách hàng.
                </span>
            </div>
            <div class="introducesImg col-md-5"><img class="card-img-top"
                    src="https://www.itourvn.com/images/easyblog_articles/644/b2ap3_large_buy-wine-hcm-cover.jpg">
            </div>
        </div>
        <div class="row row-cols-2 row-cols-md-4 mb-3 justify-content-between text-center m-3 shadow-lg">
            <div class="col-md-3">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <h1 class="card-title">
                            <i class="bi bi-emoji-laughing" style="font-size: 80px"></i>
                        </h1>
                        <p class="card-text text-dark">Nhiều năm kinh nghiệm trong lĩnh vực nhập khẩu, phân phối rượu
                            vang cùng kiến thức sản phẩm chuyên sâu, cam kết mang đến Quý Khách hàng sự hài lòng.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <h1 class="card-title">
                            <i class="bi bi-coin" style="font-size: 80px"></i>
                        </h1>
                        <p class="card-text text-dark">Giá thành sản phẩm được tính toán, so sánh với thị trường để đảm
                            bảo lợi ích của Quý Khách hàng và giá trị thật của từng sản phẩm rượu vang tuyệt hảo.</p>
                    </div>

                </div>
            </div>
            <div class="col-md-3">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <h1 class="card-title">
                            <i class="bi bi-patch-check" style="font-size: 80px"></i>
                        </h1>
                        <p class="card-text text-dark">Cam kết ượu vang chất lượng quý khách được trả hoặc đổi
                            nếu không hài lòng về chất lượng sản phẩm, dịch vụ của chúng tôi.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card h-100 border-0">
                    <div class="card-body">
                        <h1 class="card-title">
                            <i class="bi bi-telephone-outbound" style="font-size: 80px"></i>
                        </h1>
                        <p class="card-text text-dark">Quý Khách hàng có thể liên hệ qua tất cả các kênh: Website,
                            Facebook, Zalo, Hotline,… TM Wine sẵn sàng phục vụ bạn bất kể khi nào bạn có nhu cầu.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
