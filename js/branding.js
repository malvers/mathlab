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
        if (document.getElementById('cyber-branding-styles')) return;
        const style = document.createElement('style');
        style.id = 'cyber-branding-styles';
        style.textContent = `
            :root {
                --branding-blue: #00d2ff;
                --branding-purple: #9d50bb;
                --branding-white: #ffffff;
                --branding-orange: #ff9d00;
                --header-scale: 1;
            }

            /* Report Terminal Modal */
            .report-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 11, 24, 0.85);
                backdrop-filter: blur(15px);
                z-index: 300000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s ease;
            }

            .report-overlay.visible {
                opacity: 1;
                pointer-events: auto;
            }

            .report-container {
                background: rgba(15, 23, 42, 0.95);
                padding: 35px;
                border-radius: 24px;
                border: 1px solid rgba(255, 157, 0, 0.4);
                box-shadow: 0 0 50px rgba(255, 157, 0, 0.2);
                width: 90%;
                max-width: 500px;
                transform: scale(0.9);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                text-align: center;
            }

            .report-overlay.visible .report-container {
                transform: scale(1);
            }

            .report-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.1rem;
                color: var(--branding-orange);
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .report-textarea {
                width: 100%;
                height: 150px;
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                padding: 15px;
                font-family: 'Inter', sans-serif;
                font-size: 0.95rem;
                resize: none;
                margin-bottom: 20px;
                outline: none;
                box-sizing: border-box;
                text-align: left;
            }

            .report-textarea:focus {
                border-color: var(--branding-orange);
                box-shadow: 0 0 15px rgba(255, 157, 0, 0.2);
            }

            .report-meta {
                font-size: 0.7rem;
                color: rgba(255, 255, 255, 0.4);
                margin-bottom: 25px;
                background: rgba(255, 255, 255, 0.03);
                padding: 10px;
                border-radius: 8px;
                font-family: monospace;
                text-align: left;
                line-height: 1.4;
            }

            .report-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .report-btn {
                padding: 12px 20px;
                border-radius: 10px;
                font-family: 'Orbitron';
                font-size: 0.7rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: uppercase;
                border: none;
            }

            .report-btn.primary {
                background: var(--branding-orange);
                color: black;
            }

            .report-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .report-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            .report-close {
                position: absolute;
                top: 15px;
                right: 15px;
                color: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                font-size: 1.2rem;
            }

            /* --- EDIT MODE SYSTEM --- */
            body.cyber-edit-active {
                cursor: crosshair;
            }

            body.cyber-edit-active .stat-value,
            body.cyber-edit-active .stat-label,
            body.cyber-edit-active .label-row span:first-child {
                outline: 1px dashed var(--branding-orange);
                outline-offset: 4px;
                position: relative;
                cursor: text;
                transition: all 0.2s ease;
            }

            body.cyber-edit-active .stat-value:hover,
            body.cyber-edit-active .stat-label:hover {
                background: rgba(255, 165, 0, 0.1);
                box-shadow: 0 0 15px rgba(255, 165, 0, 0.2);
            }

            body.cyber-edit-active .stat-box {
                border-style: dashed;
                border-color: var(--branding-orange);
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
                margin-bottom: 2px;
            }

            .canvas-subtitle {
                font-family: 'Orbitron', sans-serif;
                font-size: calc(7.9px + 3.5px * var(--header-scale)); /* +20% again */
                letter-spacing: calc(1px + 3.5px * var(--header-scale));
                color: var(--branding-blue);
                margin-top: 3px;
                opacity: 0.9;
                text-transform: uppercase;
                text-shadow: 0 0 7px var(--branding-blue);
                transition: font-size 0.2s ease;
                line-height: 1.1;
                font-weight: 400;
            }

            @media (max-width: 1024px) {
                .canvas-branding { top: 20px; right: 25px; }
            }

            @media (max-width: 768px) {
                .canvas-branding { top: 20px; right: 15px; max-width: 80%; }
                .canvas-branding h1 { letter-spacing: 2px; margin-top: 2px; font-size: calc(10px + 3px * var(--header-scale)); }
                .canvas-subtitle { letter-spacing: 1px; font-size: calc(12px + 10px * var(--header-scale)); }
            }

            @media (max-width: 500px) {
                .canvas-branding { top: 20px; right: 10px; max-width: 90%; }
                .canvas-branding h1 { display: none !important; }
                .canvas-subtitle { font-size: calc(11px + 7px * var(--header-scale)); letter-spacing: 0.5px; }
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
                width: 36px;
                height: 36px;
                background: rgba(15, 23, 42, 0.85) !important;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                border-radius: 10px;
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

            .nav-btn svg { width: 18px; height: 18px; stroke-width: 2.5; display: block; }

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

    injectHTML(arg1, arg2) {
        if (document.querySelector('.canvas-branding')) return;
        
        // Smart-Swap: Ensure "DOC ALVERS" is always 'topLine'
        let topLine = arg1;
        let bottomLine = arg2;
        
        if (arg2 && arg2.toUpperCase().includes("ALVERS")) {
            topLine = arg2;
            bottomLine = arg1;
        }

        const container = document.createElement('div');
        container.className = 'canvas-branding';
        container.innerHTML = `
            <h1>${topLine}</h1>
            <div class="canvas-subtitle">${bottomLine}</div>
        `;
        document.body.appendChild(container);
    },

    injectNavigation() {
        if (document.querySelector('.cyber-nav')) return;
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

        // Edit Button (NEU)
        const editBtn = document.createElement('div');
        editBtn.className = 'nav-btn';
        editBtn.title = 'Edit-Modus umschalten';
        editBtn.onclick = () => this.toggleEditMode();
        editBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        `;

        // Bug Report Button (NEU & Am Ende)
        const bugBtn = document.createElement('div');
        bugBtn.className = 'nav-btn';
        bugBtn.title = 'Fehler oder Feedback melden';
        bugBtn.style.color = 'var(--branding-orange)';
        bugBtn.onclick = () => this.showBugReport();
        bugBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20V10"></path>
                <path d="M18 9a6 6 0 0 0-12 0v3a6 6 0 0 0 12 0v-3Z"></path>
                <path d="M12 10V4"></path>
                <path d="M6 12H2"></path>
                <path d="M22 12h-4"></path>
                <path d="M15 4l-3 3-3-3"></path>
                <path d="M18 17h4"></path>
                <path d="M2 17h4"></path>
            </svg>
        `;

        nav.appendChild(homeBtn);
        nav.appendChild(backBtn);
        nav.appendChild(qrBtn);
        nav.appendChild(editBtn); // NEU
        nav.appendChild(bugBtn);

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
                if (e.target === overlay) overlay.classList.remove('visible');
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
    },

    showBugReport() {
        let overlay = document.getElementById('cyber-report-overlay');
        const filename = window.location.pathname.split('/').pop() || 'index.html';
        const systemInfo = `Module: ${filename} | OS: ${navigator.platform} | Agent: ${navigator.userAgent.substring(0, 50)}... | Res: ${window.innerWidth}x${window.innerHeight}`;

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cyber-report-overlay';
            overlay.className = 'report-overlay';
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.remove('visible');
            };
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="report-container">
                <div class="report-close" onclick="document.getElementById('cyber-report-overlay').classList.remove('visible')">×</div>
                <div class="report-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20V10"></path><path d="M18 9a6 6 0 0 0-12 0v3a6 6 0 0 0 12 0v-3Z"></path>
                    </svg>
                    Bug-Report / Feedback
                </div>
                <textarea id="report-text" class="report-textarea" placeholder="Beschreibe kurz den Fehler oder dein Feedback..."></textarea>
                <div class="report-meta">SYSTEM-STATUS: ${systemInfo}</div>
                <div class="report-actions">
                    <button class="report-btn primary" onclick="CyberBranding.sendReportEmail('${filename}', '${systemInfo}')">Bericht senden</button>
                    <button class="report-btn secondary" onclick="CyberBranding.copyReportToClipboard('${filename}', '${systemInfo}')">Code kopieren</button>
                </div>
            </div>
        `;

        setTimeout(() => overlay.classList.add('visible'), 10);
        setTimeout(() => document.getElementById('report-text').focus(), 300);
    },

    sendReportEmail(filename, meta) {
        const text = document.getElementById('report-text').value;
        if (!text) return alert("Bitte gib eine kurze Beschreibung ein.");

        const subject = encodeURIComponent(`Support-Anfrage: ${filename}`);
        const body = encodeURIComponent(`Hallo Doc Alvers,\n\nAnfrage und/oder Feedback:\n${text}\n\nDiagnose (Details):\n${meta}\n\nGesendet von docalvers.de.`);
        window.location.href = `mailto:michael.r.alvers@gmail.com?subject=${subject}&body=${body}`;
    },

    async copyReportToClipboard(filename, meta) {
        const text = document.getElementById('report-text').value;
        if (!text) return alert("Bitte gib eine kurze Beschreibung ein.");

        const report = `[CYBER-REPORT]\nLAB: ${filename}\nMESSAGE: ${text}\nSTATUS: ${meta}`;

        try {
            await navigator.clipboard.writeText(report);
            const btn = document.querySelector('.report-btn.secondary');
            const oldText = btn.innerText;
            btn.innerText = "KOPIERT! ✅";
            btn.style.background = "#adff2f";
            btn.style.color = "#000";
            setTimeout(() => {
                btn.innerText = oldText;
                btn.style.background = "";
                btn.style.color = "";
            }, 2000);
        } catch (err) {
            alert("Kopieren fehlgeschlagen. Bitte manuell kopieren.");
        }
    },
    /**
     * Centralized KaTeX renderer for laboratory modules.
     * Safely renders LaTeX to a given element.
     */
    renderMath: function(elementId, latex, options = {}) {
        const el = document.getElementById(elementId);
        if (!el) return;
        
        // Force font color to brand blue/white for visibility
        el.style.color = "#ffffff";
        el.style.fontSize = "1.2rem";
        if (!el.innerHTML) el.innerHTML = "<span style='opacity:0.5; font-size:0.8rem;'>⚛️ LOADING FORMULA...</span>";

        const attemptRender = () => {
            if (window.katex) {
                el.innerHTML = "";
                window.katex.render(latex, el, Object.assign({ throwOnError: false, displayMode: false }, options));
            } else {
                setTimeout(attemptRender, 100);
            }
        };
        attemptRender();
    },

    /**
     * Toggles the experimental Edit Mode.
     * Can be extended for laboratory-specific editing logic.
     */
    toggleEditMode: function() {
        this.isEditMode = !this.isEditMode;
        document.body.classList.toggle('cyber-edit-active', this.isEditMode);
        
        // Toggle interactivity
        const editableSelectors = '.stat-value, .stat-label, .stat-meta, .label-row span:first-child';
        document.querySelectorAll(editableSelectors).forEach(el => {
            el.contentEditable = this.isEditMode;
        });

        console.log(`[CYBER-ENGINE] Edit Mode ${this.isEditMode ? "ENABLED" : "DISABLED"}`);
        
        // Visual feedback for the button
        const btns = document.querySelectorAll('.nav-btn');
        const editBtn = Array.from(btns).find(b => b.title.includes('Edit'));
        
        if (editBtn) {
            editBtn.style.color = this.isEditMode ? 'var(--branding-orange)' : 'white';
            editBtn.style.borderColor = this.isEditMode ? 'var(--branding-orange)' : '';
            editBtn.style.boxShadow = this.isEditMode ? '0 0 15px var(--branding-orange)' : '';
        }

        // Optional: Hint to user
        if (this.isEditMode) {
            this.showNotification("Edit-Modus Aktiv: Elemente zum Bearbeiten wählen");
        }

        // Module-specific dispatch
        window.dispatchEvent(new CustomEvent('cyber-edit-toggle', { detail: { active: this.isEditMode } }));
    },

    showNotification: function(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: var(--branding-orange); color: black; padding: 10px 20px;
            border-radius: 5px; font-family: Orbitron; font-size: 0.8rem;
            z-index: 10000; box-shadow: 0 0 20px rgba(255,165,0,0.5);
            animation: fadeIn 0.3s ease;
        `;
        toast.innerText = `⚛️ ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
