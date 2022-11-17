<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Mật khẩu</title>
</head>

<body>
    <x-header />
    <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-center text-center mt-3 mb-3">
            <hr class="col-md-2" />
            <span class="border p-1 col-md-6 fs-4 fw-semibold">Đổi mật khẩu</span>
            <hr class="col-md-2" />
        </div>
        <div class="row gy-4">
            <div class="col-md-12 col-12 p-4">
                <form class="col-md-6 col-sm-12 col-lg-4 m-auto">
                    @csrf
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="current_password">
                        <label for="floatingInput">Mật khẩu hiện tại</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="retype_password">
                        <label for="floatingInput">Xác nhận lại mật khẩu</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="new_password">
                        <label for="floatingInput">Mật khẩu mới</label>
                    </div>
                    <div class="form-floating mb-3">
                        <button type="button" class="btn btn-dark update" value="{{ session('UserID') }}">Cập
                            nhật</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <x-footer />
    <x-toast />
</body>
<script type="module">
      $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    import {isPasswordValid} from "{{url('/js/regex.js')}}"
    $(".update").on('click', function() {
        let checkNewPassword = isPasswordValid($("#new_password").val());
        $.ajax({
            url: "/change_password",
            method: 'post',
            data: {
                current_password: $("#current_password").val(),
                retype_password: $("#retype_password").val(),
                new_password: $("#new_password").val(),
                id: $(this).val(),
                checkNewPassword: checkNewPassword
            },
            success: function(result){  
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
