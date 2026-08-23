/**
 * Solita Visemes — real-time photoreal lip sync without any neural net at runtime.
 *
 * Instead of generating a mouth, we composite one. A sprite atlas holds Solita's real
 * mouth shapes, harvested from existing footage and sorted by how far the mouth opens
 * and whether it stands wide or rounded. At runtime we pick the matching sprite and
 * draw it onto a looping idle clip, using a per-frame rectangle that tracks her head.
 *
 * Two drivers:
 *   attachAudio(el)  live analysis of real audio — loudness drives openness,
 *                    spectral centroid drives wide-vs-rounded.
 *   speak(text)      browser speech synthesis, driven from the text itself, since
 *                    synthesized speech cannot be routed through an analyser.
 *
 * Everything runs in the viewer's browser: no server, no per-answer cost, no wait.
 */
(function (global) {
    'use strict';

    var SRC_W = 720;   // coordinate space the mouth rectangles were measured in

    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    function SolitaVisemes(opts) {
        this.canvas = opts.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.base = opts.basePath || 'resources/solita-live/';
        this.overlay = true;          // false shows the bare idle loop, for A/B
        this.openness = 0;            // smoothed, 0..1
        this.roundness = 0.5;         // 0 = wide, 1 = rounded
        this.driver = null;
        this.running = false;
    }

    SolitaVisemes.prototype.load = function () {
        var self = this;
        var get = function (f) { return fetch(self.base + f).then(function (r) { return r.json(); }); };
        return Promise.all([
            get('mouths.json'),
            get('boxes.json'),
            new Promise(function (res, rej) {
                var im = new Image();
                im.onload = function () { res(im); };
                im.onerror = rej;
                im.src = self.base + 'mouths.png';
            }),
            new Promise(function (res, rej) {
                var v = document.createElement('video');
                v.src = self.base + 'idle.mp4';
                v.loop = true; v.muted = true; v.playsInline = true;
                v.oncanplay = function () { res(v); };
                v.onerror = rej;
            })
        ]).then(function (r) {
            self.atlas = r[0];
            self.boxes = r[1];
            self.sheet = r[2];
            self.video = r[3];

            // Split the atlas into a wide and a rounded family, each sorted by openness,
            // and rescale openness to 0..1 so audio levels map onto the full range.
            var s = self.atlas.sprites.map(function (e, i) { return { i: i, e: e }; });
            var os = s.map(function (x) { return x.e.open; });
            var lo = Math.min.apply(null, os), hi = Math.max.apply(null, os);
            s.forEach(function (x) { x.open = (x.e.open - lo) / Math.max(hi - lo, 1e-6); });
            var by = function (round) {
                return s.filter(function (x) { return /_round$/.test(x.e.name) === round; })
                        .sort(function (a, b) { return a.open - b.open; });
            };
            self.wide = by(false);
            self.round = by(true);
            return self;
        });
    };

    /** Nearest sprite by openness within the family the roundness picks. */
    SolitaVisemes.prototype.pick = function () {
        var fam = this.roundness > 0.5 ? this.round : this.wide;
        if (!fam.length) fam = this.wide.length ? this.wide : this.round;
        var want = this.openness, best = fam[0], bd = 1e9;
        for (var i = 0; i < fam.length; i++) {
            var d = Math.abs(fam[i].open - want);
            if (d < bd) { bd = d; best = fam[i]; }
        }
        return best;
    };

    SolitaVisemes.prototype.frame = function () {
        var c = this.canvas, ctx = this.ctx, v = this.video;
        if (!v || !v.videoWidth) return;

        // Fit the square source into the canvas, preserving aspect.
        var side = Math.min(c.width, c.height);
        var ox = (c.width - side) / 2, oy = (c.height - side) / 2;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(v, ox, oy, side, side);

        if (!this.overlay) return;

        var idx = Math.floor(v.currentTime * this.boxes.fps) % this.boxes.frames;
        var r = this.boxes.rects[idx];
        if (!r) return;
        var k = side / SRC_W;
        var sp = this.pick();
        var cw = this.atlas.cw, ch = this.atlas.ch;

        // Draw the sprite slightly larger than the measured rectangle so its feathered
        // edge lands on skin rather than on the lip line.
        var pad = 1.12;
        var dw = r[2] * k * pad, dh = r[3] * k * pad;
        var dx = ox + (r[0] + r[2] / 2) * k - dw / 2;
        var dy = oy + (r[1] + r[3] / 2) * k - dh / 2;
        ctx.drawImage(this.sheet, sp.i * cw, 0, cw, ch, dx, dy, dw, dh);
    };

    SolitaVisemes.prototype.start = function () {
        if (this.running) return;
        this.running = true;
        var self = this;
        this.video.play().catch(function () { });
        (function loop() {
            if (!self.running) return;
            if (self.driver) self.driver();
            self.frame();
            requestAnimationFrame(loop);
        })();
    };

    SolitaVisemes.prototype.stop = function () {
        this.running = false;
        if (this.video) this.video.pause();
    };

    SolitaVisemes.prototype.rest = function () {
        this.driver = null;
        this.openness = 0;
        this.roundness = 0.5;
    };

    /**
     * Drive the mouth from real audio. Loudness maps to how far the mouth opens;
     * the spectral centroid separates bright wide vowels from dark rounded ones.
     */
    SolitaVisemes.prototype.attachAudio = function (el) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!this._ac) {
            this._ac = new AC();
            this._src = this._ac.createMediaElementSource(el);
            this._an = this._ac.createAnalyser();
            this._an.fftSize = 1024;
            this._an.smoothingTimeConstant = 0.5;
            this._src.connect(this._an);
            this._an.connect(this._ac.destination);
        }
        if (this._ac.state === 'suspended') this._ac.resume();

        var an = this._an, self = this;
        var bins = new Uint8Array(an.frequencyBinCount);
        var time = new Uint8Array(an.fftSize);
        var nyq = this._ac.sampleRate / 2;

        this.driver = function () {
            an.getByteTimeDomainData(time);
            var sum = 0;
            for (var i = 0; i < time.length; i++) { var d = (time[i] - 128) / 128; sum += d * d; }
            var rms = Math.sqrt(sum / time.length);

            an.getByteFrequencyData(bins);
            var num = 0, den = 0;
            for (var j = 2; j < bins.length; j++) { num += j * bins[j]; den += bins[j]; }
            var centroid = den > 0 ? (num / den) * (nyq / bins.length) : 0;

            // Loudness is compressed: speech RMS rarely exceeds ~0.25, and the mouth
            // should already be wide well before that.
            var target = clamp(Math.pow(rms / 0.20, 0.75), 0, 1);
            // Attack fast, release slow — a mouth snaps open and closes lazily.
            var a = target > self.openness ? 0.45 : 0.18;
            self.openness += (target - self.openness) * a;

            var rnd = clamp((1500 - centroid) / 1100, 0, 1);
            self.roundness += (rnd - self.roundness) * 0.15;
        };
    };

    // Rough grapheme-to-mouth mapping for German, used when we only have text.
    var VOWEL = {
        a: [1.0, 0.15], e: [0.55, 0.1], i: [0.4, 0.05], o: [0.7, 0.95], u: [0.45, 1.0],
        'ä': [0.8, 0.15], 'ö': [0.6, 0.9], 'ü': [0.4, 1.0], y: [0.4, 0.9]
    };
    var CLOSED = /[bmp]/;

    /**
     * Speak text with the browser's own voice. Synthesized audio cannot be analysed,
     * so the mouth is driven from the letters, paced by the word-boundary events the
     * synthesizer emits.
     */
    SolitaVisemes.prototype.speak = function (text, opts) {
        opts = opts || {};
        if (!global.speechSynthesis) return Promise.reject(new Error('no speechSynthesis'));
        var self = this;
        speechSynthesis.cancel();

        var u = new SpeechSynthesisUtterance(text);
        u.lang = opts.lang || 'de-DE';
        u.rate = opts.rate || 1.0;
        var voices = speechSynthesis.getVoices().filter(function (v) { return /^de/.test(v.lang); });
        if (voices.length) u.voice = voices[0];

        var queue = null, qi = 0, qt = 0;

        // Turn one word into a small timed sequence of mouth targets.
        function planWord(w, ms) {
            var seq = [], letters = w.toLowerCase().split('');
            for (var i = 0; i < letters.length; i++) {
                var ch = letters[i];
                if (VOWEL[ch]) seq.push(VOWEL[ch]);
                else if (CLOSED.test(ch)) seq.push([0.0, 0.4]);
                else if (/[a-zß]/.test(ch)) seq.push([0.25, 0.35]);
            }
            if (!seq.length) seq = [[0.2, 0.4]];
            var per = Math.max(ms / seq.length, 55);
            return { seq: seq, per: per };
        }

        u.onboundary = function (e) {
            if (e.name && e.name !== 'word') return;
            var rest = text.slice(e.charIndex);
            var w = (rest.match(/^\S+/) || [''])[0];
            var p = planWord(w, Math.max(w.length * 78, 160));
            queue = p.seq; qi = 0; qt = performance.now(); self._per = p.per;
        };

        self.driver = function () {
            var tgt = [0, 0.5];
            if (queue) {
                var k = Math.floor((performance.now() - qt) / self._per);
                if (k >= queue.length) queue = null;
                else tgt = queue[k];
            }
            var a = tgt[0] > self.openness ? 0.4 : 0.16;
            self.openness += (tgt[0] - self.openness) * a;
            self.roundness += (tgt[1] - self.roundness) * 0.2;
        };

        return new Promise(function (res) {
            u.onend = function () { self.rest(); res(); };
            u.onerror = function () { self.rest(); res(); };
            speechSynthesis.speak(u);
        });
    };

    global.SolitaVisemes = {
        create: function (o) { return new SolitaVisemes(o); }
    };
})(window);
