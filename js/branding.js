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

/** Basename without .html (lowercase); pathname + href fallback for file:// and edge cases */
function getBriefingModuleKey() {
    try {
        let path = window.location.pathname || "";
        const segments = path.split("/").filter(Boolean);
        let filename = segments.length ? segments[segments.length - 1] : "";
        if (!filename || !/\.html?$/i.test(filename)) {
            const href = window.location.href || "";
            const m = href.match(/\/([^/?#]+\.html?)(?:$|[?#])/i);
            if (m) filename = m[1];
        }
        if (!filename) filename = "index.html";
        filename = filename.split("?")[0].split("#")[0];
        return filename.replace(/\.html?$/i, "").toLowerCase();
    } catch (e) {
        return "index";
    }
}

const CYBER_BRIEFING_BTN = '.nav-btn[title="Beschreibung anzeigen"]';

function getBrandingNavHost() {
    return (
        document.getElementById("sidebar-header") ||
        document.getElementById("side-panel") ||
        document.getElementById("sidebar")
    );
}

function isCyberNavComplete(navEl) {
    return !!(navEl && navEl.querySelector(CYBER_BRIEFING_BTN));
}

/** Alte/leere .cyber-nav-Reste blockierten die komplette Injektion (ohne ?-Button). */
function cleanupIncompleteBrandingNav() {
    const host = getBrandingNavHost();
    if (host) {
        host.querySelectorAll(".cyber-nav").forEach((nav) => {
            if (!isCyberNavComplete(nav)) nav.remove();
        });
        return;
    }
    document.querySelectorAll("body > .cyber-nav.floating").forEach((nav) => {
        if (!isCyberNavComplete(nav)) nav.remove();
    });
}

function hasCompleteBrandingNav() {
    const host = getBrandingNavHost();
    if (host) {
        return Array.from(host.querySelectorAll(".cyber-nav")).some((n) => isCyberNavComplete(n));
    }
    const floating = document.querySelector("body > .cyber-nav.floating");
    return isCyberNavComplete(floating);
}

/** Wenn es einen Sidebar-Host gibt, aber nur eine floatende Nav, blockiert die oft die spätere integrierte Leiste. */
function reconcileFloatingNavAwayFromHost() {
    const host = getBrandingNavHost();
    if (!host) return;
    const hasInHost = Array.from(host.querySelectorAll(".cyber-nav")).some((n) => isCyberNavComplete(n));
    if (hasInHost) return;
    document.querySelectorAll("body > .cyber-nav.floating").forEach((n) => n.remove());
}

function runNavigationConsistency() {
    try {
        reconcileFloatingNavAwayFromHost();
        cleanupIncompleteBrandingNav();
        if (!hasCompleteBrandingNav() && window.CyberBranding && typeof window.CyberBranding.injectNavigation === "function") {
            window.CyberBranding.injectNavigation();
        }
    } catch (e) {
        console.warn("CyberBranding: navigation consistency check failed", e);
    }
}

let __cyberBrandingNavHooksInstalled = false;

function installNavigationConsistencyHooks() {
    if (__cyberBrandingNavHooksInstalled) return;
    __cyberBrandingNavHooksInstalled = true;
    const onLater = () => queueMicrotask(() => runNavigationConsistency());
    if (document.readyState === "complete") {
        onLater();
    } else {
        window.addEventListener("load", onLater, { once: true });
    }
}

function scheduleNavigationConsistencyCheck() {
    installNavigationConsistencyHooks();
    queueMicrotask(() => runNavigationConsistency());
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
            brandingCore.init.call(this, config);
            scheduleNavigationConsistencyCheck();
            return;
        }
        let title = this.MASTER_TITLE;
        let subtitle = "CYBER-LABORATORIUM";
        let skipCanvasBranding = false;

        // Polymorphic Init: Support both string (subtitle only) and object (legacy)
        if (typeof config === 'string') {
            subtitle = config;
        } else if (typeof config === 'object' && config) {
            if (config.title) title = config.title;
            if (config.subtitle) subtitle = config.subtitle;
            if (config.briefing) this.briefingContent = config.briefing;
            if (config.skipCanvasBranding === true) skipCanvasBranding = true;
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
        if (skipCanvasBranding) {
            document.querySelectorAll(".canvas-branding").forEach((el) => el.remove());
        } else {
            this.injectHTML(title, subtitle);
        }
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
        scheduleNavigationConsistencyCheck();
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
        cleanupIncompleteBrandingNav();
        const brandingNav = getBrandingNav();
        if (brandingNav && typeof brandingNav.injectNavigation === "function") {
            return brandingNav.injectNavigation.call(this);
        }
        if (hasCompleteBrandingNav()) return;
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
        /* Heroicons outline qr-code (Strich 1.5, weniger „globig“ als vier dicke Rechtecke) */
        qrBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"></path>
                <path d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"></path>
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
        /* Lucide „bug“ (Käfer mit Fühlern/Beinen), Strich via CSS 1.5 */
        bugBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="m8 2 1.88 1.88"></path>
                <path d="M14.12 3.88 16 2"></path>
                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path>
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path>
                <path d="M12 20v-9"></path>
                <path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path>
                <path d="M6 13H2"></path>
                <path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path>
                <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path>
                <path d="M22 13h-4"></path>
                <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>
            </svg>
        `;

        // Briefing Button
        const briefingBtn = document.createElement('div');
        briefingBtn.className = 'nav-btn';
        briefingBtn.title = 'Beschreibung anzeigen';
        briefingBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            const cb = window.CyberBranding;
            if (cb && typeof cb.showBriefing === 'function') cb.showBriefing();
        });
        briefingBtn.innerHTML = `
            <span style="font-family: 'Orbitron', sans-serif; font-weight: 400; font-size: 1.35rem; line-height: 1; display: block;">?</span>
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

    formatBriefingText: function (text) {
        if (!text) return "";
        let lines = text.split("\n");
        let html = "";
        let inList = false;

        lines.forEach(line => {
            let trimmed = line.trim();
            // Skip empty lines, separator lines, or "LABOR:" header lines
            if (!trimmed || /^[=\-]+$/.test(trimmed) || trimmed.startsWith("LABOR:")) {
                if (inList) { html += "</ul>"; inList = false; }
                if (!trimmed) html += "<div style='height:5px;'></div>";
                return;
            }

            // Headers
            if (trimmed.endsWith(":") && trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
                if (inList) { html += "</ul>"; inList = false; }
                html += `<h3 style="color:var(--branding-blue); font-family:Orbitron; margin-top:5px; margin-bottom:5px; border-bottom:1px solid rgba(0,210,255,0.2); padding-bottom:3px; font-size:1.1rem;">${trimmed}</h3>`;
            }
            // List items
            else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                if (!inList) { html += "<ul style='margin-left:20px; margin-bottom:7px;'>"; inList = true; }
                html += `<li style='margin-bottom:4px;'>${trimmed.substring(2)}</li>`;
            }
            // Normal text
            else {
                if (inList) { html += "</ul>"; inList = false; }
                // Bold tags
                let processed = trimmed.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/__(.*?)__/g, "<b>$1</b>");
                html += `<p style='margin-bottom:5px; line-height:1.5;'>${processed}</p>`;
            }
        });
        if (inList) html += "</ul>";
        return html;
    },

    showBriefing: function () {
        const moduleKey = getBriefingModuleKey();

        const pageBrief = this.briefingContent != null && String(this.briefingContent).trim() !== "";
        if (!pageBrief && window.CyberBriefings && window.CyberBriefings[moduleKey]) {
            this.briefingContent = this.formatBriefingText(window.CyberBriefings[moduleKey]);
        }

        if (!this.briefingContent) {
            const brandingOverlays = getBrandingOverlays();
            if (brandingOverlays && typeof brandingOverlays.showBriefing === "function") {
                return brandingOverlays.showBriefing.call(this);
            }
            return this.showNotification("Keine Dokumentation gefunden.");
        }

        let overlay = document.getElementById("cyber-briefing-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "cyber-briefing-overlay";
            overlay.className = "briefing-overlay";
            overlay.style.zIndex = "1000000";
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.classList.remove("visible");
            };
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div class="briefing-modal" style="position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
                <div style="position: absolute; top: 22px; right: 25px; cursor: pointer; opacity: 0.5; transition: all 0.2s; color: var(--branding-blue); z-index: 10;" 
                     onclick="document.getElementById('cyber-briefing-overlay').classList.remove('visible')"
                     onmouseover="this.style.opacity='1'; this.style.transform='scale(1.1)'" 
                     onmouseout="this.style.opacity='0.5'; this.style.transform='scale(1)'">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                     </svg>
                </div>
                <div class="briefing-header" style="padding: 25px 25px 15px 25px; flex-shrink: 0;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Beschreibung
                </div>
                <div class="briefing-text" style="flex: 1; overflow-y: auto; padding: 0 35px 25px 25px; margin-right: 5px;">${this.briefingContent}</div>
                <div style="padding: 0 25px 25px 25px; display: flex; justify-content: flex-end; flex-shrink: 0;">
                    <button class="nav-btn" style="width: auto; height: auto; padding: 12px 35px; min-width: 140px; display: inline-flex !important;" onclick="document.getElementById('cyber-briefing-overlay').classList.remove('visible')">Verstanden</button>
                </div>
            </div>
        `;

        setTimeout(() => overlay.classList.add("visible"), 10);
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

window.CyberBranding = CyberBranding;
