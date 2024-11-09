<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <link rel="shortcut icon" type="image/png" href="{{ url('/assets/black-fire-logo.png') }}">
    <script async src="{{ asset('js/jquery.min.js') }}"></script>
    <link rel="stylesheet" href="{{ url('css/style.css') }}">
    @vite('resources/css/bootstrap.css')
    @vite('resources/css/app.css')
    @vite('resources/js/app.js')
    @yield('head')
</head>

<body>
    @include('components.header')

    <div class="bg-[#f6f5fa] py-5">
        @yield('body')
    </div>

    @include('components.footer')

    @yield('scripts')
</body>

</html>
