// Embedded Gemini API key — committed to the repo so deploys (docalvers.de
// etc.) have a working fallback without each environment needing to drop in
// apikey.local.js. Same XOR + base64 obfuscation as apikey.local.js.
//
// ⚠ This is OBFUSCATION, not encryption. Anyone who reads this file + the
//    decode loop below can recover the plaintext. For a public GitHub repo
//    that means the key is effectively public. Protect it via Google Cloud
//    "API key restrictions" (allowed referrers + locked-down API surface)
//    rather than relying on this file to keep it secret.
//
// Override mechanism: apikey.local.js (gitignored) loads AFTER this file
// and replaces window.GEMINI_API_KEY when present, so local development
// can use a different key without touching this committed file.
(function () {
    var BLOB = "LCYIETscNxdVU1RwD0pUFS1dVR4eUgIiD1orJCIPKgthWFJ0T2JQ";
    var PASS = "morpheus-2026-doc-alvers";
    try {
        var raw = atob(BLOB);
        var out = "";
        for (var i = 0; i < raw.length; i++) {
            out += String.fromCharCode(raw.charCodeAt(i) ^ PASS.charCodeAt(i % PASS.length));
        }
        window.GEMINI_API_KEY = out;
    } catch (e) {
        // atob failure or similar — silently leave key undefined.
    }
})();
