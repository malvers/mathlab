// Voice commands → text formatting.
//   "absatz"  → line break
//   New-idea trigger (any variant) → "Idee N" (blank line only if text exists before)
//     accepted starts: "#", "hashtag", "hash tag", "hash", "raute"
//     accepted middle: optional "neue" (so "hashtag idee" also works)
//   Case-insensitive, tolerant of trailing punctuation.
export function formatCommands(text) {
    if (!text) return text;

    const matches = text.match(/Idee (\d+)/g);
    let maxN = matches ? Math.max(...matches.map(m => parseInt(m.split(' ')[1]))) : 0;

    // Whisper mishears "Hashtag" as "HedgeTex", "Hedge Tex", "Hash Tech", etc.
    const ideaCmd = /(?:#|hashtag|hash\s*tag|hash\s*tech|hedge\s*tex|hedge\s*tech|hedge\s*tag|hash|hedge|raute)\s*(?:neue\s+)?idee\s*[.,;:!?]?/gi;

    return text
        .replace(ideaCmd, (match, offset) => {
            maxN++;
            const beforeMatch = text.substring(0, offset).trim();
            const prefix = beforeMatch.length > 0 ? '\n\n' : '';
            return `${prefix}Idee ${maxN}\n`;
        })
        .replace(/\babsatz\s*[.,;:]?/gi, '\n');
}
