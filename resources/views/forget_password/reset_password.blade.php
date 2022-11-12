<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Gửi email xác nhận</title>
</head>

<body>
    <x-header />
    <div class="container-sm mt-5 mb-5" style="height: 43.5vh">
        <div class="row justify-content-md-center">
            <div class="col-md-6" id="contentmail">
                <h2>Nhập địa chỉ email</h2>
                <p>Một đường dẫn sẽ gửi tới email của bạn, nhấp vào đó để tạo mật khẩu mới</p>
                <form action="/reset_password_request" action="post">
                    @csrf
                    <div class="row align-items-center">
                        <div class="col-md-10">
                            <div class="form-floating">
                                <input type="email" class="form-control" placeholder="Nhập email" name="email"
                                    id="email">
                                <label for="floatingInput">Địa chỉ email</label>
                            </div>
                        </div>
                        <div class="col-md-auto">
                            <button type="button" id="reset-request-submit" name="reset-request-submit"
                                class="btn btn-primary btn-lg">Gửi</button>
                        </div>
                    </div>
                    <div class="text-center text-lg-start mt-3">
                        <p class="small fw-bold mt-2 pt-1 mb-0">Quay lại đăng nhập? <a href="/loginregister"
                                class="link-danger">Đăng nhập</a></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />
</body>
<script>
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $("#reset-request-submit").on('click', (e) => {
        e.preventDefault()
        $.ajax({
            url: "/reset_password_request",
            method: "POST",
            dataType: 'json',
            data: {
                email: $("#email").val(),
            },
            success: function(result) {
                console.log(result);
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
                if (result.status == 1)
                    $('.toast').css('background-color', 'rgb(71, 201, 71)')
                else
                    $('.toast').css('background-color', 'rgb(239, 73, 73)')

            }
        })
    })
</script>

</html>
