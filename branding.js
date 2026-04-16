/**
 * Cyber-Labor Branding Engine v5.2 (Layout-Aware Navigation)
 * Centralized branding and navigation component for Doc Alvers Laboratories.
 */
const CyberBranding = {
    init(config = {}) {
        const title = config.title || "Cyber Laboratory";
        const subtitle = config.subtitle || "MATHEMATICAL VISUALIZATION";
        
        console.log("CyberBranding v5.2 (Layout-Aware) Initialized");
        
        this.injectStyles();
        this.injectHTML(title, subtitle);
        this.injectNavigation();
        this.setupActiveScaling();
        this.updateScale();
    },

    injectStyles() {
        const style = document.createElement('style');
        style.id = 'cyber-branding-styles';
        style.textContent = `
            :root {
                --branding-blue: #00d2ff;
                --branding-purple: #9d50bb;
                --branding-white: #ffffff;
                --header-scale: 1;
            }

            /* Branding Logo (Right-pinned for Workspace focus) */
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
                font-size: calc(14px + 14px * var(--header-scale)); /* Smaller */
                margin: 0;
                letter-spacing: calc(2px + 2px * var(--header-scale));
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
                font-size: calc(6px + 4px * var(--header-scale)); /* Smaller */
                letter-spacing: calc(4px + 4px * var(--header-scale));
                color: var(--branding-blue);
                margin-top: 6px;
                opacity: 0.8;
                text-transform: uppercase;
                text-shadow: 0 0 5px var(--branding-blue);
            }

            /* Central Navigation */
            .cyber-nav {
                display: flex;
                gap: 12px;
                z-index: 2000;
                animation: branding-fade-in 1.2s ease-out forwards;
            }

            /* Floating Fallback if no sidebar */
            .cyber-nav.floating {
                position: fixed;
                top: 20px;
                left: 20px;
            }

            /* Integrated Style if inside sidebar */
            .cyber-nav.integrated {
                margin-bottom: 20px;
                width: 100%;
                justify-content: flex-start;
            }

            .nav-btn {
                width: 45px;
                height: 45px;
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: white;
                text-decoration: none;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }

            .nav-btn:hover {
                transform: translateY(-3px) scale(1.05);
                border-color: var(--branding-blue);
                background: rgba(0, 210, 255, 0.25);
                box-shadow: 0 0 25px rgba(0, 210, 255, 0.5);
                color: #fff;
            }

            .nav-btn svg {
                width: 22px;
                height: 22px;
            }

            @keyframes branding-fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    },

    injectHTML(title, subtitle) {
        if(document.querySelector('.canvas-branding')) return;
        const container = document.createElement('div');
        container.className = 'canvas-branding';
        container.innerHTML = `
            <h1>${title}</h1>
            <div class="canvas-subtitle">${subtitle}</div>
        `;
        
        // Logical injection: Preferred workspace, fallback to body
        const target = document.getElementById('workspace') || 
                       document.getElementById('canvas-container') || 
                       document.body;
        target.appendChild(container);
    },

    injectNavigation() {
        if(document.querySelector('.cyber-nav')) return;
        const nav = document.createElement('div');
        nav.className = 'cyber-nav';
        
        // Home Button
        const homeBtn = document.createElement('a');
        homeBtn.className = 'nav-btn';
        homeBtn.href = 'index.html';
        homeBtn.title = 'Dashboard öffnen';
        homeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        `;

        // Back Button
        const backBtn = document.createElement('div');
        backBtn.className = 'nav-btn';
        backBtn.title = 'Zurück zum Dashboard';
        backBtn.onclick = () => window.history.back();
        backBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        `;

        nav.appendChild(homeBtn);
        nav.appendChild(backBtn);

        // Sidebar detection: check #sidebar-header first (targeted), then fallbacks
        const sidebarHeader = document.getElementById('sidebar-header');
        const sidebar = sidebarHeader || 
                        document.getElementById('side-panel') || 
                        document.querySelector('.sidebar') || 
                        document.querySelector('aside');
        
        if (sidebar) {
            nav.classList.add('integrated');
            if (sidebarHeader) {
                sidebarHeader.appendChild(nav);
            } else {
                sidebar.prepend(nav);
            }
        } else {
            nav.classList.add('floating');
            document.body.appendChild(nav);
        }
    },

    setupActiveScaling() {
        window.addEventListener('resize', () => this.updateScale());
    },

    updateScale() {
        const w = window.innerWidth;
        let scale = (w - 400) / (1400 - 400);
        scale = Math.max(0, Math.min(1, scale));
        document.documentElement.style.setProperty('--header-scale', scale);
    }
};
