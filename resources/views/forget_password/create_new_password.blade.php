<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Đặt lại mật khẩu</title>
</head>

<body>
    <x-header />
    <div class="container-sm mt-5 mb-5" style="height: 43.5vh">
        <div class="row justify-content-md-center">
            <div class="col-md-4">
                <h3>Nhập mật khẩu mới</h3>
                <form action="/reset_password_handler" method="post">
                    @csrf
                    <input hidden id="selector" name="selector" type="text" value="{{ $selector }}">
                    <input hidden id="token" name="token" type="text" value="{{ $token }}">
                    <div class="form-floating mb-3">
                        <input type="password" name="password" class="form-control" id="password">
                        <label for="floatingInput">Mật khẩu mới</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" name="retype_password" class="form-control" id="retype_password">
                        <label for="floatingInput">Xác nhận mật khẩu mới</label>
                    </div>
                    <button class="btn btn-primary btn-lg" id="reset-password-submit" name="reset-password-submit">Đổi
                        mật khẩu</button>
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
    $("#reset-password-submit").on('click', (e) => {
        e.preventDefault();
        $.ajax({
            url: "/reset_password_handler",
            method: "POST",
            dataType: "json",
            data: {
                token: $("#token").val(),
                selector: $("#selector").val(),
                password: $("#password").val(),
                retype_password: $("#retype_password").val()
            },
            success: function(result) {
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
