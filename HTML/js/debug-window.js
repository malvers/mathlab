const DebugWindow = (() => {
    let debugEl = null;
    let logs = [];
    let collapsed = false;
    let prevHeight = '300px';
    let prevLeft = '';
    let prevTop = '';
    const MAX_LOGS = 50;

    function isProduction() {
        const host = window.location.hostname;
        return host === 'docalvers.de' || host === 'www.docalvers.de';
    }

    function init() {
        if (debugEl) return;
        // Skip debug window on production unless ?debug=force is set
        if (isProduction() && !new URLSearchParams(window.location.search).has('debug')) {
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
        } catch (_) {}

        debugEl = document.createElement('div');
        debugEl.id = 'central-debug-window';

        // Position/size: collapsed → bottom-right; expanded → saved position or default bottom-right
        const w = savedState.width || '400px';
        const h = collapsed ? '40px' : (savedState.height || '300px');
        let positionStyle;
        if (collapsed) {
            positionStyle = `left: auto; top: auto; right: 20px; bottom: 20px;`;
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
        `;

        const header = document.createElement('div');
        header.id = 'debug-header';
        header.style.cssText = `
            display: flex;
            justify-content: ${collapsed ? 'center' : 'space-between'};
            align-items: center;
            margin-bottom: ${collapsed ? '0' : '8px'};
            padding-bottom: ${collapsed ? '0' : '6px'};
            border-bottom: ${collapsed ? 'none' : '1px solid rgba(107, 160, 67, 0.3)'};
            cursor: move;
            user-select: none;
        `;

        const title = document.createElement('span');
        title.textContent = '🐛 DEBUGING';
        title.style.flex = '1';
        title.style.display = collapsed ? 'none' : 'block';
        header.appendChild(title);

        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = `display: flex; gap: 4px;`;

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
        btnGroup.appendChild(btnCopy);

        const btnClear = document.createElement('button');
        btnClear.textContent = 'C';
        btnClear.title = 'Clear logs';
        btnClear.style.cssText = `
            background: transparent;
            border: 1px solid #6BA043;
            color: #6BA043;
            width: 28px;
            height: 24px;
            cursor: pointer;
            font-family: monospace;
            font-size: 12px;
            padding: 0;
            border-radius: 3px;
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
        btnGroup.appendChild(btnCollapse);
        header.appendChild(btnGroup);

        const content = document.createElement('div');
        content.id = 'debug-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-all;
            line-height: 1.4;
            display: ${collapsed ? 'none' : 'block'};
        `;

        debugEl.style.position = 'fixed';
        debugEl.appendChild(header);
        debugEl.appendChild(content);
        document.body.appendChild(debugEl);

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
            h.style.cssText = `position:absolute; ${def.style} cursor:${def.cursor}; display:${collapsed ? 'none' : 'block'}; user-select:none; z-index:5;`;
            debugEl.appendChild(h);
            resizeHandles.push(h);
            makeResizable(h, debugEl, def.dir);
        });

        // Make draggable
        makeHeaderDraggable(header, debugEl);

        // Expose handles for toggle()
        debugEl._resizeHandles = resizeHandles;
    }

    function makeResizable(handle, element) {
        let isResizing = false;
        let startX = 0, startY = 0;
        let startWidth = 0, startHeight = 0;

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            const newWidth = Math.max(150, startWidth + deltaX);
            const newHeight = Math.max(80, startHeight + deltaY);
            element.style.width = newWidth + 'px';
            element.style.height = newHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) saveState();
            isResizing = false;
        });
    }

    function makeHeaderDraggable(header, element) {
        let offsetX = 0, offsetY = 0;
        let isMouseDown = false;

        const startDrag = (e) => {
            isMouseDown = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
        };

        header.addEventListener('mousedown', startDrag);

        // Auch am Rand greifen zum Verschieben
        element.addEventListener('mousedown', (e) => {
            const rect = element.getBoundingClientRect();
            const DRAG_MARGIN = 8;
            const inLeft = e.clientX - rect.left < DRAG_MARGIN;
            const inRight = e.clientX - rect.right > -DRAG_MARGIN;
            const inTop = e.clientY - rect.top < DRAG_MARGIN;
            const inBottom = e.clientY - rect.bottom > -DRAG_MARGIN;

            if ((inLeft || inRight || inTop || inBottom) && e.target === element) {
                startDrag(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isMouseDown) saveState();
            isMouseDown = false;
        });
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
            const state = {
                left: collapsed ? prevLeft : liveLeft,
                top: collapsed ? prevTop : liveTop,
                width: debugEl.style.width,
                height: collapsed ? prevHeight : debugEl.style.height,
                prevHeight: prevHeight,
                prevLeft: prevLeft,
                prevTop: prevTop
            };
            localStorage.setItem('debug-window-state', JSON.stringify(state));
        } catch (_) {}
    }

    function log(msg) {
        if (!debugEl) init();
        const timestamp = new Date().toLocaleTimeString('de-DE', { hour12: false });
        logs.push(`[${timestamp}] ${msg}`);
        if (logs.length > MAX_LOGS) logs.shift();
        updateContent();
    }

    function updateContent() {
        if (!debugEl) return;
        const content = document.getElementById('debug-content');
        if (content) content.textContent = logs.join('\n');
        content.scrollTop = content.scrollHeight;
    }

    function clear() {
        logs = [];
        updateContent();
    }

    function toggle() {
        if (!debugEl) init();
        const content = document.getElementById('debug-content');
        const btn = document.getElementById('debug-collapse-btn');
        const resizeHandle = document.getElementById('debug-resize-handle');
        const title = debugEl.querySelector('span');
        const btnCopy = debugEl.querySelectorAll('button')[0];
        const btnClear = debugEl.querySelectorAll('button')[1];
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
            // Snap collapsed pill to bottom-right of viewport
            debugEl.style.left = 'auto';
            debugEl.style.top = 'auto';
            debugEl.style.right = '20px';
            debugEl.style.bottom = '20px';
            content.style.display = 'none';
            if (resizeHandle) resizeHandle.style.display = 'none';
            if (title) title.style.display = 'none';
            if (btnCopy) btnCopy.style.display = 'none';
            if (btnClear) btnClear.style.display = 'none';
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
            if (resizeHandle) resizeHandle.style.display = 'flex';
            if (title) title.style.display = 'block';
            if (btnCopy) btnCopy.style.display = 'flex';
            if (btnClear) btnClear.style.display = 'block';
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
    }

    function show() {
        if (!debugEl) init();
        debugEl.style.display = 'flex';
    }

    function hide() {
        if (!debugEl) init();
        debugEl.style.display = 'none';
    }

    return { init, log, clear, toggle, show, hide };
})();

// Autostart on page load
document.addEventListener('DOMContentLoaded', () => {
    DebugWindow.init();
});
