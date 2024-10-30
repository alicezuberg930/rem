<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="csrf-token" content="{{ csrf_token() }}" />
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
<link rel="shortcut icon" type="image/png" href="{{ url('./icon.png') }}">
<script async src="{{ asset('js/jquery.min.js') }}"></script>
<link rel="stylesheet" href="{{ url('css/style.css') }}">
@vite('resources/css/bootstrap.css')
@vite('resources/css/app.css')
@vite('resources/js/app.js')
