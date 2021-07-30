//視窗縮放
window.onresize = function (event) {
    this.setFitSize();
};

//
function vidTimeUpdated() {
    var title = document.title.split(' : ')[0];
    document.title = title + " : " + Math.floor(player.currentTime);

    var lb = parseInt(document.getElementById("loopB").value);
    if (lb < 1)
        document.getElementById("loopA").value = Math.floor(player.currentTime);
    var la = parseInt(document.getElementById("loopA").value);

    if (la > 0 && lb > la && player.currentTime > lb) {
        player.currentTime = la;
    }
}

function setFitSize() {

    player.style.position = "absolute";
    player.style.top = "60px";
    var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    player.width = vw;
    //player.height = (vw / 1.777)-160;
    player.height = vh - 100;
}



function initTable(pos) {
    var VidPos = document.getElementById("vidchas");
    var content = "";
    for (var i = 0; i < pos.length; i++) {
        var c = pos[i].split(':');
        var p1 = c[0];
        var p2 = c[1];
        content += "<li class='shadow' data-start='" + p2 + "'>" + p1 + "</li>";
        posList.push(p2);
    }
    VidPos.innerHTML = content;
    setFitSize();
}

function initPlayer(vidSrc, pos) {
    initTable(pos);
    player.src = vidSrc;
}