/*
 * CyberBranding Navigation Module
 * Extracted navigation rendering for incremental refactoring.
 */
(function attachBrandingNav(global) {
    const CyberBrandingNav = {
        injectNavigation() {
            if (window.CyberBranding && window.CyberBranding._skipNavigation === true) return;
            if (typeof cleanupIncompleteBrandingNav === "function") cleanupIncompleteBrandingNav();
            if (typeof hasCompleteBrandingNav === "function" && hasCompleteBrandingNav()) return;

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
                <path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"></path>
                <path d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"></path>
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
            const briefingBtn = document.createElement("div");
            briefingBtn.className = "nav-btn";
            briefingBtn.title = "Beschreibung anzeigen";
            briefingBtn.addEventListener("click", (ev) => {
                ev.preventDefault();
                const cb = window.CyberBranding;
                if (cb && typeof cb.showBriefing === "function") cb.showBriefing();
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
