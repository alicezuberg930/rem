<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <title>Document</title>
</head>

<body>
    <div class="container">
        <h3>Xin chào {{ $username }} bạn đã đăng ký thành công vui lòng nhấn vào linh này để xác nhận danh tính của
            bạn</h3>
        <a href="{{ URL::to("/verification/$token") }}">Link xác nhận</a>
    </div>
</body>

</html>
