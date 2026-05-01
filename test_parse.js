const fs = require('fs');

function checkFile(filename) {
    try {
        const code = fs.readFileSync(filename, 'utf8');
        new Function(code);
        console.log(filename, "is OK");
    } catch (e) {
        console.log(filename, "ERROR:", e.message);
    }
}

checkFile('HTML/js/i18n.js');
checkFile('HTML/js/i18n-index.js');
