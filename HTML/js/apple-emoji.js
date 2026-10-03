/* apple-emoji.js — every emoji on the page as Apple's colourful one, the same picture on Windows, Android and the Mac.
   The images come from the set the VGP, the Vorrechnen lab and the buzzer use too (iamcal/emoji-data img-apple-160 on
   jsdelivr). Windows has no flag emoji at all - it writes "DE", "ES" instead - so the flags come from the same set.
   Doc, 03.10.2026, on docalvers.de: "die ganzen Emojis ... dermaßen grauenhaft", "keine Flaggen oben".

   Include it once; it converts the page on load and everything scripts add later (tiles, flybys, the language button).
   Opt out for a subtree with data-no-apple-emoji. Plain text signs without the emoji selector (©, ↔, ▶, ✕) stay text. */
(function () {
    'use strict';
    if (window.AppleEmoji) return;

    const BASE = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/';
    const VS16 = '\uFE0F';
    const ZWJ = '\u200D';

    // flags (two regional indicators), keycaps, and pictographs with their selector, skin tone and ZWJ joins
    const PART = '\\p{Extended_Pictographic}(?:\\uFE0F|\\p{Emoji_Modifier})*';
    const RE = new RegExp(
        '\\p{Regional_Indicator}{2}' +
        '|[#*0-9]\\uFE0F?\\u20E3' +
        '|' + PART + '(?:\\u200D' + PART + ')*',
        'gu'
    );
    const PRESENTATION = /\p{Emoji_Presentation}/u;
    const PICTO = /\p{Extended_Pictographic}/u;
    const MODIFIER = /\p{Emoji_Modifier}/u;

    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE', 'TITLE']);

    // A lone text-style sign (⚖ without U+FE0F, ©, ↔) is typography, not an emoji - leave it.
    function isEmoji(seq) {
        if (/\p{Regional_Indicator}/u.test(seq) || seq.includes('\u20E3') || seq.includes(ZWJ)) return true;
        return seq.includes(VS16) || PRESENTATION.test(seq) || MODIFIER.test(seq);
    }

    // iamcal names a file after the fully-qualified sequence: lower-case hex, at least 4 digits, joined by "-";
    // U+FE0F after a text-default pictograph, none after one that is an emoji by default.
    function fileName(seq) {
        const cps = Array.from(seq);
        const out = [];
        for (let i = 0; i < cps.length; i++) {
            const c = cps[i];
            if (c === VS16) continue;
            out.push(c);
            const next = cps[i + 1];
            const needsVs = PICTO.test(c) && !PRESENTATION.test(c) && !(next && MODIFIER.test(next));
            const keycapBase = /[#*0-9]/.test(c) && cps.includes('\u20E3');
            if (needsVs || keycapBase) out.push(VS16);
        }
        return out.map((c) => c.codePointAt(0).toString(16).padStart(4, '0')).join('-');
    }

    function makeImg(seq, lineNormal) {
        const wrap = document.createElement('span');
        wrap.className = lineNormal ? 'apple-emoji ae-normal' : 'apple-emoji';
        const img = document.createElement('img');
        const name = fileName(seq);
        img.alt = seq;
        img.draggable = false;
        img.decoding = 'async';
        img.src = BASE + name + '.png';
        img.onerror = () => {
            // some sequences are stored without U+FE0F - one more try, then the glyph again
            const bare = name.replace(/-fe0f/g, '');
            if (bare !== name && !img.dataset.retry) {
                img.dataset.retry = '1';
                img.src = BASE + bare + '.png';
                return;
            }
            const text = document.createElement('span');   // marked, or the observer would convert it again
            text.setAttribute('data-no-apple-emoji', '');
            text.textContent = seq;
            wrap.replaceWith(text);
        };
        wrap.appendChild(img);
        return wrap;
    }

    function skipped(el) {
        for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
            if (SKIP.has(e.tagName) || e.isContentEditable || e.hasAttribute('data-no-apple-emoji')) return true;
            if (e.namespaceURI === 'http://www.w3.org/2000/svg') return true;
            if (e.classList.contains('apple-emoji')) return true;
        }
        return false;
    }

    function convertText(node) {
        const text = node.nodeValue;
        if (!text || !PICTO.test(text) && !/\p{Regional_Indicator}/u.test(text) && !text.includes('\u20E3')) return;
        if (!node.parentElement || skipped(node.parentElement)) return;
        const lineNormal = getComputedStyle(node.parentElement).lineHeight === 'normal';
        RE.lastIndex = 0;
        let m, last = 0, frag = null;
        while ((m = RE.exec(text))) {
            if (!isEmoji(m[0])) continue;
            frag = frag || document.createDocumentFragment();
            if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
            frag.appendChild(makeImg(m[0], lineNormal));
            last = m.index + m[0].length;
        }
        if (!frag) return;
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.replaceWith(frag);
    }

    function convert(root) {
        if (!root) return;
        if (root.nodeType === 3) return convertText(root);
        if (root.nodeType !== 1 && root.nodeType !== 11) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(convertText);
    }

    // Placed where Apple's glyph paints (0.86em above the baseline, 0.14em below). Apple's font box reaches 1em up
    // and 0.31em down, and at line-height: normal it sets the line's height (70px glyph -> 92px row on the index
    // tiles) - the margins of .ae-normal give the picture that same box, vertical-align moves its margin edge there.
    // Measured on the Mac, 03.10.2026.
    const style = document.createElement('style');
    style.textContent =
        '.apple-emoji>img{display:inline-block;width:1em;height:1em;vertical-align:-0.14em;' +
        'object-fit:contain;-webkit-user-drag:none;user-select:none;}' +
        '.apple-emoji.ae-normal>img{margin:0.14em 0 0.17em;vertical-align:-0.31em;}';
    document.head.appendChild(style);

    function start() {
        convert(document.body);
        new MutationObserver((records) => {
            for (const r of records) {
                if (r.type === 'characterData') convertText(r.target);
                else r.addedNodes.forEach(convert);
            }
        }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    window.AppleEmoji = { convert, fileName, url: (seq) => BASE + fileName(seq) + '.png' };
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
