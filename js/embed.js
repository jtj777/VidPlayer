/*此為嵌入網站用*/
var la = -1;
var lb = -1;
var rotate = 0;
var flip = false;
var speed = 1;
var 亮度 = 100;
var 飽和度 = 100;
var 對比度 = 100;
var isOnlyVid = false;
var pos = [];
var pIndx = -1;
var player = document.getElementsByTagName('video')[0];

function adjSpeed(rate) {
    player.playbackRate = rate;
}

function setRotate(val) {
    rotate += val;
    adjTransform();
}

function setFlip() {
    flip = (flip ? false : true);
    adjTransform();
}

function adjTransform() {
    player.style.transform = "rotate(" + rotate + "deg) rotateY(" + (flip ? 180 : 0) + "deg)";
}

function setBrightness(val) {
    亮度 += val;
    adjFilter();
}

function setSaturate(val) {
    飽和度 += val;
    adjFilter();
}

function setContrast(val) {
    對比度 += val;
    adjFilter();
}

function adjFilter() {
    player.style.filter = "brightness(" + 亮度 + "%) saturate(" + 飽和度 + "%) contrast(" + 對比度 + "%)";
}
function onlyVideo() {
    isOnlyVid = (isOnlyVid ? false : true);
    if (isOnlyVid) {
        document.body.style.visibility = "hidden";
        player.style.visibility = "visible";

        //影片置中
        //player.style.position = "absolute";
        //player.style.left = "50%";
        //player.style.transform = "translate(-50%, -50%);";
    } else {
        document.body.style.visibility = "visible";
    }
}

//pos
function getPos() {
    let urlParams = new URLSearchParams(window.location.search);
    pos = urlParams.get('pos').split(',');
}

function skipPos() {
    pIndx++;
    if (pIndx >= pos.length) {
        pIndx = 0;
    }
    player.currentTime = pos[pIndx];
}

player.ontimeupdate = () => {
    var s = Math.round(player.playbackRate * 100) / 100;
    document.title = "亮:" + 亮度 + "飽:" + 飽和度 + "對:" + 對比度 + "速:" + s;
    if (la >= 0 && lb > la) {
        if (player.currentTime > lb) {
            player.currentTime = la;
        }
    }
}

//快捷鍵事件監聽
function hotKey(e) {
    switch (e.code) {

        case 'KeyS':
            if (window.event.shiftKey) speed -= 0.1;
            else speed += 0.1;
            adjSpeed(speed);
            break;

        case 'KeyO':
            onlyVideo();
            break;

        case 'KeyR':
            var val = (window.event.shiftKey) ? -10 : 10;
            setRotate(val);
            break;

        case 'KeyF':
        case 'KeyY':
            setFlip();
            break;

        case 'KeyQ':
            var val = window.event.shiftKey ? -10 : 10;
            setBrightness(val);
            break;
        case 'KeyW':
            var val = window.event.shiftKey ? -10 : 10;
            setSaturate(val);
            break;
        case 'KeyE':
            var val = window.event.shiftKey ? -10 : 10;
            setContrast(val);
            break;

        case 'KeyA':
            la = player.currentTime;
            break;
        case 'KeyB':
            lb = player.currentTime;
            break;
        case 'KeyC':
            la = lb = -1;
            break;

        case 'KeyL':
            var val = window.event.shiftKey ? 60 : 10;
            player.currentTime += val;
            break;
        case 'KeyJ':
            var val = window.event.shiftKey ? 60 : 10;
            player.currentTime -= val;
            break;

        case 'KeyP':
            skipPos();
            break;
    }
}
window.addEventListener('keypress', hotKey);



//init
getPos();
$('.modal').remove();

