const DebugWindow = (() => {
    let debugEl = null;
    let statusEl = null;      // pinned live-status block (below header, above the scrolling log)
    const statusLines = {};   // key → text; live readouts that OVERWRITE (not append) — e.g. the motion gate
    let logs = [];
    let collapsed = false;
    let prevHeight = '300px';
    let prevLeft = '';
    let prevTop = '';
    let colLeft = '';  // collapsed-pill position (persisted); 'auto'/'' → snap bottom-right
    let colTop = '';
    let fontSize = 11; // px — persisted; user-adjustable via +/- buttons
    const MIN_FONT = 8;
    const MAX_FONT = 28;
    const MAX_LOGS = 50;

    function isProduction() {
        const host = window.location.hostname;
        return host === 'docalvers.de' || host === 'www.docalvers.de';
    }

    function init() {
        if (debugEl) return;
        // Skip debug window on production unless ?debug is set — BUT always allow it inside the
        // native Capacitor app (it loads the live docalvers.de URL, yet is our test build).
        const isNativeApp = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
        if (isProduction() && !isNativeApp && !new URLSearchParams(window.location.search).has('debug')) {
            return;
        }

        // Restore state from localStorage
        let savedState = {};
        try {
            collapsed = localStorage.getItem('debug-window-collapsed') === '1';
            const s = localStorage.getItem('debug-window-state');
            if (s) savedState = JSON.parse(s);
            if (savedState.prevHeight) prevHeight = savedState.prevHeight;
            if (savedState.prevLeft) prevLeft = savedState.prevLeft;
            if (savedState.prevTop) prevTop = savedState.prevTop;
            if (savedState.colLeft) colLeft = savedState.colLeft;
            if (savedState.colTop) colTop = savedState.colTop;
            const savedFont = parseFloat(localStorage.getItem('debug-window-fontsize'));
            if (Number.isFinite(savedFont) && savedFont >= MIN_FONT && savedFont <= MAX_FONT) {
                fontSize = savedFont;
            }
        } catch (_) {}

        debugEl = document.createElement('div');
        debugEl.id = 'central-debug-window';

        // Position/size: collapsed → bottom-right; expanded → saved position or default bottom-right
        const w = savedState.width || '520px';
        const h = collapsed ? '40px' : (savedState.height || '500px');
        let positionStyle;
        if (collapsed) {
            positionStyle = (colLeft && colLeft !== 'auto')
                ? `left: ${colLeft}; top: ${colTop}; right: auto; bottom: auto;`   // restore moved collapsed pill
                : `left: auto; top: auto; right: 20px; bottom: 20px;`;
        } else if (savedState.left && savedState.left !== 'auto') {
            positionStyle = `left: ${savedState.left}; top: ${savedState.top}; right: auto; bottom: auto;`;
        } else {
            positionStyle = `right: 20px; bottom: 20px;`;
        }

        debugEl.style.cssText = `
            position: fixed;
            ${positionStyle}
            width: ${collapsed ? '50px' : w};
            height: ${h};
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid ${collapsed ? '#444444' : '#6BA043'};
            color: ${collapsed ? '#444444' : '#6BA043'};
            font-family: Arial, sans-serif;
            font-size: 11px;
            padding: ${collapsed ? '0' : '8px'};
            border-radius: 6px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            justify-content: ${collapsed ? 'center' : 'flex-start'};
            align-items: ${collapsed ? 'center' : 'stretch'};
            box-shadow: 0 0 8px rgba(107, 160, 67, 0.15);
            resize: none;
            overflow: hidden;
            transition: height 0.25s ease, width 0.25s ease;
            touch-action: none;
        `;

        const header = document.createElement('div');
        header.id = 'debug-header';
        header.style.cssText = `
            display: flex;
            justify-content: ${collapsed ? 'center' : 'flex-start'};
            align-items: center;
            margin-bottom: ${collapsed ? '0' : '8px'};
            padding-bottom: ${collapsed ? '0' : '6px'};
            border-bottom: ${collapsed ? 'none' : '1px solid rgba(107, 160, 67, 0.3)'};
            cursor: move;
            user-select: none;
            touch-action: none;
        `;

        const title = document.createElement('span');
        // Header shows the deploy/build stamp instead of a static label, so you can tell at a glance whether
        // your latest change is live (Doc 2026-06-30: build belongs at the top of the debug window, "b: …").
        //
        // It must reflect the NEWEST change across ALL loaded modules — if a single JS/CSS file changed by
        // even one letter, the stamp must jump (Doc 2026-07-01: "da MUSS der aktuelle Build stehen … in
        // ALLEN Modulen"). On the DEPLOYED site every file shares the one deploy time, so document.lastModified
        // (the served HTML) already IS the build. But in LOCAL dev you routinely edit a single module without
        // touching the lab's HTML, and its date would freeze → so on localhost we take the max Last-Modified
        // across every same-origin <script src> + <link stylesheet> this page loaded. Central here → every lab
        // that uses DebugWindow gets it automatically.
        const p2 = (n) => String(n).padStart(2, '0');
        const setStamp = (d) => {
            title.textContent = (d && !isNaN(d.getTime()))
                ? '🐛 B: ' + p2(d.getDate()) + '.' + p2(d.getMonth() + 1) + '. '
                  + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds())
                : '🐛 B: ' + (document.lastModified || '?');
        };
        setStamp(new Date(document.lastModified)); // instant provisional = the served HTML's own date
        if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
            (async () => {
                try {
                    const urls = new Set();
                    document.querySelectorAll('script[src], link[rel="stylesheet"][href]').forEach((el) => {
                        const raw = el.getAttribute('src') || el.getAttribute('href');
                        if (!raw) return;
                        try {
                            const abs = new URL(raw, document.baseURI);
                            if (abs.origin === location.origin) { abs.search = ''; urls.add(abs.href); } // drop ?v=
                        } catch (_) { /* skip an unparseable src */ }
                    });
                    let newest = new Date(document.lastModified).getTime() || 0;
                    await Promise.all([...urls].map(async (u) => {
                        try {
                            const r = await fetch(u, { method: 'HEAD', cache: 'no-store' });
                            const lm = r.headers.get('last-modified');
                            const t = lm ? new Date(lm).getTime() : NaN;
                            if (!isNaN(t)) newest = Math.max(newest, t);
                        } catch (_) { /* one module failing must never break the stamp */ }
                    }));
                    if (newest) setStamp(new Date(newest));
                } catch (_) { /* keep the provisional stamp */ }
            })();
        }
        title.style.display = collapsed ? 'none' : 'block';
        title.style.marginRight = '8px';
        title.style.fontSize = '17px';   // build stamp deutlich größer (Doc 2026-07-02)
        title.style.fontWeight = '700';
        header.appendChild(title);

        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = `display: flex; gap: 4px;`;

        // Font-size minus button
        const btnFontMinus = document.createElement('button');
        btnFontMinus.textContent = 'A−';
        btnFontMinus.title = 'Schrift kleiner';
        btnFontMinus.style.cssText = `
            background: transparent;
            border: 1px solid #6BA043;
            color: #6BA043;
            width: 28px;
            height: 24px;
            cursor: pointer;
            font-family: monospace;
            font-size: 11px;
            padding: 0;
            border-radius: 3px;
            display: ${collapsed ? 'none' : 'block'};
        `;
        btnFontMinus.onclick = (e) => {
            e.stopPropagation();
            setFontSize(fontSize - 1);
        };
        btnGroup.appendChild(btnFontMinus);

        // Font-size plus button
        const btnFontPlus = document.createElement('button');
        btnFontPlus.textContent = 'A+';
        btnFontPlus.title = 'Schrift größer';
        btnFontPlus.style.cssText = `
            background: transparent;
            border: 1px solid #6BA043;
            color: #6BA043;
            width: 28px;
            height: 24px;
            cursor: pointer;
            font-family: monospace;
            font-size: 11px;
            padding: 0;
            border-radius: 3px;
            display: ${collapsed ? 'none' : 'block'};
        `;
        btnFontPlus.onclick = (e) => {
            e.stopPropagation();
            setFontSize(fontSize + 1);
        };
        btnGroup.appendChild(btnFontPlus);

        const btnCopy = document.createElement('button');
        btnCopy.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="10" rx="1"/><rect x="5" y="2" width="9" height="10" rx="1"/></svg>`;
        btnCopy.title = 'Copy to clipboard';
        btnCopy.style.cssText = `
            background: transparent;
            border: 1px solid #6BA043;
            color: #6BA043;
            width: 28px;
            height: 24px;
            cursor: pointer;
            padding: 4px;
            border-radius: 3px;
            display: ${collapsed ? 'none' : 'flex'};
            align-items: center;
            justify-content: center;
        `;
        btnCopy.onclick = (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(logs.join('\n')).then(() => {
                btnCopy.textContent = '✓';
                setTimeout(() => { btnCopy.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="9" height="10" rx="1"/><rect x="5" y="2" width="9" height="10" rx="1"/></svg>`; }, 1500);
            });
        };
        // copy sits LEFT, right after the title; a flexible gap then pushes A−/A+/C/minimize to the right,
        // so the destructive C (clear) is no longer glued next to copy (Doc 2026-06-20).
        header.appendChild(btnCopy);
        const headerSpacer = document.createElement('div');
        headerSpacer.style.cssText = `flex: 1 1 0;`;
        header.appendChild(headerSpacer);

        const btnClear = document.createElement('button');
        btnClear.textContent = 'C';
        btnClear.title = 'Clear logs';
        btnClear.style.cssText = `
            background: transparent;
            border: 1px solid rgb(176, 36, 24);
            color: rgb(176, 36, 24);
            width: 28px;
            height: 24px;
            cursor: pointer;
            font-family: monospace;
            font-size: 12px;
            padding: 0;
            border-radius: 3px;
            margin-left: 12px;
            display: ${collapsed ? 'none' : 'block'};
        `;
        btnClear.onclick = (e) => {
            e.stopPropagation();
            clear();
        };
        btnGroup.appendChild(btnClear);

        const btnCollapse = document.createElement('button');
        btnCollapse.id = 'debug-collapse-btn';
        btnCollapse.textContent = collapsed ? '▲' : '▼';
        btnCollapse.title = 'Collapse/Expand';
        btnCollapse.style.cssText = `
            background: transparent;
            border: 1px solid ${collapsed ? '#444444' : '#6BA043'};
            color: ${collapsed ? '#444444' : '#6BA043'};
            width: 28px;
            height: 24px;
            cursor: pointer;
            font-family: monospace;
            font-size: 11px;
            padding: 0;
            border-radius: 3px;
        `;
        btnCollapse.onclick = (e) => {
            e.stopPropagation();
            toggle();
        };
        header.appendChild(btnGroup);
        // second flexible spacer → equal flex on both sides centres the A−/A+/C group between copy and
        // minimize, responsive to the window width; minimize stays at the far right.
        const headerSpacer2 = document.createElement('div');
        headerSpacer2.style.cssText = `flex: 1 1 0;`;
        header.appendChild(headerSpacer2);
        header.appendChild(btnCollapse);

        const content = document.createElement('div');
        content.id = 'debug-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
            line-height: 1.4;
            font-size: ${fontSize}px;
            display: ${collapsed ? 'none' : 'block'};
        `;

        // Pinned live-status block: single lines that OVERWRITE per key (motion gate, speed source, …),
        // so a high-frequency readout doesn't flood the scrolling log. Sits below the header, above the log.
        statusEl = document.createElement('div');
        statusEl.id = 'debug-status';
        statusEl.style.cssText = `
            flex: 0 0 auto;
            white-space: pre-wrap;
            word-break: break-all;
            line-height: 1.4;
            font-size: ${fontSize}px;
            color: #9ec36a;
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(107, 160, 67, 0.3);
            display: none;
        `;

        debugEl.style.position = 'fixed';
        debugEl.appendChild(header);
        debugEl.appendChild(statusEl);
        debugEl.appendChild(content);
        document.body.appendChild(debugEl);
        renderStatus();

        // Create 8 resize handles (4 edges + 4 corners). Hidden when collapsed.
        const EDGE_THICKNESS = 6;
        const CORNER_SIZE = 14;
        const handleDefs = [
            { dir: 'n',  cursor: 'ns-resize',   style: `top:0; left:${CORNER_SIZE}px; right:${CORNER_SIZE}px; height:${EDGE_THICKNESS}px;` },
            { dir: 's',  cursor: 'ns-resize',   style: `bottom:0; left:${CORNER_SIZE}px; right:${CORNER_SIZE}px; height:${EDGE_THICKNESS}px;` },
            { dir: 'e',  cursor: 'ew-resize',   style: `right:0; top:${CORNER_SIZE}px; bottom:${CORNER_SIZE}px; width:${EDGE_THICKNESS}px;` },
            { dir: 'w',  cursor: 'ew-resize',   style: `left:0; top:${CORNER_SIZE}px; bottom:${CORNER_SIZE}px; width:${EDGE_THICKNESS}px;` },
            { dir: 'ne', cursor: 'nesw-resize', style: `top:0; right:0; width:${CORNER_SIZE}px; height:${CORNER_SIZE}px;` },
            { dir: 'nw', cursor: 'nwse-resize', style: `top:0; left:0; width:${CORNER_SIZE}px; height:${CORNER_SIZE}px;` },
            { dir: 'se', cursor: 'nwse-resize', style: `bottom:0; right:0; width:${CORNER_SIZE}px; height:${CORNER_SIZE}px;` },
            { dir: 'sw', cursor: 'nesw-resize', style: `bottom:0; left:0; width:${CORNER_SIZE}px; height:${CORNER_SIZE}px;` }
        ];
        const resizeHandles = [];
        handleDefs.forEach(def => {
            const h = document.createElement('div');
            h.className = 'debug-resize-handle';
            h.dataset.dir = def.dir;
            h.style.cssText = `position:absolute; ${def.style} cursor:${def.cursor}; display:${collapsed ? 'none' : 'block'}; user-select:none; touch-action:none; z-index:5;`;
            // Visual indicator on the SE corner (bottom-right) so users see the resize grip
            if (def.dir === 'se') {
                h.style.display = collapsed ? 'none' : 'flex';
                h.style.alignItems = 'flex-end';
                h.style.justifyContent = 'flex-end';
                h.style.padding = '2px';
                h.style.boxSizing = 'border-box';
                h.innerHTML = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="color:inherit; pointer-events:none;">
                    <line x1="2" y1="14" x2="14" y2="2"/>
                    <line x1="6" y1="14" x2="14" y2="6"/>
                    <line x1="10" y1="14" x2="14" y2="10"/>
                </svg>`;
            }
            debugEl.appendChild(h);
            resizeHandles.push(h);
            makeResizable(h, debugEl, def.dir);
        });

        // Make draggable
        makeHeaderDraggable(header, debugEl);

        // Expose handles for toggle()
        debugEl._resizeHandles = resizeHandles;

        // Never leave the panel off-screen (restored/old position, smaller viewport, rotate).
        clampIntoView();
        window.addEventListener('resize', clampIntoView);
        window.addEventListener('orientationchange', clampIntoView);
    }

    function makeResizable(handle, element, dir) {
        let isResizing = false;
        let startX = 0, startY = 0;
        let startWidth = 0, startHeight = 0;
        let startLeft = 0, startTop = 0;
        const MIN_W = 150, MIN_H = 80;

        let activePointerId = null;

        handle.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            activePointerId = e.pointerId;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
            startLeft = element.offsetLeft;
            startTop = element.offsetTop;
            // Switch from bottom/right anchoring to absolute coords for stable resize
            element.style.left = startLeft + 'px';
            element.style.top = startTop + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
            // Capture pointer so we keep getting move events even when finger/cursor leaves the handle.
            try { handle.setPointerCapture(e.pointerId); } catch (_) {}
        });

        handle.addEventListener('pointermove', (e) => {
            if (!isResizing) return;
            if (activePointerId != null && e.pointerId !== activePointerId) return;
            e.preventDefault();
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // East/West (width)
            if (dir.indexOf('e') !== -1) {
                const newWidth = Math.max(MIN_W, startWidth + deltaX);
                element.style.width = newWidth + 'px';
            } else if (dir.indexOf('w') !== -1) {
                const newWidth = Math.max(MIN_W, startWidth - deltaX);
                element.style.width = newWidth + 'px';
                element.style.left = (startLeft + (startWidth - newWidth)) + 'px';
            }

            // North/South (height)
            if (dir.indexOf('s') !== -1) {
                const newHeight = Math.max(MIN_H, startHeight + deltaY);
                element.style.height = newHeight + 'px';
            } else if (dir.indexOf('n') !== -1) {
                const newHeight = Math.max(MIN_H, startHeight - deltaY);
                element.style.height = newHeight + 'px';
                element.style.top = (startTop + (startHeight - newHeight)) + 'px';
            }
        });

        const endResize = (e) => {
            if (activePointerId != null && e.pointerId !== activePointerId) return;
            if (isResizing) saveState();
            isResizing = false;
            try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
            activePointerId = null;
        };
        handle.addEventListener('pointerup', endResize);
        handle.addEventListener('pointercancel', endResize);
    }

    function makeHeaderDraggable(header, element) {
        let offsetX = 0, offsetY = 0;
        let isDragging = false;
        let activePointerId = null;

        // Read clientX/clientY from either a Pointer or a Touch event.
        const xyFrom = (e) => {
            if (typeof e.clientX === 'number') return { x: e.clientX, y: e.clientY };
            const t = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0];
            return t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 };
        };

        const startDrag = (e) => {
            const { x, y } = xyFrom(e);
            isDragging = true;
            activePointerId = (typeof e.pointerId === 'number') ? e.pointerId : null;
            offsetX = x - element.offsetLeft;
            offsetY = y - element.offsetTop;
            // Bind move/up to WINDOW so the events keep firing no matter where
            // the finger goes (no need for setPointerCapture, which is flaky
            // on touch). Pointer events first; touch events as fallback.
            window.addEventListener('pointermove', onMove, { passive: false });
            window.addEventListener('pointerup', endDrag);
            window.addEventListener('pointercancel', endDrag);
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend', endDrag);
            window.addEventListener('touchcancel', endDrag);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            if (activePointerId != null && typeof e.pointerId === 'number'
                && e.pointerId !== activePointerId) return;
            if (e.cancelable) e.preventDefault();
            const { x, y } = xyFrom(e);
            element.style.left = (x - offsetX) + 'px';
            element.style.top = (y - offsetY) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        };

        const endDrag = (e) => {
            if (activePointerId != null && typeof e.pointerId === 'number'
                && e.pointerId !== activePointerId) return;
            if (isDragging) saveState();
            isDragging = false;
            activePointerId = null;
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', endDrag);
            window.removeEventListener('pointercancel', endDrag);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', endDrag);
            window.removeEventListener('touchcancel', endDrag);
        };

        // Header: drag from anywhere except buttons.
        const onHeaderStart = (e) => {
            if (e.target.closest && e.target.closest('button')) return;
            if (e.cancelable) e.preventDefault();
            log(`🐾 dragStart type=${e.type} ptId=${e.pointerId} target=${e.target?.tagName||'?'}`);
            startDrag(e);
        };
        header.addEventListener('pointerdown', onHeaderStart);
        header.addEventListener('touchstart', onHeaderStart, { passive: false });

        // Edge-drag: tap within 8px of any edge of the body itself.
        const onEdgeStart = (e) => {
            if (e.target !== element) return;
            const rect = element.getBoundingClientRect();
            const { x, y } = xyFrom(e);
            const DRAG_MARGIN = 8;
            const inLeft = x - rect.left < DRAG_MARGIN;
            const inRight = x - rect.right > -DRAG_MARGIN;
            const inTop = y - rect.top < DRAG_MARGIN;
            const inBottom = y - rect.bottom > -DRAG_MARGIN;
            if (inLeft || inRight || inTop || inBottom) {
                if (e.cancelable) e.preventDefault();
                startDrag(e);
            }
        };
        element.addEventListener('pointerdown', onEdgeStart);
        element.addEventListener('touchstart', onEdgeStart, { passive: false });
    }

    function saveState() {
        if (!debugEl) return;
        try {
            // When collapsed, the live left/top are "auto" — persist the pre-collapse
            // position via prevLeft/prevTop so reload + expand restores it.
            const liveLeft = debugEl.style.left;
            const liveTop = debugEl.style.top;
            if (!collapsed && liveLeft && liveLeft !== 'auto') {
                prevLeft = liveLeft;
                prevTop = liveTop;
            }
            // When collapsed and dragged, the live left/top are real px → remember as the collapsed position.
            if (collapsed && liveLeft && liveLeft !== 'auto') {
                colLeft = liveLeft;
                colTop = liveTop;
            }
            const state = {
                left: collapsed ? prevLeft : liveLeft,
                top: collapsed ? prevTop : liveTop,
                width: debugEl.style.width,
                height: collapsed ? prevHeight : debugEl.style.height,
                prevHeight: prevHeight,
                prevLeft: prevLeft,
                prevTop: prevTop,
                colLeft: colLeft,
                colTop: colTop
            };
            localStorage.setItem('debug-window-state', JSON.stringify(state));
        } catch (_) {}
    }

    // Keep the window on-screen. A position restored from localStorage (saved on a bigger
    // monitor, or dragged past the edge) can land fully outside the viewport → invisible.
    // Clamp left/top so the whole box stays within a small margin. No-op when already in
    // view, so the default bottom-right anchoring is preserved.
    function clampIntoView() {
        if (!debugEl) return;
        const rect = debugEl.getBoundingClientRect();
        const margin = 8;
        const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
        const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
        const newLeft = Math.min(Math.max(rect.left, margin), maxLeft);
        const newTop = Math.min(Math.max(rect.top, margin), maxTop);
        if (Math.abs(newLeft - rect.left) > 0.5 || Math.abs(newTop - rect.top) > 0.5) {
            debugEl.style.left = newLeft + 'px';
            debugEl.style.top = newTop + 'px';
            debugEl.style.right = 'auto';
            debugEl.style.bottom = 'auto';
        }
    }

    function log(msg) {
        if (!debugEl) init();
        const timestamp = new Date().toLocaleTimeString('de-DE', { hour12: false });
        logs.push(`[${timestamp}] ${msg}`);
        if (logs.length > MAX_LOGS) logs.shift();
        updateContent();
        // Mirror to console so remote DevTools (chrome://inspect over USB)
        // see every log without having to scroll the in-page debug panel.
        try { console.log(`[DBG] ${msg}`); } catch (_) {}
    }

    function updateContent() {
        if (!debugEl) return;
        const content = document.getElementById('debug-content');
        if (content) content.textContent = logs.join('\n');
        content.scrollTop = content.scrollHeight;
    }

    // Live status line(s): OVERWRITE the value for `key` (empty text → remove it). Unlike log(), this does
    // NOT scroll or accumulate — meant for high-frequency readouts (motion gate, speed source) that used to
    // live in an on-screen bar. Rendered pinned at the top of the debug window.
    function status(key, text) {
        if (!debugEl) init();
        if (text == null || text === '') delete statusLines[key];
        else statusLines[key] = String(text);
        renderStatus();
    }

    function renderStatus() {
        if (!statusEl) return;
        const lines = Object.keys(statusLines).map((k) => statusLines[k]);
        statusEl.textContent = lines.join('\n');
        statusEl.style.display = (lines.length && !collapsed) ? 'block' : 'none';
    }

    function clear() {
        logs = [];
        updateContent();
    }

    function setFontSize(px) {
        const clamped = Math.max(MIN_FONT, Math.min(MAX_FONT, px));
        if (clamped === fontSize) return;
        fontSize = clamped;
        const content = document.getElementById('debug-content');
        if (content) content.style.fontSize = fontSize + 'px';
        if (statusEl) statusEl.style.fontSize = fontSize + 'px';
        try { localStorage.setItem('debug-window-fontsize', String(fontSize)); } catch (_) {}
    }

    function toggle() {
        if (!debugEl) init();
        const content = document.getElementById('debug-content');
        const btn = document.getElementById('debug-collapse-btn');
        const resizeHandles = debugEl._resizeHandles || [];
        const title = debugEl.querySelector('span');
        // All buttons in header except the collapse button (which stays visible)
        const allBtns = Array.from(debugEl.querySelectorAll('button')).filter(b => b.id !== 'debug-collapse-btn');
        const header = debugEl.querySelector('div');

        if (!collapsed) {
            // Collapsing: save current size + position, snap to bottom-right
            prevHeight = debugEl.style.height || debugEl.offsetHeight + 'px';
            prevLeft = debugEl.style.left || '';
            prevTop = debugEl.style.top || '';
            collapsed = true;
            debugEl.style.height = '50px';
            debugEl.style.width = '50px';
            debugEl.style.padding = '0';
            debugEl.style.display = 'flex';
            debugEl.style.justifyContent = 'center';
            debugEl.style.alignItems = 'center';
            debugEl.style.borderColor = '#444444';
            debugEl.style.color = '#444444';
            // Snap collapsed pill to bottom-right of viewport (a fresh collapse forgets any moved position)
            debugEl.style.left = 'auto';
            debugEl.style.top = 'auto';
            debugEl.style.right = '20px';
            debugEl.style.bottom = '20px';
            colLeft = 'auto';
            colTop = 'auto';
            content.style.display = 'none';
            if (statusEl) statusEl.style.display = 'none';
            resizeHandles.forEach(h => h.style.display = 'none');
            if (title) title.style.display = 'none';
            allBtns.forEach(b => b.style.display = 'none');
            if (header) {
                header.style.marginBottom = '0';
                header.style.paddingBottom = '0';
                header.style.borderBottom = 'none';
            }
            if (btn) {
                btn.textContent = '▲';
                btn.style.borderColor = '#444444';
                btn.style.color = '#444444';
            }
        } else {
            // Expanding: restore previous height + position (or bottom-right default)
            collapsed = false;
            debugEl.style.height = prevHeight;
            debugEl.style.width = '400px';
            debugEl.style.padding = '8px';
            debugEl.style.justifyContent = 'flex-start';
            debugEl.style.alignItems = 'stretch';
            debugEl.style.borderColor = '#6BA043';
            debugEl.style.color = '#6BA043';
            if (prevLeft || prevTop) {
                debugEl.style.left = prevLeft;
                debugEl.style.top = prevTop;
                debugEl.style.right = 'auto';
                debugEl.style.bottom = 'auto';
            } else {
                debugEl.style.left = 'auto';
                debugEl.style.top = 'auto';
                debugEl.style.right = '20px';
                debugEl.style.bottom = '20px';
            }
            content.style.display = 'block';
            renderStatus();   // restore the pinned status block if it has any lines
            resizeHandles.forEach(h => h.style.display = (h.dataset.dir === 'se') ? 'flex' : 'block');
            if (title) title.style.display = 'block';
            allBtns.forEach(b => {
                // Copy button uses 'flex' (centers SVG); others use 'block'
                b.style.display = b.querySelector('svg') ? 'flex' : 'block';
            });
            if (header) {
                header.style.marginBottom = '8px';
                header.style.paddingBottom = '6px';
                header.style.borderBottom = '1px solid rgba(107, 160, 67, 0.3)';
            }
            if (btn) {
                btn.textContent = '▼';
                btn.style.borderColor = '#6BA043';
                btn.style.color = '#6BA043';
            }
        }

        try { localStorage.setItem('debug-window-collapsed', collapsed ? '1' : '0'); } catch (_) {}
        saveState();
        clampIntoView();
    }

    function show() {
        if (!debugEl) init();
        debugEl.style.display = 'flex';
        clampIntoView();
    }

    function hide() {
        if (!debugEl) init();
        debugEl.style.display = 'none';
    }

    return { init, log, status, clear, toggle, show, hide };
})();

// Expose on window: a top-level `const` is NOT a window property, so every
// `if (window.DebugWindow) …` guard in the labs would silently no-op without this.
window.DebugWindow = DebugWindow;

// Autostart on page load
document.addEventListener('DOMContentLoaded', () => {
    DebugWindow.init();
});
