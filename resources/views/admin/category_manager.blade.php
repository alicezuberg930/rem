@extends('admin.adminpage')
@section('body_manager')
    <div class="col-md-9 col-lg-10">
        <div class="container-md p-0">
            <div class="p-3 row row-cols-1 row-cols-md-3 sticky-top bg-light justify-content-between">
                <div class="col-md-auto d-flex">
                    <div class="col-md-auto">
                        <input type="radio" class="btn-check" autocomplete="off" value="Tổng đơn">
                        <label class="btn btn-outline-primary btn-sm" for="btnradio1">
                            Tổng thể loại
                            <span class="badge bg-danger" id="badge_tongdon"> <?php echo $pagin = 8; ?></span>
                        </label>
                    </div>
                    <div class="col-md-auto">
                        <button type="submit" href="/admin/manage_category/add" class="btn btn-primary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#themtheloai">Thêm thể loại</button>
                    </div>
                </div>
                <div class="col-md-auto">
                    <div class="input-group">
                        <input type="text" class="form-control form-control-sm" value="" placeholder="Tên..."
                            id="search_id">
                        <button class="btn btn-sm btn-primary" onclick="searched(this.parentElement)"
                            type="button">Search</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive" id="quanlytheloai">
                @include('dynamic_layout.category_reload')
            </div>
        </div>
    </div>
    </body>
    <script>
        function deleted(ele, page) {
            console.log(ele);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById('quanlytheloai').innerHTML = this.responseText;
                    const toastLiveExample = document.getElementById('liveToast')
                    toastLiveExample.innerHTML =
                        '<div class="d-flex">' +
                        '<div class="toast-body">Xóa thành công</div>' +
                        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
                        '</div>'
                    const toast = new bootstrap.Toast(toastLiveExample)
                    toast.show()
                }
            };
            xhttp.open("DELETE", '/admin/categories/' + ele + '?page=' + page, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
            xhttp.send();
        }

        function edit(ele) {
            var name = document.getElementById('name-category-modal-' + ele).value;
            var desc = document.getElementById('desc-category-modal-' + ele).value;
            var ss1 = document.getElementById(ele).parentElement.parentElement;
            console.log(ele, name, desc, ss1);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    ss1.children[1].innerHTML = name;
                    ss1.children[2].innerHTML = desc;
                    const toastLiveExample = document.getElementById('liveToast')
                    toastLiveExample.innerHTML =
                        '<div class="d-flex">' +
                        '<div class="toast-body">Sửa thành công</div>' +
                        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
                        '</div>'
                    const toast = new bootstrap.Toast(toastLiveExample)
                    toast.show()
                }
            };
            xhttp.open("PUT", '/admin/categories/' + ele + '?name=' + name + '&description=' + desc, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
            xhttp.send();
        }

        function add(page) {
            var name = document.getElementById('name-category-add').value;
            var desc = document.getElementById('desc-category-add').value;
            console.log(name, desc);

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    document.getElementById('quanlytheloai').innerHTML = this.responseText;

                    const toastLiveExample = document.getElementById('liveToast')
                    toastLiveExample.innerHTML =
                        '<div class="d-flex">' +
                        '<div class="toast-body">Thêm thành công</div>' +
                        '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
                        '</div>'
                    const toast = new bootstrap.Toast(toastLiveExample)
                    toast.show()
                }
            };
            xhttp.open("POST", '/admin/add-category', true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
            xhttp.send(
                'name=' + name +
                '&description=' + desc +
                '&page=' + page
            );
        }

        function phantrang(page) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    document.getElementById('quanlytheloai').innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", '/admin/categories/' + page, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
            xhttp.send();
        }

        function searched(ele) {
            var search = document.getElementById('search_id').value;
            console.log(search);
            // var ss1 = document.getElementById(ele).parentElement.parentElement;
            // console.log(ss1);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    document.getElementById('quanlytheloai').innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", '/admin/search-category?name=' + search, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
            xhttp.send();
        }
    </script>
@endsection
