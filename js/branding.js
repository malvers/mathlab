/* @AI-READONLY: CENTRAL BRANDING ENGINE - DO NOT MODIFY WITHOUT EXPLICIT USER COMMAND */
/**
 * Cyber-Labor Branding Engine v5.3.8 (ULTRA Edition - Responsive Upgrade)
 * Centralized branding and navigation component for Doc Alvers Laboratories.
 */
function getBrandingCore() {
    return window.CyberBrandingCore || null;
}

function getBrandingNav() {
    return window.CyberBrandingNav || null;
}

function getBrandingOverlays() {
    return window.CyberBrandingOverlays || null;
}

const CyberBranding = {
    MASTER_TITLE: "DOC ALVERS MATHE-LABOR",
    /// MRA ///
    DEV_MODE: true, // Master Switch for Auto-Reload
    FORCE_INTERNAL_STYLES: false, // Ultimate extraction test: keep false to rely on external CSS only
    _coreLoadRequested: false,
    _navLoadRequested: false,
    _overlaysLoadRequested: false,

    ensureFavicon(href = "resources/favicon.svg") {
        const head = document.head || document.getElementsByTagName("head")[0];
        if (!head) return;

        // Prefer one managed favicon link and keep it stable across labs.
        let link = head.querySelector('link[rel="icon"][data-cyber-favicon="1"]');
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "icon");
            link.setAttribute("data-cyber-favicon", "1");
            head.appendChild(link);
        }
        link.setAttribute("type", "image/svg+xml");
        link.setAttribute("href", href);
    },

    ensureCoreModuleLoaded() {
        if (window.CyberBrandingCore || this._coreLoadRequested) return;

        const script = document.createElement("script");
        script.src = "js/branding/core.js";
        script.async = true;
        script.dataset.cyberBrandingCore = "1";
        script.onerror = () => {
            this._coreLoadRequested = false;
            console.warn("CyberBranding: failed to load js/branding/core.js, using in-file fallback.");
        };

        this._coreLoadRequested = true;
        document.head.appendChild(script);
    },

    ensureNavModuleLoaded() {
        if (window.CyberBrandingNav || this._navLoadRequested) return;

        const script = document.createElement("script");
        script.src = "js/branding/nav.js";
        script.async = true;
        script.dataset.cyberBrandingNav = "1";
        script.onerror = () => {
            this._navLoadRequested = false;
            console.warn("CyberBranding: failed to load js/branding/nav.js, using in-file fallback.");
        };

        this._navLoadRequested = true;
        document.head.appendChild(script);
    },

    ensureOverlaysModuleLoaded() {
        if (window.CyberBrandingOverlays || this._overlaysLoadRequested) return;

        const script = document.createElement("script");
        script.src = "js/branding/overlays.js";
        script.async = true;
        script.dataset.cyberBrandingOverlays = "1";
        script.onerror = () => {
            this._overlaysLoadRequested = false;
            console.warn("CyberBranding: failed to load js/branding/overlays.js, using in-file fallback.");
        };

        this._overlaysLoadRequested = true;
        document.head.appendChild(script);
    },

    init(config = {}) {
        this.ensureCoreModuleLoaded();
        this.ensureNavModuleLoaded();
        this.ensureOverlaysModuleLoaded();
        const brandingCore = getBrandingCore();
        if (brandingCore && typeof brandingCore.init === "function") {
            return brandingCore.init.call(this, config);
        }
        let title = this.MASTER_TITLE;
        let subtitle = "CYBER-LABORATORIUM";

        // Polymorphic Init: Support both string (subtitle only) and object (legacy)
        if (typeof config === 'string') {
            subtitle = config;
        } else if (typeof config === 'object') {
            if (config.title) title = config.title;
            if (config.subtitle) subtitle = config.subtitle;
            if (config.briefing) this.briefingContent = config.briefing;
        }

        console.log(`CyberBranding v5.3.8 Initialized | ${title} : ${subtitle}`);

        // Safe migration path with global override:
        // - FORCE_INTERNAL_STYLES=true forces legacy inlined styles for quick rollback.
        // - Otherwise, pages should rely on extracted external CSS.
        const shouldUseInternalStyles = this.FORCE_INTERNAL_STYLES === true;
        if (shouldUseInternalStyles) {
            this.injectStyles();
        }
        this.ensureFavicon();
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
        const brandingCore = getBrandingCore();
        if (brandingCore && typeof brandingCore.injectHTML === "function") {
            return brandingCore.injectHTML.call(this, topLine, bottomLine);
        }
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
        const brandingCore = getBrandingCore();
        if (brandingCore && typeof brandingCore.toggleFullscreen === "function") {
            return brandingCore.toggleFullscreen.call(this);
        }
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
        const brandingNav = getBrandingNav();
        if (brandingNav && typeof brandingNav.injectNavigation === "function") {
            return brandingNav.injectNavigation.call(this);
        }
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
        const brandingCore = getBrandingCore();
        if (brandingCore && typeof brandingCore.setupActiveScaling === "function") {
            return brandingCore.setupActiveScaling.call(this);
        }
        window.addEventListener('resize', () => this.updateScale());
        window.addEventListener('load', () => this.updateScale());
    },

    updateScale() {
        const brandingCore = getBrandingCore();
        if (brandingCore && typeof brandingCore.updateScale === "function") {
            return brandingCore.updateScale.call(this);
        }
        const w = window.innerWidth;
        // Optimized Responsive Scale between 320px and 1400px
        let scale = (w - 320) / (1400 - 320);
        scale = Math.max(0, Math.min(1, scale));
        document.documentElement.style.setProperty('--header-scale', scale);
    },

    showQR() {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.showQR === "function") {
            return brandingOverlays.showQR.call(this);
        }
        console.warn("CyberBranding overlays module not ready: showQR.");
    },

    showBugReport() {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.showBugReport === "function") {
            return brandingOverlays.showBugReport.call(this);
        }
        console.warn("CyberBranding overlays module not ready: showBugReport.");
    },

    sendReportEmail(filename, meta) {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.sendReportEmail === "function") {
            return brandingOverlays.sendReportEmail.call(this, filename, meta);
        }
        const text = document.getElementById('report-text').value;
        if (!text) return alert("Bitte gib eine kurze Beschreibung ein.");

        const subject = encodeURIComponent(`Support-Anfrage: ${filename}`);
        const body = encodeURIComponent(`Hallo Doc Alvers,\n\nAnfrage und/oder Feedback:\n${text}\n\nDiagnose (Details):\n${meta}\n\nGesendet von docalvers.de.`);
        window.location.href = `mailto:michael.r.alvers@gmail.com?subject=${subject}&body=${body}`;
    },

    async copyReportToClipboard(filename, meta) {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.copyReportToClipboard === "function") {
            return brandingOverlays.copyReportToClipboard.call(this, filename, meta);
        }
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
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.toggleEditMode === "function") {
            return brandingOverlays.toggleEditMode.call(this);
        }
        console.warn("CyberBranding overlays module not ready: toggleEditMode.");
    },

    requestEditAccess: function () {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.requestEditAccess === "function") {
            return brandingOverlays.requestEditAccess.call(this);
        }
        console.warn("CyberBranding overlays module not ready: requestEditAccess.");
    },

    validateAccess: function () {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.validateAccess === "function") {
            return brandingOverlays.validateAccess.call(this);
        }
        console.warn("CyberBranding overlays module not ready: validateAccess.");
    },

    showNotification: function (msg) {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.showNotification === "function") {
            return brandingOverlays.showNotification.call(this, msg);
        }
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
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.setBriefing === "function") {
            return brandingOverlays.setBriefing.call(this, html);
        }
        this.briefingContent = html;
    },

    showBriefing: function () {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.showBriefing === "function") {
            return brandingOverlays.showBriefing.call(this);
        }
        console.warn("CyberBranding overlays module not ready: showBriefing.");
    },

    copyLocalBriefing: function () {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.copyLocalBriefing === "function") {
            return brandingOverlays.copyLocalBriefing.call(this);
        }
        console.warn("CyberBranding overlays module not ready: copyLocalBriefing.");
    },

    transmitEdits: function () {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.transmitEdits === "function") {
            return brandingOverlays.transmitEdits.call(this);
        }
        console.warn("CyberBranding overlays module not ready: transmitEdits.");
    },

    showSyncModal: function (json) {
        const brandingOverlays = getBrandingOverlays();
        if (brandingOverlays && typeof brandingOverlays.showSyncModal === "function") {
            return brandingOverlays.showSyncModal.call(this, json);
        }
        console.warn("CyberBranding overlays module not ready: showSyncModal.");
    }
};
