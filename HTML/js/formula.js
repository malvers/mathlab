/**
 * Cyber-Labor Formula Engine v1.0.0
 * Modular and responsive mathematical formula display.
 * Uses --header-scale from Branding Engine for adaptive font sizing.
 */
const CyberFormula = {
    init(config = {}) {
        this.containerId = config.id || 'floating-formula';
        this.injectStyles();
        this.createContainer(config.anchorId);
    },

    injectStyles() {
        if(document.getElementById('cyber-formula-styles')) return;
        const style = document.createElement('style');
        style.id = 'cyber-formula-styles';
        style.textContent = `
            .cyber-formula {
                position: absolute;
                bottom: max(12px, calc(8px + env(safe-area-inset-bottom, 0px)));
                left: 50%;
                transform: translateX(-50%);
                padding: 8px max(10px, env(safe-area-inset-left, 0px))
                    8px max(10px, env(safe-area-inset-right, 0px));
                z-index: 50;
                box-sizing: border-box;
                max-width: min(920px, calc(100vw - 16px));
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: clamp(0.5rem, 0.26rem + 2.65vmin, calc(0.85rem + 0.95rem * var(--header-scale, 1)));
                pointer-events: none;
                text-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
                transition: font-size 0.2s ease;
                text-align: center;
                line-height: 1.22;
                white-space: nowrap;
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
            }

            .cyber-formula .katex-display {
                margin: 0 !important;
            }

            .cyber-formula.cyber-formula--display {
                white-space: normal;
                overflow-x: visible;
            }

            @media (min-width: 900px) {
                .cyber-formula {
                    bottom: max(16px, calc(36px + env(safe-area-inset-bottom, 0px)));
                }
            }
        `;
        document.head.appendChild(style);
    },

    createContainer(anchorId) {
        if(document.getElementById(this.containerId)) return;
        const container = document.createElement('div');
        container.id = this.containerId;
        container.className = 'cyber-formula';
        
        // Find workspace anchor or fall back to body
        const anchor = document.getElementById(anchorId) || 
                       document.getElementById('workspace') || 
                       document.body;
        anchor.appendChild(container);
    },

    set(tex, renderOpts = {}) {
        const container = document.getElementById(this.containerId);
        if (!container || !window.katex) return;
        container.classList.toggle('cyber-formula--display', !!renderOpts.displayMode);
        window.katex.render(tex, container, {
            throwOnError: false,
            ...renderOpts,
        });
    }
};
