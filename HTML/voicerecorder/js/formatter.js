// Voice commands → text formatting.
//   "absatz"                     → line break
//   "hashtag/hash/# neue Idee"   → "Idee N" (blank line only if text exists before)
export function formatCommands(text) {
    if (!text) return text;

    const matches = text.match(/Idee (\d+)/g);
    let maxN = matches ? Math.max(...matches.map(m => parseInt(m.split(' ')[1]))) : 0;

    return text
        .replace(/(?:#|hashtag|hash)\s*neue\s+idee\s*[.,;:!?]?/gi, (match, offset) => {
            maxN++;
            const beforeMatch = text.substring(0, offset).trim();
            const prefix = beforeMatch.length > 0 ? '\n\n' : '';
            return `${prefix}Idee ${maxN}\n`;
        })
        .replace(/\babsatz\s*[.,;:]?/gi, '\n');
}
