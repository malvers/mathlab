const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");

function check(relPath) {
    const filename = path.join(repoRoot, relPath);
    try {
        new Function(fs.readFileSync(filename, "utf8"));
        console.log(relPath + " is valid");
    } catch (e) {
        console.log(relPath + " error:", e.message);
    }
}

check("HTML/js/i18n.js");
check("HTML/js/i18n-index.js");
