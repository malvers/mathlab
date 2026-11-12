/* Shared video lightbox — plays a YouTube video in a frame over the current page instead of tearing
   the visitor away into a new tab. Used by the lab demo buttons (js/branding.js) and by the SVP
   pages. Brings its own styles, so a page needs nothing but this one file:

     <script src="js/video-lightbox.js"></script>          (subdirs: ../js/video-lightbox.js)
     VideoLightbox.open('https://youtu.be/XXXXXXXXXXX');
     VideoLightbox.mini('https://youtu.be/XXXXXXXXXXX');    a small player in a corner instead (the decks' J key)

   youtube-nocookie keeps the player from setting cookies before playback. */
(function () {
    'use strict';

    const STYLE_ID = 'video-lightbox-styles';

    /* Class names stay lab-video-* — they were born in the lab branding and are referenced there. */
    const CSS = [
        '.lab-video-wrap { position: fixed; inset: 0; z-index: 100000; display: flex;',
        '  align-items: center; justify-content: center; padding: 4vmin;',
        '  background: rgba(8, 20, 42, 0.86); backdrop-filter: blur(3px); }',
        '.lab-video-box { position: relative; width: min(1100px, 92vw); max-height: 92vh;',
        '  display: flex; flex-direction: column; gap: 8px; }',
        '.lab-video-frame { position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 82vh;',
        '  border-radius: 12px; overflow: hidden; background: #000;',
        '  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.6); }',
        '.lab-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }',
        '.lab-video-close { position: absolute; top: -14px; right: -10px; z-index: 2; width: 34px;',
        '  height: 34px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.35);',
        '  background: rgb(14, 36, 78); color: #fff; font-size: 15px; line-height: 1; cursor: pointer; }',
        '.lab-video-close:hover { background: rgb(176, 36, 24); border-color: rgb(176, 36, 24); }',
        '.lab-video-out { align-self: flex-end; font-family: \'Orbitron\', sans-serif; font-size: 0.68rem;',
        '  letter-spacing: 0.06em; color: rgba(255, 255, 255, 0.72); text-decoration: none; }',
        /* the small player in a corner (mini): 200 x 200 px is the least YouTube allows - never scaled down */
        '.lab-video-mini { position: fixed; top: 16px; right: 16px; z-index: 100000; width: 200px; height: 200px;',
        '  border-radius: 10px; background: #000; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);',
        '  outline: 1px solid rgba(255, 255, 255, 0.25); }',
        '.lab-video-mini iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: 10px; }',
        '.lab-video-mini .lab-video-close { top: -11px; right: -11px; width: 26px; height: 26px; font-size: 12px; }'
    ].join('\n');

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const st = document.createElement('style');
        st.id = STYLE_ID;
        st.textContent = CSS;
        (document.head || document.documentElement).appendChild(st);
    }

    let escHandler = null;
    let returnFocus = null;
    let miniNow = null;                    /* the small player in its corner, if one is open */

    const VideoLightbox = {
        /* youtu.be/ID, watch?v=ID and /embed/ID all boil down to the same eleven characters. */
        videoId(url) {
            const m = String(url).match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{6,})/);
            return m ? m[1] : null;
        },

        /* Sekunden aus einem YouTube-Zeitstempel: "983", "983s" und "16m23s"
           kommen alle vor, je nachdem wie der Link entstanden ist. */
        seconds(wert) {
            const t = String(wert || '').trim();
            if (!t) return null;
            if (/^\d+$/.test(t)) return Number(t);
            const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
            if (!m || !(m[1] || m[2] || m[3])) return null;
            return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
        },

        /* Anfang und Ende aus dem Link. Ohne das begann jeder Link wieder bei
           null - fuer eine Stelle mitten in einem 22-Minuten-Film unbrauchbar
           (Doc, 08.09.2026). "t" ist die Form, die YouTubes eigenes Teilen-Menue
           erzeugt, "start"/"end" die der Einbettung. */
        spanne(url) {
            const q = String(url);
            const hol = (name) => {
                const m = q.match(new RegExp('[?&#]' + name + '=([^&#]+)'));
                return m ? VideoLightbox.seconds(decodeURIComponent(m[1])) : null;
            };
            return { start: hol('t') ?? hol('start'), end: hol('end') };
        },

        close() {
            const wrap = document.querySelector('.lab-video-wrap');
            if (!wrap) return;
            wrap.remove();                 /* removing the iframe stops playback */
            if (escHandler) document.removeEventListener('keydown', escHandler, true);
            escHandler = null;
            /* back to whatever opened the player, so keyboard users do not land at page top */
            const back = returnFocus;
            returnFocus = null;
            if (back && back.focus) back.focus();
        },

        /* Anything that is not a YouTube link (a SharePoint share, say) simply opens in a new tab. */
        open(url, opts) {
            const id = this.videoId(url);
            if (!id) { window.open(url, '_blank', 'noopener'); return false; }
            const title = (opts && opts.title) || 'Video';
            ensureStyles();
            this.close();
            returnFocus = document.activeElement;

            const wrap = document.createElement('div');
            wrap.className = 'lab-video-wrap';
            wrap.setAttribute('role', 'dialog');
            wrap.setAttribute('aria-modal', 'true');
            wrap.setAttribute('aria-label', title);

            const box = document.createElement('div');
            box.className = 'lab-video-box';

            const close = document.createElement('button');
            close.type = 'button';
            close.className = 'lab-video-close';
            close.textContent = '✕';
            close.title = 'Schließen (Esc)';
            close.setAttribute('aria-label', 'Video schließen');
            close.addEventListener('click', () => this.close());
            box.appendChild(close);

            const frame = document.createElement('div');
            frame.className = 'lab-video-frame';
            const iframe = document.createElement('iframe');
            /* Runs straight away and without a control bar; a click on the picture pauses and
               resumes, Esc closes. */
            const sp = VideoLightbox.spanne(url);
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                         '?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' +
                         (sp.start ? '&start=' + sp.start : '') +
                         (sp.end ? '&end=' + sp.end : '');
            iframe.title = title;
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            frame.appendChild(iframe);
            box.appendChild(frame);

            const out = document.createElement('a');
            out.className = 'lab-video-out';
            out.href = url;
            out.target = '_blank';
            out.rel = 'noopener';
            out.textContent = 'Auf YouTube öffnen ↗';
            box.appendChild(out);

            wrap.appendChild(box);
            /* the page underneath must not react to clicks meant for the player */
            ['click', 'mousedown', 'mouseup', 'pointerdown', 'wheel', 'touchstart']
                .forEach(ev => wrap.addEventListener(ev, e => e.stopPropagation()));
            wrap.addEventListener('click', (e) => { if (e.target === wrap) this.close(); });
            document.body.appendChild(wrap);

            escHandler = (e) => {
                if (e.key !== 'Escape') return;
                e.stopPropagation();       /* labs often listen for Escape themselves */
                this.close();
            };
            document.addEventListener('keydown', escHandler, true);
            close.focus();                 /* Esc and Tab start inside the dialog, not in the page */
            return true;
        },

        /* A small player in a corner instead of the big frame (Doc, 12.11.2026, the decks' key J: "ganz kleines
           YouTube-Fensterchen"): no dimming, the focus stays where it is, the page underneath keeps its keys and
           clicks. 200 x 200 px, the smallest player YouTube allows. One at a time: mini() again replaces it.
           It talks to the player through YouTube's postMessage interface (enablejsapi=1), so volume, pause and the
           end are at hand without loading the IFrame API script.

             const p = VideoLightbox.mini(url, { title, place(box), onend(p), onclose() });
             p.volume(20); p.pause(); p.play(); p.fade(400); p.close();

           place(box) positions the box (again on every resize) - without it the box sits top right. onend comes
           when the video has played to its end, onclose whenever the box goes, by the x or by close()/fade(). */
        mini(url, opts) {
            const id = this.videoId(url);
            if (!id) return null;
            const o = opts || {};
            ensureStyles();
            this.closeMini();

            const box = document.createElement('div');
            box.className = 'lab-video-mini';
            box.setAttribute('role', 'region');
            box.setAttribute('aria-label', o.title || 'Video');
            const iframe = document.createElement('iframe');
            const sp = VideoLightbox.spanne(url);
            const origin = /^https?:$/.test(location.protocol) ? '&origin=' + encodeURIComponent(location.origin) : '';
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                         '?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' +
                         '&disablekb=1&fs=0&enablejsapi=1' + origin +
                         (sp.start ? '&start=' + sp.start : '') +
                         (sp.end ? '&end=' + sp.end : '');
            iframe.title = o.title || 'Video';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            iframe.tabIndex = -1;
            box.appendChild(iframe);
            const x = document.createElement('button');
            x.type = 'button';
            x.className = 'lab-video-close';
            x.textContent = '✕';
            x.title = 'Schließen';
            x.setAttribute('aria-label', 'Video schließen');
            box.appendChild(x);
            /* clicks on the box stay with it: the page underneath must not turn a page or pick an element */
            ['click', 'mousedown', 'mouseup', 'pointerdown', 'wheel', 'touchstart']
                .forEach(ev => box.addEventListener(ev, e => e.stopPropagation()));
            document.body.appendChild(box);
            const place = () => { if (o.place) o.place(box); };
            place();
            addEventListener('resize', place);

            /* the player answers only once it has heard "listening"; until then commands wait in a queue */
            let ready = false, state = -1, vol = 100, ended = false, fading = 0;
            const queue = [];
            const post = (m) => {
                if (iframe.contentWindow) iframe.contentWindow.postMessage(JSON.stringify(Object.assign(m, { id: 1, channel: 'widget' })), '*');
            };
            const command = (func, args) => {
                const m = { event: 'command', func: func, args: args || [] };
                if (ready) post(m); else queue.push(m);
            };
            const hello = setInterval(() => post({ event: 'listening' }), 250);
            iframe.addEventListener('load', () => post({ event: 'listening' }));
            const onMessage = (e) => {
                if (e.source !== iframe.contentWindow) return;
                let d = e.data;
                if (typeof d === 'string') { try { d = JSON.parse(d); } catch (err) { return; } }
                if (!d || !d.event) return;
                if (!ready) { ready = true; clearInterval(hello); queue.splice(0).forEach(post); }
                if (d.event === 'onStateChange') state = d.info;
                else if (d.info && typeof d.info === 'object' && 'playerState' in d.info) state = d.info.playerState;
                if (state === 0 && !ended) { ended = true; if (o.onend) o.onend(handle); }
            };
            addEventListener('message', onMessage);
            /* a click into the player would take the keyboard away from the page: hand it straight back */
            const keepKeys = () => setTimeout(() => { if (document.activeElement === iframe) iframe.blur(); }, 0);
            addEventListener('blur', keepKeys);

            const handle = {
                box: box,
                state: () => state,
                volume(v) { vol = Math.max(0, Math.min(100, Math.round(v))); command('setVolume', [vol]); },
                pause() { command('pauseVideo'); },
                play() { command('playVideo'); },
                /* down to silence in ms, then gone */
                fade(ms) {
                    if (fading || miniNow !== handle) return;
                    const from = vol, steps = Math.max(1, Math.round((ms || 400) / 40));
                    let i = 0;
                    fading = setInterval(() => {
                        i++;
                        handle.volume(from * (1 - i / steps));
                        if (i >= steps) handle.close();
                    }, 40);
                },
                close() {
                    if (miniNow !== handle) return;
                    miniNow = null;
                    clearInterval(hello); clearInterval(fading);
                    removeEventListener('message', onMessage);
                    removeEventListener('resize', place);
                    removeEventListener('blur', keepKeys);
                    box.remove();          /* removing the iframe stops playback */
                    if (o.onclose) o.onclose();
                }
            };
            x.addEventListener('click', () => handle.close());
            miniNow = handle;
            return handle;
        },

        closeMini() { if (miniNow) miniNow.close(); },

        /* Turns a plain link into a lightbox trigger: Cmd-/middle-click still open YouTube. */
        wireLink(a, opts) {
            if (!a || a.dataset.videoLightbox) return;
            a.dataset.videoLightbox = '1';
            a.addEventListener('click', (e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();
                this.open(a.href, opts || { title: a.title || a.getAttribute('aria-label') || 'Video' });
            });
        }
    };

    window.VideoLightbox = VideoLightbox;
})();
