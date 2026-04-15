/**
 * Cyber-Labor Branding Engine v4.0
 * Centralized branding component for Doc Alvers Laboratories.
 */
const CyberBranding = {
    init(config = {}) {
        const title = config.title || "Cyber Laboratory";
        const subtitle = config.subtitle || "MATHEMATICAL VISUALIZATION";
        
        this.injectStyles();
        this.injectHTML(title, subtitle);
    },

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --branding-blue: #00d2ff;
                --branding-purple: #9d50bb;
                --branding-white: #ffffff;
            }

            .canvas-branding {
                position: absolute;
                top: 40px;
                right: 40px;
                text-align: right;
                pointer-events: none;
                z-index: 1000;
                animation: branding-fade-in 1.2s ease-out forwards;
            }

            .canvas-branding h1 {
                font-family: 'Orbitron', sans-serif;
                font-size: clamp(1.4rem, 4vw, 1.8rem);
                margin: 0;
                letter-spacing: 4px;
                background: linear-gradient(to right, var(--branding-blue), var(--branding-white), var(--branding-purple));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 10px rgba(0, 210, 255, 0.4));
                text-transform: uppercase;
                line-height: 1.1;
                font-weight: 700;
            }

            .canvas-subtitle {
                font-family: 'Orbitron', sans-serif;
                font-size: clamp(0.6rem, 2vw, 0.8rem);
                letter-spacing: 6px;
                color: var(--branding-blue);
                margin-top: 8px;
                opacity: 0.9;
                text-transform: uppercase;
                text-shadow: 0 0 5px var(--branding-blue);
            }

            @keyframes branding-fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Tablet / iPad Portrait Optimization */
            @media (max-width: 1024px) and (orientation: portrait) {
                .canvas-branding {
                    top: 20px;
                    right: 20px;
                }
                .canvas-subtitle {
                    letter-spacing: 3px;
                }
                .canvas-branding h1 {
                    font-size: 1.2rem;
                }
            }
        `;
        document.head.appendChild(style);
    },

    injectHTML(title, subtitle) {
        const container = document.createElement('div');
        container.className = 'canvas-branding';
        container.innerHTML = `
            <h1>${title}</h1>
            <div class="canvas-subtitle">${subtitle}</div>
        `;
        document.body.appendChild(container);
    }
};
