/**
 * CYBER-LABOR GLOBAL i18n DICTIONARY — CORE
 * Languages: DE, EN, ES, FR, IT, PT, NL, SW, TR
 * Translations are in separate files loaded after this one:
 *   i18n-de.js  i18n-en.js  i18n-es.js  i18n-fr.js  i18n-it.js
 *   i18n-pt.js  i18n-sw.js  i18n-tr.js  i18n-nl.js
 * i18n-nl.js calls resolveLanguageFromEnvironment() at the end.
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

    /** Floating canvas masthead (coach line): always German, independent of UI language */
    /** Brand masthead line — fixed German wording; not localized. */
    getBrandMastheadTitle: function () {
        return "Doc Alvers Mathe-Labor";
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
