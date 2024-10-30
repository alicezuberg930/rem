<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}" />

    <script src="{{ url('./js/excel_export.js') }}"></script>

    <link rel="shortcut icon" type="image/png" href="{{ url('./icon.png') }}">
    <script async src="{{ url('js/jquery.min.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js"
        integrity="sha512-TPh2Oxlg1zp+kz3nFA0C5vVC6leG/6mm1z9+mA81MI5eaUVqasPLO8Cuk4gMF4gUfP5etR73rgU/8PNMsSesoQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    @vite('resources/js/app.js')
    @vite('resources/css/bootstrap.css')
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.0/css/all.css">
    <title>Quản lý {{ explode('_', request()->route()->uri)[1] }}</title>
</head>

<body class="vh-100">
    <div class="container-fluid">
        <div class="row vh-100">
            @include('components.sidebar')
            @yield('body_manager')
        </div>
    </div>
    <x-toast />
</body>

</html>
