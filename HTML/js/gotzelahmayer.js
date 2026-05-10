/**
 * Berechnet die vertikale Schwerewirkung (gz) eines Dreiecks (Facet) nach Götze.
 * @param {Array} p1, p2, p3 - Die Eckpunkte [x, y, z] des Dreiecks
 * @param {Array} m - Der Messpunkt [x, y, z]
 * @param {number} rho - Dichte (Standard: 2670 kg/m^3)
 * @returns {number} gz in mGal
 */
function calculateTriangleGz(p1, p2, p3, m, rho = 2670) {
    const G = 6.67430e-11; // Gravitationskonstante
    const SI_TO_MGAL = 100000;

    // Koordinaten relativ zum Messpunkt M verschieben
    const r1 = p1.map((v, i) => v - m[i]);
    const r2 = p2.map((v, i) => v - m[i]);
    const r3 = p3.map((v, i) => v - m[i]);

    // Hilfsfunktion: Vektor-Operationen
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
    const mag = (a) => Math.sqrt(dot(a, a));

    // 1. Raumwinkel (Solid Angle Omega) nach Oosterom & Stracke
    const det = dot(r1, cross(r2, r3));
    const modR1 = mag(r1);
    const modR2 = mag(r2);
    const modR3 = mag(r3);
    
    const div = (modR1 * modR2 * modR3) + 
                dot(r1, r2) * modR3 + 
                dot(r2, r3) * modR1 + 
                dot(r3, r1) * modR2;
    
    const omega = 2 * Math.abs(Math.atan2(det, div));

    // 2. Flächenparameter
    // Normale der Fläche berechnen
    const normal = cross(r1.map((v, i) => r2[i] - v), r1.map((v, i) => r3[i] - v));
    const nMag = mag(normal);
    const unitNormal = normal.map(v => v / nMag);
    
    // Senkrechter Abstand zp (Projektion von M auf die Fläche)
    const zp = Math.abs(dot(r1, unitNormal));

    // 3. Kantenbeiträge (Linienintegrale)
    const corners = [r1, r2, r3, r1];
    let sumLogTerms = 0;

    for (let i = 0; i < 3; i++) {
        const A = corners[i];
        const B = corners[i+1];
        const s = mag(A.map((v, j) => B[j] - v)); // Kantenlänge
        const distA = mag(A);
        const distB = mag(B);

        // Kanten-Logarithmus Term
        const L = Math.log((distA + distB + s) / (distA + distB - s));
        
        // dj (Abstand vom Lotpunkt in der Ebene zur Kante)
        // Vereinfachte Projektionslogik für dj:
        const edgeVec = A.map((v, j) => (B[j] - v) / s);
        const aToM_inPlane = A.map((v, j) => -v); // Da M im Ursprung
        const proj = dot(aToM_inPlane, edgeVec);
        const dj = Math.sqrt(Math.abs(distA**2 - zp**2 - proj**2));

        sumLogTerms += dj * L;
    }

    // 4. Endergebnis nach Götze & Lahmeyer
    const factor = G * rho;
    const gz = factor * (zp * omega - sumLogTerms);

    return gz * SI_TO_MGAL;
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