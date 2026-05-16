// Voice commands → text formatting.
//   "absatz"           → line break
//   "hash neue Idee"   → "Idee N" + newline (no blank line before if text starts with it)
export function formatCommands(text) {
    if (!text) return text;

    const matches = text.match(/Idee (\d+)/g);
    let maxN = matches ? Math.max(...matches.map(m => parseInt(m.split(' ')[1]))) : 0;
    let isFirst = true;

    return text
        .replace(/\b(?:hash|hashtag)\s+neue\s+idee\s*[.,;:]?/gi, (match, offset) => {
            maxN++;
            const beforeMatch = text.substring(0, offset).trim();
            const needsBlankLine = beforeMatch.length > 0;
            const prefix = isFirst && !needsBlankLine ? '' : '\n\n';
            isFirst = false;
            return `${prefix}Idee ${maxN}\n`;
        })
        .replace(/\babsatz\s*[.,;:]?/gi, '\n');
}
