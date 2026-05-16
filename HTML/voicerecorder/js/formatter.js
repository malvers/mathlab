// Voice commands → text formatting.
//   "absatz"           → line break
//   "Prozent Idee"     → "Idee N" (blank line only if text exists before)
//     also accepted (legacy / Whisper variants): "%", "hashtag", "hash", "#", "raute"
export function formatCommands(text) {
    if (!text) return text;

    const matches = text.match(/Idee (\d+)/g);
    let maxN = matches ? Math.max(...matches.map(m => parseInt(m.split(' ')[1]))) : 0;

    const ideaCmd = /(?:%|prozent|#|hashtag|hash\s*tag|hash|raute)\s*(?:neue\s+)?idee\s*[.,;:!?]?/gi;

    return text
        .replace(ideaCmd, (match, offset) => {
            maxN++;
            const beforeMatch = text.substring(0, offset).trim();
            const prefix = beforeMatch.length > 0 ? '\n\n' : '';
            return `${prefix}Idee ${maxN}\n`;
        })
        .replace(/\babsatz\s*[.,;:]?/gi, '\n');
}
