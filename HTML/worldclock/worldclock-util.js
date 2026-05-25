// Worldclock — small pure display/lookup helpers (no DOM, no shared state).

// "SZ" (summer time) / "WZ" (winter time) for a given IANA timezone, "" if unknown.
function getDSTLabel(tz) {
    if (!tz) return "";
    try {
        const parts = new Intl.DateTimeFormat('de-DE', {
            timeZone: tz,
            timeZoneName: 'long'
        }).formatToParts(new Date());
        const tzName = parts.find(p => p.type === 'timeZoneName').value;
        return tzName.includes('Sommerzeit') ? "SZ" : "WZ";
    } catch (e) { return ""; }
}

// Population number → German thousands grouping.
function formatPopulation(n) {
    return Math.round(n).toLocaleString('de-DE');
}

// Flag emoji → German country name ("Land" if unknown).
function getCountryName(flag) {
    const map = {
        "🇫🇷": "Frankreich", "🇮🇹": "Italien", "🇪🇸": "Spanien", "🇦🇹": "Österreich", "🇵🇱": "Polen",
        "🇵🇹": "Portugal", "🇮🇪": "Irland", "🇬🇧": "Großbritannien",
        "🇨🇦": "Kanada", "🇺🇸": "USA", "🇲🇽": "Mexiko",
        "🇧🇷": "Brasilien", "🇦🇷": "Argentinien", "🇺🇾": "Uruguay", "🇵🇾": "Paraguay", "🇨🇱": "Chile",
        "🇩🇴": "Dom. Republik", "🇵🇷": "Puerto Rico", "🇬🇾": "Guyana", "🇸🇷": "Suriname",
        "🇨🇳": "China", "🇸🇬": "Singapur", "🇭🇰": "Hongkong", "🇹🇼": "Taiwan", "🇦🇺": "Australien",
        "🇰🇷": "Südkorea", "🇯🇵": "Japan",
        "🇴🇲": "Oman", "🇦🇪": "V.A.E.", "🇬🇪": "Georgien", "🇦🇿": "Aserbaidschan", "🇦🇲": "Armenien",
        "🇮🇳": "Indien",
        "🇰🇼": "Kuwait", "🇸🇦": "Saudi-Arabien", "🇾🇪": "Jemen", "🇪🇹": "Äthiopien", "🇰🇪": "Kenia",
        "🇵🇰": "Pakistan", "🇺🇿": "Usbekistan", "🇹🇯": "Tadschikistan", "🇦🇫": "Afghanistan",
        "🇮🇩": "Indonesien", "🇻🇳": "Vietnam", "🇰🇭": "Kambodscha", "🇱🇦": "Laos",
        "🇳🇿": "Neuseeland", "🇫🇯": "Fidschi", "🇹🇴": "Tonga", "🇼🇸": "Samoa",
        "🇻🇺": "Vanuatu", "🇳🇨": "Neukaledonien", "🇷🇺": "Russland", "🇸🇧": "Salomonen",
        "🇵🇫": "Franz. Polynesien", "🇨🇰": "Cookinseln",
        "🇦🇸": "Amerik. Samoa", "🇳🇺": "Niue", "🇹🇰": "Tokelau",
        "🇨🇻": "Kap Verde",
        "🇬🇷": "Griechenland", "🇮🇱": "Israel", "🇱🇧": "Libanon", "🇯🇴": "Jordanien", "🇿🇦": "Südafrika",
        "🇨🇮": "Elfenbeinküste", "🇲🇱": "Mali", "🇬🇳": "Guinea", "🇸🇱": "Sierra Leone", "🇱🇷": "Liberia",
        "🌐": "Welt"
    };
    return map[flag] || "Land";
}
