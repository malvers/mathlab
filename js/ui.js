/**
 * Cyber-UI Engine v5.3.8
 * Central component engine for the Cyber-Labor ecosystem.
 */
class CyberUI {
    static init() {
        console.log("⚛️ Cyber-UI Engine v5.3.8 initialized.");
        this.injectStyles();
    }

    static injectStyles() {
        const styleId = 'cyber-ui-dynamic-styles';
        // Remove existing to force refresh
        const old = document.getElementById(styleId);
        if (old) old.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            :root {
                --glass-bright: rgba(255, 255, 255, 0.05);
                --neon-blue: #00d2ff;
                --border: rgba(255, 255, 255, 0.1);
            }

            .instrument-card {
                background: var(--glass-bright);
                padding: 12px 15px;
                border-radius: 18px;
                border: 1px solid rgba(0, 210, 255, 0.25);
                display: flex;
                flex-direction: column;
                gap: 4px;
                position: relative;
                overflow: visible; /* To allow dropdown panels to bleed out */
                backdrop-filter: blur(25px);
                animation: ui-card-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                margin-bottom: 5px;
            }

            .instrument-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.65rem;
                letter-spacing: 2px;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                margin-bottom: 2px;
                padding-bottom: 0px;
            }

            /* Collapsible Logic */
            .instrument-card.collapsible .instrument-title {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                user-select: none;
            }

            .instrument-card.collapsible .toggle-icon {
                font-size: 0.7rem;
                transition: transform 0.3s ease;
                display: inline-block;
            }

            .instrument-card.collapsed .toggle-icon {
                transform: rotate(0deg);
            }

            .instrument-card:not(.collapsed) .toggle-icon {
                transform: rotate(90deg);
            }

            .card-content {
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
            }

            .instrument-card.collapsed .card-content {
                max-height: 0;
                opacity: 0;
                margin: 0;
            }

            /* CYBER CHECKBOX SYSTEM (PREMIUM) */
            .cyber-control-group {
                display: flex;
                flex-direction: column;
                gap: 2px;
                width: 100%;
            }

            .cyber-checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                user-select: none;
                margin-bottom: 10px;
                width: 100%;
            }

            .cyber-checkbox {
                appearance: none;
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.03);
                cursor: pointer;
                position: relative;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .cyber-checkbox:checked {
                background: var(--neon-blue);
                border-color: var(--neon-blue);
                box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
            }

            .cyber-checkbox::after {
                content: '';
                position: absolute;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: translate(-50%, -55%) rotate(45deg);
                opacity: 0;
                transition: opacity 0.2s ease;
                left: 50%;
                top: 45%;
                display: block;
            }

            .cyber-checkbox:checked::after {
                opacity: 1;
            }

            .cyber-label {
                font-family: 'Outfit', sans-serif;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.8);
                letter-spacing: 0.5px;
            }

            /* UTILITIES */
            .cyber-number {
                font-family: 'Orbitron', sans-serif;
                font-variant-numeric: tabular-nums;
            }

            /* CONTEXT MENU */
            .cyber-context-menu {
                position: fixed;
                background: rgba(15, 23, 42, 0.92);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(0, 210, 255, 0.4);
                border-radius: 12px;
                padding: 10px;
                min-width: 220px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                gap: 5px;
                opacity: 0;
                transform: scale(0.95);
                transform-origin: top left;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cyber-context-menu.visible {
                opacity: 1;
                transform: scale(1);
                pointer-events: auto;
            }

            .context-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .context-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .context-label {
                font-family: 'Outfit', sans-serif;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.85);
            }

            .context-close {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0.4;
                transition: opacity 0.2s;
                font-size: 1.2rem;
                line-height: 1;
                color: white;
            }

            .context-close:hover {
                opacity: 1;
            }

            @keyframes ui-card-fade {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* MISSION BRIEFING BOX */
            .cyber-dropdown {
                position: relative;
                width: 100%;
                font-family: 'Outfit', sans-serif;
            }

            .dropdown-trigger {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--neon-blue);
                padding: 12px 15px;
                border-radius: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                box-sizing: border-box;
                transition: all 0.3s ease;
            }

            .dropdown-trigger:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: var(--neon-blue);
            }

            .dropdown-panel {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                width: 100%;
                box-sizing: border-box;
                background: rgba(10, 15, 25, 0.95);
                border: 1px solid var(--neon-blue);
                border-radius: 12px;
                z-index: 1000;
                display: none;
                backdrop-filter: blur(20px);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 210, 255, 0.1);
            }

            .dropdown-option {
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .dropdown-option:hover {
                background: rgba(0, 210, 255, 0.15);
                color: var(--neon-blue);
                padding-left: 20px;
            }

            .math-part {
                font-size: 1.1rem;
                flex-grow: 1;
            }

            .desc-part {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.6rem;
                letter-spacing: 1px;
                opacity: 0.5;
                text-transform: uppercase;
                margin-left: 15px;
                white-space: nowrap;
            }

            .label-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.7);
            }

            /* CHECKBOXES */
            .checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
            }

            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: opacity 0.2s ease;
                min-height: 24px;
            }

            .checkbox-item:hover {
                opacity: 0.8;
            }

            .checkbox-item input[type="checkbox"] {
                appearance: none;
                width: 16px;
                height: 16px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 3px;
                cursor: pointer;
                position: relative;
                transition: background 0.2s, border-color 0.2s;
                flex-shrink: 0;
                background: rgba(0, 0, 0, 0.2);
            }

            .checkbox-item input[type="checkbox"]:checked {
                background: var(--neon-blue);
                border-color: var(--neon-blue);
                box-shadow: 0 0 12px rgba(0, 210, 255, 0.4);
            }

            .checkbox-item input[type="checkbox"]:checked::after {
                content: "";
                position: absolute;
                top: 3px;
                left: 3px;
                width: 8px;
                height: 8px;
                background: black;
                border-radius: 1px;
            }

            .checkbox-item label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.62rem;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.6);
                transition: color 0.2s;
            }

            .checkbox-item input[type="checkbox"]:checked + label {
                color: #fff;
            }

            /* CYBER BUTTONS */
            .cyber-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--neon-blue);
                color: #fff;
                padding: 12px 20px;
                border-radius: 12px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.65rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                box-shadow: 0 0 15px rgba(0, 210, 255, 0.1);
                width: 100%;
                margin-top: 10px;
                outline: none;
            }

            .cyber-btn:hover {
                background: rgba(0, 210, 255, 0.15);
                box-shadow: 0 0 25px rgba(0, 210, 255, 0.3);
                border-color: #fff;
                transform: translateY(-1px);
            }

            .cyber-btn:active {
                transform: translateY(1px) scale(0.98);
                background: rgba(0, 210, 255, 0.3);
            }

            /* MISSION BRIEFING BOX */
            .briefing-box {
                font-size: 0.85rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.8);
                border-left: 3px solid var(--neon-blue);
                padding-left: 15px;
            }

            /* STATS / ANALYSIS GRID */
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 5px;
            }

            .stats-card {
                background: rgba(255, 255, 255, 0.03);
                padding: 12px;
                border-radius: 14px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                transition: all 0.3s ease;
            }

            .stats-card:hover {
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(255, 255, 255, 0.15);
            }

            .stats-label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.55rem;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
                display: block;
                margin-bottom: 5px;
            }

            .stats-val {
                font-family: 'Orbitron', sans-serif;
                font-size: 1rem;
                color: var(--neon-blue);
                font-weight: bold;
            }

            /* CYBER SLIDER (PREMIUM) */
            .cyber-control-group {
                margin-bottom: 5px;
                width: 100%;
            }
            .control-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }
            .cyber-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                outline: none;
                margin: 8px 0;
            }
            .cyber-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: var(--accent, var(--neon-blue));
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px var(--accent, var(--neon-blue));
                transition: all 0.2s ease;
            }
            .cyber-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 0 20px var(--accent, var(--neon-blue));
            }
            .val-display {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.8rem;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    static createCard(containerId, title, contentHTML, accentColor = '#00d2ff', options = { collapsible: false }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cardId = `card-${Math.random().toString(36).substr(2, 9)}`;
        const toggleHtml = options.collapsible ? '<span class="toggle-icon">▶</span>' : '';
        
        const glowColor = (typeof accentColor === 'string' && accentColor.startsWith('#')) ? `${accentColor}66` : 'rgba(0, 210, 255, 0.4)';
        
        const cardHTML = `
            <div id="${cardId}" class="instrument-card ${options.collapsible ? 'collapsible' : ''}">
                <div class="instrument-title" style="color: ${accentColor}; text-shadow: 0 0 10px ${glowColor};">
                    ${toggleHtml}
                    ${title}
                </div>
                <div class="card-content">
                    ${contentHTML}
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);

        if (options.collapsible) {
            const card = document.getElementById(cardId);
            const titleEl = card.querySelector('.instrument-title');
            titleEl.addEventListener('click', () => {
                card.classList.toggle('collapsed');
            });
        }
    }

    static createSlider(containerId, label, min, max, value, step, oninput, color = 'var(--neon-blue)') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const sliderId = `slider-${Math.random().toString(36).substr(2, 9)}`;
        const displayId = `val-${sliderId}`;
        
        const html = `
            <div class="cyber-control-group">
                <div class="control-header">
                    <span class="cyber-label" style="color:rgba(255,255,255,0.7); font-size:0.7rem; font-family:'Orbitron';">${label}</span>
                    <span id="${displayId}" class="val-display" style="color:${color}">${value}</span>
                </div>
                <input type="range" class="cyber-slider" id="${sliderId}" 
                    min="${min}" max="${max}" value="${value}" step="${step}"
                    style="--accent:${color}">
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        
        const input = document.getElementById(sliderId);
        const display = document.getElementById(displayId);
        
        input.oninput = (e) => {
            const val = e.target.value;
            display.innerText = val;
            oninput(parseFloat(val));
        };
    }

    /**
     * Creates a high-fidelity data grid for real-time analysis
     * @param {string} containerId - Mount point
     * @param {Array} stats - [{label, value, color}]
     */
    static createStatsGrid(containerId, stats) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `<div class="stats-grid"></div>`;
        const grid = container.querySelector('.stats-grid');
        
        stats.forEach((stat, index) => {
            const card = document.createElement('div');
            card.className = 'stats-card';
            card.id = `stats-card-${containerId}-${index}`;
            card.innerHTML = `
                <span class="stats-label">${stat.label}</span>
                <span class="stats-val" style="color:${stat.color || 'var(--neon-blue)'}">${stat.value}</span>
            `;
            grid.appendChild(card);
        });
    }

    /**
     * Updates values in an existing stats grid
     * @param {string} containerId - Mount point (used for targeting)
     * @param {Array} stats - [{value, color}]
     */
    static updateStatsGrid(containerId, stats) {
        stats.forEach((stat, index) => {
            const valEl = document.querySelector(`#stats-card-${containerId}-${index} .stats-val`);
            if (valEl) {
                if (stat.value !== undefined) valEl.innerText = stat.value;
                if (stat.color) valEl.style.color = stat.color;
            }
        });
    }

    static injectBriefing(containerId, text) {
        this.createCard(containerId, 'Missions-Briefing', `
            <div class="briefing-box">
                ${text}
            </div>
        `, '#00d2ff', { collapsible: true });
    }

    static createDropdown(containerId, options, onSelect, defaultId = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
        const defaultOption = options.find(o => o.id === defaultId) || options[0];

        const html = `
            <div id="${dropdownId}" class="cyber-dropdown">
                <div class="dropdown-trigger">
                    <span class="selected-val">${defaultOption.label}</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="dropdown-panel">
                    ${options.map(opt => `<div class="dropdown-option" data-id="${opt.id}">${opt.label}</div>`).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;

        const dropdown = document.getElementById(dropdownId);
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const panel = dropdown.querySelector('.dropdown-panel');

        trigger.addEventListener('click', () => {
            const isOpen = panel.style.display === 'block';
            panel.style.display = isOpen ? 'none' : 'block';
            
            // Render Math in options if open
            if (!isOpen && window.katex) {
                dropdown.querySelectorAll('.math-part').forEach(mp => {
                    window.katex.render(mp.dataset.tex, mp, { throwOnError: false });
                });
            }
        });

        panel.addEventListener('click', (e) => {
            const opt = e.target.closest('.dropdown-option');
            if (opt) {
                const id = opt.dataset.id;
                const selectedVal = dropdown.querySelector('.selected-val');
                selectedVal.innerHTML = opt.innerHTML; // Copy the structured HTML
                panel.style.display = 'none';
                
                // Render Math in the selected trigger (selective)
                if (window.katex) {
                    const mp = selectedVal.querySelector('.math-part');
                    if (mp) {
                        window.katex.render(mp.dataset.tex, mp, { throwOnError: false });
                    }
                }
                
                onSelect(id);
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        // Initial Math Render for the trigger
        if (window.katex) {
            const initialMp = dropdown.querySelector('.dropdown-trigger .math-part');
            if (initialMp) {
                window.katex.render(initialMp.dataset.tex, initialMp, { throwOnError: false });
            }
        }
    }

    /**
     * Creates a premium Cyber-Checkbox
     * @param {string} containerId - The ID of the container element
     * @param {string} label - The label text
     * @param {boolean} checked - Initial state
     * @param {function} onchange - Callback for state changes
     * @param {string} color - Optional custom color for the label
     */
    static createCheckbox(containerId, label, checked, onchange, color = null) {
        const wrapper = document.createElement('label');
        wrapper.className = 'cyber-checkbox-wrapper';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'cyber-checkbox';
        checkbox.checked = checked;
        checkbox.onchange = (e) => onchange(e.target.checked);
        
        const labelText = document.createElement('span');
        labelText.className = 'cyber-label';
        labelText.textContent = label;
        if (color) labelText.style.color = color;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(labelText);
        
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) container.appendChild(wrapper);
        }
        
        return wrapper;
    }

    static showContextMenu(x, y, items = []) {
        let menu = document.getElementById('cyber-context-menu');
        if (menu) menu.remove();

        menu = document.createElement('div');
        menu.id = 'cyber-context-menu';
        menu.className = 'cyber-context-menu';
        document.body.appendChild(menu);

        // Close Button (X)
        const closeBtn = document.createElement('div');
        closeBtn.className = 'context-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            menu.classList.remove('visible');
            setTimeout(() => menu.remove(), 200);
        };
        menu.appendChild(closeBtn);

        // Position & Shift if near edges
        const menuWidth = 220;
        const menuHeight = items.length * 45 + 20;
        let finalX = x;
        let finalY = y;

        if (x + menuWidth > window.innerWidth) finalX -= menuWidth;
        if (y + menuHeight > window.innerHeight) finalY -= menuHeight;

        menu.style.left = `${finalX}px`;
        menu.style.top = `${finalY}px`;

        // Render items
        items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.className = 'context-divider';
                menu.appendChild(divider);
                return;
            }
            if (item.checked !== undefined) {
                // Checkbox Item
                const checkboxWrapper = this.createCheckbox(null, item.label, item.checked, (val) => {
                    if (item.onchange) item.onchange(val);
                });
                menu.appendChild(checkboxWrapper);
            } else {
                // Action Item (No Checkbox)
                const actionBtn = document.createElement('div');
                actionBtn.className = 'context-item action-item';
                actionBtn.innerHTML = `<div class="context-label">${item.label}</div>`;
                actionBtn.onclick = () => {
                    if (item.onclick) item.onclick();
                    // Close menu on action
                    menu.classList.remove('visible');
                    setTimeout(() => menu.remove(), 200);
                };
                menu.appendChild(actionBtn);
            }
        });

        requestAnimationFrame(() => menu.classList.add('visible'));

        // global close
        const dismiss = (e) => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('visible');
                setTimeout(() => menu.remove(), 200);
                window.removeEventListener('mousedown', dismiss);
            }
        };
        setTimeout(() => window.addEventListener('mousedown', dismiss), 10);
    }
}
