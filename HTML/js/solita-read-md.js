// Solita tool: read_markdown — give Solita READ access to the repo's Markdown files on GitHub.
//
// Self-contained add-on: registers into window.SolitaTools, no core touch (Regel 7). PUBLIC repo, so both
// the listing (GitHub git/trees API) and the file content (raw.githubusercontent.com) are KEYLESS and
// CORS-OK — no token in code (Regel 21). Read-only; there is no write path here.
//
// Two-step by design: call with NO argument → Solita gets the list of available .md files; call again with a
// `file` (name or path, fuzzy) → Solita gets that file's content. This is the general counterpart to read_notes
// (which only ever reads the single solita-notizen.md).
//
// SECURITY: AUDIT.md re-leaks decrypted secrets (WP-1 remediation backlog). The repo is public so it is already
// exposed, but we do NOT make Solita a convenient read+email path for it → it is hidden from the listing and
// refused on fetch (DENY below). Add further sensitive files there if they ever appear.
(function () {
    'use strict';

    const OWNER = 'malvers', REPO = 'mathlab', BRANCH = 'main';
    const TREE_URL = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/trees/' + BRANCH + '?recursive=1';
    const RAW_BASE = 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' + BRANCH + '/';
    const MAX_CHARS = 24000;   // safety cap so a single file's content stays sane in the tool result
    const MAX_LIST  = 400;     // safety cap on how many paths we enumerate

    // Files that must never be surfaced (decrypted secrets etc.). Matched against the lowercased basename.
    const DENY = ['audit.md'];

    const spec = {
        name: 'read_markdown',
        description: 'Lies eine beliebige Markdown-Datei (.md) aus Docs öffentlichem Repo (Notizen, Ideen, Pläne, '
            + 'Konzepte, Übergabe-Docs). OHNE Parameter aufrufen → du bekommst die LISTE aller verfügbaren .md-Dateien; '
            + 'dann RUF ERNEUT mit "file" (Dateiname oder Pfad, ungefährer Name reicht) auf, um den Inhalt zu holen. '
            + 'Nutze dies, wenn Doc nach einer bestimmten Datei/Notiz/Idee/Plan fragt („lies mir die Navigation-Notiz vor", '
            + '„was steht in den Ideen?", „zeig mir den Plan für X", „welche Notizen gibt es?"). Das Werkzeug LIEST nur. '
            + 'Für deine EIGENEN gespeicherten Solita-Notizen nutze stattdessen read_notes. Danach machst DU, was Doc wollte: '
            + 'per Mail → send_gmail mit dem Inhalt; vorlesen → natürlich gesprochen zusammenfassen; fragen → knapp sagen.',
        input_schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    description: 'Dateiname oder Pfad der gewünschten .md-Datei (ungefähr reicht, z.B. '
                        + '"notiz-2026-06-16" oder "ideen"). Leer/weglassen → gib die Liste aller .md-Dateien zurück.'
                }
            },
            required: []
        }
    };

    const isDenied = (path) => DENY.includes(path.split('/').pop().toLowerCase());
    const norm = (s) => (s || '').toLowerCase().replace(/\.md$/, '').replace(/[^a-z0-9]+/g, '');

    // Fetch the repo tree once and return the sorted list of .md paths (denylisted files removed).
    async function listMarkdown() {
        const r = await fetch(TREE_URL, { headers: { 'Accept': 'application/vnd.github+json' }, cache: 'no-store' });
        if (r.status === 403) { const e = new Error('rate'); e.kind = 'rate'; throw e; }
        if (!r.ok) { const e = new Error('http'); e.kind = 'http'; throw e; }
        const data = await r.json();
        const tree = (data && data.tree) || [];
        return tree
            .filter(n => n.type === 'blob' && /\.md$/i.test(n.path) && !isDenied(n.path))
            .map(n => n.path)
            .sort()
            .slice(0, MAX_LIST);
    }

    // Pick the best path for a user-given name: exact path → exact basename → unique substring → normalized match.
    function resolve(paths, want) {
        const w = want.trim();
        const wl = w.toLowerCase();
        const base = (p) => p.split('/').pop().toLowerCase();
        let hit = paths.find(p => p.toLowerCase() === wl) || paths.find(p => base(p) === wl)
            || paths.find(p => base(p) === wl + '.md');
        if (hit) return { hit };
        const wn = norm(w);
        const cands = paths.filter(p => p.toLowerCase().includes(wl) || norm(base(p)).includes(wn));
        if (cands.length === 1) return { hit: cands[0] };
        if (cands.length > 1) return { many: cands.slice(0, 20) };
        return {};
    }

    async function handler(args) {
        const want = args && typeof args.file === 'string' ? args.file.trim() : '';

        // --- network + listing ---
        let paths;
        try {
            paths = await listMarkdown();
        } catch (e) {
            if (e.kind === 'rate') {
                return { ok: false, summary: 'GitHub lässt mich gerade nicht nochmal nachschauen (kurzes Limit erreicht). '
                    + 'Probier es in ein paar Minuten nochmal.' };
            }
            if (e.kind === 'http') {
                return { ok: false, summary: 'Ich konnte die Dateiliste gerade nicht von GitHub laden (Server antwortet nicht). '
                    + 'Versuch es gleich nochmal.' };
            }
            return { ok: false, summary: 'Ich komme gerade nicht an die Dateien — keine Internet-Verbindung. '
                + 'Probier es gleich nochmal.' };
        }

        if (!paths.length) {
            return { ok: true, summary: 'Ich finde im Repo gerade keine Markdown-Dateien.' };
        }

        // --- no file requested → return the catalogue so Solita can pick / ask Doc ---
        if (!want) {
            return { ok: true, summary:
                'Verfügbare Markdown-Dateien (' + paths.length + '):\n\n- ' + paths.join('\n- ') + '\n\n'
                + 'ANWEISUNG AN DICH (Solita): Wenn Doc eine bestimmte Datei wollte, RUF read_markdown ERNEUT auf mit '
                + '"file" = dem passenden Pfad/Namen oben, hol dann den Inhalt und mach damit, was Doc wollte (vorlesen / '
                + 'mailen / zusammenfassen). Wollte Doc nur wissen, WELCHE Dateien es gibt, nenn ihm die wichtigsten knapp.' };
        }

        // --- file requested → resolve + fetch ---
        const res = resolve(paths, want);
        if (res.many) {
            return { ok: true, summary: 'Dazu passen mehrere Dateien:\n\n- ' + res.many.join('\n- ') + '\n\n'
                + 'ANWEISUNG AN DICH (Solita): Frag Doc kurz, welche er meint, oder nimm die offensichtlich gemeinte und '
                + 'ruf read_markdown nochmal mit dem genauen Pfad auf.' };
        }
        if (!res.hit) {
            // Denylisted name explicitly asked for → say it's not available, don't hint at its content.
            if (isDenied(want)) {
                return { ok: true, summary: 'Diese Datei kann ich nicht herausgeben.' };
            }
            return { ok: true, summary: 'Ich finde keine Markdown-Datei, die zu „' + want + '" passt. '
                + 'Ruf read_markdown ohne Parameter auf, dann siehst du die verfügbaren Namen.' };
        }

        let text = null, httpFail = false, netFail = false, status = 0;
        try {
            const r = await fetch(RAW_BASE + res.hit, { headers: { 'Accept': 'text/plain' }, cache: 'no-store' });
            status = r.status;
            if (r.ok) text = await r.text(); else httpFail = true;
        } catch (e) { netFail = true; }

        if (netFail) {
            return { ok: false, summary: 'Ich komme gerade nicht an „' + res.hit + '" — keine Internet-Verbindung. '
                + 'Probier es gleich nochmal.' };
        }
        if (httpFail || text == null) {
            return { ok: false, summary: 'Ich konnte „' + res.hit + '" gerade nicht laden (Status ' + status + '). '
                + 'Versuch es gleich nochmal.' };
        }

        let content = text, truncated = false;
        if (content.length > MAX_CHARS) { content = content.slice(0, MAX_CHARS); truncated = true; }

        return { ok: true, summary:
            'Inhalt von „' + res.hit + '"' + (truncated ? ' (gekürzt — sehr lang)' : '') + ':\n\n'
            + content + '\n\n'
            + 'ANWEISUNG AN DICH (Solita): Mach damit, was Doc wollte — vorlesen (natürlich gesprochen zusammenfassen, bei '
            + 'sehr langem Text die wichtigsten Punkte), per Mail (send_gmail, Inhalt = diese Datei) oder knapp sagen, was '
            + 'drinsteht. Erfinde nichts dazu, was nicht im Text steht.' };
    }

    function badge(args) {
        const f = args && args.file ? String(args.file).trim() : '';
        return f ? ('📄 ich lese „' + f + '" …') : '📄 ich schaue nach den Dateien …';
    }

    // Register into the shared Solita tool registry (idempotent — independent of load order).
    const reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(spec);
    reg.handlers[spec.name] = handler;
    reg.badges[spec.name] = badge;
})();
