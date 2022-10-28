import { isEmailValid, isPasswordValid, isPhonenumberValid } from "./Regex.js"
const verify = document.querySelector(".verify");
const login_side = document.getElementById("login-slider");
const register_side = document.getElementById("register-slider");
register_side.addEventListener("click", function () {
    document.getElementById("login_form").style.left = "-80%";
    document.getElementById("register_form").style.left = "50%";
    document.getElementById("slider").style.left = "50%";
});
login_side.addEventListener("click", function () {
    document.getElementById("login_form").style.left = "50%";
    document.getElementById("register_form").style.left = "140%";
    document.getElementById("slider").style.left = "0";
});
document.querySelectorAll('form').forEach(data => {
    data.addEventListener('submit', function (e) {
        e.preventDefault();
    });
});
let ErrorNotification = (Circle, Circle2, Border, Span, Text) => {
    Circle.css("visibility", "visible")
    Circle.css("color", "#cf1414")
    Circle2.css("visibility", "hidden")
    Border.css("border-color", "#cf1414")
    Span.css("visibility", "visible")
    Span.text(Text)
}
let SuccessNotification = (Circle, Circle2, Border, Span) => {
    Circle.css("visibility", "visible")
    Circle.css("color", "#14df14")
    Circle2.css("visibility", "hidden")
    Border.css("border-color", "#14df14")
    Span.css("visibility", "hidden")
}
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
    }
});
$("#login").on('click', (e) => {
    e.preventDefault()
    let email = $(".l-email").val()
    let password = $(".l-password").val()
    $.ajax({
        url: "login",
        method: "POST",
        dataType: 'json',
        data: { email: email, password: password },
        success: function (data) {
            console.log(data)
            if (data.status == 0) ErrorNotification($("#l-password-error"), $("#l-password-success"), $(".l-password"), $(".form-box").find("span").eq(3), data.message)
            else SuccessNotification($("#l-password-success"), $("#l-password-error"), $(".l-password"), $(".form-box").find("span").eq(3))
            if (data.status == -1) ErrorNotification($("#l-email-error"), $("#l-email-success"), $(".l-email"), $(".form-box").find("span").eq(2), data.message)
            else SuccessNotification($("#l-email-success"), $("#l-email-error"), $(".l-email"), $(".form-box").find("span").eq())
            if (data.status == 1) {
                $('.toast').toast('show')
                $('.toast-body').html('Đăng nhập thành công')
                setTimeout(() => { window.location.href = "/" }, 2000)
            }
        }
    })
})
$("#register").on('click', () => {
    let username = $(".r-username").val()
    let email = $(".r-email").val()
    let password = $(".r-password").val()
    let checkpassword = $(".r-check-password").val()
    let phonenumber = $(".r-phone-number").val()
    let gender = $("input:radio[name=gender]:checked").val()
    let a = 0, b = 0, c = 0, d = 0, e = 0
    if (username.length < 7) {
        ErrorNotification($("#r-username-error"), $("#r-username-success"), $(".r-username"), $(".form-box").find("span").eq(4), "Tên người dùng không hợp lệ")
    } else {
        SuccessNotification($("#r-username-success"), $("#r-username-error"), $(".r-username"), $(".form-box").find("span").eq(4))
        a = 1
    } if (!isEmailValid(email)) {
        ErrorNotification($("#r-email-error"), $("#r-email-success"), $(".r-email"), $(".form-box").find("span").eq(5), "Email không hợp lệ")
    } else {
        SuccessNotification($("#r-email-success"), $("#r-email-error"), $(".r-email"), $(".form-box").find("span").eq(5))
        b = 1
    } if (!isPasswordValid(password)) {
        ErrorNotification($("#r-password-error"), $("#r-password-success"), $(".r-password"), $(".form-box").find("span").eq(6), "Mật khẩu gồm có chữ và số & trong khoảng (8,16) từ")
    } else {
        SuccessNotification($("#r-password-success"), $("#r-password-error"), $(".r-password"), $(".form-box").find("span").eq(6))
        c = 1
    } if (checkpassword !== password || checkpassword.length == 0) {
        ErrorNotification($("#r-check-password-error"), $("#r-check-password-success"), $(".r-check-password"), $(".form-box").find("span").eq(7), "Mật khẩu không trùng")
    } else {
        SuccessNotification($("#r-check-password-success"), $("#r-check-password-error"), $(".r-check-password"), $(".form-box").find("span").eq(7))
        d = 1
    } if (!isPhonenumberValid(phonenumber)) {
        ErrorNotification($("#r-phone-number-error"), $("#r-phone-number-success"), $(".r-phone-number"), $(".form-box").find("span").eq(8), "Số điện thoại không hợp lệ")
    } else {
        SuccessNotification($("#r-phone-number-success"), $("#r-phone-number-error"), $(".r-phone-number"), $(".form-box").find("span").eq(8))
        e = 1
    }
    if (a == 1 && b == 1 && c == 1 && d == 1 && e == 1) {
        $.ajax({
            url: "register",
            method: "POST",
            dataType: 'json',
            data: { username: username, email: email, password: password, phonenumber: phonenumber, gender: gender },
            success: function (data) {
                console.log(data)
                if (data.status == 1 || data.status == 0) {
                    $('.toast').toast('show')
                    $('.toast-body').html(data.message)
                }
                if (data.status == -1) ErrorNotification($("#r-email-error"), $("#r-email-success"), $(".r-email"), $(".form-box").find("span").eq(5), data.message)
                else SuccessNotification($("#r-email-success"), $("#r-email-error"), $(".r-email"), $(".form-box").find("span").eq(5))
                if (data.status == -2) ErrorNotification($("#r-phone-number-error"), $("#r-phone-number-success"), $(".r-phone-number"), $(".form-box").find("span").eq(8), data.message)
                else SuccessNotification($("#r-phone-number-success"), $("#r-phone-number-error"), $(".r-phone-number"), $(".form-box").find("span").eq(8))
            }
        })
    }
})