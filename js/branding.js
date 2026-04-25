/* @AI-READONLY: CENTRAL BRANDING ENGINE - DO NOT MODIFY WITHOUT EXPLICIT USER COMMAND */
/**
 * Cyber-Labor Branding Engine v5.3.8 (ULTRA Edition - Responsive Upgrade)
 * Centralized branding and navigation component for Doc Alvers Laboratories.
 */
const CyberBranding = {
    MASTER_TITLE: "DOC ALVERS MATHE-LABOR",
    /// MRA ///
    DEV_MODE: true, // Master Switch for Auto-Reload
    FORCE_INTERNAL_STYLES: false, // Ultimate extraction test: keep false to rely on external CSS only

    init(config = {}) {
        let title = this.MASTER_TITLE;
        let subtitle = "CYBER-LABORATORIUM";
        let useExternalStyles = false;

        // Polymorphic Init: Support both string (subtitle only) and object (legacy)
        if (typeof config === 'string') {
            subtitle = config;
        } else if (typeof config === 'object') {
            if (config.title) title = config.title;
            if (config.subtitle) subtitle = config.subtitle;
            if (config.briefing) this.briefingContent = config.briefing;
            if (config.useExternalStyles === true) useExternalStyles = true;
        }

        console.log(`CyberBranding v5.3.8 Initialized | ${title} : ${subtitle}`);

        // Safe migration path with global override:
        // - FORCE_INTERNAL_STYLES=true forces legacy inlined styles for quick rollback.
        // - Otherwise, pages should rely on extracted external CSS.
        const shouldUseInternalStyles = this.FORCE_INTERNAL_STYLES === true;
        if (shouldUseInternalStyles) {
            this.injectStyles();
        }
        this.injectHTML(title, subtitle);
        this.injectNavigation();
        this.setupActiveScaling();
        this.updateScale();
        if (!this.briefingContent) this.briefingContent = "";

        // --- DEV-MODE: SYSTEM SYNC ---
        if (this.DEV_MODE) {
            console.warn("⚠️ DEV_MODE ACTIVE: Page will hard-reload on tab focus.");
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") {
                    console.log("♻️ Dev-Mode: Triggering hard reload...");
                    window.location.reload(true);
                }
            });
        }
    },

    injectStyles() {
        // External CSS migration is complete.
        // Legacy inlined styles were removed from this file.
        console.warn("CyberBranding.injectStyles() is deprecated. Use js/branding.styles.extracted.css.");
    },

    injectHTML(topLine, bottomLine) {
        if (document.querySelector('.canvas-branding')) return;

        const container = document.createElement('div');
        container.className = 'canvas-branding';
        container.title = "Vollbild umschalten";
        container.innerHTML = `
            <h1 id="branding-master-title">${topLine}</h1>
            <div class="canvas-subtitle" id="branding-module-title">${bottomLine}</div>
        `;

        container.addEventListener('click', () => this.toggleFullscreen());
        document.body.appendChild(container);
    },

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Fullscreen error: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
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

        // --- DEV-MODE INDICATOR: RED HOME BUTTON (INTENSE) ---
        if (this.DEV_MODE) {
            homeBtn.style.background = "rgba(255, 0, 0, 0.5)";
            homeBtn.style.borderColor = "#ff0000";
            homeBtn.style.color = "#ff0000";
            homeBtn.style.boxShadow = "0 0 25px rgba(255, 0, 0, 0.6)";
            homeBtn.title = "DEV-MODE AKTIV: Auto-Reload an!";
        }

        homeBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
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
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
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
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
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

        // Edit Button
        const editBtn = document.createElement('div');
        editBtn.className = 'nav-btn';
        editBtn.title = 'Edit-Modus umschalten';
        editBtn.onclick = () => this.requestEditAccess();
        editBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        `;

        // Bug Report Button
        const bugBtn = document.createElement('div');
        bugBtn.className = 'nav-btn';
        bugBtn.title = 'Fehler oder Feedback melden';
        bugBtn.style.color = 'var(--branding-orange)';
        bugBtn.onclick = () => this.showBugReport();
        bugBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
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

        // Briefing Button
        const briefingBtn = document.createElement('div');
        briefingBtn.className = 'nav-btn';
        briefingBtn.title = 'Beschreibung anzeigen';
        briefingBtn.onclick = () => this.showBriefing();
        briefingBtn.innerHTML = `
            <span style="font-family: 'Orbitron', sans-serif; font-weight: bold; font-size: 1.5rem; line-height: 1; display: block;">?</span>
        `;

        nav.appendChild(homeBtn);
        nav.appendChild(backBtn);
        nav.appendChild(qrBtn);
        nav.appendChild(editBtn);
        nav.appendChild(bugBtn);
        nav.appendChild(briefingBtn);

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
    renderMath: function (elementId, latex, options = {}) {
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
    toggleEditMode: function () {
        this.isEditMode = !this.isEditMode;
        document.body.classList.toggle('cyber-edit-active', this.isEditMode);

        // STRICTLY RESTRICTED: Only the briefing-text becomes editable
        const briefingText = document.querySelector('.briefing-text');
        if (briefingText) {
            briefingText.contentEditable = this.isEditMode;
        }

        console.log(`[CYBER-ENGINE] Briefing Editor ${this.isEditMode ? "ENABLED" : "DISABLED"}`);

        // Visual feedback for the Pen button (Blue identity)
        const btns = document.querySelectorAll('.nav-btn');
        const editBtn = Array.from(btns).find(b => b.title.includes('Edit') || b.title.includes('bearbeiten'));

        if (editBtn) {
            editBtn.style.color = this.isEditMode ? 'var(--branding-blue)' : 'white';
            editBtn.style.borderColor = this.isEditMode ? 'var(--branding-blue)' : '';
            editBtn.style.boxShadow = this.isEditMode ? '0 0 15px var(--branding-blue)' : '';
        }

        if (this.isEditMode) {
            this.showNotification("Briefing-Editor Aktiv: Text kann nun geändert werden.");
        }

        window.dispatchEvent(new CustomEvent('cyber-edit-toggle', { detail: { active: this.isEditMode } }));
    },

    requestEditAccess: function () {
        if (this.isEditMode) {
            this.toggleEditMode();
            return;
        }

        let overlay = document.getElementById('cyber-auth-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cyber-auth-overlay';
            overlay.className = 'auth-overlay';
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="auth-modal">
                <div class="briefing-header" style="color: var(--branding-blue);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    SECURITY CLEARANCE
                </div>
                <div style="font-size: 0.8rem; margin-top: 10px; opacity: 0.6; font-family: Orbitron;">LEVEL 5 ACCESS REQUIRED</div>
                <input type="password" id="cyber-pwd-input" class="auth-input" placeholder="********" autocomplete="off">
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="nav-btn" style="width: auto; padding: 10px 25px;" onclick="CyberBranding.validateAccess()">LOGIN</button>
                    <button class="nav-btn" style="width: auto; padding: 10px 25px; opacity: 0.5;" onclick="document.getElementById('cyber-auth-overlay').classList.remove('visible')">CANCEL</button>
                </div>
            </div>
        `;

        setTimeout(() => {
            overlay.classList.add('visible');
            const input = document.getElementById('cyber-pwd-input');
            input.focus();
            input.onkeydown = (e) => { if (e.key === 'Enter') this.validateAccess(); };
        }, 10);
    },

    validateAccess: function () {
        const input = document.getElementById('cyber-pwd-input');
        // Secure Obfuscation (Base64 check for !aMe5007!!??)
        const target = "IWFNZTUwMDchIT8/";

        if (btoa(input.value) === target) {
            document.getElementById('cyber-auth-overlay').classList.remove('visible');
            this.toggleEditMode();
            this.showNotification("Zugriff gewährt. Briefing-Edit aktiviert.");

            // Auto-open briefing
            setTimeout(() => this.showBriefing(), 300);
        } else {
            this.showNotification("Zugriff verweigert. Falsches Passwort.");
            input.value = "";
            input.focus();

            // Animation for error
            const modal = document.querySelector('.auth-modal');
            modal.style.borderColor = 'red';
            modal.style.boxShadow = '0 0 30px rgba(255,0,0,0.4)';
            setTimeout(() => {
                modal.style.borderColor = '';
                modal.style.boxShadow = '';
            }, 500);
        }
    },

    showNotification: function (msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: var(--branding-blue); color: black; padding: 10px 20px;
            border-radius: 5px; font-family: Orbitron; font-size: 0.8rem;
            z-index: 10000; box-shadow: 0 0 20px rgba(0, 210, 255, 0.4);
            animation: fadeIn 0.3s ease;
        `;
        toast.innerText = `⚛️ ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    setBriefing: function (html) {
        this.briefingContent = html;
    },

    showBriefing: function () {
        if (!this.briefingContent) return this.showNotification("Keine Beschreibung für dieses Modul vorhanden.");

        let overlay = document.getElementById('cyber-briefing-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cyber-briefing-overlay';
            overlay.className = 'briefing-overlay';
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.remove('visible');
            };
            document.body.appendChild(overlay);
        }

        const copyBtnHTML = this.isEditMode ? `
            <button class="nav-btn" style="width: auto; height: auto; padding: 10px 25px; display: inline-flex !important; border-color: var(--branding-blue) !important;" 
                onclick="CyberBranding.copyLocalBriefing()">
                Text kopieren
            </button>
        ` : '';

        overlay.innerHTML = `
            <div class="briefing-modal">
                <div class="briefing-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Beschreibung
                </div>
                <div class="briefing-text" ${this.isEditMode ? 'contenteditable="true"' : ''}>${this.briefingContent}</div>
                <div style="margin-top: 30px; display: flex; justify-content: flex-end; gap: 15px;">
                    ${copyBtnHTML}
                    <button class="nav-btn" style="width: auto; height: auto; padding: 12px 35px; min-width: 140px; display: inline-flex !important;" onclick="document.getElementById('cyber-briefing-overlay').classList.remove('visible')">Verstanden</button>
                </div>
            </div>
        `;

        setTimeout(() => overlay.classList.add('visible'), 10);
    },

    copyLocalBriefing: function () {
        const el = document.querySelector('.briefing-text');
        // Copy innerHTML to preserve the structure (!admin-info etc) for Antigravity
        const content = el.innerHTML;
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification("Komplette Struktur kopiert (bereit für Antigravity)!");
        });
    },

    transmitEdits: function () {
        const labName = window.location.pathname.split('/').pop() || 'index.html';
        const selectors = '.stat-value, .stat-label, .instrument-title, .canvas-branding h1, .canvas-subtitle, .briefing-text, .label-row span:first-child';
        const edits = [];

        document.querySelectorAll(selectors).forEach(el => {
            edits.push({
                selector: el.className.split(' ')[0], // Base class as hint
                id: el.id || 'none',
                text: el.innerText.trim(),
                context: el.closest('.instrument-card')?.querySelector('.instrument-title')?.innerText || 'Global'
            });
        });

        const syncReport = {
            lab: labName,
            timestamp: new Date().toISOString(),
            edits: edits
        };

        const reportJSON = JSON.stringify(syncReport, null, 2);

        // Copy to clipboard
        navigator.clipboard.writeText(reportJSON).then(() => {
            this.showSyncModal(reportJSON);
        }).catch(err => {
            alert("Fehler beim Kopieren. Hier ist dein Report:\n" + reportJSON);
        });
    },

    showSyncModal: function (json) {
        let overlay = document.getElementById('cyber-sync-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cyber-sync-overlay';
            overlay.className = 'sync-overlay';
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.remove('visible');
            };
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="sync-modal">
                <div class="briefing-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                    </svg>
                    Sync-Paket geschnürt
                </div>
                <div style="font-size: 0.9rem; margin-bottom: 15px;">Alle Änderungen wurden erfasst und in die <b>Zwischenablage kopiert</b>.</div>
                <div class="sync-report-area">${json}</div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 25px;">Kopiere diesen Text einfach zurück in den Chat mit Antigravity.</div>
                <button class="nav-btn" style="width: auto; height: auto; padding: 10px 25px; display: inline-flex !important;" onclick="document.getElementById('cyber-sync-overlay').classList.remove('visible')">Verstanden</button>
            </div>
        `;

        setTimeout(() => overlay.classList.add('visible'), 10);
    }
};
