/**
 * Kugelflächenfunktionen — Logik aus orbits/Orbital.java (getValueAtPhiAndTheta).
 * Konvention: phi ∈ [0, π], theta ∈ [0, 2π]; x = sin(theta)cos(phi), y = sin(theta)sin(phi), z = cos(theta).
 */

export const ORBITAL_TYPES = [
  { id: "L0M0", label: "Y₀₀ (s)" },
  { id: "L1M_MINUS1", label: "Y₁,₋₁" },
  { id: "L1M_0", label: "Y₁,₀" },
  { id: "L1M_PLUS1", label: "Y₁,₁" },
  { id: "L2M_MINUS2", label: "Y₂,₋₂" },
  { id: "L2M_MINUS1", label: "Y₂,₋₁" },
  { id: "L2M_0", label: "Y₂,₀" },
  { id: "L2M_PLUS1", label: "Y₂,₁" },
  { id: "L2M_PLUS2", label: "Y₂,₂" },
  { id: "L3M_MINUS3", label: "Y₃,₋₃" },
  { id: "L3M_MINUS2", label: "Y₃,₋₂" },
  { id: "L3M_MINUS1", label: "Y₃,₋₁" },
  { id: "L3M_0", label: "Y₃,₀" },
  { id: "L3M_PLUS1", label: "Y₃,₁" },
  { id: "L3M_PLUS2", label: "Y₃,₂" },
  { id: "L3M_PLUS3", label: "Y₃,₃" },
  { id: "L4M_MINUS4", label: "Y₄,₋₄" },
  { id: "L4M_MINUS3", label: "Y₄,₋₃" },
  { id: "L4M_MINUS2", label: "Y₄,₋₂" },
  { id: "L4M_MINUS1", label: "Y₄,₋₁" },
  { id: "L4M_0", label: "Y₄,₀" },
  { id: "L4M_PLUS1", label: "Y₄,₁" },
  { id: "L4M_PLUS2", label: "Y₄,₂" },
  { id: "L4M_PLUS3", label: "Y₄,₃" },
  { id: "L4M_PLUS4", label: "Y₄,₄" },
  { id: "L5M_MINUS5", label: "Y₅,₋₅" },
  { id: "L5M_MINUS4", label: "Y₅,₋₄" },
  { id: "L5M_MINUS3", label: "Y₅,₋₃" },
  { id: "L5M_MINUS2", label: "Y₅,₋₂" },
  { id: "L5M_MINUS1", label: "Y₅,₋₁" },
  { id: "L5M_0", label: "Y₅,₀" },
  { id: "L5M_PLUS1", label: "Y₅,₁" },
  { id: "L5M_PLUS2", label: "Y₅,₂" },
  { id: "L5M_PLUS3", label: "Y₅,₃" },
  { id: "L5M_PLUS4", label: "Y₅,₄" },
  { id: "L5M_PLUS5", label: "Y₅,₅" },
];

const LATEX_BY_ID = {
  L0M0: String.raw`Y_{0,0} = \sqrt{\frac{1}{4\pi}}`,
  L1M_MINUS1: String.raw`Y_{1,-1} = \sqrt{\frac{3}{4\pi}} \cos\vartheta`,
  L1M_0: String.raw`Y_{1,0} = \sqrt{\frac{3}{4\pi}} \sin\vartheta \cos\varphi`,
  L1M_PLUS1: String.raw`Y_{1,1} =\sqrt{\frac{3}{4\pi}} \sin\vartheta \sin\varphi`,
  L2M_MINUS2: String.raw`Y_{2,-2} = \sqrt{\frac{5}{16\pi}} \left( 3\cos^2\vartheta - 1 \right)`,
  L2M_MINUS1: String.raw`Y_{2,-1} = \sqrt{\frac{15}{4\pi}} \sin\vartheta \cos\vartheta \cos\varphi`,
  L2M_0: String.raw`Y_{2,0} = \sqrt{\frac{15}{4\pi}} \sin\vartheta \cos\vartheta \sin\varphi`,
  L2M_PLUS1: String.raw`Y_{2,1} = \sqrt{\frac{15}{16\pi}} \sin^2\vartheta \cos(2\varphi)`,
  L2M_PLUS2: String.raw`Y_{2,2} = \sqrt{\frac{15}{16\pi}} \sin^2\vartheta \sin(2\varphi)`,
  L3M_MINUS3: String.raw`Y_{3,-3} = \frac{1}{4} \sqrt{\frac{35}{2\pi}} \cdot \frac{y \, (3x^2 - y^2)}{r^3}`,
  L3M_MINUS2: String.raw`Y_{3,-2} = \frac{1}{2} \sqrt{\frac{105}{\pi}} \cdot \frac{xy \cdot z}{r^3}`,
  L3M_MINUS1: String.raw`Y_{3,-1} = -\frac{1}{4} \sqrt{\frac{21}{2\pi}} \cdot \frac{y \cdot (5z^2 - r^2)}{r^3}`,
  L3M_0: String.raw`Y_{3,0} = \frac{1}{4} \sqrt{\frac{7}{\pi}} \cdot \frac{5z^3 - 3zr^2}{r^3}`,
  L3M_PLUS1: String.raw`Y_{3,1} = \frac{1}{4} \sqrt{\frac{21}{2\pi}} \cdot \frac{x \cdot (5z^2 - r^2)}{r^3}`,
  L3M_PLUS2: String.raw`Y_{3,2} = \frac{1}{4} \sqrt{\frac{105}{\pi}} \cdot \frac{(x^2 - y^2) \cdot z}{r^3}`,
  L3M_PLUS3: String.raw`Y_{3,3} = \frac{1}{4} \sqrt{\frac{35}{2\pi}} \cdot \frac{x \cdot (x^2 - 3y^2)}{r^3}`,
  L4M_MINUS4: String.raw`Y_{4,-4} = \frac{3}{4} \sqrt{\frac{35}{\pi}} \cdot \frac{xy \cdot (x^2 - y^2)}{r^4}`,
  L4M_MINUS3: String.raw`Y_{4,-3} = \frac{3}{4} \sqrt{\frac{35}{2\pi}} \cdot \frac{y \cdot (3x^2 - y^2) \cdot z}{r^4}`,
  L4M_MINUS2: String.raw`Y_{4,-2} = \frac{3}{4} \sqrt{\frac{5}{\pi}} \cdot \frac{xy \cdot (7z^2 - r^2)}{r^4}`,
  L4M_MINUS1: String.raw`Y_{4,-1} = \frac{3}{4} \sqrt{\frac{5}{2\pi}} \cdot \frac{y \cdot (7z^2 - 3r^2)}{r^4}`,
  L4M_0: String.raw`Y_{4,0} = \frac{3}{16} \sqrt{\frac{1}{\pi}} \cdot \frac{35z^4 - 30z^2r^2 + 3r^4}{r^4}`,
  L4M_PLUS1: String.raw`Y_{4,1} = \frac{3}{4} \sqrt{\frac{5}{2\pi}} \cdot \frac{x \cdot (7z^2 - 3r^2)}{r^4}`,
  L4M_PLUS2: String.raw`Y_{4,2} = \frac{3}{8} \sqrt{\frac{5}{\pi}} \cdot \frac{(x^2 - y^2) \cdot (7z^2 - r^2)}{r^4}`,
  L4M_PLUS3: String.raw`Y_{4,3} = \frac{3}{4} \sqrt{\frac{35}{2\pi}} \cdot \frac{x \cdot (x^2 - 3y^2) \cdot z}{r^4}`,
  L4M_PLUS4: String.raw`Y_{4,4} = \frac{3}{16} \sqrt{\frac{35}{\pi}} \cdot \frac{x^2 \cdot (x^2 - 3y^2) - y^2 \cdot (3x^2 - y^2)}{r^4}`,
  L5M_MINUS5: String.raw`Y_{5,-5} = \frac{3}{16} \sqrt{\frac{77}{\pi}} \cdot \frac{xy \cdot (x^2 - y^2)}{r^5}`,
  L5M_MINUS4: String.raw`Y_{5,-4} = \frac{3}{4} \sqrt{\frac{385}{2\pi}} \cdot \frac{xy \cdot z \cdot (3x^2 - y^2)}{r^5}`,
  L5M_MINUS3: String.raw`Y_{5,-3} = \frac{1}{16} \sqrt{\frac{385}{\pi}} \cdot \frac{y \cdot (5z^2 - r^2) \cdot (3x^2 - y^2)}{r^5}`,
  L5M_MINUS2: String.raw`Y_{5,-2} = \frac{3}{8} \sqrt{\frac{1155}{\pi}} \cdot \frac{xy \cdot (7z^2 - 3r^2)}{r^5}`,
  L5M_MINUS1: String.raw`Y_{5,-1} = \frac{3}{8} \sqrt{\frac{165}{\pi}} \cdot \frac{y \cdot (35z^3 - 30zr^2 + 3r^4)}{r^5}`,
  L5M_0: String.raw`Y_{5,0} = \frac{3}{16} \sqrt{\frac{11}{\pi}} \cdot \frac{63z^5 - 70z^3r^2 + 15zr^4}{r^5}`,
  L5M_PLUS1: String.raw`Y_{5,1} = \frac{3}{8} \sqrt{\frac{165}{\pi}} \cdot \frac{x \cdot (35z^3 - 30zr^2 + 3r^4)}{r^5}`,
  L5M_PLUS2: String.raw`Y_{5,2} = \frac{3}{8} \sqrt{\frac{1155}{\pi}} \cdot \frac{(x^2 - y^2) \cdot (7z^2 - 3r^2)}{r^5}`,
  L5M_PLUS3: String.raw`Y_{5,3} = \frac{1}{16} \sqrt{\frac{385}{\pi}} \cdot \frac{x \cdot (5z^2 - r^2) \cdot (3x^2 - y^2)}{r^5}`,
  L5M_PLUS4: String.raw`Y_{5,4} = \frac{3}{4} \sqrt{\frac{385}{2\pi}} \cdot \frac{xy \cdot z \cdot (3x^2 - y^2)}{r^5}`,
  L5M_PLUS5: String.raw`Y_{5,5} = \frac{3}{16} \sqrt{\frac{77}{\pi}} \cdot \frac{xy \cdot (x^2 - y^2)}{r^5}`,
};

export function getLatexForOrbital(orbitalId) {
  return LATEX_BY_ID[orbitalId] ?? "";
}

function polarToCartesian(r, phi, theta) {
  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);
  return [x, y, z];
}

/**
 * @param {string} orbitType - ORBITAL_TYPES[].id
 * @param {number} phi
 * @param {number} theta
 */
export function getValueAtPhiAndTheta(orbitType, phi, theta) {
  const PI = Math.PI;
  let r = 1.0;
  const xyz = polarToCartesian(r, phi, theta);
  const x = xyz[0];
  const y = xyz[1];
  const z = xyz[2];

  switch (orbitType) {
    case "L0M0":
      return Math.sqrt(1.0 / (4.0 * PI));
    case "L1M_MINUS1":
      return Math.sqrt(3.0 / (4.0 * PI)) * Math.cos(theta);
    case "L1M_0":
      return Math.sqrt(3.0 / (4.0 * PI)) * Math.sin(theta) * Math.cos(phi);
    case "L1M_PLUS1":
      return Math.sqrt(3.0 / (4.0 * PI)) * Math.sin(theta) * Math.sin(phi);
    case "L2M_MINUS2":
      return Math.sqrt(5.0 / (16.0 * PI)) * (3.0 * Math.pow(Math.cos(theta), 2.0) - 1.0);
    case "L2M_MINUS1":
      return Math.sqrt(15 / (4 * PI)) * (Math.sin(theta) * Math.cos(theta) * Math.cos(phi));
    case "L2M_0":
      return Math.sqrt(15 / (4 * PI)) * (Math.sin(theta) * Math.cos(theta) * Math.sin(phi));
    case "L2M_PLUS1":
      return Math.sqrt(15 / (16 * PI)) * (Math.pow(Math.sin(theta), 2) * Math.cos(2 * phi));
    case "L2M_PLUS2":
      return Math.sqrt(15 / (16 * PI)) * (Math.pow(Math.sin(theta), 2) * Math.sin(2 * phi));
    case "L3M_MINUS3":
      return 0.25 * Math.sqrt(35.0 / (2 * PI)) * (y * (3.0 * Math.pow(x, 2.0) - Math.pow(y, 2.0)) / Math.pow(r, 3.0));
    case "L3M_MINUS2":
      return 0.5 * Math.sqrt(105.0 / PI) * (x * y * z) / Math.pow(r, 3.0);
    case "L3M_MINUS1":
      return 0.25 * Math.sqrt(21.0 / (2 * PI)) * (y * (5 * Math.pow(y, 2) - Math.pow(r, 2)) / Math.pow(r, 3));
    case "L3M_0":
      return 0.25 * Math.sqrt(7.0 / PI) * (5.0 * Math.pow(y, 3.0) - 3.0 * y * Math.pow(r, 2.0)) / Math.pow(r, 3.0);
    case "L3M_PLUS1":
      return (1.0 / 4) * Math.sqrt(21.0 / (2 * Math.PI)) * (x * (5 * Math.pow(z, 2) - Math.pow(r, 2))) / Math.pow(r, 3);
    case "L3M_PLUS2":
      return (1.0 / 4) * Math.sqrt(105.0 / Math.PI) * ((Math.pow(x, 2) - Math.pow(y, 2)) * xyz[0]) / Math.pow(r, 3);
    case "L3M_PLUS3":
      return (1.0 / 4) * Math.sqrt(35.0 / (2 * Math.PI)) * (x * (Math.pow(x, 2) - 3 * Math.pow(y, 2))) / Math.pow(r, 3);
    case "L4M_MINUS4":
      return (3.0 / 4) * Math.sqrt(35.0 / Math.PI) * (x * y * (Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 4);
    case "L4M_MINUS3":
      return (3.0 / 4) * Math.sqrt(35.0 / (2 * Math.PI)) * (y * (3 * Math.pow(x, 2) - Math.pow(y, 2)) * z) / Math.pow(r, 4);
    case "L4M_MINUS2":
      return (3.0 / 4) * Math.sqrt(5.0 / Math.PI) * (x * y * (7 * Math.pow(z, 2) - Math.pow(r, 2))) / Math.pow(r, 4);
    case "L4M_MINUS1":
      return (3.0 / 4) * Math.sqrt(5.0 / (2 * Math.PI)) * (y * (7 * Math.pow(z, 2) - 3 * Math.pow(r, 2))) / Math.pow(r, 4);
    case "L4M_0":
      return (3.0 / 16) * Math.sqrt(1.0 / Math.PI) * (35 * Math.pow(z, 4) - 30 * Math.pow(z, 2) * Math.pow(r, 2) + 3 * Math.pow(r, 4)) / Math.pow(r, 4);
    case "L4M_PLUS1":
      return (3.0 / 4) * Math.sqrt(5.0 / (2 * Math.PI)) * (x * (7 * Math.pow(z, 2) - 3 * Math.pow(r, 2))) / Math.pow(r, 4);
    case "L4M_PLUS2":
      return (3.0 / 8) * Math.sqrt(5.0 / Math.PI) * ((Math.pow(x, 2) - Math.pow(y, 2)) * (7 * Math.pow(z, 2) - Math.pow(r, 2))) / Math.pow(r, 4);
    case "L4M_PLUS3":
      return (3.0 / 4) * Math.sqrt(35.0 / (2 * Math.PI)) * (x * (Math.pow(x, 2) - 3 * Math.pow(y, 2)) * z) / Math.pow(r, 4);
    case "L4M_PLUS4":
      return (3.0 / 16) * Math.sqrt(35.0 / Math.PI) * ((Math.pow(x, 2) * (Math.pow(x, 2) - 3 * Math.pow(y, 2))) - (Math.pow(y, 2) * (3 * Math.pow(x, 2) - Math.pow(y, 2)))) / Math.pow(r, 4);
    case "L5M_MINUS5":
      return (3.0 / 16) * Math.sqrt(77.0 / Math.PI) * (x * y * (Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 5);
    case "L5M_MINUS4":
      return (3.0 / 4) * Math.sqrt(385.0 / (2 * Math.PI)) * (x * y * z * (3 * Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 5);
    case "L5M_MINUS3":
      return (1.0 / 16) * Math.sqrt(385.0 / Math.PI) * (y * (5 * Math.pow(z, 2) - Math.pow(r, 2)) * (3 * Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 5);
    case "L5M_MINUS2":
      return (3.0 / 8) * Math.sqrt(1155.0 / Math.PI) * (x * y * (7 * Math.pow(z, 2) - 3 * Math.pow(r, 2))) / Math.pow(r, 5);
    case "L5M_MINUS1":
      return (3.0 / 8) * Math.sqrt(165.0 / Math.PI) * (y * (35 * Math.pow(z, 3) - 30 * z * Math.pow(r, 2) + 3 * Math.pow(r, 4))) / Math.pow(r, 5);
    case "L5M_0":
      return (3.0 / 16) * Math.sqrt(11.0 / Math.PI) * (63 * Math.pow(z, 5) - 70 * Math.pow(z, 3) * Math.pow(r, 2) + 15 * z * Math.pow(r, 4)) / Math.pow(r, 5);
    case "L5M_PLUS1":
      return (3.0 / 8) * Math.sqrt(165.0 / Math.PI) * (x * (35 * Math.pow(z, 3) - 30 * z * Math.pow(r, 2) + 3 * Math.pow(r, 4))) / Math.pow(r, 5);
    case "L5M_PLUS2":
      return (3.0 / 8) * Math.sqrt(1155.0 / Math.PI) * ((Math.pow(x, 2) - Math.pow(y, 2)) * (7 * Math.pow(z, 2) - 3 * Math.pow(r, 2))) / Math.pow(r, 5);
    case "L5M_PLUS3":
      return (1.0 / 16) * Math.sqrt(385.0 / Math.PI) * (x * (5 * Math.pow(z, 2) - Math.pow(r, 2)) * (3 * Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 5);
    case "L5M_PLUS4":
      return (3.0 / 4) * Math.sqrt(385.0 / (2 * Math.PI)) * (x * y * z * (3 * Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 5);
    case "L5M_PLUS5":
      return (3.0 / 16) * Math.sqrt(77.0 / Math.PI) * (x * y * (Math.pow(x, 2) - Math.pow(y, 2))) / Math.pow(r, 5);
    default:
      throw new Error("Unknown orbital: " + orbitType);
  }
}
