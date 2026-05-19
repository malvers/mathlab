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
            // Compute relative path to dashboard from this script's src
            // (handles labs in subfolders like /morpheus/, /worldclock/)
            const navScript = document.querySelector('script[src$="js/branding/nav.js"]');
            const navSrc = navScript ? navScript.getAttribute("src") : "";
            homeBtn.href = navSrc
                ? navSrc.replace(/js\/branding\/nav\.js$/, "index.html")
                : "index.html";
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

            // Donation Button (formerly heart in mini-rail)
            const donateBtn = document.createElement("div");
            donateBtn.className = "nav-btn";
            donateBtn.title = (typeof CyberI18n !== 'undefined') ? CyberI18n.get('ui.adopt_contact_btn_title') : "Ein Labor adoptieren!";
            donateBtn.onclick = () => {
                if (window.CyberUI && typeof window.CyberUI.showContactLabModal === 'function') {
                    window.CyberUI.showContactLabModal();
                }
            };
            donateBtn.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
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

            // Play Recording Button (loads explanation .recording from recordings/index.json)
            // Hidden by default — shown only if recordings/index.json has an entry for this lab.
            const playBtn = document.createElement("div");
            playBtn.className = "nav-btn";
            playBtn.title = "Erklärung abspielen";
            playBtn.style.color = "#00ff88";
            // Hidden by default — !important needed to beat #mini-rail .nav-btn { display: flex !important }
            playBtn.style.setProperty('display', 'none', 'important');
            playBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
        `;
            window.cyberPlayBtn = playBtn;

            // Dashboard-relative prefix (handles subfolder labs like /morpheus/, /worldclock/)
            const dashPrefix = navSrc ? navSrc.replace(/js\/branding\/nav\.js$/, "") : "";
            // Async: check if a recording exists for this lab; show button if so.
            (() => {
                const labName = window.location.pathname.split('/').pop().replace('.html', '');
                const base = new URL(dashPrefix + 'recordings/', document.baseURI).href;
                const xhr = new XMLHttpRequest();
                xhr.open('GET', base + 'index.json', true);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    if (xhr.status !== 0 && xhr.status !== 200) return;
                    const index = xhr.response;
                    if (index && index[labName]) playBtn.style.removeProperty('display');
                };
                xhr.send();
            })();
            playBtn.onclick = () => {
                const labName = window.location.pathname.split('/').pop().replace('.html', '');
                const base = new URL(dashPrefix + 'recordings/', document.baseURI).href;
                const xhrGet = (url, type, cb) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.responseType = type;
                    xhr.onload = () => { if (xhr.status === 0 || xhr.status === 200) cb(xhr.response); else cb(null); };
                    xhr.onerror = () => cb(null);
                    xhr.send();
                };
                const loadRecorder = (cb) => {
                    if (window.CyberRecorder) { cb(); return; }
                    const s = document.createElement('script');
                    s.src = dashPrefix + 'js/cyber-recorder.js' + '?v=' + Date.now();
                    s.onload = cb;
                    document.head.appendChild(s);
                };
                xhrGet(base + 'index.json', 'json', index => {
                    if (!index || !index[labName]) {
                        alert('Kein Recording für dieses Lab gefunden.');
                        return;
                    }
                    const recordingUrl = base + index[labName];
                    loadRecorder(() => {
                        CyberRecorder.userPlayMode = true;
                        CyberRecorder.init();
                        xhrGet(recordingUrl, 'arraybuffer', buf => {
                            if (!buf) { alert('Recording konnte nicht geladen werden.'); return; }
                            const fakeEvt = { target: { files: [new File([buf], 'script.recording')], value: '' } };
                            CyberRecorder.importScript(fakeEvt);
                            setTimeout(() => CyberRecorder.play(), 200);
                        });
                    });
                });
            };

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
            nav.appendChild(bugBtn);
            nav.appendChild(donateBtn);
            nav.appendChild(briefingBtn);

            const miniRail = document.getElementById("mini-rail");
            if (miniRail) {
                queueMicrotask(() => {
                    // 1. Move language to end first — it sits right after hamburger by default
                    //    and would otherwise push QR/bug to position 2 when we insert before it.
                    const langBtn = miniRail.querySelector('#rail-lang-display-btn');
                    if (langBtn) miniRail.appendChild(langBtn);

                    // 2. Insert play→home→back→?→heart directly after the hamburger button.
                    const hamburger = miniRail.firstElementChild;
                    let anchor = hamburger;
                    [playBtn, homeBtn, backBtn, briefingBtn, donateBtn].forEach(btn => {
                        btn.dataset.cyberBrandingNav = "1";
                        miniRail.insertBefore(btn, anchor.nextSibling);
                        anchor = btn;
                    });

                    // 3. Insert QR→bug after coffee (or after heart if coffee not present yet).
                    const coffeeBtn = miniRail.querySelector('.coffee-btn');
                    let anchor2 = coffeeBtn || anchor;
                    [qrBtn, bugBtn].forEach(btn => {
                        btn.dataset.cyberBrandingNav = "1";
                        miniRail.insertBefore(btn, anchor2.nextSibling);
                        anchor2 = btn;
                    });

                    // language is already last (moved in step 1)
                    nav.style.display = "none";
                    nav.classList.add("integrated");
                    miniRail.appendChild(nav);
                });
            } else {
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
        }
    };

    global.CyberBrandingNav = CyberBrandingNav;
})(window);
