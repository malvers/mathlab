/*
 * CyberBranding Core Module
 * Extracted core behaviors for incremental refactoring.
 */
(function attachBrandingCore(global) {
    const CyberBrandingCore = {
        init(config = {}) {
            let title = this.MASTER_TITLE;
            let subtitle = "CYBER-LABORATORIUM";
            let skipCanvasBranding = false;

            // Polymorphic Init: Support both string (subtitle only) and object (legacy)
            if (typeof config === "string") {
                subtitle = config;
            } else if (typeof config === "object" && config) {
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
            if (typeof this.ensureFavicon === "function") {
                this.ensureFavicon();
            }
            if (!skipCanvasBranding) {
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
        },

        injectHTML(topLine, bottomLine) {
            if (document.querySelector(".canvas-branding")) return;

            const container = document.createElement("div");
            container.className = "canvas-branding";
            container.title = "Vollbild umschalten";
            container.innerHTML = `
            <h1 id="branding-master-title">${topLine}</h1>
            <div class="canvas-subtitle" id="branding-module-title">${bottomLine}</div>
        `;

            container.addEventListener("click", () => this.toggleFullscreen());
            document.body.appendChild(container);
        },

        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.warn(`Fullscreen error: ${err.message}`);
                });
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        },

        setupActiveScaling() {
            window.addEventListener("resize", () => this.updateScale());
            window.addEventListener("load", () => this.updateScale());
        },

        updateScale() {
            const w = window.innerWidth;
            // Optimized Responsive Scale between 320px and 1400px
            let scale = (w - 320) / (1400 - 320);
            scale = Math.max(0, Math.min(1, scale));
            document.documentElement.style.setProperty("--header-scale", scale);
        }
    };

    global.CyberBrandingCore = CyberBrandingCore;
})(window);
