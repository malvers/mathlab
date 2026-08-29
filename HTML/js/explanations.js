function updateExplanation() {
    const box = document.getElementById('explanation-box');
    const splitHost = document.getElementById('canvas-container');
    const title = document.getElementById('exp-title');
    const text = document.getElementById('exp-text');
    const v = variants[currentVariant];

    if (currentStep === 0) {
        if (box) box.style.display = 'none';
        if (splitHost) splitHost.classList.remove('lenglay-split-explanation');
        return;
    }
    if (box) box.style.display = 'flex';
    if (splitHost) splitHost.classList.add('lenglay-split-explanation');

    if (!box || !title || !text) return;

    // Step texts live in the i18n dictionaries (langley.s1..s12, g13..g17 geometric, t13..t15 trigonometric);
    // angles are filled in via placeholders so every language shares one code path.
    const angABC = 180 - v.BAC - v.ACB;
    const angADB = 180 - v.BAD - v.ABD;
    const vals = { BAC: v.BAC, ACB: v.ACB, ABC: angABC, BAD: v.BAD, ABD: v.ABD, DBC: angABC - v.ABD, ADB: angADB, target: v.target };
    let key = null;
    if (currentStep <= 12) {
        key = 's' + currentStep;
    } else if (currentVariant === 0) {
        key = currentStep >= 17 ? 'g17' : 'g' + currentStep;      // g17 covers steps 17 & 18
    } else {
        key = currentStep >= 15 ? 't15' : 't' + currentStep;
    }
    title.innerText = CyberI18n.get('langley.' + key + '_t', vals);
    text.innerHTML = CyberI18n.get('langley.' + key, vals);

    if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById('explanation-box')]).catch((err) => console.log(err));
    }
}