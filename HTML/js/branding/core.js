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
            let skipNavigation = false;

            // Polymorphic Init: Support both string (subtitle only) and object (legacy)
            if (typeof config === "string") {
                subtitle = config;
            } else if (typeof config === "object" && config) {
                if (config.title) title = config.title;
                if (config.subtitle) subtitle = config.subtitle;
                if (config.briefing) this.briefingContent = config.briefing;
                if (config.skipCanvasBranding === true) skipCanvasBranding = true;
                if (config.skipNavigation === true) skipNavigation = true;
            }

            title =
                typeof global.CyberI18n !== "undefined" &&
                typeof global.CyberI18n.getBrandMastheadTitle === "function"
                    ? global.CyberI18n.getBrandMastheadTitle()
                    : "Doc Alvers Mathe-Labor";

            this._skipNavigation = skipNavigation;

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
            if (skipCanvasBranding) {
                document.querySelectorAll(".canvas-branding").forEach((el) => el.remove());
            } else {
                this.injectHTML(title, subtitle);
            }
            if (skipNavigation) {
                document.querySelectorAll("body > .cyber-nav").forEach((el) => el.remove());
            } else {
                this.injectNavigation();
            }
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

            // Subtle fullscreen icon: two diagonal corner brackets.
            // ENTER FS: brackets at outer TR + BL corners, opening toward center.
            // EXIT FS:  same diagonal but inverted — brackets sit closer to center
            //           with their apex pointing inward (legs open outward).
            const ENTER_FS_SVG = `<svg class="canvas-branding-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4H20V10M4 14V20H10"/></svg>`;
            const EXIT_FS_SVG  = `<svg class="canvas-branding-fs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4V10H20M10 20V14H4"/></svg>`;
            const currentIcon = () => (document.fullscreenElement ? EXIT_FS_SVG : ENTER_FS_SVG);

            const container = document.createElement("div");
            container.className = "canvas-branding";
            container.title = "Vollbild umschalten";
            container.innerHTML = `
            <h1 id="branding-master-title">${currentIcon()}${topLine}</h1>
            <div class="canvas-subtitle" id="branding-module-title">${bottomLine}</div>
        `;

            container.addEventListener("click", (e) => {
                this.toggleFullscreen();
            });

            // Swap icon when fullscreen state changes
            document.addEventListener("fullscreenchange", () => {
                const h1 = container.querySelector("#branding-master-title");
                if (!h1) return;
                const oldIcon = h1.querySelector(".canvas-branding-fs-icon");
                if (oldIcon) oldIcon.outerHTML = currentIcon();
            });

            const anchor =
                document.getElementById("main-content") ||
                document.getElementById("workspace") ||
                document.body;
            anchor.appendChild(container);
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
