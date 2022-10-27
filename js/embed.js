/*此為嵌入網站用*/

//遮蔽播放器以外
var tmpBody = "";
var isOnlyVid = false;
function onlyVideo() {
    isOnlyVid = (isOnlyVid ? false : true);
    if (isOnlyVid) {
        if (tmpBody == "") {
            tmpBody = document.body;
        }
        //remove
        //document.body.style.visibility = "hidden";
        //player.style.visibility = "visible";
        var tmpSrc = player.src;
        document.body.innerHTML = "<!--設定面板--> <div class='offcanvas offcanvas-bottom' data-bs-backdrop='false' id='offcanvasScrolling' style='height:7vh'> <div class='offcanvas-body row'> <!--關閉設定面板的按鈕--> <button class='col-1 form-floating btn-close' data-bs-dismiss='offcanvas' aria-label='Close'></button> <div class='col-3 form-floating'> <div class='input-group input-group-sm'> <button class='btn btn-outline-secondary btn-sm' id='btnLoopA'>A</button> <input id='loopA' class='form-control'> <button class='btn btn-outline-secondary btn-sm' id='btnLoopAAdd'>＋</button> <button class='btn btn-outline-secondary btn-sm' id='btnLoopASub'>－</button> <span> </span> <button class='btn btn-outline-secondary btn-sm' id='btnLoopB'>B</button> <input id='loopB' class='form-control'> <button class='btn btn-outline-secondary btn-sm' id='btnLoopBAdd'>＋</button> <button class='btn btn-outline-secondary btn-sm' id='btnLoopBSub'>－</button> </div> </div> <div class='col-2 form-floating'> <div class='input-group input-group-sm'> <span class='input-group-text shadow'>Loop</span> <div class='input-group-text shadow'> <input type='checkbox' class='btn btn-secondary btn-sm shadow' id='btnLoopOn' /> </div> </div> </div> <div class='col-1 form-floating'> <div class='input-group input-group-sm shadow'> <span class='input-group-text'>角度</span> <input class='form-control' id='rotate' value='0' readonly /> </div> </div> <div class='col-1 form-floating'> <div class='input-group input-group-sm shadow'> <span class='input-group-text'>鏡像</span> <input class='form-control' id='rotateY' value='False' readonly /> </div> </div> <div class='col-1 form-floating'> <div class='input-group input-group-sm shadow'> <span class='input-group-text'>速度</span> <input class='form-control' id='speed' value='100%' readonly /> </div> </div> <div class='col-1 form-floating'> <div class='input-group input-group-sm shadow'> <span class='input-group-text'>亮度</span> <input class='form-control' id='bright' value='100%' readonly /> </div> </div> <div class='col-1 form-floating'> <div class='input-group input-group-sm shadow'> <span class='input-group-text'>飽和度</span> <input class='form-control' id='saturation' value='100%' readonly /> </div> </div> <div class='col-1 form-floating'> <div class='input-group input-group-sm shadow'> <span class='input-group-text'>對比度</span> <input class='form-control' id='contrast' value='100%' readonly /> </div> </div> </div> </div>";
        player = document.getElementsByTagName('video')[0];
        player.src = tmpSrc;

        var btns = document.getElementsByClassName('data-start');
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.visibility = "visible";
        }
    } else {
        //show
        //document.body.style.visibility = "visible";
        document.body = tmpBody;
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

function Transform() {
    this.rotate = 0;
    this.flip = false;
    this.top = 0;
    this.left = 0;

    //角度調整
    this.setRotate = function (val) {
        this.rotate += val;
        this.adjTransform();
    }

    //水平翻轉
    this.setFlip = function () {
        this.flip = (this.flip ? false : true);
        this.adjTransform();
    }

    //上下移動
    this.setPositionY = function (val) {
        this.top += val;
        this.adjTransform();
    }

    //左右移動
    this.setPositionX = function (val) {
        this.left += val;
        this.adjTransform();
    }

    this.adjTransform = function () {
        player.style.transform = "rotate(" + this.rotate + "deg) rotateY(" + (this.flip ? 180 : 0) + "deg) translate(" + this.left + "px," + this.top + "px)";
    }
}

function Filter() {
    this.bright = 100;
    this.sat = 100;
    this.contrast = 100;

    this.setBrightness = function (val) {
        this.bright += val;
        this.adjFilter();
    }

    this.setSaturate = function (val) {
        this.sat += val;
        this.adjFilter();
    }

    this.setContrast = function (val) {
        this.contrast += val;
        this.adjFilter();
    }

    this.adjFilter = function () {
        player.style.filter = "brightness(" + this.bright + "%) saturate(" + this.sat + "%) contrast(" + this.contrast + "%)";
    }
}

function Time() {
    //loop
    this.la = -1;
    this.lb = -1;

    this.speed = 1;

    this.pos = [];
    this.pIndx = -1;

    //pos
    this.showPosUrl = function () {
        //重複按下時,移除參數
        window.open(window.location.toString().split('?', 0) + "?pos=" + this.pos.toString());
    }

    this.makerPos = function () {
        player.pause();
        var m = prompt("名稱");
        if (m != null && m != "") {
            this.pos[this.pos.length] = m + ":" + Math.round(player.currentTime);
        }
    }

    this.getPos = function () {
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pos') != null) {
            this.pos = urlParams.get('pos').split(',');
        }
    }

    this.skipPos = function (val) {
        if (val) {
            if (this.pIndx + 1 < this.pos.length) {
                this.pIndx++;
                player.currentTime = this.pos[this.pIndx].split(':')[1];
            }
        }
        else {
            if (this.pIndx - 1 >= 0) {
                this.pIndx--;
                player.currentTime = this.pos[this.pIndx].split(':')[1];
            }
        }
    }

    //插入章節按鈕
    this.addChapter = function () {
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
                player.currentTime = e.target.attributes.time.value;
            });
            div.appendChild(btn);
        }

        document.body.appendChild(div);
    }

    this.loopIfExist = function () {
        if (this.la >= 0 && this.lb > this.la) {
            if (player.currentTime > this.lb) {
                player.currentTime = this.la;
            }
        }
    }

    this.loopA = function () {
        this.la = player.currentTime;
    }

    this.loopB = function () {
        this.lb = player.currentTime;
    }

    this.clearLoop = function () {
        this.la = this.lb = -1;
    }

    this.adjSpeed = function (rate) {
        player.playbackRate += rate;
    }

    this.adjTime = function (val) {
        player.currentTime += val;
    }
}

function main() {
    var transform = new Transform(player);
    var filter = new Filter(player);
    var time = new Time(player);
    time.getPos();
    time.addChapter();

    player.ontimeupdate = () => {
        //顯示設定值
        var s = Math.round(player.playbackRate * 100) / 100;

        var title = "亮:" + (filter.bright / 100) + "飽:" + (filter.sat / 100) + "對:" + (filter.contrast / 100) + "速:" + s;

        //loopAB
        if (time.la >= 0) {
            title += "A";
        }
        if (time.lb >= 0) {
            title += "B";
        }

        document.title = title;
        time.loopIfExist();
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
