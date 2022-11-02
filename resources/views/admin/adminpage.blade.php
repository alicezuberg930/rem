<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <script src="{{ url('./jquery/dist/jquery.min.js') }}"></script>
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <script src="{{ url('./popper/dist/umd/popper.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <title>Document</title>
</head>

<body class="vh-100">
    <div class="container-fluid">
        <div class="row vh-100">
            @include('admin.sidebar')
            @yield('body_manager')
        </div>
    </div>
    <x-toast />
</body>

</html>
