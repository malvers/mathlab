/* ============================================================
   KAIMBO simulator — canvas mock-up of the learner's phone app
   (SimulatorPane port): drill through the topic tree via 7
   colored menu buttons, then an auto-advancing play mode with
   the card image, Italian/German caption bars (click to toggle,
   at least one stays on), TTS of the visible languages and
   iPod-style transport controls. Right-click = up/exit.
   The phone bezel is CSS/canvas-drawn (no phone.png asset).
   ============================================================ */
'use strict';

KB.sim = {
    open: false, node: null, playMode: false, optionsMode: false, helpNode: null,
    playList: [], onDisplay: 0, playing: false, playToken: 0,
    drawItalian: true, drawGerman: true, mouseOver: false,
    controls: [], buttons: [], img: null
};

// original 7 button color pairs (dark / light)
KB.sim.COLORS = [
    ['rgb(240,0,0)', 'rgb(255,160,160)'], ['rgb(245,134,0)', 'rgb(255,213,165)'],
    ['rgb(138,188,0)', 'rgb(173,240,3)'], ['rgb(0,89,75)', 'rgb(0,180,158)'],
    ['rgb(0,50,117)', 'rgb(68,140,251)'], ['rgb(106,0,106)', 'rgb(220,0,225)'],
    ['rgb(80,80,80)', 'rgb(180,180,180)']
];

KB.sim.OPTIONS = ['Listening', 'Speaking', 'Handwriting', 'Typing', '5 min', '10 min', '20 min'];

KB.sim.toggle = function () { KB.sim.open ? KB.sim.close() : KB.sim.show(); };

KB.sim.show = function () {
    const host = document.getElementById('simulator');
    host.innerHTML = '<canvas id="sim-canvas"></canvas>' +
        '<div id="sim-hint">click = drill/choose · right-click = up/exit · Alt+click = options · hover = controls · Esc = close</div>';
    host.classList.remove('hidden');
    KB.sim.open = true;
    KB.sim.node = KB.tree.root();
    KB.sim.playMode = false;
    KB.sim.optionsMode = false;
    const cv = document.getElementById('sim-canvas');
    cv.addEventListener('mousedown', e => KB.sim.click(e));
    cv.addEventListener('contextmenu', e => e.preventDefault());
    cv.addEventListener('mousemove', () => { KB.sim.mouseOver = true; KB.sim.draw(); });
    cv.addEventListener('mouseleave', () => { KB.sim.mouseOver = false; KB.sim.draw(); });
    host.onclick = e => { if (e.target === host) KB.sim.close(); };
    KB.sim.resize();
    KB.sim.draw();
};

KB.sim.close = function () {
    KB.sim.stopPlaying();
    speechSynthesis.cancel();
    document.getElementById('simulator').classList.add('hidden');
    KB.sim.open = false;
};

KB.sim.resize = function () {
    const cv = document.getElementById('sim-canvas');
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const vertical = !KB.sim.playMode;
    const h = Math.min(window.innerHeight * 0.82, 760);
    const w = vertical ? h * (400 / 750) : h * (750 / 400);
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    cv.width = w * dpr; cv.height = h * dpr;
    cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    KB.sim.w = w; KB.sim.h = h;
};

/* ---------------- drawing ---------------- */
KB.sim.draw = function () {
    const cv = document.getElementById('sim-canvas');
    if (!cv) return;
    const g = cv.getContext('2d');
    const { w, h } = KB.sim;
    g.clearRect(0, 0, w, h);
    // bezel
    g.fillStyle = 'rgb(136,136,136)';
    KB.sim.rr(g, 0, 0, w, h, 26); g.fill();
    g.fillStyle = '#111';
    KB.sim.rr(g, 8, 8, w - 16, h - 16, 20); g.fill();
    const inX = 14, inY = 40, inW = w - 28, inH = h - 80;   // screen area inside bezel
    KB.sim.screen = { x: inX, y: inY, w: inW, h: inH };
    g.save();
    KB.sim.rr(g, inX, inY, inW, inH, 6); g.clip();
    if (KB.sim.playMode) KB.sim.drawPlay(g);
    else KB.sim.drawMenu(g);
    g.restore();
    // speaker + home dot
    g.fillStyle = '#333';
    KB.sim.rr(g, w / 2 - 30, 18, 60, 8, 4); g.fill();
    g.beginPath(); g.arc(w / 2, h - 22, 10, 0, 7); g.fill();
};

KB.sim.rr = function (g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r);
    g.closePath();
};

KB.sim.drawMenu = function (g) {
    const s = KB.sim.screen;
    g.fillStyle = 'rgb(136,136,136)';
    g.fillRect(s.x, s.y, s.w, s.h);
    KB.sim.buttons = [];
    if (KB.sim.helpNode) {   // help screen: solid color + banner
        g.fillStyle = KB.sim.helpNode.color;
        g.fillRect(s.x, s.y, s.w, s.h);
        g.fillStyle = 'rgba(0,0,0,0.35)';
        g.fillRect(s.x, s.y + 10, s.w, 54);
        g.fillStyle = '#fff';
        g.font = '22px Arial';
        g.textAlign = 'center';
        g.fillText('More on ' + KB.sim.helpNode.text, s.x + s.w / 2, s.y + 45);
        return;
    }
    const items = KB.sim.optionsMode
        ? KB.sim.OPTIONS.map(t => ({ text: t, children: [] }))
        : (KB.sim.node ? KB.sim.node.children.slice(0, 7) : []);
    const bh = (s.h - 12) / 7;
    items.forEach((n, i) => {
        const [dark, light] = KB.sim.COLORS[i % 7];
        const y = s.y + 6 + i * bh;
        g.fillStyle = dark;
        g.fillRect(s.x + 6, y + 2, s.w - 12, bh - 4);
        g.fillStyle = '#fff';
        g.font = Math.min(22, bh * 0.4) + 'px Arial';
        g.textAlign = 'center';
        g.fillText(KB.sim.fit(g, n.text || '', s.w - 60), s.x + s.w / 2, y + bh / 2 + 7);
        if (n.children && n.children.length) {
            // triangle + total child count in the light partner color
            g.fillStyle = light;
            g.font = '11px Arial';
            g.textAlign = 'left';
            const total = KB.tree.totalChildCount(n);
            g.fillText(String(total), s.x + 42, y + bh / 2 - 4);
            g.beginPath();
            g.moveTo(s.x + 42, y + bh / 2 + 2);
            g.lineTo(s.x + 54, y + bh / 2 + 2);
            g.lineTo(s.x + 48, y + bh / 2 + 10);
            g.fill();
        }
        KB.sim.buttons.push({ x: s.x + 6, y: y + 2, w: s.w - 12, h: bh - 4, node: n, index: i, color: dark });
    });
};

KB.sim.fit = function (g, text, maxW) {
    if (g.measureText(text).width <= maxW) return text;
    while (text.length > 1 && g.measureText(text + '…').width > maxW) text = text.slice(0, -1);
    return text + '…';
};

KB.sim.drawPlay = function (g) {
    const s = KB.sim.screen;
    g.fillStyle = '#000';
    g.fillRect(s.x, s.y, s.w, s.h);
    KB.sim.controls = [];
    const task = KB.sim.playList[KB.sim.onDisplay];
    if (!task) return;
    // card image letterboxed
    if (KB.sim.img && KB.sim.img.complete && KB.sim.img.naturalWidth) {
        const iw = KB.sim.img.naturalWidth, ih = KB.sim.img.naturalHeight;
        const sc = Math.min(s.w / iw, s.h / ih);
        const dw = iw * sc, dh = ih * sc;
        g.drawImage(KB.sim.img, s.x + (s.w - dw) / 2, s.y + (s.h - dh) / 2, dw, dh);
    }
    // caption bars at 33% and 66%
    const barH = s.h / 16;
    const drawBar = (frac, text, on) => {
        const y = s.y + s.h * frac - barH / 2;
        g.fillStyle = on ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.5)';
        g.fillRect(s.x, y, s.w, barH);
        if (on) {
            g.fillStyle = 'gray';
            g.font = (s.h / 26) + 'px Arial';
            g.textAlign = 'center';
            g.fillText(KB.sim.fit(g, text, s.w - 30), s.x + s.w / 2, y + barH / 2 + s.h / 78);
        }
        return { x: s.x, y, w: s.w, h: barH };
    };
    KB.sim.controls.push({ ...drawBar(0.33, task.italian, KB.sim.drawItalian), name: 'it' });
    KB.sim.controls.push({ ...drawBar(0.66, task.german, KB.sim.drawGerman), name: 'de' });
    // progress bar
    const py = s.y + s.h * 0.85;
    g.fillStyle = 'rgba(255,255,255,0.7)';
    g.fillRect(s.x + 60, py, s.w - 120, 3);
    g.fillStyle = 'red';
    g.fillRect(s.x + 60, py, (s.w - 120) * (KB.sim.onDisplay + 1) / KB.sim.playList.length, 3);
    g.fillStyle = '#fff';
    g.font = '12px Arial';
    g.textAlign = 'right'; g.fillText(String(KB.sim.onDisplay + 1), s.x + 54, py + 5);
    g.textAlign = 'left'; g.fillText(String(KB.sim.playList.length), s.x + s.w - 54, py + 5);
    // transport controls (hover only)
    if (KB.sim.mouseOver) {
        const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
        g.fillStyle = 'rgba(255,255,255,0.86)';
        const reg = (x, name, draw) => {
            draw(x);
            KB.sim.controls.push({ x: x - 25, y: cy - 25, w: 50, h: 50, name });
        };
        if (KB.sim.playing) {
            reg(cx, 'pause', x => { g.fillRect(x - 14, cy - 20, 10, 40); g.fillRect(x + 4, cy - 20, 10, 40); });
        } else {
            reg(cx, 'play', x => { g.beginPath(); g.moveTo(x - 12, cy - 20); g.lineTo(x + 20, cy); g.lineTo(x - 12, cy + 20); g.fill(); });
        }
        const arrow = (x, dir) => {
            g.beginPath();
            g.moveTo(x - 10 * dir, cy - 14); g.lineTo(x + 8 * dir, cy); g.lineTo(x - 10 * dir, cy + 14); g.fill();
        };
        reg(cx + 110, 'next', x => { arrow(x - 5, 1); arrow(x + 9, 1); });
        reg(cx - 110, 'previouse', x => { arrow(x + 5, -1); arrow(x - 9, -1); });
        reg(cx + 180, 'toEnd', x => { arrow(x - 4, 1); g.fillRect(x + 10, cy - 14, 5, 28); });
        reg(cx - 180, 'toBegin', x => { arrow(x + 4, -1); g.fillRect(x - 15, cy - 14, 5, 28); });
    }
};

/* ---------------- interaction ---------------- */
KB.sim.click = function (e) {
    const cv = document.getElementById('sim-canvas');
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    // macOS delivers Ctrl+click as a button-2 press — check ctrlKey FIRST so the
    // help screen stays reachable; plain right-click = up one level / exit play
    if (e.ctrlKey && !KB.sim.playMode && !KB.sim.optionsMode) {
        e.preventDefault();
        const btn = KB.sim.buttons.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
        if (btn) { KB.sim.helpNode = { text: btn.node.text, color: btn.color }; KB.sim.draw(); }
        return;
    }
    if (e.button === 2) {   // right-click: up one level / exit play
        e.preventDefault();
        if (KB.sim.playMode) KB.sim.exitPlay();
        else if (KB.sim.helpNode) { KB.sim.helpNode = null; KB.sim.draw(); }
        else KB.sim.upOneLevel();
        return;
    }
    if (KB.sim.playMode) {
        const hit = KB.sim.controls.find(c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
        if (!hit) return;
        KB.sim.transport(hit.name);
        return;
    }
    if (KB.sim.helpNode) { KB.sim.helpNode = null; KB.sim.draw(); return; }
    const btn = KB.sim.buttons.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    if (!btn) return;
    if (KB.sim.optionsMode) {          // any option starts play mode (decorative, like the original)
        KB.sim.optionsMode = false;
        KB.sim.startShow(KB.sim.optionsNode);
        return;
    }
    if (e.altKey || e.shiftKey) { KB.sim.optionsMode = true; KB.sim.optionsNode = btn.node; KB.sim.draw(); return; }
    if (btn.node.children && btn.node.children.length) {
        KB.sim.node = btn.node;
        KB.sim.draw();
    } else {
        KB.sim.startShow(btn.node);
    }
};

KB.sim.upOneLevel = function () {
    if (KB.sim.node && KB.sim.node.parent) { KB.sim.node = KB.sim.node.parent; KB.sim.draw(); }
    else KB.sim.close();
};

KB.sim.transport = function (name) {
    switch (name) {
        case 'play': KB.sim.startPlaying(); break;
        case 'pause': KB.sim.stopPlaying(); break;
        case 'next': KB.sim.advance(1); break;
        case 'previouse': KB.sim.advance(-1); break;
        case 'toBegin': KB.sim.onDisplay = 0; KB.sim.showCard(); break;
        case 'toEnd': KB.sim.onDisplay = KB.sim.playList.length - 1; KB.sim.showCard(); break;
        case 'it':
            KB.sim.drawItalian = !KB.sim.drawItalian;
            if (!KB.sim.drawItalian && !KB.sim.drawGerman) KB.sim.drawGerman = true;
            KB.sim.draw(); break;
        case 'de':
            KB.sim.drawGerman = !KB.sim.drawGerman;
            if (!KB.sim.drawItalian && !KB.sim.drawGerman) KB.sim.drawItalian = true;
            KB.sim.draw(); break;
    }
};

/* ---------------- play mode ---------------- */
KB.sim.startShow = function (node) {
    // playlist = all tasks matched in the subtree, shuffled
    const set = new Set();
    KB.tree.forEach(n => n.matchedTasks.forEach(t => set.add(t)), node);
    const list = [...set];
    if (!list.length) {
        // fall back to the shown tasks so play mode always works
        KB.shownTasks().forEach(t => list.push(t));
    }
    if (!list.length) return;
    KB.sim.playList = KB.shuffled(list);
    KB.sim.onDisplay = 0;
    KB.sim.playMode = true;
    KB.sim.resize();
    KB.sim.showCard();
    KB.sim.startPlaying();
};

KB.sim.exitPlay = function () {
    KB.sim.stopPlaying();
    speechSynthesis.cancel();
    KB.sim.playMode = false;
    KB.sim.resize();
    KB.sim.draw();
};

KB.sim.showCard = async function () {
    const task = KB.sim.playList[KB.sim.onDisplay];
    if (!task) return;
    KB.sim.img = null;
    const url = await KB.store.imageURL(task.backgroundImageName);
    if (url) {
        const img = new Image();
        img.onload = () => { KB.sim.img = img; KB.sim.draw(); };
        img.src = url;
    }
    KB.sim.draw();
};

KB.sim.advance = function (dir) {
    const n = KB.sim.playList.length;
    KB.sim.onDisplay = ((KB.sim.onDisplay + dir) % n + n) % n;
    KB.sim.showCard();
};

const simDelay = ms => new Promise(r => setTimeout(r, ms));

// self-rescheduling async loop: image → 900ms → speak A → 2s → speak B → advance
KB.sim.startPlaying = async function () {
    if (KB.sim.playing) return;
    KB.sim.playing = true;
    const token = ++KB.sim.playToken;
    KB.sim.draw();
    while (KB.sim.playing && KB.sim.playToken === token) {
        const task = KB.sim.playList[KB.sim.onDisplay];
        if (!task) break;
        await simDelay(900);
        if (!KB.sim.playing || KB.sim.playToken !== token) break;
        const first = KB.sim.drawItalian ? ['italian', 'it-IT'] : ['german', 'de-DE'];
        const second = KB.sim.drawItalian ? ['german', 'de-DE'] : ['italian', 'it-IT'];
        await KB.audio.speakAsync(KB.txt(task, first[0]), first[1]);
        await simDelay(2000);
        if (!KB.sim.playing || KB.sim.playToken !== token) break;
        if ((first[0] === 'italian' && KB.sim.drawGerman) || (first[0] === 'german' && KB.sim.drawItalian)) {
            await KB.audio.speakAsync(KB.txt(task, second[0]), second[1]);
        }
        await simDelay(1200);
        if (!KB.sim.playing || KB.sim.playToken !== token) break;
        KB.sim.advance(1);
    }
};

KB.sim.stopPlaying = function () {
    KB.sim.playing = false;
    KB.sim.playToken++;
    speechSynthesis.cancel();
    if (KB.sim.open) KB.sim.draw();
};

KB.sim.handleKey = function (e) {
    if (!KB.sim.open) return false;
    if (e.key === 'Escape') {
        if (KB.sim.playMode) KB.sim.exitPlay();
        else if (KB.sim.helpNode) { KB.sim.helpNode = null; KB.sim.draw(); }
        else KB.sim.close();
        return true;
    }
    if (e.key === 'ArrowUp' && !KB.sim.playMode) { KB.sim.upOneLevel(); return true; }
    return true;   // swallow everything else while the simulator is open
};
