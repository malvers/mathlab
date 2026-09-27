// Würfelspiel (wuerfelspiel.html), part 9 of 9: the 3D dice bridge, buildUI, resize, fonts and the boot.
// One of the classic scripts js/wuerfelspiel-*.js, split from the page's single inline block (27.09.2026,
// refactor audit). They share ONE global scope (top-level let/const/function), so the order of their
// <script> tags in wuerfelspiel.html matters: code that runs while the files load must not reach into a later
// file, and a callback that can fire in between (a resolved promise, a timer) must not either.

        // What the 3D die of player A or B has to show right now - read by Dice3D every frame
        window.DICE3D_SOURCE = key => {
            const m = model();
            const die = key === 'A' ? m.A : m.B;
            const st = dieShown(key, m, performance.now());
            const an = S.anim && S.anim.key === m.key ? S.anim : null;
            return {
                faces: die.faces,
                tints: die.faces.map(v => 'rgb(' + tintOf(key, m, v) + ')'),
                idx: (st.phase === 'roll' && an) ? (key === 'A' ? an.ia : an.ib) : st.idx,
                fin: an ? (key === 'A' ? an.ia : an.ib) : st.idx,
                rolling: st.phase === 'roll',
                p: st.p,
                anim: an ? an.t0 : 0
            };
        };

        // A tap on a die (not a drag) rolls, like a tap anywhere else on those stages
        window.DICE3D_TAP = () => {
            const vk = viewKey();
            if (vk === 'spiel' || vk === 'netze' || vk === 'zweistufig') rollDice();
        };

        /* -------------------------------------------------------------- Setup */
        function resizeCanvasToContainer() {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
        }

        function init() {
            resizeCanvasToContainer();
            render();
        }

        // Canvas text needs the fonts loaded - measured with a fallback font the TeX would sit wrong
        function fontsChanged() {
            texCache.clear();
            if (window.Dice3D && Dice3D.ok) Dice3D.refreshFaces();   // face numbers use KaTeX_Main too
            init();
        }

        buildUI();
        window.addEventListener('resize', init);
        if (window.ResizeObserver) {
            new ResizeObserver(() => init()).observe(container);
            new ResizeObserver(() => render()).observe(document.getElementById('math-coach-box'));
        }
        Promise.all(['20px KaTeX_Main', 'bold 20px KaTeX_Main', 'italic 20px KaTeX_Math', '400 20px Outfit',
            '600 20px Outfit', '700 20px Orbitron', '400 20px Orbitron'].map(f => document.fonts.load(f).catch(() => null)))
            .then(fontsChanged);
        document.fonts.ready.then(fontsChanged);
        // KaTeX arrives with defer: panel and coach box get their formulas then
        document.addEventListener('DOMContentLoaded', () => { buildUI(); render(); });
        window.addEventListener('load', () => { buildUI(); fontsChanged(); });
        init();
        dbg('Würfelspiel-Labor bereit');
