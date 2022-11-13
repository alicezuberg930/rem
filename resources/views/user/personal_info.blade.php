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
                        <input type="email" class="form-control" id="fullname" value="{{ $User->username }}">
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
                            <option  value="Nam">Nam</option>
                            <option selected value="Nữ">Nữ</option>
                        </select>
                        <label for="floatingInput">Giới tính</label>
                    </div>
                    <div class="form-floating mb-3">
                        <button type="button" class="btn btn-dark">Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <x-toast />
    <x-footer />
</body>

</html>
