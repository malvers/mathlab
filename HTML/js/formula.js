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
                bottom: 45px;
                left: 50%;
                transform: translateX(-50%);
                padding: 10px;
                z-index: 50;
                white-space: nowrap;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: calc(0.8rem + 1.0rem * var(--header-scale, 1));
                pointer-events: none;
                text-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
                transition: font-size 0.2s ease;
                text-align: center;
            }

            @media (max-width: 600px) {
                .cyber-formula {
                    bottom: 20px;
                    width: 90%;
                    white-space: normal; /* Erlaubt Umbruch auf kleinen Handy-Screens */
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

    set(tex) {
        const container = document.getElementById(this.containerId);
        if (container && window.katex) {
            window.katex.render(tex, container, { throwOnError: false });
        }
    }
};
