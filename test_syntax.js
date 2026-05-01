const fs = require('fs');
try {
  new Function(fs.readFileSync('HTML/js/i18n.js', 'utf8'));
  console.log("i18n.js is valid");
} catch (e) {
  console.log("i18n.js error:", e.message);
}
try {
  new Function(fs.readFileSync('HTML/js/i18n-index.js', 'utf8'));
  console.log("i18n-index.js is valid");
} catch (e) {
  console.log("i18n-index.js error:", e.message);
}
