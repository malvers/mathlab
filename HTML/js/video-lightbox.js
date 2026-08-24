/* Shared video lightbox — plays a YouTube video in a frame over the current page instead of tearing
   the visitor away into a new tab. Used by the lab demo buttons (js/branding.js) and by the SVP
   pages. Brings its own styles, so a page needs nothing but this one file:

     <script src="js/video-lightbox.js"></script>          (subdirs: ../js/video-lightbox.js)
     VideoLightbox.open('https://youtu.be/XXXXXXXXXXX');

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
        '  letter-spacing: 0.06em; color: rgba(255, 255, 255, 0.72); text-decoration: none; }'
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

    const VideoLightbox = {
        /* youtu.be/ID, watch?v=ID and /embed/ID all boil down to the same eleven characters. */
        videoId(url) {
            const m = String(url).match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{6,})/);
            return m ? m[1] : null;
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
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                         '?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3';
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
