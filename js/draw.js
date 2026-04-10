// js/draw.js

const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

function draw() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const v = variants[currentVariant];
    const colorWhite = "#ffffff";
    const cBAD = "#ff9800", cBAC = "#00f2ff", cACB = "#a855f7", cABD = "#22c55e";

    const angABC = 180 - v.BAC - v.ACB;

    // --- Dynamische Anpassung an die Bildschirmgröße ---
    const baseWidth = Math.min(280, w * 0.45);
    // Wenn das Fenster sehr breit ist, schieben wir die Figur weiter nach links (Platz für die Box)
    const shiftX = w > 600 ? 220 : 0;
    const centerX = w/2 - shiftX;

    const A = { x: centerX - baseWidth/2, y: h * 0.95 };
    const B = { x: centerX + baseWidth/2, y: h * 0.95 };
    const D = getPoint(A, B, v.BAD, v.ABD);
    const C = getPoint(A, B, v.BAC, angABC);
    const E = getPoint(A, B, 80, 80);
    const M = { x: (A.x + B.x) / 2, y: A.y };

    const P = getIntersection(E, M, B, D);
    const F = getIntersection(A, C, B, D);

    const showTriABD = document.getElementById('cb_tri_ABD') ? document.getElementById('cb_tri_ABD').checked : false;
    const showTriABC = document.getElementById('cb_tri_ABC') ? document.getElementById('cb_tri_ABC').checked : false;
    const showTriBCD = document.getElementById('cb_tri_BCD') ? document.getElementById('cb_tri_BCD').checked : false;

    if (showTriABD) {
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(D.x, D.y); ctx.closePath();
        ctx.fillStyle = "rgba(34, 197, 94, 0.2)"; ctx.fill();
    }
    if (showTriABC) {
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
        ctx.fillStyle = "rgba(0, 242, 255, 0.15)"; ctx.fill();
    }
    if (showTriBCD) {
        ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.lineTo(D.x, D.y); ctx.closePath();
        ctx.fillStyle = "rgba(168, 85, 247, 0.25)"; ctx.fill();
    }

    ctx.lineCap = "round"; ctx.lineJoin = "round";

    const showAB = document.getElementById('cb_AB').checked;
    const showAD = document.getElementById('cb_AD').checked;
    const showBC = document.getElementById('cb_BC') ? document.getElementById('cb_BC').checked : document.getElementById('cb_ABC').checked;
    const showAC = document.getElementById('cb_AC').checked;
    const showBD = document.getElementById('cb_BD').checked;
    const showCD = document.getElementById('cb_CD').checked;

    const showBAD = showAD;
    const showF = showBD;
    const showDAC = document.getElementById('cb_ADB') ? document.getElementById('cb_ADB').checked : false;

    const showDE = document.getElementById('cb_DE') ? document.getElementById('cb_DE').checked : false;
    const showEP = document.getElementById('cb_EP') ? document.getElementById('cb_EP').checked : false;

    ctx.lineWidth = 1.8; ctx.strokeStyle = colorWhite;
    if (showAB) { ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
    if (showAD) { ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(D.x, D.y); ctx.stroke(); }
    if (showBC) { ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.stroke(); }
    if (showAC) { ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(C.x, C.y); ctx.stroke(); }
    if (showBD) { ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(D.x, D.y); ctx.stroke(); }
    if (showDE) {
        ctx.beginPath(); ctx.moveTo(D.x, D.y); ctx.lineTo(E.x, E.y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(E.x, E.y); ctx.stroke();
    }
    if (showEP) {
        ctx.lineWidth = 1.0; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(E.x, E.y); ctx.lineTo(P.x, P.y); ctx.stroke();
        ctx.setLineDash([]); ctx.lineWidth = 1.8;
    }
    if (showCD) { ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(D.x, D.y); ctx.stroke(); }

    if (showBAD) drawArcA(A, 0, v.BAD, 45, v.BAD+"°", cBAD);
    if (document.getElementById('cb_BAC').checked) drawArcA(A, 0, v.BAC, 25, v.BAC+"°", cBAC);
    if (showDAC) drawArcA(A, v.BAC, v.BAD, 75, (v.BAD - v.BAC)+"°", colorWhite);

    if (document.getElementById('cb_ABD').checked) drawArcB(B, 0, v.ABD, 45, v.ABD+"°", cABD);
    if (document.getElementById('cb_ABC') && document.getElementById('cb_ABC').checked) drawArcB(B, 0, angABC, 25, angABC+"°", colorWhite);
    if (document.getElementById('cb_DBC') && document.getElementById('cb_DBC').checked) drawArcB(B, v.ABD, angABC, 75, (angABC - v.ABD)+"°", colorWhite);

    if (document.getElementById('cb_ADB') && document.getElementById('cb_ADB').checked) {
        let a1 = Math.atan2(A.y - D.y, A.x - D.x);
        let a2 = Math.atan2(B.y - D.y, B.x - D.x);
        let diff = a2 - a1;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        while (diff > Math.PI) diff -= 2 * Math.PI;

        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.5;
        ctx.arc(D.x, D.y, 40, a1, a1 + diff, diff < 0); ctx.stroke();
        let mid = a1 + diff / 2;
        ctx.fillStyle = colorWhite; ctx.font = "bold 12px Orbitron"; ctx.textAlign = "center";
        ctx.fillText((180 - v.BAD - v.ABD)+"°", D.x + Math.cos(mid) * 55, D.y + Math.sin(mid) * 55);
    }

    if (document.getElementById('cb_ACB') && document.getElementById('cb_ACB').checked) {
        const angCA = Math.atan2(A.y - C.y, A.x - C.x), angCB = Math.atan2(B.y - C.y, B.x - C.x);
        ctx.beginPath(); ctx.strokeStyle = cACB; ctx.lineWidth = 1.5;
        ctx.arc(C.x, C.y, 40, angCA, angCB, true); ctx.stroke();
        ctx.fillStyle = cACB; ctx.font = "bold 12px Orbitron"; ctx.textAlign = "center";
        ctx.fillText(v.ACB+"°", C.x + Math.cos((angCA + angCB) / 2) * 55, C.y + Math.sin((angCA + angCB) / 2) * 55);
    }

    if (document.getElementById('cb_DCA').checked) {
        let a1 = Math.atan2(A.y - C.y, A.x - C.x);
        let a2 = Math.atan2(D.y - C.y, D.x - C.x);
        let diff = a2 - a1;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        while (diff > Math.PI) diff -= 2 * Math.PI;

        ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.arc(C.x, C.y, 40, a1, a1 + diff, diff < 0); ctx.closePath();
        ctx.fillStyle = "#ff9800"; ctx.fill();
        ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 1.5; ctx.stroke();

        let mid = a1 + diff / 2;
        ctx.fillStyle = "#ef4444"; ctx.font = "bold 18px Orbitron"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("?", C.x + Math.cos(mid) * 55, C.y + Math.sin(mid) * 55); ctx.textBaseline = "alphabetic";
    }

    if (document.getElementById('cb_AEB') && document.getElementById('cb_AEB').checked) {
        const angEA = Math.atan2(A.y - E.y, A.x - E.x), angEB = Math.atan2(B.y - E.y, B.x - E.x);
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.5;
        ctx.arc(E.x, E.y, 50, angEB, angEA, false); ctx.stroke();
        ctx.fillStyle = colorWhite; ctx.font = "bold 12px Orbitron"; ctx.textAlign = "center";
        ctx.fillText("20°", E.x, E.y + 85);
    }

    if (document.getElementById('cb_AEP') && document.getElementById('cb_AEP').checked) {
        const angEA = Math.atan2(A.y - E.y, A.x - E.x), angEP = Math.atan2(P.y - E.y, P.x - E.x);
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.2;
        ctx.arc(E.x, E.y, 60, angEP, angEA, false); ctx.stroke();
        ctx.fillStyle = colorWhite; ctx.font = "bold 11px Orbitron"; ctx.textAlign = "right";
        ctx.fillText("10°", E.x - 25, E.y + 65);
    }

    if (document.getElementById('cb_BEP') && document.getElementById('cb_BEP').checked) {
        const angEB = Math.atan2(B.y - E.y, B.x - E.x), angEP = Math.atan2(P.y - E.y, P.x - E.x);
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.2;
        ctx.arc(E.x, E.y, 60, angEB, angEP, false); ctx.stroke();
        ctx.fillStyle = colorWhite; ctx.font = "bold 11px Orbitron"; ctx.textAlign = "left";
        ctx.fillText("10°", E.x + 25, E.y + 65);
    }

    ctx.fillStyle = "white"; ctx.font = "bold 18px Orbitron"; ctx.textAlign = "center";
    if (showAB || showAD || showAC || showBAD || document.getElementById('cb_BAC').checked || showDAC) ctx.fillText("A", A.x - 20, A.y + 10);
    if (showAB || showBC || showBD || (document.getElementById('cb_ABC') && document.getElementById('cb_ABC').checked) || document.getElementById('cb_ABD').checked || (document.getElementById('cb_DBC') && document.getElementById('cb_DBC').checked)) ctx.fillText("B", B.x + 20, B.y + 10);
    if (showAD || showCD || showBD || (document.getElementById('cb_ADB') && document.getElementById('cb_ADB').checked)) ctx.fillText("D", D.x - 15, D.y);
    if (showBC || showCD || showAC || (document.getElementById('cb_ACB') && document.getElementById('cb_ACB').checked) || document.getElementById('cb_DCA').checked) ctx.fillText("C", C.x + 15, C.y);
    if (showDE || showEP || (document.getElementById('cb_AEB') && document.getElementById('cb_AEB').checked)) ctx.fillText("E", E.x, E.y - 15);
    if (showEP || (document.getElementById('cb_P') && document.getElementById('cb_P').checked)) ctx.fillText("P", P.x + 15, P.y + 10);
    if (showF) ctx.fillText("F", F.x - 25, F.y - 5);
}