<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
</head>

<body>
    <x-header />
    <div class="fluid-container-md">
        <div class="row gy-4">
            <div class="col-md-12 col-12 p-4">
                <form class="col-md-6 col-sm-12 col-lg-4 m-auto">
                    <h3>Thông tin cá nhân</h3>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="username" value="{{ $User->username }}">
                        <label for="floatingInput">Họ và tên</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="phone" class="form-control" id="phone_number" value="{{ $User->phonenumber }}">
                        <label for="floatingInput">Số điện thoại</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="email" value="{{ $User->email }}">
                        <label for="floatingInput">Email</label>
                    </div>
                    <div class="form-floating mb-3">
                        <select class="form-control" id="gender">
                            <option @if ($User->gender == 'Nam') selected @endif value="Nam">Nam</option>
                            <option @if ($User->gender == 'Nữ') selected @endif value="Nữ">Nữ</option>
                        </select>
                        <label for="floatingInput">Giới tính</label>
                    </div>
                    <div class="form-floating mb-3">
                        <button type="button" class="btn btn-dark update" value="{{ $User->id }}">Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <x-toast />
    <x-footer />
</body>
<script>
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(".update").on('click', function() {
        $.ajax({
            url: "/edit_personal_info",
            method: "post",
            data: {
                id: $(this).val(),
                username: $("#username").val(),
                phonenumber: $("#phone_number").val(),
                email: $("#email").val(),
                gender: $("#gender").val()
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
