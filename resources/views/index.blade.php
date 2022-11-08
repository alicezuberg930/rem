<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> ZippoStore </title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.2.0/css/all.css">
    <link rel="shortcut icon" type="image/png" href="{{ url('./icon.png') }}">
    <link rel="stylesheet" href="{{ url('./css/style.css') }}">
    <link rel="stylesheet" href="{{ url('./bootstrap/dist/css/bootstrap.min.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
</head>

<body>
    <x-header />
    <div class="container">
        <x-slideshow />
        @include('news')
        @include('onsale')
    </div>
    <x-footer />
    <x-toast />
</body>
@if (session()->has('invalid_token'))
    <script>
        $('.toast').toast('show')
        $('.toast-body').html("Vui lòng xác thực")
    </script>
@endif
<script src="{{ url('./js/api.js') }}"></script>
<script src="{{ url('./jquery/dist/jquery.min.js') }}"></script>
<script src="{{ url('./bootstrap/dist/js/bootstrap.bundle.min.js') }}"></script>
<script type="text/javascript">
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(".card-quick-add").click(function(e) {
        $.ajax({
            url: "/add_cart",
            method: "POST",
            dataType: 'json',
            data: {
                "id": $(this).attr('data-name')
            },
            success: function(result) {
                $('.toast').toast('show')
                $('.toast-body').html(result.message)
            }
        });
    })

</script>

</html>
