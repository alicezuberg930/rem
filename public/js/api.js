var colorArray = ["#aa00aa", "#aa0000", "#ff5555", "#ffaa00", "#00aaaa", "#00aa00", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#808080", "#FF8080", "#80FF80", "#8080FF", "#008080", "#800080", "#808000", "#FFFF80", "#80FFFF", "#FF80FF", "#FF0080", "#80FF00", "#0080FF", "#00FF80", "#8000FF", "#FF8000", "#000080", "#800000", "#008000", "#404040", "#FF4040", "#40FF40", "#4040FF", "#004040", "#400040", "#404000", "#804040", "#408040", "#404080", "#FFFF40", "#40FFFF", "#FF40FF", "#FF0040", "#40FF00", "#0040FF", "#FF8040", "#40FF80", "#8040FF", "#00FF40", "#4000FF", "#FF4000", "#000040", "#400000", "#004000", "#008040", "#400080", "#804000", "#80FF40", "#4080FF", "#FF4080", "#800040", "#408000", "#004080", "#808040", "#408080", "#804080", "#C0C0C0", "#FFC0C0", "#C0FFC0", "#C0C0FF", "#00C0C0", "#C000C0", "#C0C000", "#80C0C0", "#C080C0", "#C0C080", "#40C0C0", "#C040C0", "#C0C040", "#FFFFC0", "#C0FFFF", "#FFC0FF", "#FF00C0", "#C0FF00", "#00C0FF", "#FF80C0", "#C0FF80", "#80C0FF", "#FF40C0", "#C0FF40", "#40C0FF", "#00FFC0", "#C000FF", "#FFC000", "#0000C0", "#C00000", "#00C000", "#0080C0", "#C00080", "#80C000", "#0040C0", "#C00040", "#40C000", "#80FFC0", "#C080FF", "#FFC080", "#8000C0", "#C08000", "#00C080", "#8080C0", "#C08080", "#80C080", "#8040C0", "#C08040", "#40C080", "#40FFC0", "#C040FF", "#FFC040", "#4000C0", "#C04000", "#00C040", "#4080C0", "#C04080", "#80C040", "#4040C0", "#C04040", "#40C040", "#202020", "#FF2020", "#20FF20#"];
var colorTopArray = ["#aa00aa", "#aa0000", "#ff5555", "#ffaa00", "#ffaa00", "#00aaaa", "#00aaaa", "#00aa00", "#00aa00", "#00aa00"];
var lastNoticeTime;

function callNotice(s) {
    var div = document.getElementById("notice");
    div.innerHTML = s;
    div.classList.toggle("danger", false);
    div.classList.toggle("success", false);
    div.classList.toggle("show", true);
    div.classList.toggle("off", false);
    lastNoticeTime = Date.now() + 1500;

    setTimeout(function() {
        if (Date.now() > lastNoticeTime) {
            div.classList.toggle("off", true);
            div.classList.toggle("show", false);

            setTimeout(function() {
                div.classList.toggle("off", false);
            }, 1000);
        }
    }, 2000);
}

function callDangerNotice(s) {
    var div = document.getElementById("notice");
    div.innerHTML = s;
    div.classList.toggle("success", false);
    div.classList.toggle("danger", true);
    div.classList.toggle("show", true);
    div.classList.toggle("off", false);
    lastNoticeTime = Date.now() + 1500;

    setTimeout(function() {
        if (Date.now() > lastNoticeTime) {
            div.classList.toggle("off", true);
            div.classList.toggle("show", false);

            setTimeout(function() {
                div.classList.toggle("off", false);
            }, 1000);
        }
    }, 2000);
}

function callSuccessNotice(s) {
    var div = document.getElementById("notice");
    div.innerHTML = s;
    div.classList.toggle("danger", false);
    div.classList.toggle("success", true);
    div.classList.toggle("show", true);
    div.classList.toggle("off", false);
    lastNoticeTime = Date.now() + 1500;

    setTimeout(function() {
        if (Date.now() > lastNoticeTime) {
            div.classList.toggle("off", true);
            div.classList.toggle("show", false);

            setTimeout(function() {
                div.classList.toggle("off", false);
            }, 1000);
        }
    }, 2000);
}

function getDateFromInput(date) {
    if (date.length != 0) {
        date = date.replace(/T/g, ' ');
    }
    return date;
}

function getShortName(name) {
    let names = name.split(" ");
    let newName = "";
    for (let i = 0; i < names.length; i++) {
        if (checkSimpleTextRegex(names[i].charAt(0))) {
            newName += names[i].charAt(0);
        }
    }
    return newName.toUpperCase();
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
  

function checkFirstnameRegex(firstname) {
    return firstname.length > 0 && firstname.length <= 64 && XRegExp('^([\\p{L}]+(\\s[\\p{L}]+)?){0,15}$').test(firstname);
}

function checkLastnameRegex(lastname) {
    return lastname.length > 0 && lastname.length <= 64 && XRegExp('^([\\p{L}]+(\\s[\\p{L}]+)?){0,15}$').test(lastname);
}

function checkDisplayRegex(display) {
    return display.length > 0 && display.length <= 64 && XRegExp('^([\\p{L}]+(\\s[\\p{L}]+)?){0,15}$').test(display);
}

function checkBirthRegex(date) {
    if (date.length == 0) {
        return false;
    }

    var d = date.split("-");
    var year = parseInt(d[0]);
    return year >= 1900 && year <= new Date().getFullYear() - 18;
}

function checkAddressRegex(address) {
    return address.length > 0 && address.length <= 128;
}

function checkPhoneRegex(phone) {
    return /^[\d]{10,13}$/g.test(phone);
}

function checkSimpleTextRegex(text) {
    return /^[\w]+$/g.test(text);
}

function checkProductCodeRegex(text) {
    return /^[\w]{10}$/g.test(text);
}

function checkUTF8TextRegex(text) {
    return XRegExp('^([\\p{L}]+(\\s[\\p{L}]+)?)+$').test(text);
}

function checkUsernameRegex(username) {
    return /^[\w]{5,16}$/g.test(username);
}

function checkNameRegex(name) {
    return /^[\w]{5,16}$/g.test(name);
}

function checkEmailRegex(email) {
    return email.length <= 64 && /^[\w]+@+[\w]+(\.[\w]+){1,2}$/g.test(email);
}

function checkPermissionRegex(permission) {
    return /^[\w.]+$/g.test(permission);
}

function checkPasswordRegex(password) {
    return /^[\S]{5,24}$/g.test(password);
}

function checkPassword(password, confirmPassword) {
    return password == confirmPassword;
}

function checkText(text) {
    return text.length <= 65535;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}