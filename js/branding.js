/**
 * Cyber-Labor Branding Engine v5.3.8 (ULTRA Edition - Responsive Upgrade)
 * Centralized branding and navigation component for Doc Alvers Laboratories.
 */
const CyberBranding = {
    init(config = {}) {
        const title = config.title || "Doc Alvers Mathe-Labor";
        const subtitle = config.subtitle || "CYBER-LABORATORIUM";

        console.log("CyberBranding v5.3.8 (ULTRA Responsive) Initialized");

        this.injectStyles();
        this.injectHTML(title, subtitle);
        this.injectNavigation();
        this.setupActiveScaling();
        this.updateScale();
    },

    injectStyles() {
        if(document.getElementById('cyber-branding-styles')) return;
        const style = document.createElement('style');
        style.id = 'cyber-branding-styles';
        style.textContent = `
            :root {
                --branding-blue: #00d2ff;
                --branding-purple: #9d50bb;
                --branding-white: #ffffff;
                --header-scale: 1;
            }

            /* Branding Logo (Right-pinned Master Header) */
            .canvas-branding {
                position: fixed;
                top: 40px;
                right: 40px; 
                text-align: right;
                pointer-events: none;
                z-index: 99999;
                animation: branding-fade-in 1.2s ease-out forwards;
                max-width: 70%;
                transition: top 0.3s ease, right 0.3s ease;
            }

            .canvas-branding h1 {
                font-family: 'Orbitron', sans-serif;
                font-size: calc(14px + 14px * var(--header-scale));
                margin: 0;
                letter-spacing: calc(1px + 3px * var(--header-scale));
                background: linear-gradient(to right, var(--branding-blue), var(--branding-white), var(--branding-purple));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 0 10px rgba(0, 210, 255, 0.4));
                text-transform: uppercase;
                line-height: 1.1;
                font-weight: 700;
                transition: font-size 0.2s ease;
            }

            .canvas-subtitle {
                font-family: 'Orbitron', sans-serif;
                font-size: calc(7px + 3px * var(--header-scale));
                letter-spacing: calc(2px + 6px * var(--header-scale));
                color: var(--branding-blue);
                margin-top: 6px;
                opacity: 0.8;
                text-transform: uppercase;
                text-shadow: 0 0 5px var(--branding-blue);
                transition: font-size 0.2s ease;
            }

            @media (max-width: 1024px) {
                .canvas-branding { top: 20px; right: 25px; }
            }

            @media (max-width: 768px) {
                .canvas-branding { top: 20px; right: 15px; max-width: 80%; }
                .canvas-branding h1 { letter-spacing: 1px; font-size: calc(12px + 10px * var(--header-scale)); }
                .canvas-subtitle { letter-spacing: 2px; margin-top: 2px; font-size: calc(7px + 2px * var(--header-scale)); }
            }

            @media (max-width: 500px) {
                .canvas-branding { top: 20px; right: 10px; max-width: 90%; }
                .canvas-branding h1 { font-size: calc(11px + 7px * var(--header-scale)); letter-spacing: 0.5px; }
                .canvas-subtitle { display: none !important; } /* Hard hide for mobile clarity */
            }

            /* Central Navigation */
            .cyber-nav {
                display: flex !important;
                gap: 12px;
                z-index: 100000 !important;
                animation: branding-fade-in 1.2s ease-out forwards;
            }

            .cyber-nav.integrated {
                margin-bottom: 15px;
                width: 100%;
                justify-content: flex-start;
                position: relative;
            }

            .cyber-nav.floating {
                position: fixed;
                top: 20px;
                left: 20px;
            }

            .nav-btn {
                width: 45px;
                height: 45px;
                background: rgba(15, 23, 42, 0.85) !important;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 12px;
                display: flex !important;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                color: white !important;
                text-decoration: none;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            }

            .nav-btn:hover {
                transform: translateY(-3px) scale(1.05);
                border-color: var(--branding-blue) !important;
                background: rgba(0, 210, 255, 0.3) !important;
                box-shadow: 0 0 25px rgba(0, 210, 255, 0.6);
            }

            .nav-btn svg { width: 22px; height: 22px; stroke-width: 2.5; display: block; }

            @keyframes branding-fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Ensure sidebar-header doesn't collapse */
            #sidebar-header:empty::before {
                content: "";
                display: block;
                height: 60px;
            }

            /* QR Overlay Styles */
            .qr-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 11, 24, 0.85);
                backdrop-filter: blur(10px);
                z-index: 200000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s ease;
            }

            .qr-overlay.visible {
                opacity: 1;
                pointer-events: auto;
            }

            .qr-container {
                background: rgba(15, 23, 42, 0.95);
                padding: 30px;
                border-radius: 24px;
                border: 1px solid rgba(0, 210, 255, 0.3);
                box-shadow: 0 0 40px rgba(0, 210, 255, 0.2);
                text-align: center;
                transform: scale(0.8);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .qr-overlay.visible .qr-container {
                transform: scale(1);
            }

            .qr-container img {
                width: 250px;
                height: 250px;
                border: 10px solid white;
                border-radius: 8px;
                margin-bottom: 20px;
            }

            .qr-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.9rem;
                color: var(--branding-blue);
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }

            .qr-url {
                font-family: 'monospace';
                font-size: 0.85rem;
                color: var(--branding-blue);
                margin: 10px 0 15px 0;
                word-break: break-all;
                padding: 0 20px;
                text-decoration: none;
                transition: opacity 0.3s;
                display: block;
            }

            .qr-url:hover {
                opacity: 0.7;
                text-decoration: underline;
            }

            .qr-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                font-size: 1.2rem;
                transition: all 0.3s;
            }

            .qr-close:hover {
                background: rgba(255, 0, 0, 0.3);
                transform: rotate(90deg);
            }

            .qr-hint {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.5);
                margin-top: 10px;
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
        document.body.appendChild(container);
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        `;

        nav.appendChild(homeBtn);
        nav.appendChild(backBtn);

        // QR Button
        const qrBtn = document.createElement('div');
        qrBtn.className = 'nav-btn';
        qrBtn.title = 'QR-Code für diese Seite';
        qrBtn.onclick = () => this.showQR();
        qrBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <path d="M7 7h.01"></path>
                <path d="M17 7h.01"></path>
                <path d="M17 17h.01"></path>
                <path d="M7 17h.01"></path>
            </svg>
        `;
        nav.appendChild(qrBtn);

        const sidebarHeader = document.getElementById('sidebar-header');
        const sidebar = sidebarHeader || 
                        document.getElementById('side-panel') || 
                        document.getElementById('sidebar') || 
                        document.querySelector('aside') ||
                        document.querySelector('.sidebar');

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
        window.addEventListener('load', () => this.updateScale());
    },

    updateScale() {
        const w = window.innerWidth;
        // Optimized Responsive Scale between 320px and 1400px
        let scale = (w - 320) / (1400 - 320);
        scale = Math.max(0, Math.min(1, scale));
        document.documentElement.style.setProperty('--header-scale', scale);
    },

    showQR() {
        let overlay = document.getElementById('cyber-qr-overlay');
        
        // Build the public URL (map local to docalvers.de)
        const pathParts = window.location.pathname.split('/');
        const filename = pathParts[pathParts.length - 1] || 'index.html';
        const publicURL = `https://docalvers.de/${filename}`;

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cyber-qr-overlay';
            overlay.className = 'qr-overlay';
            
            overlay.onclick = (e) => {
                if(e.target === overlay) overlay.classList.remove('visible');
            };

            document.body.appendChild(overlay);
        }

        const apiURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicURL)}`;

        overlay.innerHTML = `
            <div class="qr-container">
                <div class="qr-close" onclick="document.getElementById('cyber-qr-overlay').classList.remove('visible')">×</div>
                <div class="qr-title">Page Share</div>
                <img src="${apiURL}" alt="QR Code">
                <a href="${publicURL}" target="_blank" class="qr-url">${publicURL}</a>
                <div class="qr-hint">Scan to open on mobile</div>
            </div>
        `;

        setTimeout(() => overlay.classList.add('visible'), 10);
    }
};
