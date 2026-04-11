// js/draw.js

const canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

function draw() {
    const dpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth <= 1100;

    // 1. CANVAS SETUP & PLATZBERECHNUNG
    // Wir verstecken das Canvas komplett, um die ECHTE Größe des Containers zu messen
    canvas.style.display = 'none';

    const containerRect = canvas.parentElement.getBoundingClientRect();
    const expBox = document.getElementById('explanation-box');

    let canvasW = containerRect.width;
    let canvasH = containerRect.height;

    // Auf dem Tablet zieht die Erklärbox Platz vom Container ab
    if (isMobile && expBox) {
        canvasH = containerRect.height - expBox.offsetHeight;
    }

    canvasH = Math.max(canvasH, 150); // Notbremse

    // Canvas wieder einblenden und exakt auf die errechneten Pixel zwingen
    canvas.style.display = 'block';
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvasW, canvasH);

    // 2. VARIANTEN & FARBEN
    const v = variants[currentVariant];
    const colorWhite = "#ffffff";
    const cBAD = "#ff9800", cBAC = "#00f2ff", cACB = "#a855f7", cABD = "#22c55e";
    const angABC = 180 - v.BAC - v.ACB;

    // 3. RESPONSIVE SKALIERUNG
    const bottomPadding = isMobile ? 50 : 60;
    const availableHeight = canvasH - bottomPadding - 40;

    const heightRatio = (currentVariant === 0) ? 2.85 : 1.2;
    const maxSafeWidth = availableHeight / heightRatio;
    const baseWidth = Math.min(280, canvasW * 0.8, maxSafeWidth);

    const scale = baseWidth / 280;
    const fL = Math.max(12, Math.round(18 * scale));
    const fM = Math.max(9, Math.round(12 * scale));
    const fS = Math.max(8, Math.round(11 * scale));

    const r25 = 25 * scale, r40 = 40 * scale, r45 = 45 * scale, r50 = 50 * scale, r60 = 60 * scale, r75 = 75 * scale;
    const o25 = 25 * scale, o55 = 55 * scale, o65 = 65 * scale, o85 = 85 * scale;

    // 4. PUNKTE BERECHNEN
    let centerX = isMobile ? (canvasW / 2) : ((canvasW - 380) / 2);
    centerX = Math.max(centerX, baseWidth / 2 + 20);

    const A = { x: centerX - baseWidth/2, y: canvasH - bottomPadding };
    const B = { x: centerX + baseWidth/2, y: canvasH - bottomPadding };
    const D = getPoint(A, B, v.BAD, v.ABD);
    const C = getPoint(A, B, v.BAC, angABC);
    const E = getPoint(A, B, 80, 80);
    const M = { x: (A.x + B.x) / 2, y: A.y };
    const P = getIntersection(E, M, B, D);
    const F = getIntersection(A, C, B, D);

    // 5. FARBIGE DREIECKE
    if (isChecked('cb_tri_ABD')) fillTriangle(ctx, A, B, D, "rgba(34, 197, 94, 0.2)");
    if (isChecked('cb_tri_ABC')) fillTriangle(ctx, A, B, C, "rgba(0, 242, 255, 0.15)");
    if (isChecked('cb_tri_BCD')) fillTriangle(ctx, B, C, D, "rgba(168, 85, 247, 0.25)");

    // 6. LINIEN ZEICHNEN
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colorWhite;

    const showAB = isChecked('cb_AB');
    const showAD = isChecked('cb_AD');
    const showBC = isChecked('cb_BC') || isChecked('cb_ABC');
    const showAC = isChecked('cb_AC');
    const showBD = isChecked('cb_BD');
    const showCD = isChecked('cb_CD');
    const showBAD = showAD;
    const showF = showBD;
    const showDAC = isChecked('cb_ADB');
    const showDE = isChecked('cb_DE');
    const showEP = isChecked('cb_EP');

    if (showAB) drawLine(ctx, A, B);
    if (showAD) drawLine(ctx, A, D);
    if (showBC) drawLine(ctx, B, C);
    if (showAC) drawLine(ctx, A, C);
    if (showBD) drawLine(ctx, B, D);
    if (showCD) drawLine(ctx, C, D);

    if (showDE) { drawLine(ctx, D, E); drawLine(ctx, C, E); }
    if (showEP) { drawLine(ctx, E, P, 1.0, [5, 5]); }

    // 7. WINKEL & BÖGEN ZEICHNEN
    if (showBAD) drawArcA(A, 0, v.BAD, r45, v.BAD+"°", cBAD);
    if (isChecked('cb_BAC')) drawArcA(A, 0, v.BAC, r25, v.BAC+"°", cBAC);
    if (showDAC) drawArcA(A, v.BAC, v.BAD, r75, (v.BAD - v.BAC)+"°", colorWhite);
    if (isChecked('cb_ABD')) drawArcB(B, 0, v.ABD, r45, v.ABD+"°", cABD);
    if (isChecked('cb_ABC')) drawArcB(B, 0, angABC, r25, angABC+"°", colorWhite);
    if (isChecked('cb_DBC')) drawArcB(B, v.ABD, angABC, r75, (angABC - v.ABD)+"°", colorWhite);

    if (isChecked('cb_ADB')) {
        let a1 = Math.atan2(A.y - D.y, A.x - D.x), a2 = Math.atan2(B.y - D.y, B.x - D.x), diff = a2 - a1;
        while (diff < -Math.PI) diff += 2 * Math.PI; while (diff > Math.PI) diff -= 2 * Math.PI;
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.5; ctx.arc(D.x, D.y, r40, a1, a1 + diff, diff < 0); ctx.stroke();
        let mid = a1 + diff / 2; ctx.fillStyle = colorWhite; ctx.font = "bold " + fM + "px Orbitron"; ctx.textAlign = "center";
        ctx.fillText((180 - v.BAD - v.ABD)+"°", D.x + Math.cos(mid) * o55, D.y + Math.sin(mid) * o55);
    }
    if (isChecked('cb_ACB')) {
        const angCA = Math.atan2(A.y - C.y, A.x - C.x), angCB = Math.atan2(B.y - C.y, B.x - C.x);
        ctx.beginPath(); ctx.strokeStyle = cACB; ctx.lineWidth = 1.5; ctx.arc(C.x, C.y, r40, angCA, angCB, true); ctx.stroke();
        ctx.fillStyle = cACB; ctx.font = "bold " + fM + "px Orbitron"; ctx.textAlign = "center";
        ctx.fillText(v.ACB+"°", C.x + Math.cos((angCA + angCB) / 2) * o55, C.y + Math.sin((angCA + angCB) / 2) * o55);
    }
    if (isChecked('cb_DCA')) {
        let a1 = Math.atan2(A.y - C.y, A.x - C.x), a2 = Math.atan2(D.y - C.y, D.x - C.x), diff = a2 - a1;
        while (diff < -Math.PI) diff += 2 * Math.PI; while (diff > Math.PI) diff -= 2 * Math.PI;
        ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.arc(C.x, C.y, r40, a1, a1 + diff, diff < 0); ctx.closePath();
        ctx.fillStyle = "#ff9800"; ctx.fill(); ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 1.5; ctx.stroke();
        let mid = a1 + diff / 2; ctx.fillStyle = "#ef4444"; ctx.font = "bold " + fL + "px Orbitron"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("?", C.x + Math.cos(mid) * o55, C.y + Math.sin(mid) * o55); ctx.textBaseline = "alphabetic";
    }

    if (isChecked('cb_AEB')) {
        const angEA = Math.atan2(A.y - E.y, A.x - E.x), angEB = Math.atan2(B.y - E.y, B.x - E.x);
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.5; ctx.arc(E.x, E.y, r50, angEB, angEA, false); ctx.stroke();
        ctx.fillStyle = colorWhite; ctx.font = "bold " + fM + "px Orbitron"; ctx.textAlign = "center"; ctx.fillText("20°", E.x, E.y + o85);
    }
    if (isChecked('cb_AEP')) {
        const angEA = Math.atan2(A.y - E.y, A.x - E.x), angEP = Math.atan2(P.y - E.y, P.x - E.x);
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.2; ctx.arc(E.x, E.y, r60, angEP, angEA, false); ctx.stroke();
        ctx.fillStyle = colorWhite; ctx.font = "bold " + fS + "px Orbitron"; ctx.textAlign = "right"; ctx.fillText("10°", E.x - o25, E.y + o65);
    }
    if (isChecked('cb_BEP')) {
        const angEB = Math.atan2(B.y - E.y, B.x - E.x), angEP = Math.atan2(P.y - E.y, P.x - E.x);
        ctx.beginPath(); ctx.strokeStyle = colorWhite; ctx.lineWidth = 1.2; ctx.arc(E.x, E.y, r60, angEB, angEP, false); ctx.stroke();
        ctx.fillStyle = colorWhite; ctx.font = "bold " + fS + "px Orbitron"; ctx.textAlign = "left"; ctx.fillText("10°", E.x + o25, E.y + o65);
    }

    // 8. BESCHRIFTUNGEN (A, B, C...)
    ctx.fillStyle = "white"; ctx.font = "bold " + fL + "px Orbitron"; ctx.textAlign = "center";
    if (showAB || showAD || showAC || showBAD || isChecked('cb_BAC') || showDAC) ctx.fillText("A", A.x - 20, A.y + 10);
    if (showAB || showBC || showBD || isChecked('cb_ABC') || isChecked('cb_ABD') || isChecked('cb_DBC')) ctx.fillText("B", B.x + 20, B.y + 10);
    if (showAD || showCD || showBD || isChecked('cb_ADB')) ctx.fillText("D", D.x - 15, D.y);
    if (showBC || showCD || showAC || isChecked('cb_ACB') || isChecked('cb_DCA')) ctx.fillText("C", C.x + 15, C.y);
    if (showDE || showEP || isChecked('cb_AEB')) ctx.fillText("E", E.x, E.y - 15);
    if (showEP || isChecked('cb_P')) ctx.fillText("P", P.x + 15, P.y + 10);
    if (showF) ctx.fillText("F", F.x - 25, F.y - 5);
}