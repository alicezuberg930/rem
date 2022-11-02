<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.0/css/all.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <script src="{{ url('./jquery/dist/jquery.min.js') }}"></script>
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./css/style.css') }}">
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
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
