/**
 * CYBER-LABOR GLOBAL i18n DICTIONARY — CORE
 * Languages: DE, EN, ES, FR, IT, PT, NL, SW, TR
 * The bootstrap at the end of THIS file resolves the language (URL/localStorage,
 * no dictionaries needed) and then document.writes ONLY the active language's
 * dictionary (i18n-<lang>.js) — pages do NOT list dictionary <script> tags anymore.
 * Language switching always reloads the page (CyberUI.cycleCyberLabLang /
 * index.html setLanguage), so one language per page load is sufficient.
 * Index/tools card texts load the same way via the i18n-index.js loader.
 */

const CyberI18n = {
    current: 'de',

    translations: {},


    /**
     * Keep the document root lang attribute aligned with CyberI18n.current.
     * Only writes when the value changes — avoids redundant style/layout work during WebGL labs (orbitals, …).
     */
    applyHtmlLangAttribute: function () {
        try {
            const code = this.current || 'de';
            const langAttr = code === 'sw' ? 'sw' : code;
            const root = document.documentElement;
            if (root && root.getAttribute('lang') !== langAttr) {
                root.lang = langAttr;
            }
        } catch (e) {
            /* ignore */
        }
    },

    /** URL ?lang= → localStorage cyber-lab-lang → Standard de (keine Browser-Sprache, damit Erstbesuch konsistent DE). */
    resolveLanguageFromEnvironment: function () {
        const supported = ['de', 'en', 'es', 'fr', 'it', 'pt', 'nl', 'sw', 'tr'];
        const norm = function (s) {
            if (s == null || s === '') return '';
            const t = String(s).trim().replace(/_/g, '-').toLowerCase();
            return t.length >= 2 ? t.slice(0, 2) : '';
        };
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let pick = norm(urlParams.get('lang'));
            if (!supported.includes(pick)) {
                pick = norm(localStorage.getItem('cyber-lab-lang'));
            }
            if (!supported.includes(pick)) pick = 'de';
            this.current = pick;
            try {
                localStorage.setItem('cyber-lab-lang', pick);
            } catch (e) {}
            this.applyHtmlLangAttribute();
        } catch (e) {
            console.warn('Language resolve failed:', e);
        }
    },

    /**
     * Suppress Chrome/Edge “Translate this page?” — labs are already multilingual via CyberI18n;
     * otherwise the browser mixes in (e.g. when lang≠ detected page text).
     */
    suppressBrowserTranslatePrompt: function () {
        try {
            const html = document.documentElement;
            html.setAttribute('translate', 'no');
            html.classList.add('notranslate');
            if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
                const meta = document.createElement('meta');
                meta.setAttribute('name', 'google');
                meta.setAttribute('content', 'notranslate');
                document.head.insertBefore(meta, document.head.firstChild);
            }
        } catch (e) {
            /* ignore */
        }
    },

    // Helper to get a translation
    get: function (key, replacements = {}) {
        const parts = key.split('.');
        let result = this.translations[this.current];

        for (let part of parts) {
            if (result && result[part]) {
                result = result[part];
            } else {
                return key; // Fallback to key name
            }
        }

        // Replace placeholders
        if (typeof result === 'string') {
            Object.keys(replacements).forEach(placeholder => {
                result = result.replace(`{${placeholder}}`, replacements[placeholder]);
            });
        }

        return result;
    },

    /** Like get(), but with a fallback that actually fires.
     *  get() returns the key itself when a translation is missing, and a
     *  non-empty key string is truthy — so `get(k) || fallback` silently
     *  renders the raw key instead of the fallback. Use this instead. */
    getOr: function (key, fallback, replacements = {}) {
        const value = this.get(key, replacements);
        return (value === key || value === undefined || value === null) ? fallback : value;
    },

    /** Floating canvas masthead (coach line): always German, independent of UI language */
    /** Brand masthead line — fixed German wording; not localized. */
    getBrandMastheadTitle: function () {
        return (typeof CyberBranding !== "undefined" && CyberBranding.BRAND_NAME)
            ? CyberBranding.BRAND_NAME
            : "Doc Alvers Mathe-Labore";
    },

    /** Internal lab/tool links: ensure ?lang= matches CyberI18n.current (same tab / new tab / BFCache-safe). */
    appendLangToRelativeHref: function (href) {
        if (!href || /^https?:\/\//i.test(href)) return href;
        const lang = this.current || 'de';
        const hashIdx = href.indexOf('#');
        const hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
        const head = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
        const qIdx = head.indexOf('?');
        const path = qIdx >= 0 ? head.slice(0, qIdx) : head;
        const query = qIdx >= 0 ? head.slice(qIdx + 1) : '';
        const params = new URLSearchParams(query);
        params.set('lang', lang);
        const qs = params.toString();
        return path + (qs ? '?' + qs : '') + hash;
    }
};

// Language bootstrap: URL ?lang= → localStorage cyber-lab-lang → default DE (user choice persists on flag toggle).
// Lives here — not in a dictionary file — so every page gets it regardless of which dicts it loads;
// it reads only URL/localStorage, no dictionaries. (Moved from the tail of i18n-nl.js, 2026-08-29.)
(function () {
    try {
        CyberI18n.resolveLanguageFromEnvironment();
        CyberI18n.suppressBrowserTranslatePrompt();
    } catch (e) {
        console.warn("Language auto-detect failed:", e);
    }
    window.addEventListener(
        'pageshow',
        function (ev) {
            if (!ev.persisted) return;
            requestAnimationFrame(function () {
                try {
                    CyberI18n.resolveLanguageFromEnvironment();
                    CyberI18n.suppressBrowserTranslatePrompt();
                    if (typeof CyberUI !== 'undefined' && typeof CyberUI.syncCyberLangDisplayButtons === 'function') {
                        CyberUI.syncCyberLangDisplayButtons();
                    }
                } catch (e2) {
                    console.warn('Language re-sync after bfcache failed:', e2);
                }
            });
        },
        false
    );
})();

// Load ONLY the active language's dictionary. document.write on purpose: it blocks the
// parser like a static <script> tag, so inline scripts further down the page can rely on
// the dictionary being present (dynamic insertion would race with DOMContentLoaded).
(function () {
    try {
        // Derive the path prefix from this script's own src so subdirectory pages work too.
        var src = document.currentScript && document.currentScript.src;
        var base = src ? src.replace(/i18n\.js.*$/, '') : 'js/';
        document.write('<script src="' + base + 'i18n-' + (CyberI18n.current || 'de') + '.js"><\/script>');
    } catch (e) {
        console.warn('i18n dictionary load failed:', e);
    }
})();
