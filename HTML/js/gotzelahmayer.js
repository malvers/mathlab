/**
 * Berechnet die vertikale Schwerewirkung (gz) eines Dreiecks (Facet) nach Götze.
 * @param {Array} p1, p2, p3 - Die Eckpunkte [x, y, z] des Dreiecks
 * @param {Array} m - Der Messpunkt [x, y, z]
 * @param {number} rho - Dichte (Standard: 2670 kg/m^3)
 * @returns {number} gz in mGal
 */
function calculateTriangleGz(p1, p2, p3, m, rho = 2670) {
    const G = 6.67430e-11;
    const SI_TO_MGAL = 100000;

    const dot   = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    const cross  = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const sub    = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
    const mag    = a => Math.sqrt(dot(a, a));

    // Koordinaten relativ zu M
    const r1 = sub(p1, m);
    const r2 = sub(p2, m);
    const r3 = sub(p3, m);

    // 1. Vorzeichenbehafteter Raumwinkel nach Oosterom & Stracke (1983)
    const det  = dot(r1, cross(r2, r3));
    const mR1  = mag(r1), mR2 = mag(r2), mR3 = mag(r3);
    const div  = mR1*mR2*mR3 + dot(r1,r2)*mR3 + dot(r2,r3)*mR1 + dot(r3,r1)*mR2;
    const omega = 2 * Math.atan2(det, div);   // vorzeichenbehaftet — kein Math.abs

    // 2. Einheitsnormale und vorzeichenbehafteter Lotabstand zp
    const nRaw = cross(sub(r2, r1), sub(r3, r1));
    const nMag = mag(nRaw);
    if (nMag < 1e-14) return 0;               // entartetes Dreieck
    const n  = nRaw.map(v => v / nMag);
    const zp = dot(r1, n);                    // vorzeichenbehaftet

    // 3. Kantenbeiträge nach Götze & Lahmeyer (1988)
    // dj = vorzeichenbehafteter Abstand vom Fußpunkt P' zur Kante A→B
    //    = dot(cross(A, B), n̂) / s   (analytisch exakt, kein sqrt-Workaround)
    const verts = [r1, r2, r3];
    let sumLogTerms = 0;

    for (let i = 0; i < 3; i++) {
        const A  = verts[i];
        const B  = verts[(i + 1) % 3];
        const s  = mag(sub(B, A));
        if (s < 1e-14) continue;

        const rA = mag(A);
        const rB = mag(B);
        const denom = rA + rB - s;
        if (Math.abs(denom) < 1e-14) continue; // M liegt auf der Kante

        const L  = Math.log((rA + rB + s) / denom);
        const dj = dot(cross(A, B), n) / s;    // vorzeichenbehaftet

        sumLogTerms += dj * L;
    }

    // 4. gz nach Götze & Lahmeyer
    return G * rho * (zp * omega - sumLogTerms) * SI_TO_MGAL;
}

/**
 * Erzeugt n gleichverteilte Zufallspunkte auf der Einheitskugel.
 * Methode: Normalverteilte Koordinaten → Normierung (Marsaglia).
 * @param {number} n - Anzahl Punkte
 * @param {number} r - Radius (Standard: 1)
 * @returns {Array<[x, y, z]>}
 */
function randomPointsOnSphere(n = 1, r = 1) {
    const points = [];
    for (let i = 0; i < n; i++) {
        // Box-Muller für normalverteilte Werte
        const u1 = Math.random(), u2 = Math.random(), u3 = Math.random();
        const x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const y = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        const z = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * Math.random());
        const len = Math.sqrt(x * x + y * y + z * z);
        points.push([r * x / len, r * y / len, r * z / len]);
    }
    return points;
}

// Beispielaufruf:
const p1 = [0, 0, 100];
const p2 = [100, 0, 100];
const p3 = [0, 100, 100];
const M = [50, 50, 0];

console.log(`Schwerewirkung: ${calculateTriangleGz(p1, p2, p3, M).toFixed(6)} mGal`);