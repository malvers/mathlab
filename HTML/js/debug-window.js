const DebugWindow = (() => {
    let debugEl = null;
    let logs = [];
    let collapsed = false;
    let prevHeight = '300px';
    const MAX_LOGS = 50;

    function init() {
        if (debugEl) return;

        // Restore state from localStorage
        let savedState = {};
        try {
            collapsed = localStorage.getItem('debug-window-collapsed') === '1';
            const s = localStorage.getItem('debug-window-state');
            if (s) savedState = JSON.parse(s);
            if (savedState.prevHeight) prevHeight = savedState.prevHeight;
        } catch (_) {}

        debugEl = document.createElement('div');
        debugEl.id = 'central-debug-window';

        // Position/size: use saved or defaults
        const w = savedState.width || '400px';
        const h = collapsed ? '40px' : (savedState.height || '300px');
        const positionStyle = savedState.left
            ? `left: ${savedState.left}; top: ${savedState.top}; right: auto; bottom: auto;`
            : `right: 20px; bottom: 20px;`;

        debugEl.style.cssText = `
            position: fixed;
            ${positionStyle}
            width: ${w};
            height: ${h};
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #6BA043;
            color: #6BA043;
            font-family: Arial, sans-serif;
            font-size: 11px;
            padding: 10px;
            border-radius: 6px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 20px rgba(107, 160, 67, 0.3);
            resize: ${collapsed ? 'none' : 'both'};
            overflow: hidden;
            transition: height 0.25s ease;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(107, 160, 67, 0.3);
            cursor: move;
            user-select: none;
        `;

        const title = document.createElement('span');
        title.textContent = '🐛 DEBUG';
        title.style.flex = '1';
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
            display: flex;
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
            border: 1px solid #6BA043;
            color: #6BA043;
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

        debugEl.appendChild(header);
        debugEl.appendChild(content);
        document.body.appendChild(debugEl);

        // Make draggable
        makeHeaderDraggable(header, debugEl);
    }

    function makeHeaderDraggable(header, element) {
        let offsetX = 0, offsetY = 0;
        let isMouseDown = false;

        header.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
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

        // Save on resize (resize: both creates a resize handle)
        const ro = new ResizeObserver(() => {
            if (!collapsed) saveState();
        });
        ro.observe(element);
    }

    function saveState() {
        if (!debugEl) return;
        try {
            const state = {
                left: debugEl.style.left,
                top: debugEl.style.top,
                width: debugEl.style.width,
                height: collapsed ? prevHeight : debugEl.style.height,
                prevHeight: prevHeight
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

        if (!collapsed) {
            // Collapsing: save current height, shrink to header
            prevHeight = debugEl.style.height || debugEl.offsetHeight + 'px';
            collapsed = true;
            debugEl.style.height = '40px';
            debugEl.style.resize = 'none';
            content.style.display = 'none';
            if (btn) btn.textContent = '▲';
        } else {
            // Expanding: restore previous height
            collapsed = false;
            debugEl.style.height = prevHeight;
            debugEl.style.resize = 'both';
            content.style.display = 'block';
            if (btn) btn.textContent = '▼';
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
