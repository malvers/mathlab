/* @AI-READONLY: CENTRAL UI ENGINE - DO NOT MODIFY WITHOUT EXPLICIT USER COMMAND */
/**
 * Cyber-UI Engine v5.3.8
 * Central component engine for the Cyber-Labor ecosystem.
 */
class CyberUI {
    static init() {
        console.log("⚛️ Cyber-UI Engine v5.3.8 initialized.");
        this.installResourceGuard();
        this.injectStyles();
        this.ensureScreenWarning({
            minWidth: 980,
            minHeight: 620,
            message: "Bildschirm zu klein für optimale Labor-Ansicht (empfohlen: mind. 980 × 620)"
        });

        // Mini-rail (labs): language + contact + coffee. Without mini-rail but with #sidebar-header (tools, …): language in cyber-nav row.
        const tryInject = () => {
            const rail = document.getElementById('mini-rail');
            if (rail) {
                if (!CyberUI.injectMiniRailLangButton()) {
                    setTimeout(tryInject, 100);
                    return;
                }
                CyberUI.applyMiniRailMenuLabel();
                CyberUI.injectContactHeartButton();
                if (CyberUI.injectCoffeeButton()) {
                    console.log("☕ Cyber-Coffee injected.");
                } else {
                    setTimeout(tryInject, 100);
                }
                return;
            }

            const sidebarHeader = document.getElementById('sidebar-header');
            if (sidebarHeader) {
                if (CyberUI.injectIntegratedCyberNavLangButton()) return;
                setTimeout(tryInject, 100);
                return;
            }

            /* e.g. index.html: neither rail nor sidebar nav — nothing to inject */
        };
        tryInject();

        this.injectContactLabModal();
        // Inject the global donate modal structure
        this.injectDonateModal();
        this.installAppScreenshot();
    }

    /** Supported lab languages — order when cycling on click */
    static CYBER_LANG_ORDER = ['de', 'en', 'es', 'fr', 'it', 'pt', 'nl', 'sw', 'tr'];

    static CYBER_LANG_FLAGS = {
        de: '🇩🇪',
        en: '🇬🇧',
        es: '🇪🇸',
        fr: '🇫🇷',
        it: '🇮🇹',
        pt: '🇵🇹',
        nl: '🇳🇱',
        sw: '🇰🇪',
        tr: '🇹🇷',
    };

    /** Mini-rail: one flag; click → next language (?lang= + reload). */
    static injectMiniRailLangButton() {
        const miniRail = document.getElementById('mini-rail');
        if (!miniRail) return false;
        if (miniRail.querySelector('#rail-lang-display-btn')) return true;
        if (typeof CyberI18n === 'undefined' || typeof CyberI18n.current !== 'string') return false;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'rail-lang-display-btn';
        btn.className = 'nav-btn nav-btn-lang-display';
        btn.onclick = () => CyberUI.cycleCyberLabLang();

        const span = document.createElement('span');
        span.className = 'rail-lang-flag';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = '🌐';
        btn.appendChild(span);

        const toggleBtn =
            miniRail.querySelector('.nav-btn[onclick*="toggleSidebar"]') ||
            miniRail.querySelector('.nav-btn[onclick*="toggle"]');
        const anchor = toggleBtn || miniRail.querySelector('.nav-btn');
        if (anchor && anchor.parentNode === miniRail) {
            miniRail.insertBefore(btn, anchor.nextSibling);
        } else {
            miniRail.appendChild(btn);
        }

        CyberUI.syncCyberLangDisplayButtons();
        return true;
    }

    /**
     * #sidebar-header .cyber-nav (e.g. tools.html): same language toggle as mini-rail.
     */
    static injectIntegratedCyberNavLangButton() {
        const nav = document.querySelector('#sidebar-header .cyber-nav');
        if (!nav || nav.querySelector('.nav-btn-lang-display')) return !!nav;
        if (typeof CyberI18n === 'undefined' || typeof CyberI18n.current !== 'string') return false;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-btn nav-btn-lang-display';
        btn.onclick = () => CyberUI.cycleCyberLabLang();

        const span = document.createElement('span');
        span.className = 'rail-lang-flag';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = '🌐';
        btn.appendChild(span);

        const homeBtn = nav.querySelector('a.nav-btn[href="index.html"], a.nav-btn[href*="index.html"]');
        const anchor = homeBtn || nav.querySelector('.nav-btn');
        if (anchor && anchor.parentNode === nav) {
            nav.insertBefore(btn, anchor.nextSibling);
        } else {
            nav.appendChild(btn);
        }

        CyberUI.syncCyberLangDisplayButtons();
        return true;
    }

    static cycleCyberLabLang() {
        const ORDER = CyberUI.CYBER_LANG_ORDER;
        let idx = ORDER.indexOf(CyberI18n.current);
        if (idx < 0) idx = 0;
        const next = ORDER[(idx + 1) % ORDER.length];
        try {
            localStorage.setItem('cyber-lab-lang', next);
        } catch (e) {
            /* ignore */
        }
        const u = new URL(window.location.href);
        u.searchParams.set('lang', next);
        window.location.href = u.toString();
    }

    static syncCyberLangDisplayButtons() {
        if (typeof CyberI18n === 'undefined') return;
        const code = CyberI18n.current;
        const flag = CyberUI.CYBER_LANG_FLAGS[code] || '🌐';
        const hint = CyberI18n.get('ui.mini_rail_lang_title');
        const titleBase = hint && hint !== 'ui.mini_rail_lang_title' ? hint : 'Language';

        document.querySelectorAll('.nav-btn-lang-display').forEach((btn) => {
            const span = btn.querySelector('.rail-lang-flag');
            if (span) span.textContent = flag;
            btn.title = `${titleBase} · ${code.toUpperCase()}`;
            btn.setAttribute('aria-label', `${titleBase} (${code})`);
        });

        if (typeof CyberI18n.applyHtmlLangAttribute === 'function') {
            CyberI18n.applyHtmlLangAttribute();
        } else {
            document.documentElement.lang = code === 'sw' ? 'sw' : code;
        }
    }

    /** Sidebar hamburger: HTML placeholders are often DE/EN; sync to active CyberI18n. */
    static applyMiniRailMenuLabel() {
        const rail = document.getElementById('mini-rail');
        if (!rail || typeof CyberI18n === 'undefined' || typeof CyberI18n.get !== 'function') return;
        const label = CyberI18n.get('ui.toggle_menu');
        if (!label || label === 'ui.toggle_menu') return;
        rail.querySelectorAll('.nav-btn[onclick*="toggleSidebar"]').forEach((el) => {
            el.setAttribute('title', label);
            el.setAttribute('aria-label', label);
        });
    }

    static injectCoffeeButton() {
        const miniRail = document.getElementById('mini-rail');
        if (!miniRail) return false;

        if (miniRail.querySelector('.coffee-btn')) return true;

        const coffeeBtn = document.createElement('div');
        coffeeBtn.className = "nav-btn coffee-btn";
        coffeeBtn.title = "Cyber-Kaffee spendieren";
        coffeeBtn.onclick = () => CyberUI.showDonateModal();
        coffeeBtn.style.color = "#ffd700";
        coffeeBtn.style.borderColor = "rgba(255, 215, 0, 0.3)";
        coffeeBtn.style.textDecoration = "none";
        
        coffeeBtn.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 22px !important; height: 22px !important; stroke-width: 1.5 !important;">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
        `;

        coffeeBtn.onmouseover = () => {
            coffeeBtn.style.borderColor = "#ffe033";
            coffeeBtn.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.4)";
            coffeeBtn.style.color = "#ffe033";
        };
        coffeeBtn.onmouseout = () => {
            coffeeBtn.style.borderColor = "rgba(255, 215, 0, 0.3)";
            coffeeBtn.style.boxShadow = "none";
            coffeeBtn.style.color = "#ffd700";
        };

        miniRail.appendChild(coffeeBtn);
        return true;
    }

    /** Contact (heart) on mini-rail — opens cyan-styled modal with mailto (not donate dialog). */
    static injectContactHeartButton() {
        const miniRail = document.getElementById('mini-rail');
        if (!miniRail) return false;
        if (miniRail.querySelector('.adopt-contact-btn')) return true;

        const title = CyberI18n.get('ui.adopt_contact_btn_title');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-btn adopt-contact-btn';
        btn.title = title;
        btn.setAttribute('aria-label', title);
        btn.onclick = () => CyberUI.showContactLabModal();
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="22" height="22">
                <path class="adopt-heart-path" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2C10.5 3.5 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
            </svg>
        `;

        const coffee = miniRail.querySelector('.coffee-btn');
        if (coffee) {
            miniRail.insertBefore(btn, coffee);
        } else {
            miniRail.appendChild(btn);
        }
        return true;
    }

    static injectContactLabModal() {
        if (document.getElementById('cyber-contact-lab-overlay')) return;

        const t = (key) => CyberI18n.get(key);
        const overlay = document.createElement('div');
        overlay.id = 'cyber-contact-lab-overlay';
        overlay.className = 'cyber-overlay';
        overlay.onclick = () => CyberUI.hideContactLabModal();

        overlay.innerHTML = `
            <div class="cyber-modal cyber-modal--neon" onclick="event.stopPropagation()">
                <h3 class="cyber-modal-adopt-title">${t('ui.contact_lab_modal_title')}</h3>
                <p>${t('ui.contact_lab_modal_body')}</p>
                <a href="mailto:info@docalvers.de"
                   class="cyber-modal-email-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    ${t('ui.contact_lab_email_cta')}
                </a>
                <button type="button" class="cyber-modal-close" onclick="CyberUI.hideContactLabModal()">${t('ui.contact_lab_close')}</button>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    static showContactLabModal() {
        const overlay = document.getElementById('cyber-contact-lab-overlay');
        if (overlay) overlay.classList.add('open');
    }

    static hideContactLabModal() {
        const overlay = document.getElementById('cyber-contact-lab-overlay');
        if (overlay) overlay.classList.remove('open');
    }

    static injectDonateModal() {
        if (document.getElementById('cyber-donate-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'cyber-donate-overlay';
        overlay.className = 'cyber-overlay';
        overlay.onclick = () => CyberUI.hideDonateModal();

        overlay.innerHTML = `
            <div class="cyber-modal" onclick="event.stopPropagation()">
                <h3 style="color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);">Cyber-Kaffee Spendieren</h3>
                <p>Dir gefallen die interaktiven Labore und du möchtest die Weiterentwicklung des Cyber-Labors unterstützen? Ich freue mich über jeden virtuellen Kaffee, der mich nachts beim Coden wachhält! ☕️🚀</p>
                
                <a href="https://www.paypal.com/donate/?business=michael.r.alvers@gmail.com&no_recurring=1&currency_code=EUR" 
                   target="_blank" 
                   style="display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700; color: #ffd700; padding: 15px; border-radius: 8px; text-decoration: none; font-family: 'Orbitron', sans-serif; font-size: 1rem; margin: 25px 0 15px 0; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);"
                   onmouseover="this.style.background='rgba(255, 215, 0, 0.2)'; this.style.boxShadow='0 0 25px rgba(255, 215, 0, 0.4)';"
                   onmouseout="this.style.background='rgba(255, 215, 0, 0.1)'; this.style.boxShadow='0 0 15px rgba(255, 215, 0, 0.2)';"
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" style="margin-top:-2px;">
                        <path fill="#00457C" d="M20.067 8.478c-.492-3.269-3.111-4.721-7.01-4.721H6.848a1.05 1.05 0 0 0-1.042.88L3.25 20.893c-.033.208.13.393.342.393h3.585a.99.99 0 0 0 .984-.836l.72-4.57c.063-.4.401-.699.807-.699h1.764c3.513 0 6.071-1.633 6.643-5.263.15-.953.07-1.71-.247-2.316l.22.876z"/>
                        <path fill="#0079C1" d="M19.467 8.162c-.183-.497-.478-.91-.861-1.246-.826-.723-2.222-1.002-4.004-1.002h-4.32a.965.965 0 0 0-.958.81l-2.457 15.61c-.031.196.12.366.319.366h3.42a.91.91 0 0 0 .905-.769l.79-5.01c.058-.368.369-.643.743-.643h1.62c3.23 0 5.584-1.503 6.112-4.843.197-1.25.044-2.274-.309-3.273z"/>
                    </svg>
                    DONATE WITH PAYPAL
                </a>
                
                <button class="cyber-modal-close" onclick="CyberUI.hideDonateModal()">SCHLIESSEN</button>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    static showDonateModal() {
        const overlay = document.getElementById('cyber-donate-overlay');
        if (overlay) overlay.classList.add('open');
    }

    /**
     * Cmd+Shift+S / Ctrl+Shift+S: PNG screenshot of the largest visible canvas (typically WebGL view).
     * Cmd+S stays with the “save page” dialog. Unchanged in text fields.
     */
    static installAppScreenshot() {
        if (window.__cyberAppScreenshotInstalled) return;
        window.__cyberAppScreenshotInstalled = true;

        document.addEventListener('keydown', (e) => {
            if (e.key !== 's' && e.key !== 'S') return;
            if (!e.shiftKey) return;
            if (!(e.metaKey || e.ctrlKey)) return;
            const t = e.target;
            if (t && (t.isContentEditable || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            CyberUI.captureAppScreenshot();
        }, true);
    }

    static _suggestedScreenshotFileStem() {
        const part = (document.title && document.title.split(/\s*[|\u2013\u2014-]\s*/)[0].trim()) || 'lab';
        const slug = part.replace(/[^\w\-.]+/g, '-').replace(/^-|-$/g, '') || 'lab';
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const ts = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        return `cyber-lab-snapshot-${slug}-${ts}`;
    }

    static _selectPrimaryCanvas() {
        let best = null;
        let bestArea = 0;
        for (const c of document.querySelectorAll('canvas')) {
            if (!(c instanceof HTMLCanvasElement)) continue;
            const r = c.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) continue;
            const area = r.width * r.height;
            if (area > bestArea) {
                bestArea = area;
                best = c;
            }
        }
        return best;
    }

    static _flashScreenshotHint(message, isError) {
        const id = 'cyber-screenshot-hint';
        let el = document.getElementById(id);
        if (el) el.remove();
        el = document.createElement('div');
        el.id = id;
        el.setAttribute('role', 'status');
        el.textContent = message;
        el.style.cssText = [
            'position:fixed',
            'left:50%',
            'bottom:28px',
            'transform:translateX(-50%)',
            'z-index:2147483646',
            'max-width:min(90vw,420px)',
            'padding:12px 18px',
            'border-radius:12px',
            'font-family:Outfit,system-ui,sans-serif',
            'font-size:0.88rem',
            'line-height:1.4',
            'box-shadow:0 8px 28px rgba(0,0,0,0.4)',
            isError
                ? 'background:rgba(120,0,0,0.92);color:#fff;border:1px solid rgba(255,90,90,0.6);'
                : 'background:rgba(0,32,48,0.95);color:#9de8ff;border:1px solid rgba(0,210,255,0.35);'
        ].join('');
        document.body.appendChild(el);
        window.clearTimeout(CyberUI._flashScreenshotHint.t);
        CyberUI._flashScreenshotHint.t = window.setTimeout(() => {
            el.remove();
        }, 3200);
    }

    static captureAppScreenshot() {
        const canvas = CyberUI._selectPrimaryCanvas();
        if (!canvas) {
            CyberUI._flashScreenshotHint('Kein sichtbares Canvas – Screenshot entfällt (reine Text-/SVG-Seiten).', true);
            return;
        }
        let dataUrl;
        try {
            dataUrl = canvas.toDataURL('image/png');
        } catch (err) {
            console.warn('CyberUI screenshot:', err);
            CyberUI._flashScreenshotHint('Screenshot fehlgeschlagen (Canvas geschützt / CORS).', true);
            return;
        }
        if (!dataUrl || dataUrl.length < 64 || dataUrl === 'data:,') {
            CyberUI._flashScreenshotHint('Leeres Bild – ggf. preserveDrawingBuffer im WebGL-Renderer setzen.', true);
            return;
        }
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${CyberUI._suggestedScreenshotFileStem()}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        CyberUI._flashScreenshotHint('PNG downloaded.');
    }

    static hideDonateModal() {
        const overlay = document.getElementById('cyber-donate-overlay');
        if (overlay) overlay.classList.remove('open');
    }


    static installResourceGuard() {
        if (window.__cyberResourceGuardInstalled) return;
        window.__cyberResourceGuardInstalled = true;

        window.addEventListener('error', (event) => {
            const target = event && event.target;
            if (!target) return;

            if (target.tagName === 'SCRIPT') {
                const src = target.getAttribute('src') || target.src || 'unknown script';
                this.showRuntimeWarning(`Script konnte nicht geladen werden: ${src}`);
                return;
            }

            if (target.tagName === 'LINK' && String(target.getAttribute('rel') || '').toLowerCase().includes('stylesheet')) {
                const href = target.getAttribute('href') || target.href || 'unknown stylesheet';
                this.showRuntimeWarning(`Stylesheet konnte nicht geladen werden: ${href}`);
            }
        }, true);
    }

    static showRuntimeWarning(message) {
        const rootId = 'cyber-runtime-warning-root';
        let root = document.getElementById(rootId);
        if (!root) {
            root = document.createElement('div');
            root.id = rootId;
            root.style.cssText = [
                'position:fixed',
                'right:16px',
                'bottom:16px',
                'z-index:2147483647',
                'max-width:min(90vw,560px)',
                'display:flex',
                'flex-direction:column',
                'gap:10px'
            ].join(';');
            document.body.appendChild(root);
        }

        const item = document.createElement('div');
        item.style.cssText = [
            'background:rgba(120,0,0,0.92)',
            'color:#fff',
            'border:1px solid rgba(255,90,90,0.7)',
            'border-radius:12px',
            'padding:12px 14px',
            'font-family:Outfit,sans-serif',
            'font-size:0.85rem',
            'line-height:1.4',
            'box-shadow:0 8px 24px rgba(0,0,0,0.45)'
        ].join(';');
        item.innerHTML = `<b>Resource Guard:</b> ${message}`;

        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = 'x';
        close.style.cssText = [
            'float:right',
            'margin-left:12px',
            'background:transparent',
            'border:0',
            'color:#fff',
            'font-size:1rem',
            'cursor:pointer'
        ].join(';');
        close.onclick = () => item.remove();
        item.prepend(close);

        root.appendChild(item);
    }

    static injectStyles() {
        const styleId = 'cyber-ui-dynamic-styles';
        // Remove existing to force refresh
        const old = document.getElementById(styleId);
        if (old) old.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            :root {
                --glass-bright: rgba(255, 255, 255, 0.05);
                --neon-blue: #00d2ff;
                --border: rgba(255, 255, 255, 0.1);
            }

            /* GLOBAL SAFETY LOCK: Prevent checkboxes/radios from inflating */
            input[type="checkbox"], input[type="radio"] {
                min-height: 18px !important;
                height: 18px !important;
                width: 18px !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            .instrument-card {
                background: var(--glass-bright);
                padding: 12px 15px;
                border-radius: 18px;
                border: 1px solid rgba(0, 210, 255, 0.25);
                display: flex;
                flex-direction: column;
                gap: 4px;
                position: relative;
                overflow: visible; /* To allow dropdown panels to bleed out */
                backdrop-filter: blur(25px);
                animation: ui-card-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                margin-bottom: 5px;
            }

            .instrument-title {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.65rem;
                letter-spacing: 2px;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                margin-bottom: 2px;
                padding-bottom: 0px;
            }

            /* Collapsible Logic */
            .instrument-card.collapsible .instrument-title {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                user-select: none;
            }

            .instrument-card.collapsible .toggle-icon {
                font-size: 0.7rem;
                transition: transform 0.3s ease;
                display: inline-block;
            }

            .instrument-card.collapsed .toggle-icon {
                transform: rotate(0deg);
            }

            .instrument-card:not(.collapsed) .toggle-icon {
                transform: rotate(90deg);
            }

            .card-content {
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
            }

            .instrument-card.collapsed .card-content {
                max-height: 0;
                opacity: 0;
                margin: 0;
            }

            /* CYBER CHECKBOX SYSTEM (PREMIUM) */
            .cyber-control-group {
                display: flex;
                flex-direction: column;
                gap: 2px;
                width: 100%;
            }

            .cyber-checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                user-select: none;
                margin-bottom: 10px;
                width: 100%;
            }

            .cyber-checkbox {
                appearance: none;
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.03);
                cursor: pointer;
                position: relative;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .cyber-checkbox:checked {
                background: var(--neon-blue);
                border-color: var(--neon-blue);
                box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
            }

            .cyber-checkbox::after {
                content: '';
                position: absolute;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: translate(-50%, -55%) rotate(45deg);
                opacity: 0;
                transition: opacity 0.2s ease;
                left: 50%;
                top: 45%;
                display: block;
            }

            .cyber-checkbox:checked::after {
                opacity: 1;
            }

            .cyber-label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.8);
                letter-spacing: 0.5px;
            }

            /* CYBER RADIO SYSTEM */
            .cyber-radio-group {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 5px;
                width: 100%;
            }

            .cyber-radio-wrapper {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                user-select: none;
            }

            .cyber-radio-input {
                appearance: none;
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.03);
                cursor: pointer;
                position: relative;
                transition: all 0.2s ease;
                outline: none;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .cyber-radio-input:checked {
                border-color: var(--neon-blue);
                box-shadow: 0 0 15px rgba(0, 210, 255, 0.3);
            }

            .cyber-radio-input::after {
                content: '';
                width: 10px;
                height: 10px;
                background: var(--neon-blue);
                border-radius: 50%;
                opacity: 0;
                transform: scale(0.5);
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cyber-radio-input:checked::after {
                opacity: 1;
                transform: scale(1);
            }

            /* UTILITIES */
            .cyber-number {
                font-family: 'Orbitron', sans-serif;
                font-variant-numeric: tabular-nums;
            }

            /* CONTEXT MENU */
            .cyber-context-menu {
                position: fixed;
                background: rgba(15, 23, 42, 0.92);
                backdrop-filter: blur(25px);
                border: 1px solid rgba(0, 210, 255, 0.4);
                border-radius: 12px;
                padding: 10px;
                min-width: 220px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                gap: 5px;
                opacity: 0;
                transform: scale(0.95);
                transform-origin: top left;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .cyber-context-menu.visible {
                opacity: 1;
                transform: scale(1);
                pointer-events: auto;
            }

            .context-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .context-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .context-label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.85);
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .context-close {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0.4;
                transition: opacity 0.2s;
                font-size: 1.2rem;
                line-height: 1;
                color: white;
            }

            .context-close:hover {
                opacity: 1;
            }

            @keyframes ui-card-fade {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* --- HIGH-FIDELITY NUMBER WIDGETS --- */
            .cyber-number-widget {
                display: inline-flex;
                gap: 2px;
                align-items: center;
                justify-content: flex-start;
                min-height: 32px;
            }

            .cyber-digit-box {
                width: 20px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Orbitron', sans-serif;
                font-size: 1.4rem;
                font-weight: bold;
                color: var(--neon-blue);
                text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
                transition: all 0.1s ease;
            }

            .cyber-digit-box.separator {
                width: 10px;
                opacity: 0.6;
            }

            /* --- DROPDOWN PANEL FIX --- */
            .dropdown-panel {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(10, 15, 25, 0.98);
                border: 1px solid var(--neon-blue);
                border-radius: 8px;
                z-index: 10000;
                backdrop-filter: blur(20px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                margin-top: 5px;
            }

            .dropdown-option {
                padding: 10px 15px;
                cursor: pointer;
                font-family: 'Orbitron';
                font-size: 0.75rem;
                color: rgba(255,255,255,0.7);
                transition: all 0.2s;
            }

            .dropdown-option:hover {
                background: rgba(0, 210, 255, 0.2);
                color: #fff;
            }

            /* CYBER SELECT BOX SYSTEM */
            .cyber-select {
                appearance: none;
                -webkit-appearance: none;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid var(--neon-blue);
                color: #fff;
                padding: 10px 35px 10px 15px;
                border-radius: 12px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                outline: none;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300d2ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 12px center;
                background-size: 14px;
                box-shadow: 0 0 10px rgba(0, 210, 255, 0.1);
            }

            .cyber-select:hover {
                background-color: rgba(255, 255, 255, 0.08);
                border-color: #fff;
                box-shadow: 0 0 20px rgba(0, 210, 255, 0.2);
                transform: translateY(-1px);
            }

            .cyber-select:focus {
                border-color: #fff;
                box-shadow: 0 0 25px rgba(0, 210, 255, 0.4);
            }

            .cyber-select option {
                background-color: #0a1329;
                color: #fff;
                padding: 10px;
            }

            /* MISSION BRIEFING BOX */
            .cyber-dropdown {
                position: relative;
                width: 100%;
                font-family: 'Outfit', sans-serif;
            }

            .dropdown-trigger {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--neon-blue);
                padding: 12px 15px;
                border-radius: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                box-sizing: border-box;
                transition: all 0.3s ease;
            }

            .dropdown-trigger:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: var(--neon-blue);
            }

            .dropdown-panel {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                width: 100%;
                box-sizing: border-box;
                background: rgba(10, 15, 25, 0.95);
                border: 1px solid var(--neon-blue);
                border-radius: 12px;
                z-index: 1000;
                display: none;
                backdrop-filter: blur(20px);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 210, 255, 0.1);
            }

            .dropdown-option {
                padding: 12px 15px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .dropdown-option:hover {
                background: rgba(0, 210, 255, 0.15);
                color: var(--neon-blue);
                padding-left: 20px;
            }

            .math-part {
                font-size: 1.1rem;
                flex-grow: 1;
            }

            .desc-part {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.6rem;
                letter-spacing: 1px;
                opacity: 0.5;
                text-transform: uppercase;
                margin-left: 15px;
                white-space: nowrap;
            }

            .label-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.7);
            }

            /* CHECKBOXES */
            .checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
            }

            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: opacity 0.2s ease;
                min-height: 24px;
            }

            .checkbox-item:hover {
                opacity: 0.8;
            }

            .checkbox-item input[type="checkbox"] {
                appearance: none;
                width: 16px;
                height: 16px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 3px;
                cursor: pointer;
                position: relative;
                transition: background 0.2s, border-color 0.2s;
                flex-shrink: 0;
                background: rgba(0, 0, 0, 0.2);
            }

            .checkbox-item input[type="checkbox"]:checked {
                background: var(--neon-blue);
                border-color: var(--neon-blue);
                box-shadow: 0 0 12px rgba(0, 210, 255, 0.4);
            }

            .checkbox-item input[type="checkbox"]:checked::after {
                content: "";
                position: absolute;
                top: 3px;
                left: 3px;
                width: 8px;
                height: 8px;
                background: black;
                border-radius: 1px;
            }

            .checkbox-item label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.62rem;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                color: rgba(255, 255, 255, 0.6);
                transition: color 0.2s;
            }

            .checkbox-item input[type="checkbox"]:checked + label {
                color: #fff;
            }

            /* CYBER BUTTONS */
            .cyber-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--neon-blue);
                color: #fff;
                padding: 12px 20px;
                border-radius: 12px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.65rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                box-shadow: 0 0 15px rgba(0, 210, 255, 0.1);
                width: 100%;
                margin-top: 10px;
                outline: none;
            }

            .cyber-btn:hover {
                background: rgba(0, 210, 255, 0.15);
                box-shadow: 0 0 25px rgba(0, 210, 255, 0.3);
                border-color: #fff;
                transform: translateY(-1px);
            }

            .cyber-btn:active {
                transform: translateY(1px) scale(0.98);
                background: rgba(0, 210, 255, 0.3);
            }

            /* MISSION BRIEFING BOX */
            .briefing-box {
                font-size: 0.85rem;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.8);
                border-left: 3px solid var(--neon-blue);
                padding-left: 15px;
            }

            /* STATS / ANALYSIS GRID */
            .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 5px;
            }

            .stats-card {
                background: rgba(255, 255, 255, 0.03);
                padding: 12px;
                border-radius: 14px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                transition: all 0.3s ease;
            }

            .stats-card:hover {
                background: rgba(255, 255, 255, 0.06);
                border-color: rgba(255, 255, 255, 0.15);
            }

            .stats-label {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.55rem;
                color: rgba(255, 255, 255, 0.4);
                text-transform: uppercase;
                letter-spacing: 1px;
                display: block;
                margin-bottom: 5px;
            }

            .stats-val {
                font-family: 'Orbitron', sans-serif;
                font-size: 1rem;
                color: var(--neon-blue);
                font-weight: bold;
            }

            /* CYBER SLIDER (PREMIUM) */
            .cyber-control-group {
                margin-bottom: 5px;
                width: 100%;
            }
            .control-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }
            .cyber-slider {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                max-width: 100%;
                min-height: 28px;
                padding: 10px 0;
                margin: 8px 0;
                background: transparent;
                border-radius: 0;
                outline: none;
                cursor: pointer;
            }
            .cyber-slider::-webkit-slider-runnable-track {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.22);
                border-radius: 3px;
                border: none;
            }
            .cyber-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--accent, var(--neon-blue));
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px var(--accent, var(--neon-blue));
                margin-top: -5px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .cyber-slider::-moz-range-track {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.22);
                border-radius: 3px;
                border: none;
            }
            .cyber-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: var(--accent, var(--neon-blue));
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px var(--accent, var(--neon-blue));
            }
            .cyber-slider::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 0 20px var(--accent, var(--neon-blue));
            }
            .val-display {
                font-family: 'Orbitron', sans-serif;
                font-size: 0.8rem;
                font-weight: bold;
            }

            /* Lab scan (.search-container … under #search-mount): js/labor-scan-search.css (index + tools) */

            /* GLOBAL SCREEN SIZE WARNING */
            .cyber-screen-warning {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.96);
                padding: 18px 28px 22px;
                border-radius: 14px;
                border: 1px solid rgba(255, 60, 60, 0.6);
                background: rgba(90, 10, 20, 0.88);
                color: #ffd0d0;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.95rem;
                letter-spacing: 1.4px;
                z-index: 1000001;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
                box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45), 0 0 14px rgba(255, 30, 30, 0.45);
                text-transform: uppercase;
                text-align: center;
                max-width: min(98vw, 1080px);
                line-height: 1.35;
            }

            .cyber-screen-warning.visible {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
                pointer-events: auto;
            }

            .cyber-screen-warning-close {
                position: absolute;
                top: 8px;
                right: 10px;
                text-transform: none;
                width: 34px;
                height: 34px;
                padding: 0;
                border: 1px solid rgba(255, 255, 255, 0.22);
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.25);
                color: rgba(255, 220, 220, 0.95);
                font-size: 1.35rem;
                line-height: 1;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, border-color 0.2s, color 0.2s;
            }
            .cyber-screen-warning-close:hover {
                background: rgba(255, 80, 80, 0.35);
                border-color: rgba(255, 160, 160, 0.55);
                color: #fff;
            }

            .cyber-screen-warning-ok {
                margin-top: 16px;
                padding: 10px 22px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.72rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                border-radius: 10px;
                border: 1px solid rgba(255, 180, 180, 0.45);
                background: rgba(40, 8, 14, 0.65);
                color: #ffe8e8;
                cursor: pointer;
                transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
            }
            .cyber-screen-warning-ok:hover {
                background: rgba(120, 25, 35, 0.75);
                border-color: rgba(255, 220, 220, 0.65);
                box-shadow: 0 0 14px rgba(255, 80, 80, 0.35);
            }

            .cyber-screen-warning .warn-icon-top {
                display: block;
                width: 56px;
                height: 56px;
                margin: 0 auto 10px auto;
                filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.45));
            }

            /* GLOBAL MODAL STYLES (Cyber-Branding) */
            .cyber-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(5, 11, 24, 0.85);
                backdrop-filter: blur(15px);
                z-index: 50000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            .cyber-overlay.open {
                opacity: 1;
                pointer-events: auto;
            }
            .cyber-modal {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 20px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255, 215, 0, 0.1);
                position: relative;
                color: #fff;
                font-family: 'Inter', sans-serif;
                text-align: center;
            }
            .cyber-modal h3 {
                margin-top: 0;
                font-family: 'Orbitron', sans-serif;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-bottom: 20px;
            }
            .cyber-modal p {
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 30px;
                font-size: 0.95rem;
            }
            .cyber-modal-close {
                display: block;
                margin: 20px auto 0 auto;
                padding: 8px 16px;
                font-family: 'Inter', sans-serif;
                font-size: 0.75rem;
                letter-spacing: 1px;
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 6px;
                color: rgba(255, 255, 255, 0.4);
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
            }
            .cyber-modal-close:hover {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.8);
                border-color: rgba(255, 255, 255, 0.4);
            }

            /* Contact modal (lab mini-rail heart): cyan like hover, not gold like donate modal */
            .cyber-modal.cyber-modal--neon {
                border: 1px solid rgba(0, 210, 255, 0.38);
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 28px rgba(0, 210, 255, 0.14);
            }
            .cyber-modal.cyber-modal--neon h3.cyber-modal-adopt-title {
                margin-top: 0;
                margin-bottom: 22px;
                font-family: 'Orbitron', sans-serif;
                font-weight: 700;
                font-size: clamp(1.55rem, 4.8vw, 2.05rem);
                letter-spacing: 0.14em;
                line-height: 1.25;
                text-transform: uppercase;
                background: linear-gradient(to right, var(--neon-blue, #00d2ff), #ffffff, var(--neon-purple, #9d50bb));
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                filter: drop-shadow(0 0 18px rgba(0, 210, 255, 0.35)) drop-shadow(0 0 28px rgba(157, 80, 187, 0.22));
            }
            .cyber-modal-email-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                margin: 8px 0 10px 0;
                padding: 15px 18px;
                border-radius: 10px;
                background: rgba(0, 210, 255, 0.08);
                border: 1px solid #00d2ff;
                color: #00d2ff;
                text-decoration: none;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.95rem;
                letter-spacing: 1px;
                transition: all 0.25s ease;
                box-shadow: 0 0 18px rgba(0, 210, 255, 0.22);
            }
            .cyber-modal-email-btn:hover {
                background: rgba(0, 210, 255, 0.18);
                box-shadow: 0 0 28px rgba(0, 210, 255, 0.45);
                color: #9cecff;
                border-color: #9cecff;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Global screen-size warning banner.
     * @param {Object} options
     * @param {number} options.minWidth
     * @param {number} options.minHeight
     * @param {string} options.message
     * @param {string} options.id
     * @param {number} [options.snoozeMs=3600000] After “Got it”/× do not show again (default 1 h); persisted via localStorage
     * @param {string} [options.storageKey] localStorage key (default fixed per minimum resolution)
     */
    static ensureScreenWarning(options = {}) {
        const {
            minWidth = 980,
            minHeight = 620,
            message = "Screen too small for an optimal lab view",
            id = "cyber-screen-warning",
            snoozeMs = 60 * 60 * 1000,
            storageKey = `cyberLabScreenSnooze_${minWidth}x${minHeight}`
        } = options;

        const readSnoozeUntil = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                if (raw == null) return 0;
                const n = parseInt(raw, 10);
                return Number.isFinite(n) ? n : 0;
            } catch (e) {
                return 0;
            }
        };

        const isSnoozeActive = () => Date.now() < readSnoozeUntil();

        const setSnooze = () => {
            try {
                localStorage.setItem(storageKey, String(Date.now() + snoozeMs));
            } catch (e) {
                /* Private mode / storage disabled — banner shows again next visit */
            }
        };

        const buildInnerHtml = () => `
                <button type="button" class="cyber-screen-warning-close" aria-label="Close">×</button>
                <svg class="warn-icon-top" viewBox="0 0 64 64" aria-hidden="true">
                    <path d="M32 6 L58 54 H6 Z" fill="#ffd400" stroke="#111" stroke-width="3" />
                    <rect x="29" y="21" width="6" height="19" rx="3" fill="#111" />
                    <circle cx="32" cy="47" r="3.6" fill="#111" />
                </svg>
                <div>${message}</div>
                <button type="button" class="cyber-screen-warning-ok">Got it</button>
            `;

        let warning = document.getElementById(id);
        if (!warning) {
            warning = document.createElement('div');
            warning.id = id;
            warning.className = 'cyber-screen-warning';
            warning.innerHTML = buildInnerHtml();
            document.body.appendChild(warning);
        } else {
            warning.innerHTML = buildInnerHtml();
        }

        const dismiss = () => {
            setSnooze();
            warning.classList.remove('visible');
        };

        const update = () => {
            const tooSmall = window.innerWidth < minWidth || window.innerHeight < minHeight;
            warning.classList.toggle('visible', tooSmall && !isSnoozeActive());
        };

        // Avoid duplicate listeners if called multiple times.
        const listenerKey = '__cyberScreenWarningListenerAttached__';
        if (!warning[listenerKey]) {
            window.addEventListener('resize', update);
            warning.addEventListener('click', (e) => {
                const t = e.target;
                if (t.closest('.cyber-screen-warning-close') || t.closest('.cyber-screen-warning-ok')) {
                    dismiss();
                }
            });
            warning[listenerKey] = true;
        }
        update();
    }

    static createCard(containerId, title, contentHTML, accentColor = '#00d2ff', options = { collapsible: false }) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cardId = `card-${Math.random().toString(36).substr(2, 9)}`;
        const toggleHtml = options.collapsible ? '<span class="toggle-icon">▶</span>' : '';

        const glowColor = (typeof accentColor === 'string' && accentColor.startsWith('#')) ? `${accentColor}66` : 'rgba(0, 210, 255, 0.4)';

        const cardHTML = `
            <div id="${cardId}" class="instrument-card ${options.collapsible ? 'collapsible' : ''}">
                ${title ? `
                <div class="instrument-title" style="color: ${accentColor}; text-shadow: 0 0 10px ${glowColor};">
                    ${toggleHtml}
                    ${title}
                </div>` : ''}
                <div class="card-content" style="${!title ? 'padding-top: 0;' : ''}">
                    ${contentHTML}
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);

        if (options.collapsible) {
            const card = document.getElementById(cardId);
            const titleEl = card.querySelector('.instrument-title');
            titleEl.addEventListener('click', () => {
                card.classList.toggle('collapsed');
            });
        }
    }

    static createSlider(containerId, label, min, max, value, step, oninput, color = 'var(--neon-blue)') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const sliderId = `slider-${Math.random().toString(36).substr(2, 9)}`;
        const displayId = `val-${sliderId}`;

        const html = `
            <div class="cyber-control-group">
                <div class="control-header">
                    <span class="cyber-label" style="color:rgba(255,255,255,0.7); font-size:0.7rem; font-family:'Orbitron';">${label}</span>
                    <span id="${displayId}" class="val-display" style="color:${color}">${value}</span>
                </div>
                <input type="range" class="cyber-slider" id="${sliderId}" 
                    min="${min}" max="${max}" value="${value}" step="${step}"
                    style="--accent:${color}">
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);

        const input = document.getElementById(sliderId);
        const display = document.getElementById(displayId);

        input.oninput = (e) => {
            const val = e.target.value;
            display.innerText = val;
            oninput(parseFloat(val));
        };
    }

    /**
     * Creates a high-fidelity data grid for real-time analysis
     * @param {string} containerId - Mount point
     * @param {Array} stats - [{label, value, color}]
     */
    static createStatsGrid(containerId, stats) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `<div class="stats-grid"></div>`;
        const grid = container.querySelector('.stats-grid');

        stats.forEach((stat, index) => {
            const card = document.createElement('div');
            card.className = 'stats-card';
            card.id = `stats-card-${containerId}-${index}`;
            card.innerHTML = `
                <span class="stats-label">${stat.label}</span>
                <span class="stats-val" style="color:${stat.color || 'var(--neon-blue)'}">${stat.value}</span>
            `;
            grid.appendChild(card);
        });
    }

    /**
     * Updates values in an existing stats grid
     * @param {string} containerId - Mount point (used for targeting)
     * @param {Array} stats - [{value, color}]
     */
    static updateStatsGrid(containerId, stats) {
        stats.forEach((stat, index) => {
            const valEl = document.querySelector(`#stats-card-${containerId}-${index} .stats-val`);
            if (valEl) {
                if (stat.value !== undefined) valEl.innerText = stat.value;
                if (stat.color) valEl.style.color = stat.color;
            }
        });
    }

    static injectBriefing(containerId, text) {
        this.createCard(containerId, 'Mission briefing', `
            <div class="briefing-box">
                ${text}
            </div>
        `, '#00d2ff', { collapsible: true });
    }

    static createDropdown(containerId, options, onSelect, defaultId = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
        const defaultOption = options.find(o => o.id === defaultId) || options[0];

        const html = `
            <div id="${dropdownId}" class="cyber-dropdown">
                <div class="dropdown-trigger">
                    <span class="selected-val">${defaultOption.label}</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="dropdown-panel">
                    ${options.map(opt => `<div class="dropdown-option" data-id="${opt.id}">${opt.label}</div>`).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;

        const dropdown = document.getElementById(dropdownId);
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const panel = dropdown.querySelector('.dropdown-panel');

        // Ensure children don't swallow the click
        trigger.querySelectorAll('*').forEach(child => child.style.pointerEvents = 'none');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentDisplay = window.getComputedStyle(panel).display;
            const isOpen = currentDisplay === 'block';

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-panel').forEach(p => p.style.display = 'none');

            panel.style.display = isOpen ? 'none' : 'block';
            panel.style.zIndex = "1000000";

            if (!isOpen && window.katex) {
                dropdown.querySelectorAll('.math-part').forEach(mp => {
                    window.katex.render(mp.dataset.tex, mp, { throwOnError: false });
                });
            }
        });

        panel.addEventListener('click', (e) => {
            const opt = e.target.closest('.dropdown-option');
            if (opt) {
                const id = opt.dataset.id;
                const selectedVal = dropdown.querySelector('.selected-val');
                selectedVal.innerHTML = opt.innerHTML; // Copy the structured HTML
                panel.style.display = 'none';

                // Render Math in the selected trigger (selective)
                if (window.katex) {
                    const mp = selectedVal.querySelector('.math-part');
                    if (mp) {
                        window.katex.render(mp.dataset.tex, mp, { throwOnError: false });
                    }
                }

                onSelect(id);
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        // Initial Math Render for the trigger
        if (window.katex) {
            const initialMp = dropdown.querySelector('.dropdown-trigger .math-part');
            if (initialMp) {
                window.katex.render(initialMp.dataset.tex, initialMp, { throwOnError: false });
            }
        }
    }

    /**
     * Creates a premium Cyber-Checkbox
     * @param {string} containerId - The ID of the container element
     * @param {string} label - The label text
     * @param {boolean} checked - Initial state
     * @param {function} onchange - Callback for state changes
     * @param {string} color - Optional custom color for the label
     */
    static createCheckbox(containerId, label, checked, onchange, color = null) {
        const wrapper = document.createElement('label');
        wrapper.className = 'cyber-checkbox-wrapper';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'cyber-checkbox';
        checkbox.checked = checked;
        checkbox.onchange = (e) => onchange(e.target.checked);

        const labelText = document.createElement('span');
        labelText.className = 'cyber-label';
        labelText.textContent = label;
        if (color) labelText.style.color = color;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(labelText);

        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) container.appendChild(wrapper);
        }

        return wrapper;
    }

    /**
     * Creates a premium Cyber-Radio Group
     * @param {string} containerId - Mount point
     * @param {string} title - Label for the group
     * @param {Array} options - [{label, value}]
     * @param {string} selectedValue - Initial value
     * @param {function} onchange - Callback(val)
     */
    static createRadioGroup(containerId, title, options, selectedValue, onchange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const groupWrapper = document.createElement('div');
        groupWrapper.className = 'cyber-radio-group';

        if (title) {
            const h = document.createElement('span');
            h.className = 'cyber-label';
            h.style.cssText = 'font-size: 0.65rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;';
            h.textContent = title;
            groupWrapper.appendChild(h);
        }

        const name = `radio-${Math.random().toString(36).substr(2, 9)}`;

        options.forEach(opt => {
            const wrapper = document.createElement('label');
            wrapper.className = 'cyber-radio-wrapper';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = name;
            radio.className = 'cyber-radio-input';
            radio.value = opt.value;
            radio.checked = opt.value === selectedValue;
            radio.onchange = () => onchange(opt.value);

            const text = document.createElement('span');
            text.className = 'cyber-label';
            text.textContent = opt.label;

            wrapper.appendChild(radio);
            wrapper.appendChild(text);
            groupWrapper.appendChild(wrapper);
        });

        container.appendChild(groupWrapper);
    }

    static showContextMenu(x, y, items = []) {
        let menu = document.getElementById('cyber-context-menu');
        if (menu) menu.remove();

        menu = document.createElement('div');
        menu.id = 'cyber-context-menu';
        menu.className = 'cyber-context-menu';
        document.body.appendChild(menu);

        // Close Button (X)
        const closeBtn = document.createElement('div');
        closeBtn.className = 'context-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            menu.classList.remove('visible');
            setTimeout(() => menu.remove(), 200);
        };
        menu.appendChild(closeBtn);

        // Position & Shift if near edges
        const menuWidth = 220;
        const menuHeight = items.length * 45 + 20;
        let finalX = x;
        let finalY = y;

        if (x + menuWidth > window.innerWidth) finalX -= menuWidth;
        if (y + menuHeight > window.innerHeight) finalY -= menuHeight;

        menu.style.left = `${finalX}px`;
        menu.style.top = `${finalY}px`;

        // Render items
        items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.className = 'context-divider';
                menu.appendChild(divider);
                return;
            }
            if (item.checked !== undefined) {
                // Checkbox Item
                const checkboxWrapper = this.createCheckbox(null, item.label, item.checked, (val) => {
                    if (item.onchange) item.onchange(val);
                });
                /* Otherwise window mousedown dismiss often closes menu before checkbox.change */
                checkboxWrapper.addEventListener('mousedown', (ev) => ev.stopPropagation());
                menu.appendChild(checkboxWrapper);
            } else {
                // Action Item (No Checkbox)
                const actionBtn = document.createElement('div');
                actionBtn.className = 'context-item action-item';
                actionBtn.innerHTML = `<div class="context-label">${item.label}</div>`;
                actionBtn.onclick = () => {
                    if (item.onclick) item.onclick();
                    // Close menu on action
                    menu.classList.remove('visible');
                    setTimeout(() => menu.remove(), 200);
                };
                menu.appendChild(actionBtn);
            }
        });

        requestAnimationFrame(() => menu.classList.add('visible'));

        // global close
        const dismiss = (e) => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('visible');
                setTimeout(() => menu.remove(), 200);
                window.removeEventListener('mousedown', dismiss);
            }
        };
        setTimeout(() => window.addEventListener('mousedown', dismiss), 10);
    }

    /**
     * Creates a high-fidelity ULTRA search bar (lab scan)
     * @param {string} containerId - Mount point
     * @param {string} placeholder - Input placeholder
     * @param {function} onInput - Callback function(value)
     */
    static createSearch(containerId, placeholder, onInput) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="${placeholder}" autocomplete="off">
                <div class="search-icon">🔍</div>
                <button class="clear-search-btn" title="Clear search">×</button>
            </div>
        `;

        container.innerHTML = html;

        const input = container.querySelector('.search-input');
        const clearBtn = container.querySelector('.clear-search-btn');

        const updateClearBtn = () => {
            clearBtn.style.display = input.value.length > 0 ? 'flex' : 'none';
        };

        input.addEventListener('input', (e) => {
            updateClearBtn();
            onInput(e.target.value);
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            updateClearBtn();
            input.focus();
            onInput('');
        });
    }

    /**
     * Updates a high-fidelity Cyber-Number-Widget with stable digit alignment.
     * @param {string} containerId - Target container ID
     * @param {number} value - Numeric value
     * @param {number} decimals - Precision
     * @param {number} minDigits - Integer padding
     * @param {object|null} styleConfig - Optional per-widget overrides
     */
    static updateNumberWidget(containerId, value, decimals = 2, minDigits = 1, styleConfig = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let str = (typeof value === 'number') ? value.toFixed(decimals) : String(value);
        const parts = str.split('.');
        while (parts[0].length < minDigits) parts[0] = ' ' + parts[0];
        str = parts.join('.');

        let html = '';
        for (let char of str) {
            if (char === '.' || char === ',' || char === '-') {
                html += `<div class="cyber-digit-box separator">${char}</div>`;
            } else if (char === ' ') {
                html += `<div class="cyber-digit-box" style="opacity:0;">0</div>`;
            } else {
                html += `<div class="cyber-digit-box">${char}</div>`;
            }
        }
        container.innerHTML = html;

        // Optional style overrides for a single widget instance (backward-compatible).
        if (styleConfig && typeof styleConfig === 'object') {
            const digits = container.querySelectorAll('.cyber-digit-box');
            for (const el of digits) {
                if (styleConfig.fontSize) el.style.fontSize = styleConfig.fontSize;
                if (styleConfig.digitWidth && !el.classList.contains('separator')) el.style.width = styleConfig.digitWidth;
                if (styleConfig.digitHeight && !el.classList.contains('separator')) el.style.height = styleConfig.digitHeight;
                if (styleConfig.separatorWidth && el.classList.contains('separator')) el.style.width = styleConfig.separatorWidth;
                if (styleConfig.color) el.style.color = styleConfig.color;
                if (styleConfig.textShadow) el.style.textShadow = styleConfig.textShadow;
            }
        }
    }
}

/** Programmatic invoke like keyboard shortcut (e.g. from labs). */
if (typeof window !== 'undefined') {
    window.CyberAppScreenshot = () => CyberUI.captureAppScreenshot();
}
