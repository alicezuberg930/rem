<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Đăng nhập quản lý</title>
    <script src="{{ url('/js/api.js') }}"></script>
</head>

<style>
    .login-screen {
        width: 100vw;
        height: 100vh;
    }

    .login-box {
        padding: 20px 30px;
        background-color: rgb(29, 27, 27);
        border-radius: 10px;
    }

    .login-header {
        margin-top: 10px;
        margin-bottom: 5px;
        font-weight: 600;
    }

    .login-logo-layout {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .form-control.login {
        width: 100%;
    }

    #login-remember {
        width: 12px;
        height: 12px;
    }

    .is-invalid {
        display: block;
        color: red;
    }

    #login-confirm {
        font-size: 1rem;
        font-weight: 600;
        background-color: rgb(237, 120, 120);
        transition: 0.5s;
        cursor: unset;
    }

    @media (min-width: 576px) {
        .login-screen {
            background-color: var(--main-color);
        }

        .login-box {
            height: unset;
            width: 375px;
        }
    }
</style>

<div class="login-screen position-relative disable-select">
    <div class="login-box center">
        <div class="login-logo-layout">
            <a href="/">
                <img class="ml-auto mr-auto" src="{{ url('/black-fire-logo.png') }}" width="75px" height="75px">
            </a>
        </div>
        <div id="login-warn-box">
        </div>
        <form id="login-form">
            <div class="login-header text-light text-center">
                Đăng nhập nhân viên
            </div>
            <div class="form-group mb-3">
                <input type="text" class="form-control login" id="login-email" placeholder="Email">
            </div>
            <div class="form-group mb-3">
                <input type="password" class="form-control login" id="login-password" placeholder="Mật khẩu">
            </div>
            <div class="form-group mb-3">
                <div id="feedback" class="text-center">a</div>
            </div>
            <div class="form-group">
                <button type="submit" class="form-control login" id="login-confirm">
                    Đăng nhập
                </button>
            </div>
        </form>
    </div>
    <x-toast />
</div>

<script>
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $("#login-confirm").click(function(e) {
        e.preventDefault()
        $.ajax({
            url: "/admin/login",
            method: "post",
            data: {
                email: $("#login-email").val(),
                password: $("#login-password").val()
            },
            success: function(result) {
                if (result.status == -1 || result.status == 0) {
                    $("#feedback").toggleClass("is-invalid", true)
                    $("#feedback").html(result.message)
                } else {
                    window.location.href = "/admin/manage_statistic"
                }
            }
        });
    });
</script>
