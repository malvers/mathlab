// ── chat-predictor.js ────────────────────────────────────────────────────────
// Reusable, UI-agnostic prediction engine for a chat input. Given the full conversation,
// the current speaker and the draft the user has typed, it asks Gemini (full context) for
// the next message and returns continuation suggestions.
//
// HONEST NOTE: Gemini gives us NO probabilities (gemini-2.5-flash has no logprobs), and the
// order of the variants is ARBITRARY — there is no "most likely first". So there is no
// confidence here and the list order carries no meaning. (No faked rank-confidence.)
//
// Usage:
//   ChatPredictor.init({ url, key });                       // once
//   const items = await ChatPredictor.predict({ messages, me, partner, speaker, draft });
//   // items = [{ full, cont }]   (up to 3, deduped, order arbitrary)
//   //   full = the complete message to send (exact draft + continuation)
//   //   cont = just the continuation after the draft (what to show / ghost)
//
// No DOM, no framework — drop it into any page (sim, VGP, …).

(function () {
  const ChatPredictor = {
    config: {
      url: '',                       // Supabase gemini edge function URL
      key: '',                       // publishable anon key (client-safe)
      model: 'gemini-2.5-flash',
      temperature: 0.7,
      maxOutputTokens: 200,
    },

    init(cfg) { Object.assign(this.config, cfg || {}); return this; },

    // Strip the draft off a full message and return only the continuation. Tolerant of the model
    // "fixing" the draft (typos/case): exact prefix if possible, else skip as many WORDS as the draft has.
    continuationOf(draft, msg) {
      if (!draft) return msg.trim();
      if (msg.toLowerCase().startsWith(draft.toLowerCase())) return msg.slice(draft.length);
      const nWords = draft.trim().split(/\s+/).length;
      let i = 0, count = 0;
      while (count < nWords && i < msg.length) {
        while (i < msg.length && /\s/.test(msg[i])) i++;
        while (i < msg.length && !/\s/.test(msg[i])) i++;
        count++;
      }
      return msg.slice(i);
    },

    _prompt({ messages, me, partner, speaker, draft }) {
      const cur = speaker === 'me' ? me : partner;
      const dialog = (messages || []).map(m => (m.who === 'me' ? me : partner) + ': ' + m.text).join('\n');
      const base = (messages && messages.length) ? `Das ist ein Chat zwischen ${me} und ${partner}:\n\n${dialog}\n\n` : '';
      const task = draft
        ? `${cur} tippt gerade an einer Nachricht und hat bisher GENAU das getippt: "${draft}". Gib 3 verschiedene ` +
          `VOLLSTÄNDIGE Nachrichten zurück, die JEWEILS EXAKT mit genau diesem getippten Anfang beginnen und ihn dann ` +
          `natürlich fortsetzen, kurz, auf Deutsch, passend zum Verlauf.`
        : ((messages && messages.length)
            ? `Schreibe die nächste Nachricht von ${cur} — kurz, natürlich, auf Deutsch, passend zum Verlauf. 3 verschiedene Varianten.`
            : `Schreibe eine erste, natürliche Chat-Nachricht von ${me} an ${partner}, auf Deutsch. 3 verschiedene Varianten.`);
      return base + task + ` Je eine pro Zeile, ohne Nummerierung, ohne Anführungszeichen.`;
    },

    async _callGemini(prompt) {
      const c = this.config;
      const r = await fetch(c.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': c.key, 'Authorization': 'Bearer ' + c.key },
        body: JSON.stringify({ model: c.model, body: {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: c.temperature, maxOutputTokens: c.maxOutputTokens, thinkingConfig: { thinkingBudget: 0 } },
        }}),
      });
      const j = await r.json();
      return (j && j.candidates && j.candidates[0] && j.candidates[0].content
        && j.candidates[0].content.parts && j.candidates[0].content.parts[0]
        && j.candidates[0].content.parts[0].text) || '';
    },

    async predict({ messages, me, partner, speaker, draft }) {
      me = me || 'Ich'; partner = partner || 'Partner'; speaker = speaker || 'me'; draft = draft || '';
      const text = await this._callGemini(this._prompt({ messages, me, partner, speaker, draft }));
      const lines = text.split('\n').filter(s => s.trim())
        .map(s => s.replace(/^\s*(?:[-•*"»«]|\d+[.)])\s*/, '').replace(/\s*["»«]$/, ''))
        .slice(0, 3);
      const seen = new Set();
      return lines.map(msg => {
        const cont = this.continuationOf(draft, msg);
        return { full: draft ? draft + cont : cont, cont: cont.trim() };
      }).filter(it => {
        const k = it.cont.toLowerCase();
        if (!it.cont || seen.has(k)) return false;
        seen.add(k); return true;
      });
    },
  };

  window.ChatPredictor = ChatPredictor;
})();
