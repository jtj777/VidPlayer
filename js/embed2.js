// 嵌入式播放器控制腳本 - 優化版

let player = null;
let isOnlyVid = false;

document.addEventListener('DOMContentLoaded', () => {
    const init = () => {
        player = document.querySelector('video');
        if (!player) return;

        const transform = new Transform();
        const filter = new Filter();
        const time = new Time();

        time.getPosFromURL();
        time.insertChapters();

        player.ontimeupdate = () => {
            updateTitle(filter, time);
            time.checkLoop();
        };

        window.addEventListener('keydown', (e) => handleHotKey(e, transform, filter, time));
    };

    const observer = new MutationObserver(() => {
        if (!player) {
            const vid = document.querySelector('video');
            if (vid) {
                player = vid;
                init();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

function toggleOnlyVideo() {
    isOnlyVid = !isOnlyVid;
    document.body.style.visibility = isOnlyVid ? 'hidden' : 'visible';
    if (player) player.style.visibility = 'visible';
    document.querySelectorAll('.data-start').forEach(btn => btn.style.visibility = 'visible');
}

class Transform {
    constructor() {
        this.rotate = 0;
        this.flip = false;
        this.top = 0;
        this.left = 0;
    }

    setRotate(val) {
        this.rotate += val;
        this.apply();
    }

    toggleFlip() {
        this.flip = !this.flip;
        this.apply();
    }

    moveY(val) {
        this.top += val;
        this.apply();
    }

    moveX(val) {
        this.left += val;
        this.apply();
    }

    apply() {
        if (!player) return;
        player.style.transform = `rotate(${this.rotate}deg) rotateY(${this.flip ? 180 : 0}deg) translate(${this.left}px, ${this.top}px)`;
    }
}

class Filter {
    constructor() {
        this.brightness = 100;
        this.saturate = 100;
        this.contrast = 100;
    }

    adjustBrightness(val) {
        this.brightness += val;
        this.apply();
    }

    adjustSaturate(val) {
        this.saturate += val;
        this.apply();
    }

    adjustContrast(val) {
        this.contrast += val;
        this.apply();
    }

    apply() {
        if (!player) return;
        player.style.filter = `brightness(${this.brightness}%) saturate(${this.saturate}%) contrast(${this.contrast}%)`;
    }
}

class Time {
    constructor() {
        this.loopStart = -1;
        this.loopEnd = -1;
        this.positions = [];
        this.currentIndex = -1;
    }

    getPosFromURL() {
        const params = new URLSearchParams(location.search);
        const pos = params.get('pos');
        if (pos) this.positions = pos.split(',');
    }

    insertChapters() {
        if (!this.positions.length) return;

        const container = document.createElement('div');
        container.id = 'pnlChapter';
        container.style.position = 'absolute';
        container.style.top = '0';

        this.positions.forEach(p => {
            const [label, time] = p.split(':');
            const btn = document.createElement('button');
            btn.className = 'data-start';
            btn.textContent = label;
            btn.dataset.time = time || label;
            btn.onclick = (e) => { player.currentTime = e.target.dataset.time; };
            container.appendChild(btn);
        });

        document.body.appendChild(container);
    }

    markPosition() {
        player.pause();
        const label = prompt('名稱');
        if (label) this.positions.push(`${label}:${Math.round(player.currentTime)}`);
    }

    showPositionURL() {
        const baseUrl = location.href.split('?')[0];
        window.open(`${baseUrl}?pos=${this.positions.join(',')}`);
    }

    skipPosition(forward) {
        this.currentIndex += forward ? 1 : -1;
        if (this.currentIndex >= 0 && this.currentIndex < this.positions.length) {
            player.currentTime = this.positions[this.currentIndex].split(':')[1];
        }
    }

    setLoopA() { this.loopStart = player.currentTime; }
    setLoopB() { this.loopEnd = player.currentTime; }
    clearLoop() { this.loopStart = this.loopEnd = -1; }

    checkLoop() {
        if (this.loopStart >= 0 && this.loopEnd > this.loopStart && player.currentTime > this.loopEnd) {
            player.currentTime = this.loopStart;
        }
    }

    adjustSpeed(val) { player.playbackRate += val; }
    seek(val) { player.currentTime += val; }
}

function updateTitle(filter, time) {
    const rate = Math.round(player.playbackRate * 100) / 100;
    let title = `亮:${filter.brightness / 100} 飽:${filter.saturate / 100} 對:${filter.contrast / 100} 速:${rate}`;
    if (time.loopStart >= 0) title += ' A';
    if (time.loopEnd >= 0) title += ' B';
    document.title = title;
}

function handleHotKey(e, transform, filter, time) {
    const shift = e.shiftKey;
    const key = e.code;
    const val10 = shift ? -10 : 10;
    const val60 = shift ? -60 : 60;
    const val01 = shift ? -0.1 : 0.1;

    switch (key) {
        case 'KeyS': time.adjustSpeed(val01); break;
        case 'KeyO': toggleOnlyVideo(); break;
        case 'KeyR': transform.setRotate(val10); break;
        case 'KeyF':
        case 'KeyY': transform.toggleFlip(); break;
        case 'Comma': transform.moveY(val10); break;
        case 'Period': transform.moveX(val10); break;
        case 'KeyQ': filter.adjustBrightness(val10); break;
        case 'KeyW': filter.adjustSaturate(val10); break;
        case 'KeyE': filter.adjustContrast(val10); break;
        case 'KeyA': time.setLoopA(); break;
        case 'KeyB': time.setLoopB(); break;
        case 'KeyC': time.clearLoop(); break;
        case 'KeyL': time.seek(val60); break;
        case 'KeyJ': time.seek(-val60); break;
        case 'KeyP': time.skipPosition(!shift); break;
        case 'KeyM': time.markPosition(); break;
        case 'KeyU': time.showPositionURL(); break;
    }
}
