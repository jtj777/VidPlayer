var player;
var setting = {
    //播放器上下位置
    topPx: 0,
    //播放器角度
    rotatedeg: 0,
    //播放器水平翻轉
    rotateYdeg: 0,
    //章節跳轉
    posIndex: -1,
    posList: [],
    //播放速度
    speed: 1,
    //亮度
    brightness: 100,
    //飽和度
    saturate: 100,
    //對比度
    contrast: 100,
    //是否迴圈播放
    isABLoop: false,
    //迴圈起點
    loopA: -1,
    //迴圈終點
    loopB: -1
}

//快捷鍵事件監聽
window.addEventListener('keypress', hotKey);

//移動
    player.onmousedown = (e) => {
        //設定移動後的預設位置
        var endx = 0;
        var endy = 0;
        //獲取div的初始位置，要注意的是需要轉整型，因為獲取到值帶px
        var left = parseInt(player.css("left"));
        var top = parseInt(player.css("top"));
        //獲取滑鼠按下時的座標，區別於下面的es.pageX,es.pageY
        var downx = e.pageX;
        var downy = e.pageY;   //pageY的y要大寫，必須大寫！！
        //  滑鼠按下時給div掛事件
        player.bind("onmousemove", function (es) {
            //es.pageX,es.pageY:獲取滑鼠移動後的座標
            var endx = es.pageX - downx.left;   //計算div的最終位置
            var endy = es.pageY - downy.top;
            //帶上單位
            player.css("left", endx).css("top", endy);
        });
    }
    player.mouseup = () => {
        //滑鼠彈起時給div取消事件
        player.unbind("onmousemove")
    }

function hotKey(e) {
    switch (e.code) {
        case 'Digit7':
            prePos();
            return;

        case 'Digit8':
            player.currentTime = setting.posList[setting.posIndex];
            return;

        case 'Digit9':
            nextPos();
            return;

        case 'KeyR':
            if (window.event.shiftKey)
                rotate(-10);
            else
                rotate(10);
            return;

        case 'KeyF':
            flip();
            return;

        case 'KeyL':
            if (window.event.shiftKey)
                fastward(60);
            else
                fastward(10);
            return;

        case 'KeyJ':
            if (window.event.shiftKey)
                reverse(60);
            else
                reverse(10);
            return;

        //case 'Numpad8':
        //    MoveTop();
        //    return;

        //case 'Numpad2':
        //    MoveDown();
        //    return;

        case 'KeyS':
            if (window.event.shiftKey)
                speed(setting.speed - 0.1);
            else speed(setting.speed + 0.1);
            break;

        case 'KeyQ':
            if (window.event.shiftKey)
                brightness(-10);
            else brightness(10);
            break;

        case 'KeyW':
            if (window.event.shiftKey)
                saturate(-10);
            else saturate(10);
            break;

        case 'KeyE':
            if (window.event.shiftKey)
                contrast(-10);
            else contrast(10);
            break;
    }
}

function showToast(text) {
    $(".toast-body")[0].innerText = text;
    $(".toast").toast("show");
}

function speed(rate) {
    //player.playbackRate = (player.playbackRate == rate ? 1 : rate);
    player.playbackRate = rate;
    setting.speed = player.playbackRate;
    var s = parseInt(player.playbackRate * 100) + "%";
    $('#speed').val(s);
    showToast("播放速度: " + s);
}

function nextPos() {
    if (setting.posIndex < setting.posList.length) {
        setting.posIndex += 1;
        player.currentTime = setting.posList[setting.posIndex];
    }
}

function prePos() {
    if (setting.posIndex > 0) {
        setting.posIndex -= 1;
        player.currentTime = setting.posList[setting.posIndex];
    }
}

function fastward(sec) {
    player.currentTime += sec;
    showToast("+" + sec + "秒");
}

function reverse(sec) {
    player.currentTime -= sec;
    showToast("-" + sec + "秒");
}

function moveTop() {
    player.style.position = "absolute";
    player.style.top = (setting.topPx -= 20) + "px";
}

function moveDown() {
    player.style.position = "absolute";
    player.style.top = (setting.topPx += 20) + "px";
}

function rotate(deg) {
    setting.rotatedeg += deg;
    player.style.transform = "rotate(" + setting.rotatedeg + "deg) rotateY(" + setting.rotateYdeg + "deg)";

    var m = (setting.rotateYdeg % 360 == 0) ? "False" : "True";
    $('#rotate').val(setting.rotatedeg);
    $('#rotateY').val(m);

    showToast("翻轉角度: " + setting.rotatedeg);
}

function flip() {
    if (setting.rotateYdeg == 0) {
        setting.rotateYdeg = 180;
    } else {
        setting.rotateYdeg = 0;
    }
    player.style.transform = "rotate(" + setting.rotatedeg + "deg) rotateY(" + setting.rotateYdeg + "deg)";

    var m = (setting.rotateYdeg % 360 != 0);
    $('#rotate').val(setting.rotatedeg);
    $('#rotateY').val(m);
    showToast(m ? "設為鏡像" : "取消鏡像");
}

function brightness(val) {
    setting.brightness += val;

    adjFilter();
    $('#bright').val(setting.brightness + "%");
    showToast("亮度: " + setting.brightness + "%");
}

function saturate(val) {
    setting.saturate += val;

    adjFilter();
    $('#saturation').val(setting.saturate + "%");
    showToast("飽和度: " + setting.saturate + "%");
}

function contrast(val) {
    setting.contrast += val;

    adjFilter();
    $('#contrast').val(setting.contrast + "%");
    showToast("對比度: " + setting.contrast + "%");
}

function adjFilter() {
    $("video").css("filter", "brightness(" + setting.brightness + "%) saturate(" + setting.saturate + "%) contrast(" + setting.contrast + "%)");
}

//視窗縮放
window.onresize = function () {
    player = document.getElementById('player');
    setFitSize();
    showToast("影片尺寸:" + player.width + "x" + player.height);
};

// 啟動迴圈播放
function enableABLoop(second_a,second_b) {
    setting.isABLoop = true;
    setting.loopA = second_a;
    setting.loopB = second_b
    player.currentTime = second_a;
    showToast("設定Loop");
}

// 關閉迴圈播放
function disableABLoop() {
    setting.isABLoop = false;
    setting.loopA = -1;
    setting.loopB = -1;
    showToast("取消Loop");
}

function vidTimeUpdated() {
    var roundedTime = Math.floor(player.currentTime);
    //修改標題
    var title = document.title.split(' : ')[0];
    document.title = title + " : " + roundedTime;

    //紀錄最後播放位置
    localStorage.setItem(title, roundedTime);

    //迴圈播放
    var a = setting.loopA;
    var b = setting.loopB;
    if (setting.isABLoop && a >= 0 && b > a) {
        if (player.currentTime > b) {
            player.currentTime = a;
        }
    }

    //章節跳轉(顯示)
    for (var i = 1; i <= setting.posList.length; i++) { // iterate through chapters
        var start = $(".vidchaNav>*:nth-child(" + i + ")").data("start"); // get start time frome data-attr
        var end;

        // get end time from start-time from next chapter (check if last chapter)
        if (i + 1 > setting.posList.length) {
            end = player.duration;
        } else {
            var nextChapter = i + 1;
            end = $(".vidchaNav>*:nth-child(" + nextChapter + ")").data("start");
        }

        // set current Chapter active
        if (player.currentTime >= start && player.currentTime < end) {
            setActive(i);
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
    player = document.getElementById('player');
    player.src = vidSrc;
    setting.posList = [];
    var content = "";
    for (var i = 0; i < pos.length; i++) {
        var c = pos[i].split(':');
        var p1 = c[0];
        var p2 = c[1];
        content += "<li class='shadow' data-start='" + p2 + "'>" + p1 + "</li>";
        setting.posList.push(p2);
    }
    var VidPos = document.getElementById("vidchas");
    VidPos.innerHTML = content;

    bindChapter();

    setFitSize();

    //播放上次的位置
    var title = document.title.split(' : ')[0];
    player.currentTime = localStorage.getItem(title);
}

function bindChapter() {
    // click action
    $(".vidchaNav > *").click(function () {
        var clickedChapter = $(this).index() + 1;

        setActive(clickedChapter);
        skipTime($(this).data("start"));
    });

}

function setActive(cha) {
    $(".vidchaNav>*").removeClass("active"); // reset all active classes
    $(".vidchaNav>*:nth-child(" + cha + ")").addClass("active"); // add class to active chapter
}

// skip to time in timeline
function skipTime(time) {
    player.pause();
    player.currentTime = time;
    player.play();
};
