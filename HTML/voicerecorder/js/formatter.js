// Voice commands → text formatting.
//   "absatz"     → line break
//   "neue idee"  → blank line + "Idee N" + newline (N counts sequentially)
export function formatCommands(text) {
    if (!text) return text;
    let n = 0;
    return text
        .replace(/\bneue\s+idee\s*[.,;:]?/gi, () => { n++; return `\n\nIdee ${n}\n`; })
        .replace(/\babsatz\s*[.,;:]?/gi, '\n');
}
