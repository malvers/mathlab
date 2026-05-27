// worldclock-moon.js — Moon rendering: pre-scaled NASA texture + phase drawing.
//   drawMoon      — the framed Moon box on the selection panel (orientation = bright-limb for the selected city)
//   drawMoonImg   — textured Moon disc at (x,y) with phase k + bright-limb angle (planetarium bodies)
//   drawMoonPhase — vector fallback until the texture loads
// Globals used at call time: ctx, getDisplayTime, targetCity (worldclock.js), moonBrightLimbRotation (worldclock-astro.js).
// Extracted from worldclock.js (Phase 2 refactor) — behaviour unchanged.

// Round Moon disc (pre-rendered, public-domain NASA texture) — shown in a box under the city list
const moonImg = new Image();
let moonReady = false, moonSmall = null;
moonImg.onload = () => {
    moonReady = true;
    moonSmall = document.createElement('canvas'); moonSmall.width = 96; moonSmall.height = 96;
    moonSmall.getContext('2d').drawImage(moonImg, 0, 0, 96, 96);   // pre-scaled once → cheap per-frame drawImage
};
moonImg.src = '../resources/moon.png';

function drawMoon(mmx, mmy, mW, mH) {
    ctx.fillStyle = "rgba(0, 10, 30, 0.98)";
    ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mmx, mmy, mW, mH, 5);
    ctx.fill();
    ctx.stroke();
    if (moonReady) {
        const moonSize = Math.min(mW, mH) - 30;
        const mcx = 0, mcy = mmy + mH / 2, mR = moonSize / 2;
        // Follow the displayed (scrubbable) time, not just real-time — so dragging the city ring
        // rocks the Moon smoothly through its daily parallactic swing; springs back to "now" on release.
        const t = getDisplayTime();
        // Bright-limb orientation for the selected city (continuous, lat/lon/time based).
        const mLat = (targetCity.globeLat ?? targetCity.lat) ?? 0;
        const mLon = (targetCity.globeLon ?? targetCity.lon) ?? 0;
        const rot = moonBrightLimbRotation(t, mLat, mLon);
        // Phase is global (same instant everywhere); only the orientation depends on location.
        const synodic = 29.530588853;
        const knownNew = Date.UTC(2000, 0, 6, 18, 14) / 86400000;  // reference new moon (days)
        const phase = (((t.getTime() / 86400000 - knownNew) / synodic) % 1 + 1) % 1;
        const a = Math.cos(phase * 2 * Math.PI) * mR;              // signed terminator x-extent
        ctx.save();
        // Draw everything in a canonical "bright limb on the right" frame, then rotate it into place.
        ctx.translate(mcx, mcy); ctx.rotate(rot); ctx.translate(-mcx, -mcy);
        // Soft warm glow behind the Moon (before the circle-clip, so the halo can reach past the disc).
        const _glow = ctx.createRadialGradient(mcx, mcy, mR * 0.85, mcx, mcy, mR * 1.25);
        _glow.addColorStop(0, 'rgba(255, 233, 170, 0.22)');
        _glow.addColorStop(1, 'rgba(255, 233, 170, 0)');
        ctx.fillStyle = _glow;
        ctx.fillRect(mcx - mR * 1.25, mcy - mR * 1.25, mR * 2.5, mR * 2.5);
        ctx.drawImage(moonImg, mcx - mR, mcy - mR, moonSize, moonSize);
        ctx.beginPath(); ctx.arc(mcx, mcy, mR, 0, Math.PI * 2); ctx.clip();
        // Warm the Moon a touch yellow (multiply keeps the shaded areas dark).
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = 'rgb(255, 236, 170)';
        ctx.fillRect(mcx - mR, mcy - mR, moonSize, moonSize);
        ctx.globalCompositeOperation = 'source-over';
        // Solid cover, soft terminator via blur. The outer boundary is pushed well past the clip (mR*1.6),
        // so the blurred limb edge gets clipped away → only the terminator (inner edge) is soft; limb stays crisp.
        ctx.fillStyle = "rgba(2, 4, 14, 0.92)";
        ctx.filter = 'blur(' + (mR * 0.16) + 'px)';
        ctx.beginPath();
        ctx.arc(mcx, mcy, mR * 1.6, -Math.PI / 2, Math.PI / 2, true);   // outer boundary beyond the clip circle
        ctx.ellipse(mcx, mcy, Math.abs(a), mR, 0, Math.PI / 2, -Math.PI / 2, a > 0); // terminator → blurs soft
        ctx.fill();
        ctx.filter = 'none';
        ctx.restore();
    }
}

// Real Moon texture (moon.png) with the phase: dim full disc (earthshine) + bright texture clipped to the lit lune.
function drawMoonImg(c, x, y, r, k, brightAngle, alpha) {
    if (!moonReady) { drawMoonPhase(c, x, y, r, k, brightAngle, alpha); return; }   // fallback until the image loads
    c.save();
    c.translate(x, y);
    c.rotate(brightAngle);                                   // lit limb → +x (toward the Sun)
    c.save();                                                // earthshine: dim full disc
    c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.clip();
    c.globalAlpha = alpha * 0.15;
    c.drawImage(moonSmall || moonImg, -r, -r, 2 * r, 2 * r);
    c.restore();
    c.save();                                                // lit lune: full-bright texture
    const b = r * (1 - 2 * k);
    c.beginPath();
    c.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
    c.ellipse(0, 0, Math.abs(b), r, 0, Math.PI / 2, -Math.PI / 2, b > 0);
    c.closePath(); c.clip();
    c.globalAlpha = alpha;
    c.drawImage(moonSmall || moonImg, -r, -r, 2 * r, 2 * r);
    c.restore();
    c.restore();
}

function drawMoonPhase(c, x, y, r, k, brightAngle, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.translate(x, y);
    c.rotate(brightAngle);                                   // after this the bright limb is on the +x side
    c.fillStyle = 'rgba(90, 100, 120, 0.55)';                // dark disc (earthshine)
    c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(238, 240, 248, 0.98)';               // lit lune
    const b = r * (1 - 2 * k);                               // terminator semi-minor (signed): k=0→r, 0.5→0, 1→−r
    c.beginPath();
    c.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);        // bright limb (right semicircle)
    c.ellipse(0, 0, Math.abs(b), r, 0, Math.PI / 2, -Math.PI / 2, b > 0);  // terminator
    c.closePath(); c.fill();
    c.restore();
}
