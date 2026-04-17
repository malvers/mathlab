/**
 * Cyber-Labor UI Engine v1.1.0 (Smart Component Upgrade)
 * Modular components for sidebar instrumentation with collapsible support.
 * Consistent premium design with glassmorphism and neon accents.
 */
const CyberUI = {
    init() {
        this.injectStyles();
    },

    injectStyles() {
        if(document.getElementById('cyber-ui-styles')) return;
        const style = document.createElement('style');
        style.id = 'cyber-ui-styles';
        style.textContent = `
            .instrument-card {
                background: var(--glass, rgba(15, 23, 42, 0.8));
                border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
                border-radius: 16px;
                padding: 0; /* Changed to handle padding in content for collapsible */
                margin-bottom: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(20px);
                animation: ui-card-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                overflow: visible;
                position: relative;
            }

            .instrument-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 2.5px;
                padding: 16px 0; /* Horizontal padding removed to use central standard */
                margin: 0;
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 700;
                position: relative;
            }

            .instrument-card.collapsible .instrument-title {
                cursor: pointer;
                user-select: none;
            }

            .instrument-card.collapsible .instrument-title:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            /* Toggle Icon */
            .toggle-icon {
                font-size: 0.7rem;
                transition: transform 0.3s ease;
                opacity: 0.6;
            }
            .instrument-card.open .toggle-icon {
                transform: rotate(90deg);
                opacity: 1;
            }

            .card-content {
                padding: 0 0 18px 0; /* Horizontal padding removed */
                overflow: visible;
                transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
                max-height: 1000px; /* Large enough for content */
                opacity: 1;
            }

            .instrument-card.collapsed .card-content {
                max-height: 0;
                padding-top: 0;
                padding-bottom: 0;
                opacity: 0;
                pointer-events: none;
            }

            /* Cyber-LaTeX-Dropdown Component */
            .cyber-dropdown {
                position: relative;
                width: 100%;
                font-family: 'Inter', sans-serif;
                user-select: none;
                margin-top: 10px;
                background: rgba(15, 23, 42, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                transition: all 0.3s ease;
            }

            .dropdown-header {
                padding: 12px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                min-height: 50px;
            }

            .dropdown-header .katex {
                font-size: 1.25rem !important;
                color: #ffffff !important;
            }

            .dropdown-arrow {
                font-size: 0.6rem;
                color: #ffffff;
                opacity: 0.5;
                transition: transform 0.3s ease;
            }

            .cyber-dropdown.active .dropdown-arrow {
                transform: rotate(180deg);
                opacity: 1;
            }

            .dropdown-panel {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                width: 100%;
                background: #0f172a; /* Solid dark background to prevent bleed-through */
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                z-index: 110000;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
                opacity: 0;
                transform: translateY(-10px);
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cyber-dropdown.active .dropdown-panel {
                opacity: 1;
                transform: translateY(0);
                pointer-events: all;
            }

            .dropdown-option {
                padding: 14px 18px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                transition: all 0.2s;
                color: #ffffff;
                gap: 15px;
            }

            .dropdown-option:last-child { border-bottom: none; }

            .dropdown-option:hover {
                background: rgba(0, 210, 255, 0.15);
            }

            .dropdown-option.selected {
                background: rgba(0, 210, 255, 0.2);
                border-left: 4px solid var(--neon-blue, #00d2ff);
            }

            .dropdown-option .option-label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.65rem;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
                white-space: nowrap;
                opacity: 0.8;
            }

            .dropdown-option .katex {
                font-size: 1.25rem !important;
                color: #ffffff !important;
            }

            .briefing-text {
                font-size: 0.9rem;
                line-height: 1.7;
                color: rgba(255, 255, 255, 0.75);
                font-weight: 300;
            }

            .briefing-text b {
                color: white;
                font-weight: 600;
            }

            @keyframes ui-card-fade {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Injects a standard Missions-Briefing card (Collapsible by default).
     */
    injectBriefing(containerId, text, accentColor = '#00d2ff', options = {}) {
        const content = `<div class="briefing-text">${text}</div>`;
        const mergedOptions = Object.assign({ collapsible: true, collapsed: true, prepend: true }, options);
        this.createCard(containerId, 'Missions-Briefing', content, accentColor, mergedOptions);
    },

    /**
     * Toggles the collapsed state of a card.
     */
    toggleCard(card) {
        if (!card) return;
        card.classList.toggle('collapsed');
        card.classList.toggle('open');
    },

    /**
     * Creates an interactive LaTeX Dropdown.
     */
    createDropdown(containerId, items, onSelect, activeId = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const dd = document.createElement('div');
        dd.className = 'cyber-dropdown';
        
        const currentItem = items.find(i => i.id === activeId) || items[0];

        dd.innerHTML = `
            <div class="dropdown-header">
                <div class="header-formula"></div>
                <span class="dropdown-arrow">▼</span>
            </div>
            <div class="dropdown-panel"></div>
        `;

        const panel = dd.querySelector('.dropdown-panel');
        const header = dd.querySelector('.dropdown-header');
        const headerFormula = header.querySelector('.header-formula');

        items.forEach(item => {
            const opt = document.createElement('div');
            opt.className = `dropdown-option ${item.id === activeId ? 'selected' : ''}`;
            opt.innerHTML = `
                <div class="opt-formula"></div>
                <div class="option-label">${item.name}</div>
            `;
            
            const optFormulaDiv = opt.querySelector('.opt-formula');

            opt.onclick = (e) => {
                e.stopPropagation();
                onSelect(item.id);
                dd.classList.remove('active');
                this.renderFormula(item, headerFormula);
            };
            panel.appendChild(opt);

            // Render LaTeX for options directly
            this.renderFormula(item, optFormulaDiv);
        });

        header.onclick = (e) => {
            e.stopPropagation();
            dd.classList.toggle('active');
        };

        // Close on outside click
        const closeHandler = (e) => {
            if (!dd.contains(e.target)) {
                dd.classList.remove('active');
            }
        };
        document.addEventListener('click', closeHandler);

        container.innerHTML = '';
        container.appendChild(dd);

        // Render current selection in header
        this.renderFormula(currentItem, headerFormula);
    },

    renderFormula(item, target) {
        if (!target) return;
        const render = () => {
            if (window.katex) {
                window.katex.render(item.tex_short || item.tex, target, { throwOnError: false });
            } else {
                setTimeout(render, 100);
            }
        };
        render();
    },

    /**
     * Creates a generic instrument card with optional collapsible behavior.
     */
    createCard(containerId, title, contentHTML, accentColor = '#00d2ff', options = {}) {
        this.init();
        const parent = document.getElementById(containerId) || document.body;
        const card = document.createElement('div');
        
        let classes = ['instrument-card'];
        if (options.collapsible) classes.push('collapsible');
        if (options.collapsed) classes.push('collapsed');
        else classes.push('open');
        
        card.className = classes.join(' ');
        
        const toggleHtml = options.collapsible ? '<span class="toggle-icon">▶</span>' : '';
        const titleHtml = (title || options.collapsible) ? `
            <div class="instrument-title" style="color: ${accentColor}; text-shadow: 0 0 10px ${accentColor}66;">
                ${toggleHtml}
                ${title}
            </div>` : '';
        
        card.innerHTML = `
            ${titleHtml}
            <div class="card-content">
                ${contentHTML}
            </div>
        `;
        
        if (options.collapsible) {
            card.querySelector('.instrument-title').onclick = () => this.toggleCard(card);
        }

        // If prepend is needed, we could add that, but usually append is fine.
        // For briefing, we often want it at the top.
        if (options.prepend && parent.firstChild) {
            parent.insertBefore(card, parent.firstChild);
        } else {
            parent.appendChild(card);
        }
    }
};
