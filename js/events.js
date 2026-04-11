// js/events.js

document.getElementById('variant-select').addEventListener('change', function(e) {
    currentVariant = parseInt(e.target.value);
    const v = variants[currentVariant];

    document.getElementById('txt_BAC').innerText = v.BAC + "°";
    document.getElementById('txt_ACB').innerText = v.ACB + "°";
    document.getElementById('txt_ABD').innerText = v.ABD + "°";
    document.getElementById('txt_ABC').innerText = (180 - v.BAC - v.ACB) + "°";
    document.getElementById('txt_DBC').innerText = ((180 - v.BAC - v.ACB) - v.ABD) + "°";
    document.getElementById('txt_ADB').innerText = (180 - v.BAD - v.ABD) + "°";

    if (currentVariant === 0) {
        document.getElementById('phase5-geo').style.display = 'block';
        document.getElementById('phase5-tri').style.display = 'none';
        storyline = storylineGeo;
    } else {
        document.getElementById('phase5-geo').style.display = 'none';
        document.getElementById('phase5-tri').style.display = 'block';
        storyline = storylineTri;
    }

    currentStep = storyline.length;
    applyStep();
});

document.getElementById('btn_next').addEventListener('click', () => { if (currentStep < storyline.length) { currentStep++; applyStep(); } });
document.getElementById('btn_prev').addEventListener('click', () => { if (currentStep > 0) { currentStep--; applyStep(); } });
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') document.getElementById('btn_next').click();
    else if (event.key === 'ArrowLeft') document.getElementById('btn_prev').click();
});

document.getElementById('cb_all').addEventListener('change', function(e) {
    currentStep = e.target.checked ? storyline.length : 0;
    applyStep();
});

document.getElementById('cb_calc_all').addEventListener('change', function(e) {
    const isChecked = e.target.checked;
    ['cb_DAC', 'cb_ABC', 'cb_DBC', 'cb_ADB', 'cb_AEB', 'cb_AEP', 'cb_BEP'].forEach(id => {
        if(document.getElementById(id)) document.getElementById(id).checked = isChecked;
    });
    draw();
});

document.querySelectorAll('.calc-box input[type="checkbox"]').forEach(cb => { cb.addEventListener('change', draw); });

window.addEventListener('resize', draw);

// --- SPLITTER LOGIK ---
const splitter = document.getElementById('main-splitter');
const infoPanel = document.getElementById('info-panel');
let isSplitting = false;

if (splitter) {
    splitter.addEventListener('pointerdown', (e) => {
        isSplitting = true;
        splitter.classList.add('active');
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('pointermove', (e) => {
        if (!isSplitting) return;

        const isMobile = window.innerWidth <= 1100;

        if (isMobile) {
            const newHeight = window.innerHeight - e.clientY;
            const clampedHeight = Math.max(150, Math.min(newHeight, window.innerHeight * 0.4));
            infoPanel.style.height = `${clampedHeight}px`;
        } else {
            const newWidth = e.clientX;
            const clampedWidth = Math.max(250, Math.min(newWidth, window.innerWidth * 0.5));
            infoPanel.style.width = `${clampedWidth}px`;
            infoPanel.style.minWidth = `${clampedWidth}px`;
        }
        draw();
    });

    document.addEventListener('pointerup', () => {
        if (isSplitting) {
            isSplitting = false;
            splitter.classList.remove('active');
            document.body.style.userSelect = '';
            draw();
        }
    });
}