<!DOCTYPE html>
<html lang="en">

<head>
    <x-head_tag />
    <title>Đăng nhập quản lý</title>
    <script src="{{ url('/xregexp/xregexp-all.js') }}"></script>
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
            <div class="login-header text-light">
                Đăng nhập chức năng quản lý
            </div>
            <div class="form-group mb-3">
                <input type="text" class="form-control login" id="login-username" placeholder="Email">
                <div id="login-username-feedback" class="invalid-feedback"></div>
            </div>
            <div class="form-group mb-3">
                <input type="password" class="form-control login" id="login-password" placeholder="Mật khẩu">
                <div id="login-password-feedback" class="invalid-feedback"></div>
            </div>
            <div class="form-group mb-3">
                <div class="float-left text-light">
                    <input type="checkbox" id="login-remember">
                    <span for="login-remember color-light"> Nhớ tôi </span>
                </div>
            </div>
            <div class="form-group">
                <button type="submit" class="form-control login" id="login-confirm">
                    Đăng nhập
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    $("#login-confirm").click(function(e) {
        e.preventDefault()
        if (updateLoginUsername() && updateLoginPassword()) {
            let username = $("#login-username")[0].value;
            let password = $("#login-password")[0].value;
            $.ajax({
                url: "check_login.php",
                method: "POST",
                data: {
                    "username": username,
                    "password": password
                },
                success: function(response) {
                    console.log(response);
                    if (response == 0) {
                        window.location.href = "/admin/manage_statistic";
                    } else {
                        let $loginUsername = $("#login-username");
                        let $feedback = $("#login-username-feedback");

                        $feedback.html(
                            "Your account does not have permission to access this site!");
                        $loginUsername.toggleClass("is-invalid", true);
                    }
                }
            });
        }
    });

    function checkLoginPasswordRegex(password) {
        return /^[\S]{5,24}$/g.test(password);
    }

    function checkLoginUsernameRegex(username) {
        return /^[\w\d_]{5,16}$/g.test(username);
    }

    $("#login-password").on('keyup', function(e) {
        updateLoginPassword();
    });

    $("#login-username").on('keyup', function(e) {
        updateLoginUsername();
    });

    function updateLoginUsername() {
        let $loginUsername = $("#login-username");
        let $feedback = $("#login-username-feedback");
        let username = $loginUsername[0].value;
        let check = checkLoginUsernameRegex(username);
        if (username.length == 0) {
            $feedback.html("Please fill out username field.");
        } else if (username.length < 5) {
            $feedback.html("Username has 5-16 characters.");
        } else if (check) {
            $feedback.html("");
        } else {
            $feedback.html("Accept only characters (a-z A-Z 0-9 _).");
        }
        $loginUsername.toggleClass("is-invalid", !check);
        return check;
    }

    function updateLoginPassword() {
        let $loginPassword = $("#login-password");
        let $feedback = $("#login-password-feedback");
        let password = $loginPassword[0].value;
        let check = checkLoginPasswordRegex(password);
        if (password.length == 0) {
            $feedback.html("Please fill out password field.");
        } else if (password.length < 5) {
            $feedback.html("Password has 5-24 characters.");
        } else if (check) {
            $feedback.html("");
        } else {
            $feedback.html("Password has no space character.");
        }
        $loginPassword.toggleClass("is-invalid", !check);
        return check;
    }
</script>
