// Voice commands → text formatting.
//   "absatz"        → line break
//   "Hashtag Idee"  → blank line + "#Idee N" + newline (N counts sequentially)
export function formatCommands(text) {
    if (!text) return text;
    let n = 0;
    return text
        .replace(/\bhashtag\s+idee\s*[.,;:]?/gi, () => { n++; return `\n\n#Idee ${n}\n`; })
        .replace(/\babsatz\s*[.,;:]?/gi, '\n');
}
