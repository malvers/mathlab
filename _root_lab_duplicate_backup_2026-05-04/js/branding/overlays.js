/*
 * CyberBranding Overlays Module
 * Extracted overlay and interaction methods for incremental refactoring.
 */
(function attachBrandingOverlays(global) {
    const CyberBrandingOverlays = {
        showQR() {
            let overlay = document.getElementById("cyber-qr-overlay");

            // Build the public URL (map local to docalvers.de)
            const pathParts = window.location.pathname.split("/");
            const filename = pathParts[pathParts.length - 1] || "index.html";
            const publicURL = `https://docalvers.de/${filename}`;

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "cyber-qr-overlay";
                overlay.className = "qr-overlay";

                overlay.onclick = (e) => {
                    if (e.target === overlay) overlay.classList.remove("visible");
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

            setTimeout(() => overlay.classList.add("visible"), 10);
        },

        showBugReport() {
            let overlay = document.getElementById("cyber-report-overlay");
            const filename = window.location.pathname.split("/").pop() || "index.html";
            const systemInfo = `Module: ${filename} | OS: ${navigator.platform} | Agent: ${navigator.userAgent.substring(0, 50)}... | Res: ${window.innerWidth}x${window.innerHeight}`;

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "cyber-report-overlay";
                overlay.className = "report-overlay";
                overlay.onclick = (e) => {
                    if (e.target === overlay) overlay.classList.remove("visible");
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

            setTimeout(() => overlay.classList.add("visible"), 10);
            setTimeout(() => document.getElementById("report-text").focus(), 300);
        },

        sendReportEmail(filename, meta) {
            const text = document.getElementById("report-text").value;
            if (!text) return alert("Bitte gib eine kurze Beschreibung ein.");

            const subject = encodeURIComponent(`Support-Anfrage: ${filename}`);
            const body = encodeURIComponent(`Hallo Doc Alvers,\n\nAnfrage und/oder Feedback:\n${text}\n\nDiagnose (Details):\n${meta}\n\nGesendet von docalvers.de.`);
            window.location.href = `mailto:info@docalvers.de?subject=${subject}&body=${body}`;
        },

        async copyReportToClipboard(filename, meta) {
            const text = document.getElementById("report-text").value;
            if (!text) return alert("Bitte gib eine kurze Beschreibung ein.");

            const report = `[CYBER-REPORT]\nLAB: ${filename}\nMESSAGE: ${text}\nSTATUS: ${meta}`;

            try {
                await navigator.clipboard.writeText(report);
                const btn = document.querySelector(".report-btn.secondary");
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

        toggleEditMode() {
            this.isEditMode = !this.isEditMode;
            document.body.classList.toggle("cyber-edit-active", this.isEditMode);

            // STRICTLY RESTRICTED: Only the briefing-text becomes editable
            const briefingText = document.querySelector(".briefing-text");
            if (briefingText) {
                briefingText.contentEditable = this.isEditMode;
            }

            console.log(`[CYBER-ENGINE] Briefing Editor ${this.isEditMode ? "ENABLED" : "DISABLED"}`);

            // Visual feedback for the Pen button (Blue identity)
            const btns = document.querySelectorAll(".nav-btn");
            const editBtn = Array.from(btns).find(b => b.title.includes("Edit") || b.title.includes("bearbeiten"));

            if (editBtn) {
                editBtn.style.color = this.isEditMode ? "var(--branding-blue)" : "white";
                editBtn.style.borderColor = this.isEditMode ? "var(--branding-blue)" : "";
                editBtn.style.boxShadow = this.isEditMode ? "0 0 15px var(--branding-blue)" : "";
            }

            if (this.isEditMode) {
                this.showNotification("Briefing-Editor Aktiv: Text kann nun geändert werden.");
            }

            window.dispatchEvent(new CustomEvent("cyber-edit-toggle", { detail: { active: this.isEditMode } }));
        },

        requestEditAccess() {
            if (this.isEditMode) {
                this.toggleEditMode();
                return;
            }

            let overlay = document.getElementById("cyber-auth-overlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "cyber-auth-overlay";
                overlay.className = "auth-overlay";
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
                overlay.classList.add("visible");
                const input = document.getElementById("cyber-pwd-input");
                input.focus();
                input.onkeydown = (e) => { if (e.key === "Enter") this.validateAccess(); };
            }, 10);
        },

        validateAccess() {
            const input = document.getElementById("cyber-pwd-input");
            // Secure Obfuscation (Base64 check for !aMe5007!!??)
            const target = "IWFNZTUwMDchIT8/";

            if (btoa(input.value) === target) {
                document.getElementById("cyber-auth-overlay").classList.remove("visible");
                this.toggleEditMode();
                this.showNotification("Zugriff gewährt. Briefing-Edit aktiviert.");

                // Auto-open briefing
                setTimeout(() => {
                    if (global.CyberBranding && typeof global.CyberBranding.showBriefing === "function") {
                        global.CyberBranding.showBriefing();
                    }
                }, 300);
            } else {
                this.showNotification("Zugriff verweigert. Falsches Passwort.");
                input.value = "";
                input.focus();

                // Animation for error
                const modal = document.querySelector(".auth-modal");
                modal.style.borderColor = "red";
                modal.style.boxShadow = "0 0 30px rgba(255,0,0,0.4)";
                setTimeout(() => {
                    modal.style.borderColor = "";
                    modal.style.boxShadow = "";
                }, 500);
            }
        },

        showNotification(msg) {
            const toast = document.createElement("div");
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

        setBriefing(html) {
            this.briefingContent = html;
        },


        copyLocalBriefing() {
            const el = document.querySelector(".briefing-text");
            // Copy innerHTML to preserve the structure (!admin-info etc) for Antigravity
            const content = el.innerHTML;
            navigator.clipboard.writeText(content).then(() => {
                this.showNotification("Komplette Struktur kopiert (bereit für Antigravity)!");
            });
        },

        transmitEdits() {
            const labName = window.location.pathname.split("/").pop() || "index.html";
            const selectors = ".stat-value, .stat-label, .instrument-title, .canvas-branding h1, .canvas-subtitle, .briefing-text, .label-row span:first-child";
            const edits = [];

            document.querySelectorAll(selectors).forEach(el => {
                edits.push({
                    selector: el.className.split(" ")[0], // Base class as hint
                    id: el.id || "none",
                    text: el.innerText.trim(),
                    context: el.closest(".instrument-card")?.querySelector(".instrument-title")?.innerText || "Global"
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
            }).catch(() => {
                alert("Fehler beim Kopieren. Hier ist dein Report:\n" + reportJSON);
            });
        },

        showSyncModal(json) {
            let overlay = document.getElementById("cyber-sync-overlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = "cyber-sync-overlay";
                overlay.className = "sync-overlay";
                overlay.onclick = (e) => {
                    if (e.target === overlay) overlay.classList.remove("visible");
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

            setTimeout(() => overlay.classList.add("visible"), 10);
        }
    };

    global.CyberBrandingOverlays = CyberBrandingOverlays;
})(window);
