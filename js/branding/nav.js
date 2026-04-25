/*
 * CyberBranding Navigation Module
 * Extracted navigation rendering for incremental refactoring.
 */
(function attachBrandingNav(global) {
    const CyberBrandingNav = {
        injectNavigation() {
            if (document.querySelector(".cyber-nav")) return;
            const nav = document.createElement("div");
            nav.className = "cyber-nav";

            // Home Button
            const homeBtn = document.createElement("a");
            homeBtn.className = "nav-btn";
            homeBtn.href = "index.html";
            homeBtn.title = "Dashboard öffnen";

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
            const backBtn = document.createElement("div");
            backBtn.className = "nav-btn";
            backBtn.title = "Zurück zum Dashboard";
            backBtn.onclick = () => window.history.back();
            backBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        `;

            // QR Button
            const qrBtn = document.createElement("div");
            qrBtn.className = "nav-btn";
            qrBtn.title = "QR-Code für diese Seite";
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
            const editBtn = document.createElement("div");
            editBtn.className = "nav-btn";
            editBtn.title = "Edit-Modus umschalten";
            editBtn.onclick = () => this.requestEditAccess();
            editBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        `;

            // Bug Report Button
            const bugBtn = document.createElement("div");
            bugBtn.className = "nav-btn";
            bugBtn.title = "Fehler oder Feedback melden";
            bugBtn.style.color = "var(--branding-orange)";
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
            const briefingBtn = document.createElement("div");
            briefingBtn.className = "nav-btn";
            briefingBtn.title = "Beschreibung anzeigen";
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

            const sidebarHeader = document.getElementById("sidebar-header");
            const sidebar = sidebarHeader ||
                document.getElementById("side-panel") ||
                document.getElementById("sidebar") ||
                document.querySelector("aside") ||
                document.querySelector(".sidebar");

            if (sidebar) {
                nav.classList.add("integrated");
                if (sidebarHeader) {
                    sidebarHeader.appendChild(nav);
                } else {
                    sidebar.prepend(nav);
                }
            } else {
                nav.classList.add("floating");
                document.body.appendChild(nav);
            }
        }
    };

    global.CyberBrandingNav = CyberBrandingNav;
})(window);
