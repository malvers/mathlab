// js/geometry.js

// Computes the triangle apex from base endpoints and two base angles
function getPoint(baseA, baseB, angleDegA, angleDegB) {
    const a = angleDegA * Math.PI / 180, b = angleDegB * Math.PI / 180;
    const h = (baseB.x - baseA.x) * (Math.tan(a) * Math.tan(b)) / (Math.tan(a) + Math.tan(b));
    return { x: baseA.x + h / Math.tan(a), y: baseA.y - h };
}

// Line intersection for segments p1–p2 and p3–p4
function getIntersection(p1, p2, p3, p4) {
    const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
}

// Draw an angle arc on the left base vertex (A)
function drawArcA(p, startDeg, endDeg, radius, label, color) {
    const startRad = -startDeg * Math.PI / 180, endRad = -endDeg * Math.PI / 180;
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.arc(p.x, p.y, radius, startRad, endRad, true); ctx.stroke();
    const midRad = (startRad + endRad) / 2;
    ctx.fillStyle = color; ctx.font = "bold 13px Orbitron"; ctx.textAlign = "center";
    ctx.fillText(label, p.x + Math.cos(midRad) * (radius + 12), p.y + Math.sin(midRad) * (radius + 12));
}

// Draw an angle arc on the right base vertex (B)
function drawArcB(p, startDeg, endDeg, radius, label, color) {
    const startRad = Math.PI + (startDeg * Math.PI / 180), endRad = Math.PI + (endDeg * Math.PI / 180);
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.arc(p.x, p.y, radius, startRad, endRad, false); ctx.stroke();
    const midRad = (startRad + endRad) / 2;
    ctx.fillStyle = color; ctx.font = "bold 13px Orbitron"; ctx.textAlign = "center";
    ctx.fillText(label, p.x + Math.cos(midRad) * (radius + 12), p.y + Math.sin(midRad) * (radius + 12));
}

function drawLine(ctx, p1, p2, width = 1.8, dash = []) {
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
}

function fillTriangle(ctx, p1, p2, p3, color) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}