//播放器上下位置
var topPx = 0;
//撥放器角度
var rotatedeg = 0;
//播放器水平翻轉
var rotateYdeg = 0;

var posIndex = -1;
var posList = [];

var player = document.getElementById("player");

//快捷鍵
document.addEventListener('keypress', logKey);

function logKey(e) {

    switch (e.code) {
        case 'Numpad4':
            prePos();
            return;
        case 'Numpad5':
            player.currentTime = posList[posIndex];
            return;
        case 'Numpad6':
            nextPos();
            return;
        case 'Comma':
            rotate(-10);
            return;
        case 'Period':
            rotate(10);
            return;
        case 'Slash':
            rotateY(180);
            return;
        case 'KeyL':
            if (window.event.shiftKey)
                Fastward(60);
            else
                Fastward(10);
            return;
        case 'KeyJ':
            if (window.event.shiftKey)
                Reverse(60);
            else
                Reverse(10);
            return;
        case 'Numpad8':
            MoveTop();
            return;
        case 'Numpad2':
            MoveDown();
            return;

        case 'KeyS':
            ChangePlaySpeedRate(1.5);
            break;

        case 'Digit1':
            if (window.event.shiftKey)
                brightness(-10);
            else brightness(10);
            break;
        case 'Digit2':
            if (window.event.shiftKey)
                saturate(-10);
            else saturate(10);
            break;
        case 'Digit3':
            if (window.event.shiftKey)
                contrast(-10);
            else contrast(10);
            break;
    }
}

function ChangePlaySpeedRate(rate) {
    if (player.playbackRate == rate) player.playbackRate = 1;
    else player.playbackRate = rate;
    $(".toast-body")[0].innerText = "播放速度: " + rate;
    $(".toast").toast("show");
}

function nextPos() {
    if (posIndex < posList.length) {
        posIndex += 1;
        player.currentTime = posList[posIndex];
    }
}

function prePos() {
    if (posIndex > 0) {
        posIndex -= 1;
        player.currentTime = posList[posIndex];
    }
}

function Fastward(t) {
    player.currentTime += t;
}

function Reverse(t) {
    player.currentTime -= t;
}

function MoveTop() {
    player.style.position = "absolute";
    player.style.top = (topPx -= 20) + "px";
}

function MoveDown() {
    player.style.position = "absolute";
    player.style.top = (topPx += 20) + "px";
}

function jump(sec) {
    player.currentTime = sec;
}

function rotate(deg) {
    rotatedeg += deg;
    player.style.transform = "rotate(" + rotatedeg + "deg) rotateY(" + rotateYdeg + "deg)";

    $(".toast-body")[0].innerText = "翻轉角度: " + rotatedeg;
    $(".toast").toast("show");
}

function rotateY(deg) {
    rotateYdeg += deg;
    player.style.transform = "rotate(" + rotatedeg + "deg) rotateY(" + rotateYdeg + "deg)";

    $(".toast-body")[0].innerText = "水平翻轉: " + rotatedeg;
    $(".toast").toast("show");
}

var b = 100;
var s = 100;
var c = 100;
function brightness(val) {
    b += val;
    /*    $("video").css("filter", "brightness(" + b + "%)");*/
    adjFilter();
    $(".toast-body")[0].innerText = "亮度: " + b + "%";
    $(".toast").toast("show");
}

function saturate(val) {
    s += val;
/*    $("video").css("filter", "saturate(" + s + "%)");*/
    adjFilter();
    $(".toast-body")[0].innerText = "飽和度: " + s + "%";
    $(".toast").toast("show");
}

function contrast(val) {
    c += val;
/*    $("video").css("filter", "contrast(" + c + "%)");*/
    adjFilter();
    $(".toast-body")[0].innerText = "對比度: " + c + "%";
    $(".toast").toast("show");
}

function adjFilter() {
    $("video").css("filter", "brightness(" + b + "%) saturate(" + s + "%) contrast(" + c + "%)");
}