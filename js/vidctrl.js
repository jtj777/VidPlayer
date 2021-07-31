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
        case 'Digit7':
            prePos();
            return;

        case 'Digit8':
            player.currentTime = posList[posIndex];
            return;

        case 'Digit9':
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

        //case 'Numpad8':
        //    MoveTop();
        //    return;

        //case 'Numpad2':
        //    MoveDown();
        //    return;

        case 'KeyS':
            if (window.event.shiftKey)
                Speed(0.75);
            else Speed(1.5);
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

function Speed(rate) {
    if (player.playbackRate == rate)
        player.playbackRate = 1;
    else
        player.playbackRate = rate;

    $('#speed').val(player.playbackRate * 100 + "%");
    $(".toast-body")[0].innerText = "播放速度: " + player.playbackRate;
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

//function jump(sec) {
//    player.currentTime = sec;
//}

function rotate(deg) {
    rotatedeg += deg;
    player.style.transform = "rotate(" + rotatedeg + "deg) rotateY(" + rotateYdeg + "deg)";

    var m = (rotateYdeg % 360 == 0) ? "False" : "True";
    $('#rotate').val(rotatedeg);
    $('#rotateY').val(m);
    $(".toast-body")[0].innerText = "翻轉角度: " + rotatedeg;
    $(".toast").toast("show");
}

function rotateY(deg) {
    rotateYdeg += deg;
    player.style.transform = "rotate(" + rotatedeg + "deg) rotateY(" + rotateYdeg + "deg)";

    var m = (rotateYdeg % 360 == 0) ? "False" : "True";
    $('#rotate').val(rotatedeg);
    $('#rotateY').val(m);
    $(".toast-body")[0].innerText = "鏡像" + m;
    $(".toast").toast("show");
}

var b = 100;
var s = 100;
var c = 100;
function brightness(val) {
    b += val;

    adjFilter();
    $('#bright').val(b + "%");
    $(".toast-body")[0].innerText = "亮度: " + b + "%";
    $(".toast").toast("show");
}

function saturate(val) {
    s += val;

    adjFilter();
    $('#saturation').val(s + "%");
    $(".toast-body")[0].innerText = "飽和度: " + s + "%";
    $(".toast").toast("show");
}

function contrast(val) {
    c += val;

    adjFilter();
    $('#contrast').val(c + "%");
    $(".toast-body")[0].innerText = "對比度: " + c + "%";
    $(".toast").toast("show");
}

function adjFilter() {
    $("video").css("filter", "brightness(" + b + "%) saturate(" + s + "%) contrast(" + c + "%)");
}

//視窗縮放
window.onresize = function (event) {
    this.setFitSize();
};

var loopA = -1;
var loopB = -1;
var isLoopEnable = false;
function enableLoop(a, b) {
    loopA = a;
    loopB = b;
    isLoopEnable = true;
    player.currentTime = a;
}

function disableLoop() {
    loopA = -1;
    loopB = -1;
    isLoopEnable = false;
}

//
function vidTimeUpdated() {
    //修改標題
    var title = document.title.split(' : ')[0];
    document.title = title + " : " + Math.floor(player.currentTime);

    if (!isLoopEnable) {
        $('#loopB').val(Math.floor(player.currentTime));
    }

    //迴圈播放
    if (isLoopEnable && loopA >= 0 && loopB > loopA) {
        if (player.currentTime > loopB) {
            player.currentTime = loopA;
        }
    }
}

function setFitSize() {
    player.style.position = "absolute";
    player.style.top = "60px";
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    player.width = vw;
    player.height = vh - 100;
}

function initPlayer(vidSrc, pos) {
    player.src = vidSrc;

    var content = "";
    for (var i = 0; i < pos.length; i++) {
        var c = pos[i].split(':');
        var p1 = c[0];
        var p2 = c[1];
        content += "<li class='shadow' data-start='" + p2 + "'>" + p1 + "</li>";
        posList.push(p2);
    }
    var VidPos = document.getElementById("vidchas");
    VidPos.innerHTML = content;

    setFitSize();
}