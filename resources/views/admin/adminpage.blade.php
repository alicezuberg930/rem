<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <script src="{{ url('./jquery/dist/jquery.min.js') }}"></script>
    <script src="{{ url('./bootstrap/dist/js/bootstrap.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.0/css/all.css">
    <title>Quản lý {{ explode('_', request()->route()->uri)[1] }}</title>
</head>
<body class="vh-100">
    <div class="container-fluid">
        <div class="row vh-100">
            <x-sidebar />
            @yield('body_manager')
        </div>
    </div>
    <x-toast />
</body>

</html>
