const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");

function checkFile(relPath) {
    const filename = path.join(repoRoot, relPath);
    try {
        const code = fs.readFileSync(filename, "utf8");
        new Function(code);
        console.log(relPath, "is OK");
    } catch (e) {
        console.log(relPath, "ERROR:", e.message);
    }
}

checkFile("HTML/js/i18n.js");
checkFile("HTML/js/i18n-index.js");
