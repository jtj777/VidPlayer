/*此為嵌入網站用*/

//遮蔽撥放器以外
var isOnlyVid = false;
function onlyVideo() {
    isOnlyVid = (isOnlyVid ? false : true);
    if (isOnlyVid) {
        document.body.style.visibility = "hidden";
        player.style.visibility = "visible";
        var btns = document.getElementsByClassName('data-start');
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.visibility = "visible";
        }
        //影片置中
        //player.style.position = "absolute";
        //player.style.left = "50%";
        //player.style.transform = "translate(-50%, -50%);";
    } else {
        document.body.style.visibility = "visible";
    }
}

//find videoPlayer looping
var player = document.getElementsByTagName('video')[0];
var findVideo = setInterval(() => {
    if (player) {
        clearInterval(findVideo);
        main();
    }
    player = document.getElementsByTagName('video')[0];
}, 500);

class Transform {
    player;
    rotate = 0;
    flip = false;
    top = 0;
    left = 0;

    constructor(p) {
        this.player = p;
    }

    //角度調整
    setRotate(val) {
        this.rotate += val;
        this.adjTransform();
    }

    //水平翻轉
    setFlip() {
        this.flip = (flip ? false : true);
        this.adjTransform();
    }

    //上下移動
    setPositionY(val) {
        this.top += val;
        this.adjTransform();
    }

    //左右移動
    setPositionX(val) {
        this.left += val;
        this.adjTransform();
    }

    adjTransform() {
        this.player.style.transform = "rotate(" + this.rotate + "deg) rotateY(" + (this.flip ? 180 : 0) + "deg) translate(" + this.left + "px," + this.top + "px)";
    }
}

class Filter {
    player;
    亮度 = 100;
    飽和度 = 100;
    對比度 = 100;

    constructor(p) {
        this.player = p;
    }

    setBrightness(val) {
        this.亮度 += val;
        this.adjFilter();
    }

    setSaturate(val) {
        this.飽和度 += val;
        this.adjFilter();
    }

    setContrast(val) {
        this.對比度 += val;
        this.adjFilter();
    }

    adjFilter() {
        this.player.style.filter = "brightness(" + this.亮度 + "%) saturate(" + this.飽和度 + "%) contrast(" + this.對比度 + "%)";
    }
}

class Time {
    player;
    //loop
    la = -1;
    lb = -1;

    speed = 1;

    pos = [];
    pIndx = -1;

    constructor(p) {
        this.player = p;

        this.getPos();
        this.addChapter();

        //looper
        this.player.ontimeupdate = () => {
            if (this.la >= 0 && this.lb > this.la) {
                if (this.player.currentTime > this.lb) {
                    this.player.currentTime = this.la;
                }
            }
        }
    }

    //pos
    showPosUrl() {
        window.open(window.location.toString() + "?pos=" + this.pos.toString());
    }

    makerPos() {
        this.player.pause();
        var m = prompt("名稱");
        if (m != null && m != "") {
            this.pos[this.pos.length] = m + ":" + Math.round(this.player.currentTime);
        }
    }

    getPos() {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pos') != null) {
            this.pos = urlParams.get('pos').split(',');
        }
    }

    skipPos(val) {
        if (val) {
            if (this.pIndx + 1 < this.pos.length) {
                this.pIndx++;
                this.player.currentTime = this.pos[this.pIndx].split(':')[1];
            }
        }
        else {
            if (this.pIndx - 1 >= 0) {
                this.pIndx--;
                this.player.currentTime = this.pos[this.pIndx].split(':')[1];
            }
        }
    }

    //插入章節按鈕
    addChapter() {
        if (this.pos.length == 0) return;

        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.top = 0;
        div.setAttribute("id", "pnlChapter");

        for (var i = 0; i < this.pos.length; i++) {
            var btn = document.createElement("button");
            btn.setAttribute("class", "data-start");
            if (this.pos[i].split(":").length == 2) {
                btn.setAttribute("time", this.pos[i].split(":")[1]);
            } else {
                btn.setAttribute("time", this.pos[i].split(":")[0]);
            }

            var chapter = this.pos[i].split(":")[0];
            btn.textContent = chapter;
            btn.addEventListener("click", (e) => {
                this.player.currentTime = e.target.attributes.time.value;
            });
            div.appendChild(btn);
        }

        document.body.appendChild(div);
    }

    loopA() {
        this.la = this.player.currentTime;
    }

    loopB() {
        this.lb = this.player.currentTime;
    }

    clearLoop() {
        la = lb = -1;
    }

    adjSpeed(rate) {
        this.player.playbackRate += rate;
    }

    adjTime(val) {
        this.player.currentTime += val;
    }
}

function main() {
    var transform = new Transform(player);
    var filter = new Filter(player);
    var time = new Time(player);

    player.ontimeupdate = () => {
        //顯示設定值
        var s = Math.round(player.playbackRate * 100) / 100;
        document.title = "亮:" + (filter.亮度 / 100) + "飽:" + (filter.飽和度 / 100) + "對:" + (filter.對比度 / 100) + "速:" + s;
    }

    //快捷鍵事件監聽
    function hotKey(e) {
        switch (e.code) {

            case 'KeyS':
                var val = (window.event.shiftKey) ? -0.1 : 0.1;
                time.adjSpeed(val);
                break;

            case 'KeyO':
                onlyVideo();
                break;

            case 'KeyR':
                var val = (window.event.shiftKey) ? -10 : 10;
                transform.setRotate(val);
                break;

            case 'KeyF':
            case 'KeyY':
                transform.setFlip();
                break;

            case 'Comma':
                var val = window.event.shiftKey ? -10 : 10;
                transform.setPositionY(val);
                break;

            case 'Period':
                var val = window.event.shiftKey ? -10 : 10;
                transform.setPositionX(val);
                break;

            case 'KeyQ':
                var val = window.event.shiftKey ? -10 : 10;
                filter.setBrightness(val);
                break;
            case 'KeyW':
                var val = window.event.shiftKey ? -10 : 10;
                filter.setSaturate(val);
                break;
            case 'KeyE':
                var val = window.event.shiftKey ? -10 : 10;
                filter.setContrast(val);
                break;

            case 'KeyA':
                time.loopA();
                break;

            case 'KeyB':
                time.loopB();
                break;
            case 'KeyC':
                time.clearLoop();
                break;

            case 'KeyL':
                var val = window.event.shiftKey ? 60 : 10;
                time.adjTime(val);
                break;

            case 'KeyJ':
                var val = window.event.shiftKey ? -60 : -10;
                time.adjTime(val);
                break;

            case 'KeyP':
                time.skipPos(!window.event.shiftKey);
                break;

            case 'KeyM':
                time.makerPos();
                break;

            case 'KeyU':
                time.showPosUrl();
                break;
        }
    }

    window.addEventListener('keypress', hotKey);
}


