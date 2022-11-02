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
    <table style="margin-bottom: 1rem;">
        <thead>
            <tr>
                <th><img style="width: 3.5rem; margin-right: 1rem;"
                        src="https://cdn.vectorstock.com/i/1000x1000/30/91/icon-of-zippo-lighter-flat-style-vector-4763091.webp">
                </th>
                <th>
                    <span
                        style="font-weight: bold; font-style: italic; color: blueviolet; font-size: 1.5rem;">ZippoHub</span>
                </th>
            </tr>
        </thead>
    </table>
    <div class="text-info">
        <p>Chúng tôi đã nhận được 1 yêu cầu đổi mật khẩu từ email của bạn. Hãy nhấn vào link bên dưới để xác nhận.</p>
        <a href="{{ URL::to("/create_new_password/$selector/$token") }}">Link xác nhận</a>
    </div>
</body>

</html>
