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
        if (document.getElementById(styleId)) return;

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
                gap: 15px;
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
                margin-bottom: 5px;
                padding-bottom: 5px;
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

            /* CYBER DROPDOWN SYSTEM */
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

            /* MISSION BRIEFING BOX */
            .briefing-box {
                font-size: 0.85rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.8);
                border-left: 3px solid var(--neon-blue);
                padding-left: 15px;
            }
        `;
        document.head.appendChild(style);
    }

    static createCard(containerId, title, contentHTML, accentColor = '#00d2ff', options = { collapsible: false }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cardId = `card-${Math.random().toString(36).substr(2, 9)}`;
        const toggleHtml = options.collapsible ? '<span class="toggle-icon">▶</span>' : '';
        
        const cardHTML = `
            <div id="${cardId}" class="instrument-card ${options.collapsible ? 'collapsible' : ''}">
                <div class="instrument-title" style="color: ${accentColor}; text-shadow: 0 0 10px ${accentColor}66;">
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
}
