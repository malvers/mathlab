/* @AI-READONLY: LAB TILE ICONS — loaded before labs-config.js */
/**
 * SVG template literals and emoji strings for LABS_DATA tiles.
 */

const LAB_ICONS = {
    // books show their real cover, a photo among the drawn icons (Doc, 09.10.2026: "Nimm als Logo tatsächlich
    // das Cover ... bei Büchern gut"); the picture is made by tools/og-preview/make-og.mjs from the book's cover page
    "lehrbuch-mathe11": `<img src="resources/og/buch-mathe11-cover.jpg" alt="" loading="lazy" decoding="async"
            style="height: 96px; width: auto; display: block; border-radius: 2px 6px 6px 2px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);">`,
    "lehrbuch-mathe12": `<img src="resources/og/buch-mathe12-cover.jpg" alt="" loading="lazy" decoding="async"
            style="height: 96px; width: auto; display: block; border-radius: 2px 6px 6px 2px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);">`,
    "lehrbuch-mathe13": `<img src="resources/og/buch-mathe13-cover.jpg" alt="" loading="lazy" decoding="async"
            style="height: 96px; width: auto; display: block; border-radius: 2px 6px 6px 2px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);">`,
    "lehrbuch-mathefos11": `<img src="resources/og/buch-mathefos11-cover.jpg" alt="" loading="lazy" decoding="async"
            style="height: 96px; width: auto; display: block; border-radius: 2px 6px 6px 2px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);">`,
    "lehrbuch-mathefos12": `<img src="resources/og/buch-mathefos12-cover.jpg" alt="" loading="lazy" decoding="async"
            style="height: 96px; width: auto; display: block; border-radius: 2px 6px 6px 2px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);">`,
    "lehrbuch-mathegy9": `<img src="resources/og/buch-mathegy9-cover.jpg" alt="" loading="lazy" decoding="async"
            style="height: 96px; width: auto; display: block; border-radius: 2px 6px 6px 2px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);">`,
    "ziffernraetsel": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the MONEY stack itself (Doc, 29.09.2026: "icon -> MONEY stack"): SEND over MORE, a rule, MONEY in gold -
                 one letter per column, so the columns stand as on paper -->
            <g font-family="CMU Serif, Georgia, Times New Roman, serif" font-size="19" font-weight="bold" text-anchor="middle">
                <g fill="rgba(255, 255, 255, 0.85)">
                    <text x="43.5" y="27">S</text><text x="60" y="27">E</text><text x="76.5" y="27">N</text><text x="93" y="27">D</text>
                    <text x="43.5" y="51">M</text><text x="60" y="51">O</text><text x="76.5" y="51">R</text><text x="93" y="51">E</text>
                </g>
                <g fill="#F5C242">
                    <text x="27" y="85">M</text><text x="43.5" y="85">O</text><text x="60" y="85">N</text><text x="76.5" y="85">E</text><text x="93" y="85">Y</text>
                </g>
            </g>
            <path d="M12 44.5 H24 M18 38.5 V50.5" stroke="#F5C242" stroke-width="2.6" stroke-linecap="round" />
            <line x1="10" y1="62" x2="99" y2="62" stroke="rgba(255, 255, 255, 0.75)" stroke-width="2.2" stroke-linecap="round" />
        </svg>`,
    "trigonometrie": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- axes: the circle's own and the graph's -->
            <line x1="5" y1="50" x2="97" y2="50" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.1" />
            <line x1="52" y1="26" x2="52" y2="74" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.1" />
            <circle cx="27" cy="50" r="18" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1.4" />
            <!-- the sine curve, drawn from the circle -->
            <path d="M52.0 50.0 L52.9 47.7 L53.8 45.3 L54.7 43.1 L55.6 41.0 L56.5 39.0 L57.4 37.3 L58.3 35.7 L59.2 34.4 L60.1 33.4 L61.0 32.6 L61.9 32.2 L62.8 32.0 L63.6 32.2 L64.5 32.6 L65.4 33.4 L66.3 34.4 L67.2 35.7 L68.1 37.3 L69.0 39.0 L69.9 41.0 L70.8 43.1 L71.7 45.3 L72.6 47.7 L73.5 50.0 L74.4 52.3 L75.3 54.7 L76.2 56.9 L77.1 59.0 L78.0 61.0 L78.9 62.7 L79.8 64.3 L80.7 65.6 L81.6 66.6 L82.5 67.4 L83.4 67.8 L84.2 68.0 L85.1 67.8 L86.0 67.4 L86.9 66.6 L87.8 65.6 L88.7 64.3 L89.6 62.7 L90.5 61.0 L91.4 59.0 L92.3 56.9 L93.2 54.7 L94.1 52.3 L95.0 50.0" fill="none" stroke="#F5C242" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" />
            <!-- angle, radius, cosine (blue) and sine (orange) at 60° -->
            <path d="M34 50 A7 7 0 0 0 30.5 43.9" fill="none" stroke="rgb(121, 158, 49)" stroke-width="1.6" />
            <line x1="27" y1="50" x2="36.0" y2="34.4" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
            <line x1="27" y1="50" x2="36.0" y2="50" stroke="#00D2FF" stroke-width="2.8" stroke-linecap="round" />
            <line x1="36.0" y1="50" x2="36.0" y2="34.4" stroke="#F5C242" stroke-width="2.8" stroke-linecap="round" />
            <!-- projection from P to the curve -->
            <line x1="36.0" y1="34.4" x2="59.2" y2="34.4" stroke="rgba(245, 194, 66, 0.7)" stroke-width="1.2" stroke-dasharray="3 2.5" />
            <circle cx="36.0" cy="34.4" r="3.2" fill="rgb(121, 158, 49)" />
            <circle cx="59.2" cy="34.4" r="3.2" fill="#F5C242" />
        </svg>`,
    "rechenrallye": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Rechen-Rallye, in the tiles' neon lines: the mountains, the road running to them, a sign bridge with a
                 task, the orange car from behind -->
            <polyline points="4,48 22,27 33,38 52,17 70,39 80,31 96,48" fill="none" stroke="rgba(157, 232, 255, 0.75)" stroke-width="2" stroke-linejoin="round" />
            <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(157, 232, 255, 0.3)" stroke-width="1.4" />
            <g stroke="#DBE8F7" stroke-width="2.6" stroke-linecap="round"><line x1="45" y1="50" x2="14" y2="96" /><line x1="55" y1="50" x2="86" y2="96" /></g>
            <g stroke="#F5C242" stroke-width="2.2" stroke-linecap="round"><line x1="50" y1="54" x2="50" y2="59" /><line x1="50" y1="64" x2="50" y2="71" /></g>
            <g stroke="#5A96FF" stroke-width="1.8"><line x1="34" y1="33" x2="34" y2="50" /><line x1="66" y1="33" x2="66" y2="50" /></g>
            <rect x="31" y="25" width="38" height="10" rx="2.5" fill="rgba(90, 150, 255, 0.22)" stroke="#5A96FF" stroke-width="1.8" />
            <text x="50" y="32.6" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="7" fill="#DBE8F7">7 · 8 = ?</text>
            <path d="M38 80 Q38 74 44 73.5 L56 73.5 Q62 74 62 80" fill="none" stroke="#F5C242" stroke-width="2.2" stroke-linejoin="round" />
            <rect x="33" y="79" width="34" height="11" rx="4" fill="rgba(245, 194, 66, 0.28)" stroke="#F5C242" stroke-width="2.4" />
            <g fill="#E06A5E"><rect x="36" y="82.4" width="7" height="2.6" rx="1.2" /><rect x="57" y="82.4" width="7" height="2.6" rx="1.2" /></g>
            <g stroke="#DBE8F7" stroke-width="3" stroke-linecap="round"><line x1="36.5" y1="92" x2="36.5" y2="95" /><line x1="63.5" y1="92" x2="63.5" y2="95" /></g>
        </svg>`,
    "wuerfelspiel": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- tree diagram: Lena's three branches, Mia's two on every end, green = Lena wins -->
            <g stroke="rgba(157, 232, 255, 0.85)" stroke-width="2" stroke-linecap="round">
                <line x1="10" y1="52" x2="38" y2="24" /><line x1="10" y1="52" x2="38" y2="52" /><line x1="10" y1="52" x2="38" y2="80" />
            </g>
            <g stroke="rgba(157, 232, 255, 0.35)" stroke-width="1.4" stroke-linecap="round">
                <line x1="38" y1="24" x2="62" y2="15" /><line x1="38" y1="24" x2="62" y2="33" /><line x1="38" y1="52" x2="62" y2="61" />
            </g>
            <g stroke="#799E31" stroke-width="2.6" stroke-linecap="round">
                <line x1="38" y1="52" x2="62" y2="43" /><line x1="38" y1="80" x2="62" y2="71" /><line x1="38" y1="80" x2="62" y2="89" />
            </g>
            <circle cx="10" cy="52" r="3" fill="#00D2FF" />
            <circle cx="38" cy="24" r="3.2" fill="#F5C242" /><circle cx="38" cy="52" r="3.2" fill="#799E31" /><circle cx="38" cy="80" r="3.2" fill="#5A96FF" />
            <g fill="#DBE8F7"><circle cx="62" cy="15" r="2" /><circle cx="62" cy="33" r="2" /><circle cx="62" cy="43" r="2" />
                <circle cx="62" cy="61" r="2" /><circle cx="62" cy="71" r="2" /><circle cx="62" cy="89" r="2" /></g>
            <!-- Lena's die (3, 5, 7) and Mia's die (4, 6), isometric -->
            <g stroke="rgba(225, 240, 255, 0.9)" stroke-width="1.3" stroke-linejoin="round">
                <polygon points="84,10 94.4,16 84,22 73.6,16" fill="#F5C242" />
                <polygon points="73.6,16 84,22 84,34 73.6,28" fill="#799E31" />
                <polygon points="84,22 94.4,16 94.4,28 84,34" fill="#3B5FA8" />
                <polygon points="84,56 94.4,62 84,68 73.6,62" fill="#E06A5E" />
                <polygon points="73.6,62 84,68 84,80 73.6,74" fill="#5A96FF" />
                <polygon points="84,68 94.4,62 94.4,74 84,80" fill="#8E3A33" />
            </g>
        </svg>`,
    "vektoren": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the parallelogram of the sum, dashed like a construction line -->
            <path d="M16 84 L58 72 L82 32 L40 44 Z" fill="rgba(121, 158, 49, 0.13)"
                  stroke="rgba(121, 158, 49, 0.5)" stroke-width="1.3" stroke-dasharray="4 3" stroke-linejoin="round" />
            <!-- a -->
            <line x1="16" y1="84" x2="48.4" y2="74.7" stroke="#F5C242" stroke-width="2.6" stroke-linecap="round" />
            <polygon points="58,72 49.5,78.5 47.3,70.9" fill="#F5C242" />
            <!-- b -->
            <line x1="16" y1="84" x2="34.9" y2="52.6" stroke="#00D2FF" stroke-width="2.6" stroke-linecap="round" />
            <polygon points="40,44 38.3,54.7 31.5,50.5" fill="#00D2FF" />
            <!-- the sum, on the diagonal -->
            <line x1="16" y1="84" x2="72.6" y2="39.4" stroke="rgb(121, 158, 49)" stroke-width="2.9" stroke-linecap="round" />
            <polygon points="82,32 75.6,43.2 69.6,35.6" fill="rgb(121, 158, 49)" />
            <circle cx="16" cy="84" r="3.6" fill="#ffffff" />
        </svg>`,
    "marionwalter": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="14,84 86,84 50,15" fill="rgba(0, 210, 255, 0.06)" stroke="#00D2FF" stroke-width="2.2" />
            <!-- six cevians: every trisection point meets the opposite corner -->
            <g stroke="rgba(121, 158, 49, 0.95)" stroke-width="1.1">
                <line x1="50" y1="15" x2="38" y2="84" /><line x1="50" y1="15" x2="62" y2="84" />
                <line x1="14" y1="84" x2="74" y2="61" /><line x1="14" y1="84" x2="62" y2="38" />
                <line x1="86" y1="84" x2="38" y2="38" /><line x1="86" y1="84" x2="26" y2="61" />
            </g>
            <!-- the hexagon they close in - exactly one tenth of the triangle -->
            <polygon points="59,66.8 57.2,56.4 50,49.5 42.8,56.4 41,66.8 50,70.2"
                     fill="rgba(245, 194, 66, 0.85)" stroke="#F5C242" stroke-width="1.4" />
            <g fill="#799E31" stroke="rgba(255, 255, 255, 0.8)" stroke-width="0.9">
                <circle cx="38" cy="84" r="2.1" /><circle cx="62" cy="84" r="2.1" /><circle cx="74" cy="61" r="2.1" />
                <circle cx="62" cy="38" r="2.1" /><circle cx="38" cy="38" r="2.1" /><circle cx="26" cy="61" r="2.1" />
            </g>
            <g fill="#B02418" stroke="rgba(255, 255, 255, 0.85)" stroke-width="1.2">
                <circle cx="14" cy="84" r="3.2" /><circle cx="86" cy="84" r="3.2" /><circle cx="50" cy="15" r="3.2" />
            </g>
        </svg>`,
    "cavalieri": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a sheared triangle between two parallels, cut into strips of
                 unchanged length - the theorem in one picture -->
            <g stroke="rgba(0, 210, 255, 0.45)" stroke-width="1.6" stroke-dasharray="4 4">
                <line x1="8" y1="22" x2="92" y2="22" /><line x1="8" y1="82" x2="92" y2="82" />
            </g>
            <g stroke="rgba(10, 20, 40, 0.55)" stroke-width="0.8">
                <polygon points="18,82 82,82 71,67 24,67" fill="rgba(245, 194, 66, 0.75)" />
                <polygon points="24,67 71,67 60,52 30,52" fill="rgba(121, 158, 49, 0.75)" />
                <polygon points="30,52 60,52 49,37 36,37" fill="rgba(245, 194, 66, 0.75)" />
                <polygon points="36,37 49,37 38,22" fill="rgba(121, 158, 49, 0.75)" />
            </g>
            <polygon points="18,82 82,82 38,22" fill="none" stroke="#00D2FF" stroke-width="2.2" />
            <line x1="18" y1="82" x2="82" y2="82" stroke="rgb(176, 36, 24)" stroke-width="3" />
        </svg>`,

    "kreisteilung": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="34" fill="rgba(0, 210, 255, 0.06)" stroke="#00D2FF" stroke-width="2.2" />
            <!-- all fifteen chords of the regular hexagon -->
            <g stroke="rgba(255, 255, 255, 0.5)" stroke-width="1.1">
                <line x1="50" y1="16" x2="79.4" y2="33" /><line x1="50" y1="16" x2="79.4" y2="67" />
                <line x1="50" y1="16" x2="50" y2="84" /><line x1="50" y1="16" x2="20.6" y2="67" />
                <line x1="50" y1="16" x2="20.6" y2="33" /><line x1="79.4" y1="33" x2="79.4" y2="67" />
                <line x1="79.4" y1="33" x2="50" y2="84" /><line x1="79.4" y1="33" x2="20.6" y2="67" />
                <line x1="79.4" y1="33" x2="20.6" y2="33" /><line x1="79.4" y1="67" x2="50" y2="84" />
                <line x1="79.4" y1="67" x2="20.6" y2="67" /><line x1="79.4" y1="67" x2="20.6" y2="33" />
                <line x1="50" y1="84" x2="20.6" y2="67" /><line x1="50" y1="84" x2="20.6" y2="33" />
                <line x1="20.6" y1="67" x2="20.6" y2="33" />
            </g>
            <!-- the twelve honest crossings ... -->
            <g fill="#F5C242">
                <circle cx="69.6" cy="50" r="1.9" /><circle cx="64.7" cy="41.5" r="1.9" /><circle cx="59.8" cy="33" r="1.9" /><circle cx="50" cy="33" r="1.9" />
                <circle cx="50" cy="67" r="1.9" /><circle cx="40.2" cy="33" r="1.9" /><circle cx="35.3" cy="41.5" r="1.9" /><circle cx="30.4" cy="50" r="1.9" />
                <circle cx="59.8" cy="67" r="1.9" /><circle cx="64.7" cy="58.5" r="1.9" /><circle cx="35.3" cy="58.5" r="1.9" /><circle cx="40.2" cy="67" r="1.9" />
            </g>
            <!-- ... and the centre, where three diagonals meet: that one costs the 31st region -->
            <circle cx="50" cy="50" r="3.6" fill="#B02418" stroke="#F5C242" stroke-width="1.5" />
            <g fill="#B02418" stroke="rgba(255, 255, 255, 0.85)" stroke-width="1.2">
                <circle cx="50" cy="16" r="3.2" /><circle cx="79.4" cy="33" r="3.2" /><circle cx="79.4" cy="67" r="3.2" />
                <circle cx="50" cy="84" r="3.2" /><circle cx="20.6" cy="67" r="3.2" /><circle cx="20.6" cy="33" r="3.2" />
            </g>
        </svg>`,
    "brahmagupta": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- circumcircle -->
            <circle cx="50" cy="50" r="36" fill="none" stroke="rgb(128, 128, 128)" stroke-width="1.2" opacity="0.7" />
            <!-- cyclic quadrilateral ABCD, its diagonals meeting at right angles in P -->
            <polygon points="18.8,32.0 50.0,86.0 73.1,77.6 85.5,43.7" fill="rgba(0, 210, 255, 0.12)" stroke="rgb(128, 128, 128)" stroke-width="1.5" stroke-linejoin="round" />
            <line x1="18.8" y1="32.0" x2="73.1" y2="77.6" stroke="var(--neon-blue)" stroke-width="1.2" />
            <line x1="50.0" y1="86.0" x2="85.5" y2="43.7" stroke="var(--neon-blue)" stroke-width="1.2" />
            <!-- the lot from P onto BC, carried on to the midpoint M of the opposite side -->
            <line x1="67.3" y1="79.7" x2="52.2" y2="37.9" stroke="rgb(245, 194, 66)" stroke-width="1.6" />
            <!-- P, the foot, and the bisected side -->
            <circle cx="63.7" cy="69.7" r="2.4" fill="white" />
            <circle cx="52.2" cy="37.9" r="2.4" fill="rgb(245, 194, 66)" />
        </svg>`,
    "jacquard": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="12" width="84" height="18" rx="2" fill="#C6A674" stroke="rgba(255,255,255,0.55)" stroke-width="1.6" />
            <g fill="#0B1A33">
                <circle cx="21" cy="21" r="3.4" /><circle cx="38" cy="21" r="3.4" />
                <circle cx="62" cy="21" r="3.4" /><circle cx="79" cy="21" r="3.4" />
            </g>
            <g stroke="#F2EAD8" stroke-width="2.6" stroke-linecap="round">
                <line x1="21" y1="32" x2="21" y2="56" /><line x1="38" y1="32" x2="38" y2="56" />
                <line x1="50" y1="32" x2="50" y2="46" /><line x1="62" y1="32" x2="62" y2="56" />
                <line x1="79" y1="32" x2="79" y2="56" />
            </g>
            <rect x="10" y="48" width="80" height="4.2" rx="1.4" fill="#B02418" />
            <g fill="#1C3FA8">
                <rect x="12" y="58" width="76" height="8" /><rect x="12" y="70" width="76" height="8" />
                <rect x="12" y="82" width="76" height="8" />
            </g>
            <g fill="#F2EAD8">
                <rect x="24" y="58" width="10" height="8" /><rect x="56" y="58" width="10" height="8" />
                <rect x="16" y="70" width="10" height="8" /><rect x="40" y="70" width="10" height="8" />
                <rect x="70" y="70" width="10" height="8" />
                <rect x="30" y="82" width="10" height="8" /><rect x="62" y="82" width="10" height="8" />
            </g>
        </svg>`,
    "koerper": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,8 81,20 92,52 74,84 40,90 14,68 12,34" fill="none" stroke="#F5C242" stroke-width="2.4" stroke-linejoin="round" />
            <polygon points="50,30 70,44 62,68 38,68 30,44" fill="rgba(176,36,24,0.35)" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linejoin="round" />
            <g stroke="rgba(255,255,255,0.55)" stroke-width="1.6" stroke-linecap="round">
                <line x1="50" y1="8" x2="50" y2="30" /><line x1="81" y1="20" x2="70" y2="44" /><line x1="92" y1="52" x2="70" y2="44" />
                <line x1="74" y1="84" x2="62" y2="68" /><line x1="40" y1="90" x2="38" y2="68" /><line x1="14" y1="68" x2="30" y2="44" /><line x1="12" y1="34" x2="30" y2="44" />
            </g>
        </svg>`,

    "bb84": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#C07FE8" stroke-width="4" stroke-linecap="round">
                <line x1="11" y1="30" x2="33" y2="30" /><line x1="22" y1="19" x2="22" y2="41" />
            </g>
            <g stroke="#F5C242" stroke-width="4" stroke-linecap="round">
                <line x1="67" y1="19" x2="89" y2="41" /><line x1="89" y1="19" x2="67" y2="41" />
            </g>
            <circle cx="50" cy="30" r="12" fill="rgba(0, 210, 255, 0.10)" stroke="#00D2FF" stroke-width="2.2" />
            <line x1="44" y1="36" x2="56" y2="24" stroke="#00D2FF" stroke-width="3.2" stroke-linecap="round" />
            <g font-family="Orbitron, sans-serif" font-size="16" font-weight="bold" fill="#FFD700"
               text-anchor="middle">
                <text x="26" y="77">1</text><text x="50" y="77">0</text><text x="74" y="77">1</text>
            </g>
            <line x1="16" y1="88" x2="84" y2="88" stroke="rgba(255, 215, 0, 0.45)" stroke-width="2" />
        </svg>`,
    "irisvis": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="34" fill="none" stroke="#F5C242" stroke-width="2.4" />
            <path d="M35 62 L65 62 L50 36 Z" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2" stroke-linejoin="round" />
            <g stroke-width="2.2" stroke-linecap="round">
                <line x1="35" y1="62" x2="19" y2="62" stroke="#B02418" />
                <line x1="65" y1="62" x2="81" y2="62" stroke="#799E31" />
                <line x1="50" y1="36" x2="41" y2="20" stroke="#F5C242" />
                <line x1="50" y1="36" x2="59" y2="20" stroke="#F5C242" />
                <line x1="35" y1="62" x2="27" y2="76" stroke="#B02418" />
                <line x1="65" y1="62" x2="73" y2="76" stroke="#799E31" />
            </g>
            <g fill="#00d2ff">
                <circle cx="19" cy="62" r="2.6" /><circle cx="81" cy="62" r="2.6" />
                <circle cx="41" cy="20" r="2.6" /><circle cx="59" cy="20" r="2.6" />
                <circle cx="27" cy="76" r="2.6" /><circle cx="73" cy="76" r="2.6" />
            </g>
        </svg>`,
    "kovarianz": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="50" rx="38" ry="22" fill="rgba(0, 210, 255, 0.07)" stroke="#00D2FF"
                     stroke-width="2.2" transform="rotate(-28 50 50)" />
            <g stroke-width="2.6" stroke-linecap="round">
                <line x1="50" y1="50" x2="83" y2="32" stroke="#F5C242" />
                <line x1="50" y1="50" x2="61" y2="70" stroke="#799E31" />
            </g>
            <g fill="rgba(226, 235, 248, 0.55)">
                <circle cx="34" cy="58" r="1.8" /><circle cx="63" cy="41" r="1.8" />
                <circle cx="45" cy="45" r="1.8" /><circle cx="70" cy="52" r="1.8" />
                <circle cx="28" cy="47" r="1.8" /><circle cx="55" cy="60" r="1.8" />
            </g>
        </svg>`,
    "ascii": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="12" fill="rgba(121, 158, 49, 0.08)" stroke="#799E31" stroke-width="2" />
            <g font-family="Menlo, Consolas, monospace" font-size="17" font-weight="bold" text-anchor="middle">
                <text x="26" y="41" fill="#799E31">@</text><text x="42" y="41" fill="#799E31">@</text><text x="58" y="41" fill="#799E31">#</text><text x="74" y="41" fill="#F5C242">+</text>
                <text x="26" y="59" fill="#799E31">@</text><text x="42" y="59" fill="#799E31">#</text><text x="58" y="59" fill="#F5C242">+</text><text x="74" y="59" fill="rgba(255,255,255,0.5)">.</text>
                <text x="26" y="77" fill="#799E31">#</text><text x="42" y="77" fill="#F5C242">+</text><text x="58" y="77" fill="rgba(255,255,255,0.5)">.</text><text x="74" y="77" fill="rgba(255,255,255,0.3)">·</text>
            </g>
        </svg>`,
    "cinematic-intro": `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" stroke-width="1.2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="2 4" opacity="0.5"></circle>
            <path d="M10 8l6 4-6 4V8z" fill="var(--neon-blue)"></path>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" opacity="0.8"></path>
        </svg>`,
    "transformationen": `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" stroke-width="1.5">
            <path d="M5 19L12 5l7 14H5z" fill="rgba(173, 255, 47, 0.1)"></path>
            <path d="M16 4a8 8 0 0 1 4 4m-4-4l2 2m-2-2l-2 2" stroke="var(--neon-blue)"></path>
        </svg>`,
    "heart3d": "💖",
    "litchi3d": "🍒",
    "addition": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(0, 210, 255, 0.1)" stroke="#00d2ff" stroke-width="2" />
            <line x1="50" y1="35" x2="50" y2="65" stroke="#00d2ff" stroke-width="6" stroke-linecap="round" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#00d2ff" stroke-width="6" stroke-linecap="round" />
        </svg>`,
    "einsundeins": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="12" fill="rgba(245, 194, 66, 0.08)" stroke="#F5C242" stroke-width="2" />
            <text x="50" y="43" text-anchor="middle" font-family="Orbitron, sans-serif" font-weight="700" font-size="23" fill="#F5C242">1+1</text>
            <g stroke="rgba(255,255,255,0.5)" stroke-width="2.2" stroke-linecap="round">
                <line x1="50" y1="50" x2="50" y2="58" />
            </g>
            <polygon points="50,64 45.5,56.5 54.5,56.5" fill="rgba(255,255,255,0.5)" />
            <text x="50" y="82" text-anchor="middle" font-family="'Courier New', monospace" font-weight="700" font-size="21" fill="#799E31">10<tspan font-size="12" dy="4">2</tspan></text>
        </svg>`,
    "neuroaddierer": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="12" fill="rgba(245, 194, 66, 0.08)" stroke="#F5C242" stroke-width="2" />
            <g stroke-width="1.7" opacity="0.8">
                <line x1="29" y1="32" x2="50" y2="50" stroke="#799E31" />
                <line x1="29" y1="50" x2="50" y2="50" stroke="#50AAFF" />
                <line x1="29" y1="68" x2="50" y2="50" stroke="#D73728" />
                <line x1="50" y1="50" x2="74" y2="39" stroke="#F5C242" />
                <line x1="50" y1="50" x2="74" y2="61" stroke="#D73728" />
            </g>
            <circle cx="50" cy="50" r="15" fill="rgb(8,20,42)" />
            <circle cx="50" cy="50" r="15" fill="rgba(245,194,66,0.18)" stroke="#F5C242" stroke-width="1.8" />
            <text x="50" y="61" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#F5C242">+</text>
            <circle cx="29" cy="32" r="5" fill="rgba(121,158,49,0.4)" stroke="#799E31" stroke-width="1.7" />
            <circle cx="29" cy="50" r="5" fill="rgba(80,170,255,0.4)" stroke="#50AAFF" stroke-width="1.7" />
            <circle cx="29" cy="68" r="5" fill="rgba(215,55,40,0.4)" stroke="#D73728" stroke-width="1.7" />
            <circle cx="74" cy="39" r="5" fill="rgba(245,194,66,0.4)" stroke="#F5C242" stroke-width="1.7" />
            <circle cx="74" cy="61" r="5" fill="rgba(215,55,40,0.4)" stroke="#D73728" stroke-width="1.7" />
        </svg>`,
    "maya": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a Maya eight: three dots over one bar, and the shell that is the zero -
                 the shell path is the one of resources/muschel.svg, scaled into the corner -->
            <g fill="#F5C242">
                <circle cx="30" cy="14" r="6" /><circle cx="50" cy="14" r="6" /><circle cx="70" cy="14" r="6" />
                <rect x="20" y="28" width="60" height="11" rx="5.5" />
            </g>
            <g transform="translate(50 94) scale(0.44)" fill="none" stroke="#F5C242" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
                <path d="M 1.74 -0.99 L 35.12 -26.48 A 5.71 5.71 0 0 1 40.76 -16.55 Z M 1.42 -1.41 L 38.49 -49.49 A 8.14 8.14 0 0 1 49.93 -37.91 Z M 1.01 -1.73 L 29.81 -71.05 A 10.00 10.00 0 0 1 47.10 -60.98 Z M 0.52 -1.93 L 11.46 -85.33 A 11.18 11.18 0 0 1 33.05 -79.50 Z M 0.00 -2.00 L -11.58 -88.42 A 11.58 11.58 0 0 1 11.58 -88.42 Z M -0.52 -1.93 L -33.05 -79.50 A 11.18 11.18 0 0 1 -11.46 -85.33 Z M -1.01 -1.73 L -47.10 -60.98 A 10.00 10.00 0 0 1 -29.81 -71.05 Z M -1.42 -1.41 L -49.93 -37.91 A 8.14 8.14 0 0 1 -38.49 -49.49 Z M -1.74 -0.99 L -40.76 -16.55 A 5.71 5.71 0 0 1 -35.12 -26.48 Z M 1.74 -0.99 L 29.83 -12.19 L 29.83 -2.20 L 5.00 -2.20 L 0.00 -0.00 M -1.74 -0.99 L -29.83 -12.19 L -29.83 -2.20 L -5.00 -2.20 L 0.00 -0.00" />
            </g>
        </svg>`,

    "vorrechnen": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the board with a handwritten row: 1 · 1 = 1, the result underlined twice;
                 the board in the middle across (Doc, 30.09.2026: "Tafel x zentral" - it was shifted to line up with
                 the card title), a tenth smaller so the pen stays inside -->
            <g transform="translate(50 41) scale(0.9) translate(-46 -41)">
            <rect x="6" y="12" width="80" height="58" rx="5" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1.6" />
            <path d="M15.5 32.5 Q18.5 30 21.5 26.5 L21 50 M35.5 32.5 Q38.5 30 41.5 26.5 L41 50 M48.5 35 Q54 34 59.5 35.5 M48.5 43 Q54 42 59.5 43.5" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="30" cy="39" r="2.2" fill="#ffffff" />
            <path d="M65.5 32.5 Q68.5 30 71.5 26.5 L71 50" fill="none" stroke="#F5C242" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M63 55.5 Q70 54.5 77 55.5 M63 60 Q70 59 77 60" fill="none" stroke="#F5C242" stroke-width="2" stroke-linecap="round" />
            <!-- the pen, just done -->
            <path d="M82.2 51.2 L94.2 39.2 L99.8 44.8 L87.8 56.8 Z" fill="#F5C242" />
            <path d="M82.2 51.2 L87.8 56.8 L78 62 Z" fill="#ffffff" />
            </g>
        </svg>`,
    "buzzer": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a small question mark over a big red buzzer; shifted so the base lines up with the card title (measured 5 px) -->
            <g transform="translate(-5.5 0)">
            <path d="M44 14 Q44 6 50 6 Q56 6 56 12.5 Q56 17.5 50 19.5 L50 23.5" fill="none" stroke="#F5C242" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="50" cy="30" r="2.6" fill="#F5C242" />
            <path d="M14 80 A36 36 0 0 1 86 80 Z" fill="rgb(176, 36, 24)" />
            <path d="M26.4 69 A26 26 0 0 1 39 56.4" fill="none" stroke="rgba(255, 255, 255, 0.45)" stroke-width="3" stroke-linecap="round" />
            <rect x="7" y="80" width="86" height="13" rx="4" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="2" />
            </g>
        </svg>`,
    "rueckmeldung": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the buzzer's teacher side: a question in a speech bubble, a gold badge counts how many asked -->
            <path d="M22 22 H70 Q78 22 78 30 V62 Q78 70 70 70 H42 L28 84 L30 70 H22 Q14 70 14 62 V30 Q14 22 22 22 Z" fill="none" stroke="rgba(255, 255, 255, 0.75)" stroke-width="3" stroke-linejoin="round" />
            <path d="M39 39 Q39 31 46 31 Q53 31 53 37.5 Q53 42.5 46 45 L46 50" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="46" cy="58" r="3" fill="#ffffff" />
            <circle cx="79" cy="23" r="15" fill="#F5C242" />
            <path d="M73.5 16 H84.5 L78.5 22 Q85 22 85 26.5 Q85 31 79 31 Q75 31 73.5 28.5" fill="none" stroke="#0b1a33" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`,
    "babylon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a Babylonian twenty-three: two corner wedges, three upright wedges -->
            <g fill="#F5C242">
                <path d="M26 36 L8 50 L26 64 L17 50 Z" /><path d="M44 36 L26 50 L44 64 L35 50 Z" />
                <path d="M50 30 L64 30 L59 44 L57.8 72 L56.2 72 L55 44 Z" />
                <path d="M67 30 L81 30 L76 44 L74.8 72 L73.2 72 L72 44 Z" />
                <path d="M84 30 L98 30 L93 44 L91.8 72 L90.2 72 L89 44 Z" />
            </g>
        </svg>`,
    "binaer": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- eleven in binary: 1 0 1 1 - the ones lit, the zero dark -->
            <g fill="none" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 37 L19 30 L19 70" stroke="#F5C242" />
                <rect x="30" y="30" width="17" height="40" rx="7" stroke="rgba(255, 255, 255, 0.45)" />
                <path d="M53 37 L61 30 L61 70" stroke="#F5C242" />
                <path d="M74 37 L82 30 L82 70" stroke="#F5C242" />
            </g>
        </svg>`,
    "hexadezimal": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- FF, and under each F its four bits, all lit: one byte, full -->
            <g fill="none" stroke="#F5C242" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M31 22 L15 22 L15 58 M15 39 L27 39" />
                <path d="M77 22 L61 22 L61 58 M61 39 L73 39" />
            </g>
            <g fill="#F5C242">
                <rect x="8" y="68" width="7" height="7" rx="1.5" /><rect x="17" y="68" width="7" height="7" rx="1.5" />
                <rect x="26" y="68" width="7" height="7" rx="1.5" /><rect x="35" y="68" width="7" height="7" rx="1.5" />
                <rect x="54" y="68" width="7" height="7" rx="1.5" /><rect x="63" y="68" width="7" height="7" rx="1.5" />
                <rect x="72" y="68" width="7" height="7" rx="1.5" /><rect x="81" y="68" width="7" height="7" rx="1.5" />
            </g>
        </svg>`,
    "koerperzaehlen": `<svg width="60" height="60" viewBox="-4 -4 40 40" xmlns="http://www.w3.org/2000/svg">
            <!-- an open hand, fingers splayed; the red dots are the first counting points - the five fingertips
                 and the wrist, so it is more than the fingers.
                 Shape: Fluent Emoji "Hand with fingers splayed" (flat), Copyright (c) Microsoft Corporation,
                 MIT License, github.com/microsoft/fluentui-emoji - in our gold, its lines cut out -->
            <defs>
                <mask id="koerperzaehlen-cut" maskUnits="userSpaceOnUse" x="-4" y="-4" width="40" height="40">
                    <rect x="-4" y="-4" width="40" height="40" fill="white" />
                    <path d="M15.013 4.44207C15.093 3.66837 15.309 3.01403 15.6216 2.57968C15.8867 2.21121 16.2081 2.01182 16.6019 1.99559C15.265 1.9799 14.2403 3.05723 14.0625 4.47254C13.7608 6.87415 13.4218 9.42738 13.2831 10.332L13.0975 11.8454C13.0639 12.1195 13.2588 12.3689 13.5329 12.4025C13.807 12.4362 14.0565 12.2412 14.0901 11.9671L15.012 4.45151L15.013 4.44207Z" fill="black" />
                    <path d="M8.55066 12.348C8.51612 12.1484 8.4801 11.9335 8.44542 11.7149C8.3724 11.0316 8.1614 9.02355 8.06244 6.75001C8.00921 5.58776 8.80953 4.55934 9.89862 4.30023L9.90565 4.33178C9.55477 4.41 9.28887 4.77121 9.1343 5.45234C8.98827 6.09581 8.99336 6.82164 9.01075 7.23704C9.03462 7.80756 9.09903 8.49055 9.16789 9.22084C9.2001 9.56234 9.23328 9.9143 9.26375 10.2698C9.3086 10.7933 9.42651 11.5446 9.53601 12.1775C9.59031 12.4912 9.64174 12.7713 9.67958 12.9729C9.6985 13.0737 9.714 13.1547 9.72475 13.2105L9.73713 13.2743L9.74136 13.2959C9.79476 13.5668 9.61842 13.8298 9.34749 13.8832C9.07656 13.9366 8.81364 13.7603 8.76024 13.4893L8.75564 13.4658L8.74285 13.3998C8.73182 13.3427 8.71601 13.26 8.69675 13.1574C8.65826 12.9524 8.60595 12.6675 8.55066 12.348Z" fill="black" />
                    <path d="M17.5003 12.5906L18.4701 9.99588C18.6417 9.54826 18.8468 9.00584 19.0684 8.42009C19.3241 7.7438 19.6018 7.00939 19.8749 6.29688C20.2977 5.19384 21.7187 4.10938 23.0156 4.64063L23.0341 4.64829L23.0296 4.66192C22.5887 4.51522 22.1965 4.62055 21.8196 4.95126C21.4228 5.29936 21.0656 5.88608 20.798 6.62368L20.7963 6.62819L18.437 12.9407C18.3403 13.1993 18.0523 13.3307 17.7936 13.234C17.5349 13.1373 17.4036 12.8492 17.5003 12.5906Z" fill="black" />
                    <path d="M9.06687 17.3737C10.2293 17.2907 12.1236 17.1768 14.0388 17.2558C15.3462 17.3098 16.6214 17.4527 17.6704 17.7363C17.1632 17.9067 16.5544 18.1381 15.8917 18.4446C14.0716 19.2865 11.8175 20.7082 10.1564 23.0208C9.99531 23.2451 10.0465 23.5575 10.2708 23.7186C10.4951 23.8797 10.8075 23.8285 10.9686 23.6042C12.495 21.4793 14.5846 20.151 16.3115 19.3523C17.1727 18.9539 17.9368 18.6904 18.484 18.5269C18.7573 18.4453 18.9759 18.3887 19.1245 18.3529C19.1988 18.335 19.2556 18.3223 19.293 18.3143L19.3342 18.3056L19.3434 18.3037L19.3448 18.3034C19.5515 18.2633 19.7113 18.098 19.744 17.89C19.7766 17.6819 19.6753 17.4756 19.4906 17.3742C18.1052 16.6136 16.0302 16.3371 14.08 16.2567C12.1066 16.1753 10.1665 16.2926 8.99563 16.3763C8.72019 16.396 8.51285 16.6352 8.53252 16.9106C8.55219 17.1861 8.79143 17.3934 9.06687 17.3737Z" fill="black" />
                </mask>
            </defs>
            <path d="M28.6875 14.3594C27.4439 12.8937 26.2031 13.4844 24.9531 14.2813C24.9531 14.2813 22.5469 16.2344 21.5469 16.4219C22.1094 14.1719 24.3232 8.55037 24.5625 7.48438C24.9062 5.95313 24.0035 5.04529 23.0156 4.64063C21.7188 4.10938 20.2978 5.19384 19.875 6.29688C18.935 8.74934 17.9418 11.4566 17.9688 11.1875L18.8594 5.26563C19.125 3.64063 18.0763 2.10188 16.7608 2.00255C15.3467 1.89577 14.2473 3.00163 14.0625 4.47254C13.6719 7.58192 13.2188 10.9455 13.2188 10.6563L12.7969 6.53126C12.7369 5.23126 11.6369 4.18001 10.3269 4.24001C9.02687 4.30001 8.0025 5.44001 8.0625 6.75001C8.18933 9.66401 8.50022 12.1419 8.46875 11.9531L7.90625 9.56251C7.5625 8.25001 6.45376 7.35501 5.13376 7.54501C3.86376 7.73501 2.97374 8.91501 3.14374 10.195L4.34375 16.2969C4.46944 17.2575 4.5625 21.7188 5.60937 24.2656C7.31473 28.4145 10.375 29.8438 13.6408 30.0025C16.3438 29.9219 19.7344 28.4375 21.6562 25.1094C23.4888 21.9359 25.7344 20.0469 28.5625 17.7031C29.2094 17.167 29.9311 15.825 28.6875 14.3594Z" fill="#F5C242" mask="url(#koerperzaehlen-cut)" />
            <g fill="rgb(176, 36, 24)">
                <circle cx="5.9" cy="9.4" r="1.25" /><circle cx="10.45" cy="6.4" r="1.25" /><circle cx="16.5" cy="4.3" r="1.25" />
                <circle cx="22.3" cy="6.8" r="1.25" /><circle cx="27.6" cy="15.7" r="1.25" />
                <circle cx="13.8" cy="27.4" r="1.25" />
            </g>
        </svg>`,
    "subtraktion": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(255, 77, 77, 0.1)" stroke="#ff4d4d" stroke-width="2" />
            <line x1="32" y1="50" x2="68" y2="50" stroke="#ff4d4d" stroke-width="6" stroke-linecap="round" />
        </svg>`,
    "multiplikation": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(255, 215, 0, 0.1)" stroke="#ffd700" stroke-width="2" />
            <circle cx="50" cy="50" r="6" fill="#ffd700" />
        </svg>`,
    "dividieren": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(173, 255, 47, 0.1)" stroke="#adff2f" stroke-width="2" />
            <circle cx="50" cy="35" r="5" fill="#adff2f" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#adff2f" stroke-width="5" stroke-linecap="round" />
            <circle cx="50" cy="65" r="5" fill="#adff2f" />
        </svg>`,
    "winkelsumme3d": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Rectangular Frame -->
            <rect x="15" y="25" width="70" height="55" fill="rgba(0, 210, 255, 0.15)" stroke="#00d2ff" stroke-width="1.5" />
            <!-- Fold Lines meeting at the bottom center (50, 80) -->
            <line x1="15" y1="25" x2="50" y2="80" stroke="#00d2ff" stroke-width="1" />
            <line x1="85" y1="25" x2="50" y2="80" stroke="#00d2ff" stroke-width="1" />
            <!-- The 3 Colored Angle Sectors forming a semi-circle -->
            <path d="M 32,80 A 18,18 0 0,1 42,65 L 50,80 Z" fill="#ffb100" />
            <path d="M 42,65 A 18,18 0 0,1 58,65 L 50,80 Z" fill="#ff4d4d" />
            <path d="M 58,65 A 18,18 0 0,1 68,80 L 50,80 Z" fill="#adff2f" />
        </svg>`,
    "ausgleichsgerade": "🛰️",
    "binomischeslabor": `<svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 12h18M12 3v18"></path>
            <circle cx="12" cy="12" r="1.5" fill="var(--neon-blue)"></circle>
        </svg>`,
    "butterfly": "🦋",
    "triangulierer": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 25 L55 15 L85 40 L65 85 L25 75 Z" fill="rgba(198, 33, 40, 0.2)" stroke="white" stroke-width="1" />
            <line x1="20" y1="25" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="55" y1="15" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="85" y1="40" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="65" y1="85" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="25" y1="75" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <circle cx="20" cy="25" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="55" cy="15" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="85" cy="40" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="65" cy="85" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="25" cy="75" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="50" cy="55" r="7" fill="#ff9800" stroke="white" stroke-width="2" />
        </svg>`,
    "stanford-portal": `<svg class="stanford-lab-card-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 248.022" focusable="false" aria-hidden="true"><g fill-rule="nonzero"><path fill="#8c1515" d="m35.872 1.1236-34.558 33.832v90.907l30.041 30.665h13.776c-0.33541 0.92261-0.77516 2.3452 0.18119 3.7375 1.0401 1.5433 2.835 1.5433 3.5228 1.5433 0.80522 0 1.9291-0.10059 3.6571-0.33551h0.02027s0.72132 0.64079-1.4762 1.3621c-1.8117 0.63746-3.3919 1.6909-3.912 3.5025-0.03436 0.13399-0.04703 0.27196-0.08053 0.38918h-45.716l-0.013433 46.465 34.558 33.953h90.887l34.558-33.905v-87.077l-30.047-30.618h-25.478c-0.0172 0-0.0403-0.0134-0.0403-0.0134-1.1239-0.67099-2.2781-1.3789-3.3349-2.0667l-0.38917-0.24828-0.0671-0.04026c-0.57036-0.35214-1.1709-0.78508-1.8251-1.3554-0.57036-0.45294-1.0434-0.90584-1.3957-1.3085l-0.10066-0.10066c-0.67099-0.70459-1.2581-1.3789-1.7111-1.966 3.9756 1.1407 8.3071 1.4292 10.387 1.4963h0.24828c0.13399 0 0.27196 0.02027 0.38918 0.02027l0.18116 0.0134c0.50323 0.03436 0.88907 0.11712 1.1407 0.20129 0.26842 0.10049 0.5066 0.22159 0.72469 0.32208l1.0736 0.40261c0.25165 0.06699 0.52 0.08053 0.80522 0.08053 1.5601 0 3.0195-0.93941 3.6904-2.4156 0.21816-0.50327 0.5536-1.5064 0.30195-2.8316l45.442 0.03367v-50.76l-34.551-33.886h-90.887z"/><path fill="#fff" d="m157.19 36.804-32.1-31.487h-87.55l-32.108 31.436v87.382l27.628 28.182 17.815 0.0172c-1.9963 1.7949-2.6169 3.6569-2.9357 4.5628-0.68775 1.9962-1.4091 2.5665 4.8479 1.6943 1.9795-0.28515 5.5862-1.5601 7.2803-2.7008 1.6607-1.1407 4.9484-0.21816 4.6633 2.2479-1.5433 3.7743-5.502 6.1397-9.2768 6.6095-8.6893 1.0904-4.9317 4.3279-4.9317 4.3279 0.95619 0.65426 1.644 1.2917 2.1305 1.8621h-4.2273v-0.0172h-42.978l-0.017178 40.478 32.091 31.537h87.567l32.09-31.487v-83.539l-27.628-28.148h-22.327c-1.7781-1.1911-4.177-2.5163-6.3578-3.9421 0-0.01718 0-0.01718-0.0172-0.01718-0.83874-0.48647-1.6607-1.0903-2.4491-1.7781-0.65421-0.52001-1.2413-1.0736-1.7446-1.6272-1.9291-2.013-3.3717-4.1099-3.7576-5.0829-0.72133-1.7781-0.55355-4.026 1.0736-3.1034 4.1267 2.3821 10.904 2.835 13.42 2.9189 0.28515 0 2.3149 0.2349 2.8014 0.38564 0.50322 0.20141 1.2749 0.57034 1.2749 0.57034 1.0233 0.43614 2.8685-0.97294 0.73812-3.5731-0.55359-0.88907-1.3923-1.9124-2.3821-2.9524h47.354v-44.756"/><path fill="#8c1515" transform="matrix(.80001 0 0 .80001 -.00065308 0)" d="m48.988 11.889l-37.05 36.297v104.79l31.537 32.17h29.607c5.053-2.22 6.123-2.03 7.527-4.86 0.21-0.45 0.418-1.75 0.44-3.02 0.063-0.36 0.693-4.18-1.153-3.25-3.166 1.59-9.562-2.61-14.343-0.11-4.781 2.47-1.279-3.27-0.608-4.26 0 0 2.558-3.37 6.416-5.6 0.147-0.08 0.273-0.16 0.377-0.25 0.378-0.21 0.756-0.39 1.155-0.58 2.935-1.37 11.3-6.94 12.81-8.68 0.902-1.01 2.496-3.32 2.559-4.6 0.272-1.11 0.483-2.87-0.586-3.56-1.594-1.05-2.874 1-5.369 2.12-2.496 1.11-4.383 1.57-6.606 1.65-2.138 0.07-4.193-0.75-5.472-0.56-1.28 0.21-2.035-0.76 0.314-3.13 1.069-1.07 1.532-1.55 2.035-1.91 5.578-3.58 10.589-3.62 13.399-9.98 0 0 2.181-5.7-2.034-3.27-2.306 1.34-3.564 3.27-10.17 3.27-6.584 0-9.164 3.13-10.275 4.49 0 0-4.486 6.27-3.375-2.52 1.133-8.76 2.83-13.23 6.961-16.65 3.564-2.93 12.412-6.87 15.6-11.21 1.635-1.62 5.746-6.32 3.355-10.299-1.007-1.678-3.459 2.669-5.996 3.229-2.894 0.76-6.563 1.7-9.373 1.13-3.481-0.69-5.704 0.63-7.004 1.22s-3.754-1.28-0.756-4.698c4.026-4.592 13.757-10.588 20.299-14.174 0.902-0.378 3.102-1.342 5.115-2.621 0.042-0.022 0.084-0.043 0.106-0.043 0.503-0.231 1.237-0.672 1.656-1.238 1.426-1.196 2.412-2.536 2.076-3.899-0.293-1.237-0.903-1.657-2.832-1.867-1.53-0.147-4.066 1.636-6.205 1.469-3.271-0.273-8.074 0.481-6.48-1.846 1.488-2.16 3.899-3.545 4.591-3.922 1.342-0.608 3.146-1.404 5.809-2.6 4.173-1.887 3.585-6.625 1.971-6.792-2.517-0.273-9.31 1.906-4.53-3.545 0 0 2.266-2.285 4.551-3.774 1.803-1.048 3.292-1.447 5.074-2.098 1.112-0.398 4.028-2.977-2.892-3.25 0 0-3.859 0.105-3.125-1.677 0.608-1.174 4.006-3.313 4.006-3.313s2.724-1.867 3.836-2.978c1.069-1.028 1.824-1.845 1.761-2.768-0.042-1.048-2.768-2.348-3.922-3.816-0.817-1.049-0.125-1.425 0.336-1.551 0.252-0.041 0.546-0.084 0.903-0.084 2.809 0.021 3.606-2.789 5.246-10.086 0.48-2.181 0.52-2.641 1.23-2.662 0.07 0 0.11 0.021 0.15 0.021 0 0 0.69 3.69 1.7 7.821 0.86 2.285 1.8 3.25 3.46 3.228 0.33 0 0.63 0.041 0.88 0.084 0.46 0.126 1.17 0.505 0.33 1.553-0.63 0.818-2.51 2.139-2.66 2.936-0.54 2.264 1.62 3.082 3.82 3.25 3.12 0.209 1.82 2.159-1.55 4.654-3.25 2.411 5.07 7.57 5.07 7.57 4.74 3.67 1.36 4.612 0.4 5.137-0.97 0.503-3.63 2.139-0.97 3.187 2.69 1.028 6.38 4.739 6.38 4.739 4.76 5.451-2.02 3.293-4.53 3.545-1.62 0.167-2.2 4.926 1.97 6.793 6.35 2.872 7.76 3.355 10 5.033 4.19 3.103 1.97 5.745-3.27 4.822 0 0-3.35-0.838-5.7-0.377-1.47 0.273-2.48 0.608-3.17 0.965-0.36 0.545-1.19 2.704 6.1 4.947 3.48 1.09 7.8 3.713 11.64 6.711l59.81-0.062-0.01-48.457-37.05-36.338h-105.3zm90.312 118.05c1.72 2.85 2.72 6.58 3.46 12.06 0.02 3.29-4.32 1.69-5.73 0.83-0.98-0.67-2.28-1.29-3.96-1.69-3.17-0.76-10.71-4.07-12.77-4.81-2.1-0.77-3.63 0.78-3.88 1.37h0.02c-0.54 1 0.57 3.02 0.57 3.02 2.96 6.71 8.41 6.35 14.4 10.65 8.24 5.87 3.84 7.11 2.14 6.23-1.67-0.9-4.44-0.34-4.44-0.34-6.65 1.83-8.64-0.94-12.54-1.97-3.88-1.05-0.69 3.78 0.71 5.39 1.49 1.74 9.88 7.32 12.79 8.68 6.36 2.96 9.67 7.76 11.64 13.86 1.87 5.77-0.17 4.51-1.68 3.8-1.51-0.72-1.95-2.27-5.7-2.18-3.77 0.08-5.89-0.19-8.58-2.31-0.71-0.55-1.28-1.18-1.76-1.7-0.04-0.02-0.06-0.04-0.08-0.06-2.58-1.97-2.08 4.57-1.55 5.64 1.86 3.75 3.12 2.22 13.86 7.95 5.09 2.72 6.29 6.37 6.83 7.9 0.86 2.48 1.74 3.19-6.06 2.1-2.49-0.34-6.98-1.93-9.12-3.38-2.05-1.42-6.18-0.27-5.81 2.81 1.93 4.72 6.88 7.68 11.6 8.26 4.13 0.53 6 1.43 6.75 2.35 2.26 2.58-1.93 6.36-1.93 6.36-2.1 2.43 0.17 5.28 1.72 6.12 2.52 1.28 7.4 4.21 9.02 8.41 8.47 21.8 0.27 15.55-3.74 13.06-4.02-2.5-11.68-8.91-18.66-8.35-6.98 0.55-9.31 0.93-13.46-2.37-4.13-3.29-3.73 2.04-3.73 2.04v26.29c0.25 5.89 1.34 11.51 6.02 16.27 3.83 3.93 6.75 3.19 12.16 9.8 2.49 3.04 10.63 6.31 16.06 6.37l10.42 0.02 37.05-36.34v-100.04l-31.51-32.1h-20.53zm-127.34 88.97l-0.021 43.09 37.05 36.36h11.91c11.198-0.55 15.391-9.23 18.788-14.57 2.558-4.05 7.088-7.49 9.961-10.43 3.04-3.08 3.586-10.13 3.669-17.76v-15.93l0.022 0.16v-3.81h0.021v-2.54h0.002v-0.59-6.87c0-1.6-1.845-1.72-5.871 2.64-4.047 4.34-10.819 3.98-14.74 4.34-3.921 0.35-15.202 6.23-18.432 10.44-1.992 2.62-4.823 0.46-3.67-4.7h-0.042c0.545-2.32 1.551-5.45 3.166-9.58 2.222-5.76 10.568-9.14 10.568-9.14s0.86-0.38 1.615-1.11h-53.996z"/></g></svg>`,
    "differentiallabor": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="translate(50 50) scale(1.22) translate(-50 -50)">
            <line x1="18" y1="82" x2="92" y2="82" stroke="white" stroke-width="1"/>
            <path d="M 22,74 Q 42,18 54,38 Q 68,56 88,28" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="34" y1="66" x2="74" y2="26" stroke="var(--neon-cyan)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="52" cy="38" r="4.2" fill="rgba(0,210,255,0.22)" stroke="var(--neon-cyan)" stroke-width="1.2"/>
            <text x="50" y="68" font-family="'Orbitron', sans-serif" font-size="56" fill="var(--neon-purple)" text-anchor="middle" style="filter: drop-shadow(0 0 14px var(--neon-purple)); opacity: 0.82;">′</text>
            </g>
        </svg>`,
    "eulergerade": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 85,80 50,20" fill="none" stroke="rgb(128, 128, 128)" stroke-width="1.5" />
            <!-- Euler Line -->
            <line x1="5" y1="65" x2="95" y2="35" stroke="var(--neon-purple)" stroke-width="1.5" />
            <!-- Nine-point Circle -->
            <circle cx="50" cy="50" r="28" fill="none" stroke="var(--neon-blue)" stroke-width="1.2" opacity="0.6" />
            <!-- Centroid/Points on the line -->
            <circle cx="20" cy="60" r="2" fill="white" />
            <circle cx="50" cy="50" r="2" fill="white" />
            <circle cx="80" cy="40" r="2" fill="white" />
        </svg>`,
    "gleichschenkligesDreieck": "📐",
    "parabellabor": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,20 Q 50,110 80,20" fill="none" stroke="var(--neon-purple)" stroke-width="2" stroke-linecap="round" />
            <circle cx="50" cy="65" r="3.5" fill="var(--neon-blue)" />
            <circle cx="65" cy="53.75" r="3" fill="#ffd700" />
        </svg>`,
    "winkelsumme": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 80.3,32.5 80.3,67.5 50,85 19.7,67.5 19.7,32.5" fill="rgba(0, 210, 255, 0.2)" stroke="white" stroke-width="1.5" />
            <circle cx="50" cy="15" r="3" fill="var(--neon-blue)" />
            <circle cx="80.3" cy="32.5" r="3" fill="var(--neon-blue)" />
            <circle cx="80.3" cy="67.5" r="3" fill="var(--neon-blue)" />
            <circle cx="50" cy="85" r="3" fill="var(--neon-blue)" />
            <circle cx="19.7" cy="67.5" r="3" fill="var(--neon-blue)" />
            <circle cx="19.7" cy="32.5" r="3" fill="var(--neon-blue)" />
        </svg>`,
    "potenzlabor": "📈",
    "pythagorasbeweis": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 80,80 20,20" fill="rgba(255, 152, 0, 0.8)" stroke="rgb(128, 128, 128)" stroke-width="2" stroke-linejoin="round" />
            <polyline points="20,65 35,65 35,80" fill="none" stroke="rgb(0, 0, 60)" stroke-width="1.5" />
            <circle cx="80" cy="80" r="4" fill="#a00" />
            <circle cx="20" cy="20" r="4" fill="#a00" />
            <circle cx="20" cy="80" r="4" fill="#a00" />
        </svg>`,
    "pythagoras": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 80,80 20,20" fill="rgba(173, 255, 47, 0.8)" stroke="rgb(128, 128, 128)" stroke-width="2" stroke-linejoin="round" />
            <polyline points="20,65 35,65 35,80" fill="none" stroke="rgb(0, 0, 60)" stroke-width="1.5" />
            <circle cx="80" cy="80" r="4" fill="#a00" />
            <circle cx="20" cy="20" r="4" fill="#a00" />
            <circle cx="20" cy="80" r="4" fill="#a00" />
        </svg>`,
    "steigung": "🚀",
    "winkellabor": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="40" x2="90" y2="40" stroke="var(--neon-blue)" stroke-width="3" />
            <line x1="10" y1="75" x2="90" y2="75" stroke="var(--neon-blue)" stroke-width="3" />
            <line x1="20" y1="90" x2="80" y2="25" stroke="var(--neon-purple)" stroke-width="3" />
            <circle cx="34" cy="75" r="4" fill="rgba(0, 210, 255, 0.3)" stroke="var(--neon-blue)" stroke-width="1" />
            <circle cx="65.5" cy="40" r="4" fill="rgba(0, 210, 255, 0.3)" stroke="var(--neon-blue)" stroke-width="1" />
        </svg>`,
    "uhrzeitwinkel": "🕒",
    "beweisinwinkellsumme": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><clipPath id="triClip"><polygon points="10,85 90,85 50,15" /></clipPath></defs>
            <g clip-path="url(#triClip)">
                <circle cx="10" cy="85" r="25" fill="rgb(255, 177, 0)" />
                <circle cx="90" cy="85" r="25" fill="rgb(119, 181, 33)" />
                <circle cx="50" cy="15" r="25" fill="rgb(198, 33, 40)" />
            </g>
            <line x1="0" y1="15" x2="100" y2="15" stroke="rgb(198, 33, 40)" stroke-width="3" />
            <line x1="0" y1="85" x2="100" y2="85" stroke="rgb(198, 33, 40)" stroke-width="3" />
            <polygon points="10,85 90,85 50,15" fill="none" stroke="#00d2ff" stroke-width="3" stroke-linejoin="round" />
        </svg>`,
    "logikspiel": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="25" height="25" fill="none" stroke="#00d2ff" stroke-width="2" rx="4" />
            <rect x="55" y="20" width="25" height="25" fill="none" stroke="#00d2ff" stroke-width="2" rx="4" />
            <rect x="20" y="55" width="25" height="25" fill="none" stroke="#00d2ff" stroke-width="2" rx="4" />
            <rect x="55" y="55" width="25" height="25" fill="none" stroke="#adff2f" stroke-width="2" rx="4" />
            <circle cx="50" cy="50" r="5" fill="#adff2f" />
        </svg>`,
    "integralreaktor": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="translate(50 50) scale(1.22) translate(-50 -50)">
            <line x1="20" y1="80" x2="90" y2="80" stroke="white" stroke-width="1"/>
            <path d="M 20,80 L 20,65 Q 45,15 60,55 T 90,40 L 90,80 Z" fill="rgba(0, 210, 255, 0.2)"/>
            <path d="M 20,65 Q 45,15 60,55 T 90,40" fill="none" stroke="white" stroke-width="1.5"/>
            <text x="50" y="62" font-family="'Orbitron', sans-serif" font-size="64" fill="var(--neon-purple)" text-anchor="middle" style="filter: drop-shadow(0 0 15px var(--neon-purple)); opacity: 0.82;">∫</text>
            </g>
        </svg>`,
    "fourier": "🎻",
    "lissajous": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="lisOscGlow" x="-35%" y="-35%" width="170%" height="170%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.35" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>
            <rect width="100" height="100" rx="6" fill="#070f18"/>
            <g stroke="rgba(80,120,160,0.22)" stroke-width="0.55">
                <line x1="14" y1="14" x2="86" y2="14"/><line x1="14" y1="32" x2="86" y2="32"/><line x1="14" y1="50" x2="86" y2="50"/>
                <line x1="14" y1="68" x2="86" y2="68"/><line x1="14" y1="86" x2="86" y2="86"/>
                <line x1="14" y1="14" x2="14" y2="86"/><line x1="32" y1="14" x2="32" y2="86"/><line x1="50" y1="14" x2="50" y2="86"/>
                <line x1="68" y1="14" x2="68" y2="86"/><line x1="86" y1="14" x2="86" y2="86"/>
            </g>
            <line x1="14" y1="50" x2="86" y2="50" stroke="#5ee9ff" stroke-width="1.35"/>
            <line x1="50" y1="14" x2="50" y2="86" stroke="#5ee9ff" stroke-width="1.35"/>
            <g fill="#ddeeff" font-family="system-ui,sans-serif" font-size="5.2" opacity="0.82">
                <text x="11" y="51.5" text-anchor="end">−2</text><text x="30" y="51.5" text-anchor="middle">−1</text>
                <text x="50" y="51.5" text-anchor="middle">0</text><text x="69" y="51.5" text-anchor="middle">1</text><text x="88" y="51.5" text-anchor="middle">2</text>
                <text x="51" y="17" text-anchor="start">2</text><text x="51" y="35" text-anchor="start">1</text>
                <text x="51" y="71" text-anchor="start">−1</text><text x="51" y="89" text-anchor="start">−2</text>
            </g>
            <path fill="none" stroke="#ff9f3b" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" filter="url(#lisOscGlow)"
                d="M 50.0,50.0 L 57.0,45.31 L 63.62,40.73 L 69.48,36.38 L 74.27,32.37 L 77.72,28.79 L 79.63,25.73 L 79.91,23.27 L 78.53,21.47 L 75.58,20.37 L 71.21,20.0 L 65.67,20.37 L 59.27,21.47 L 52.35,23.27 L 45.31,25.73 L 38.52,28.79 L 32.37,32.37 L 27.19,36.38 L 23.27,40.73 L 20.83,45.31 L 20.0,50.0 L 20.83,54.69 L 23.27,59.27 L 27.19,63.62 L 32.37,67.63 L 38.52,71.21 L 45.31,74.27 L 52.35,76.73 L 59.27,78.53 L 65.67,79.63 L 71.21,80.0 L 75.58,79.63 L 78.53,78.53 L 79.91,76.73 L 79.63,74.27 L 77.72,71.21 L 74.27,67.63 L 69.48,63.62 L 63.62,59.27 L 57.0,54.69 L 50.0,50.0 L 43.0,45.31 L 36.38,40.73 L 30.52,36.38 L 25.73,32.37 L 22.28,28.79 L 20.37,25.73 L 20.09,23.27 L 21.47,21.47 L 24.42,20.37 L 28.79,20.0 L 34.33,20.37 L 40.73,21.47 L 47.65,23.27 L 54.69,25.73 L 61.48,28.79 L 67.63,32.37 L 72.81,36.38 L 76.73,40.73 L 79.17,45.31 L 80.0,50.0 L 79.17,54.69 L 76.73,59.27 L 72.81,63.62 L 67.63,67.63 L 61.48,71.21 L 54.69,74.27 L 47.65,76.73 L 40.73,78.53 L 34.33,79.63 L 28.79,80.0 L 24.42,79.63 L 21.47,78.53 L 20.09,76.73 L 20.37,74.27 L 22.28,71.21 L 25.73,67.63 L 30.52,63.62 L 36.38,59.27 L 43.0,54.69 L 50.0,50.0"/>
        </svg>`,
    "cmaes": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="cmaesLuxDiag" x1="8" y1="12" x2="94" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#022c22"/><stop offset="22%" stop-color="#0f766e"/><stop offset="48%" stop-color="#14b8a6"/>
                    <stop offset="62%" stop-color="#0891b2"/><stop offset="82%" stop-color="#155e75"/><stop offset="100%" stop-color="#3730a3"/>
                </linearGradient>
                <radialGradient id="cmaesLuxHot" cx="34" cy="22" r="58" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#ecfeff" stop-opacity="0.55"/><stop offset="35%" stop-color="#5eead4" stop-opacity="0.38"/>
                    <stop offset="65%" stop-color="#134e4a" stop-opacity="0.15"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
                </radialGradient>
                <filter id="cmaesLuxBloom" x="-35%" y="-35%" width="170%" height="170%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>
                    <feFlood flood-color="#2dd4bf" flood-opacity="0.45" result="fl"/>
                    <feComposite in="fl" in2="b" operator="in" result="g"/>
                    <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>
            <g filter="url(#cmaesLuxBloom)">
                <polygon points="44.8,20.16 57.33,13.4 72.62,14.69 62.74,37.48 70.77,43.25 94.35,56.57 66.27,60.24 59.12,64.92 58.9,86.6 44.8,85.28 35.06,74.6 30.75,64.56 5.65,70.44 6.64,54.57 24.39,44.24 9.87,27.68 17.27,15.03 36.63,25.4"
                    fill="url(#cmaesLuxDiag)" stroke="none" stroke-linejoin="round"/>
                <polygon points="44.8,20.16 57.33,13.4 72.62,14.69 62.74,37.48 70.77,43.25 94.35,56.57 66.27,60.24 59.12,64.92 58.9,86.6 44.8,85.28 35.06,74.6 30.75,64.56 5.65,70.44 6.64,54.57 24.39,44.24 9.87,27.68 17.27,15.03 36.63,25.4"
                    fill="url(#cmaesLuxHot)" stroke="none" stroke-linejoin="round"/>
            </g>
            <polygon points="44.8,20.16 57.33,13.4 72.62,14.69 62.74,37.48 70.77,43.25 94.35,56.57 66.27,60.24 59.12,64.92 58.9,86.6 44.8,85.28 35.06,74.6 30.75,64.56 5.65,70.44 6.64,54.57 24.39,44.24 9.87,27.68 17.27,15.03 36.63,25.4"
                fill="none" stroke="rgba(207,250,254,0.92)" stroke-width="1.35" stroke-linejoin="round"/>
            <polygon points="44.8,20.16 57.33,13.4 72.62,14.69 62.74,37.48 70.77,43.25 94.35,56.57 66.27,60.24 59.12,64.92 58.9,86.6 44.8,85.28 35.06,74.6 30.75,64.56 5.65,70.44 6.64,54.57 24.39,44.24 9.87,27.68 17.27,15.03 36.63,25.4"
                fill="none" stroke="rgba(45,212,191,0.35)" stroke-width="2.85" stroke-linejoin="round"/>
            <circle cx="44.8" cy="20.16" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="57.33" cy="13.4" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="72.62" cy="14.69" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="62.74" cy="37.48" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="70.77" cy="43.25" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="94.35" cy="56.57" r="2.55" fill="var(--neon-purple)" stroke="rgba(255,255,255,0.35)" stroke-width="0.45"/>
            <circle cx="66.27" cy="60.24" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="59.12" cy="64.92" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="58.9" cy="86.6" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="44.8" cy="85.28" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="35.06" cy="74.6" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="30.75" cy="64.56" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="5.65" cy="70.44" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="6.64" cy="54.57" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="24.39" cy="44.24" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="9.87" cy="27.68" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="17.27" cy="15.03" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
            <circle cx="36.63" cy="25.4" r="2.35" fill="#0f172a" stroke="rgba(255,255,255,0.2)" stroke-width="0.45"/>
        </svg>`,
    "happy-birthday-ulf": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="82" rx="34" ry="5" fill="#1a2440" />
            <rect x="22" y="55" width="56" height="22" rx="3" fill="#ff6fb3" stroke="rgba(255,255,255,0.18)" stroke-width="0.5" />
            <rect x="30" y="40" width="40" height="18" rx="3" fill="#ffd1f0" stroke="rgba(255,255,255,0.18)" stroke-width="0.5" />
            <rect x="38" y="28" width="24" height="14" rx="3" fill="#ffd76a" stroke="rgba(255,255,255,0.18)" stroke-width="0.5" />
            <rect x="44" y="14" width="3" height="14" fill="#cf2a6c" />
            <rect x="53" y="14" width="3" height="14" fill="#cf2a6c" />
            <ellipse cx="45.5" cy="11" rx="2.5" ry="4" fill="#ffd24a" style="filter: drop-shadow(0 0 4px #ffaa00);" />
            <ellipse cx="54.5" cy="11" rx="2.5" ry="4" fill="#ffd24a" style="filter: drop-shadow(0 0 4px #ffaa00);" />
            <circle cx="15" cy="20" r="1.5" fill="#00d2ff" />
            <circle cx="85" cy="22" r="1.5" fill="#ff3ed1" />
            <circle cx="12" cy="50" r="1.2" fill="#ffcc00" />
            <circle cx="88" cy="55" r="1.2" fill="#9d50bb" />
        </svg>`,
    "galtonboard": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="14" r="3" fill="#ff9f3b" />
            <circle cx="40" cy="27" r="2.4" fill="#9de8ff" />
            <circle cx="60" cy="27" r="2.4" fill="#9de8ff" />
            <circle cx="30" cy="40" r="2.2" fill="#9de8ff" />
            <circle cx="50" cy="40" r="2.2" fill="#9de8ff" />
            <circle cx="70" cy="40" r="2.2" fill="#9de8ff" />
            <rect x="22" y="55" width="12" height="22" fill="rgba(255,159,59,0.85)" />
            <rect x="38" y="49" width="12" height="28" fill="rgba(255,159,59,0.9)" />
            <rect x="54" y="43" width="12" height="34" fill="rgba(255,159,59,0.95)" />
            <rect x="70" y="51" width="12" height="26" fill="rgba(255,159,59,0.9)" />
            <line x1="18" y1="77" x2="84" y2="77" stroke="rgba(190,235,255,0.8)" stroke-width="1" />
        </svg>`,
    "atomorbitale": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="orbLobeCy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#b8f8ff"/><stop offset="55%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#0e7490"/>
                </linearGradient>
                <linearGradient id="orbLobeAu" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/>
                </linearGradient>
            </defs>
            <g>
                <ellipse cx="50" cy="27" rx="9.5" ry="25" fill="url(#orbLobeCy)" stroke="rgba(255,255,255,0.35)" stroke-width="0.65"
                    transform="rotate(0 50 50)"/>
                <ellipse cx="50" cy="27" rx="9.5" ry="25" fill="url(#orbLobeAu)" stroke="rgba(255,255,255,0.35)" stroke-width="0.65"
                    transform="rotate(60 50 50)"/>
                <ellipse cx="50" cy="27" rx="9.5" ry="25" fill="url(#orbLobeCy)" stroke="rgba(255,255,255,0.35)" stroke-width="0.65"
                    transform="rotate(120 50 50)"/>
                <ellipse cx="50" cy="27" rx="9.5" ry="25" fill="url(#orbLobeAu)" stroke="rgba(255,255,255,0.35)" stroke-width="0.65"
                    transform="rotate(180 50 50)"/>
                <ellipse cx="50" cy="27" rx="9.5" ry="25" fill="url(#orbLobeCy)" stroke="rgba(255,255,255,0.35)" stroke-width="0.65"
                    transform="rotate(240 50 50)"/>
                <ellipse cx="50" cy="27" rx="9.5" ry="25" fill="url(#orbLobeAu)" stroke="rgba(255,255,255,0.35)" stroke-width="0.65"
                    transform="rotate(300 50 50)"/>
            </g>
            <circle cx="50" cy="50" r="4.2" fill="none" stroke="#7eedff" stroke-width="1.1"
                style="filter: drop-shadow(0 0 5px rgba(126,237,255,0.75));"/>
        </svg>`,
    "opti-lens": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="optLensGlassGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stop-color="#2a5f68"/><stop offset="42%" stop-color="#9fe8f0"/><stop offset="58%" stop-color="#b8f5fb"/><stop offset="100%" stop-color="#2a5f68"/>
                </linearGradient>
            </defs>
            <!-- Zerstreuungslinse: parallel einfallend von links → divergieren rechts (virtueller Brennpunkt links der Linse) -->
            <line x1="8" y1="34" x2="43.88" y2="34" stroke="#89ecff" stroke-width="1.35" stroke-linecap="round"/>
            <line x1="8" y1="50" x2="44.5" y2="50" stroke="#89ecff" stroke-width="1.35" stroke-linecap="round"/>
            <line x1="8" y1="66" x2="43.88" y2="66" stroke="#89ecff" stroke-width="1.35" stroke-linecap="round"/>
            <path d="M 42 18 L 58 18 Q 53 50 58 82 L 42 82 Q 47 50 42 18 Z"
                fill="url(#optLensGlassGrad)" fill-opacity="0.88" stroke="#5ee9ff" stroke-width="1.2" stroke-linejoin="round"/>
            <line x1="56.12" y1="34" x2="94" y2="17" stroke="#42b4ff" stroke-width="1.35" stroke-linecap="round"/>
            <line x1="55.5" y1="50" x2="94" y2="50" stroke="#42b4ff" stroke-width="1.35" stroke-linecap="round"/>
            <line x1="56.12" y1="66" x2="94" y2="83" stroke="#42b4ff" stroke-width="1.35" stroke-linecap="round"/>
            <circle cx="11" cy="50" r="3.6" fill="#facc15" stroke="rgba(255,237,160,0.65)" stroke-width="0.7"
                style="filter: drop-shadow(0 0 6px rgba(250,204,21,0.95));"/>
        </svg>`,
    "cool-squares": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="40" height="40" fill="rgba(0, 210, 255, 0.15)" stroke="var(--neon-blue)" stroke-width="1.5" />
            <rect x="55" y="15" width="30" height="30" fill="#84cc16" stroke="#84cc16" stroke-width="1.5" />
            <rect x="45" y="45" width="10" height="10" fill="#ffcc00" stroke="#ffcc00" stroke-width="1.5" />
            <path d="M 55 45 L 55 55 L 45 55" fill="none" stroke="#9d50bb" stroke-width="2" />
        </svg>`,
    "fibonacci": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="35" width="40" height="40" fill="rgba(255, 157, 0, 0.15)" stroke="#ff9d00" stroke-width="1.5" />
            <rect x="55" y="35" width="25" height="25" fill="rgba(255, 157, 0, 0.1)" stroke="#ff9d00" stroke-width="1.2" />
            <path d="M 15 75 A 40 40 0 0 1 55 35 A 25 25 0 0 1 80 60" fill="none" stroke="rgb(0, 0, 40)" stroke-width="2.5" />
        </svg>`,
    "mandelbrot-deep": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="mbDeepFill" x1="0%" y1="40%" x2="100%" y2="60%">
                    <stop offset="0%" stop-color="#6b21a8"/>
                    <stop offset="55%" stop-color="#00d2ff"/>
                    <stop offset="100%" stop-color="#fbbf24"/>
                </linearGradient>
            </defs>
            <line x1="10" y1="50" x2="94" y2="50" stroke="#64748b" stroke-width="0.85" opacity="0.45"/>
            <line x1="50" y1="10" x2="50" y2="90" stroke="#64748b" stroke-width="0.85" opacity="0.45"/>
            <circle cx="16" cy="50" r="8.5" fill="url(#mbDeepFill)" fill-opacity="0.38" stroke="#adff2f" stroke-width="1.15"/>
            <path fill="url(#mbDeepFill)" fill-opacity="0.45" stroke="#00d2ff" stroke-width="1.35" stroke-linejoin="round"
                d="M 58.50,50.00 L 58.82,49.93 L 59.70,49.45 L 60.88,48.22 L 62.02,46.06 L 62.70,42.98 L 62.52,39.16 L 61.17,35.00 L 58.50,31.00 L 54.54,27.73 L 49.50,25.73 L 43.81,25.43 L 37.98,27.06 L 32.61,30.67 L 28.28,36.01 L 25.47,42.66 L 24.50,50.00 L 25.47,57.34 L 28.28,63.99 L 32.61,69.33 L 37.98,72.94 L 43.81,74.57 L 49.50,74.27 L 54.54,72.27 L 58.50,69.00 L 61.17,65.00 L 62.52,60.84 L 62.70,57.02 L 62.02,53.94 L 60.88,51.78 L 59.70,50.55 L 58.82,50.07 Z"/>
            <circle cx="50" cy="50" r="2.6" fill="#050b18" stroke="#e2e8f0" stroke-width="0.85"/>
        </svg>`,
    "fermatpunkt": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,20 20,70 80,70" fill="rgba(0, 210, 255, 0.1)" stroke="var(--neon-blue)" stroke-width="1.5" />
            <line x1="50" y1="53" x2="50" y2="20" stroke="var(--neon-purple)" stroke-width="1.5" stroke-dasharray="2 2" />
            <line x1="50" y1="53" x2="20" y2="70" stroke="var(--neon-purple)" stroke-width="1.5" stroke-dasharray="2 2" />
            <line x1="50" y1="53" x2="80" y2="70" stroke="var(--neon-purple)" stroke-width="1.5" stroke-dasharray="2 2" />
            <circle cx="50" cy="53" r="3" fill="var(--neon-purple)" />
        </svg>`,
    "gleichungssysteme": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="80" x2="80" y2="20" stroke="var(--neon-blue)" stroke-width="2.5" />
            <line x1="20" y1="30" x2="80" y2="70" stroke="var(--neon-orange)" stroke-width="2.5" />
            <circle cx="50" cy="50" r="4.5" fill="var(--neon-green)" style="filter: drop-shadow(0 0 5px var(--neon-green));" />
        </svg>`,
    "imaginarynumbers": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="50" x2="92" y2="50" stroke="var(--neon-blue)" stroke-width="1.35" opacity="0.88"/>
            <line x1="50" y1="8" x2="50" y2="92" stroke="var(--neon-purple)" stroke-width="1.35" opacity="0.88"/>
            <circle cx="64" cy="36" r="6" fill="rgba(0,210,255,0.2)" stroke="var(--neon-blue)" stroke-width="1.4"/>
            <text x="73" y="30" font-family="'Orbitron',sans-serif" font-size="13" fill="var(--neon-blue)" opacity="0.95">i</text>
        </svg>`,
    "solita": "✨",
    "tour-mission-control": "👀",
    "gameoflife": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(121, 158, 49, 0.08)" stroke="#799E31" stroke-width="2" />
            <g fill="#799E31">
                <rect x="42" y="24" width="12" height="12" rx="2" />
                <rect x="56" y="38" width="12" height="12" rx="2" />
                <rect x="28" y="52" width="12" height="12" rx="2" />
                <rect x="42" y="52" width="12" height="12" rx="2" />
                <rect x="56" y="52" width="12" height="12" rx="2" />
            </g>
            <g fill="rgba(121, 158, 49, 0.25)">
                <rect x="28" y="24" width="12" height="12" rx="2" />
                <rect x="70" y="66" width="12" height="12" rx="2" />
            </g>
        </svg>`,
    "burningship": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(255, 140, 0, 0.08)" stroke="#ff8c00" stroke-width="2" />
            <path d="M 26 74 L 42 74 L 42 46 L 50 60 L 54 38 L 60 54 L 66 30 L 74 74 Z"
                  fill="rgba(255, 140, 0, 0.25)" stroke="#ff8c00" stroke-width="2" stroke-linejoin="round" />
            <line x1="22" y1="74" x2="78" y2="74" stroke="#ff8c00" stroke-width="2.5" stroke-linecap="round" />
        </svg>`,
    "reaction-diffusion": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(186, 85, 255, 0.08)" stroke="#ba55ff" stroke-width="2" />
            <path d="M 24 34 Q 38 22 50 34 T 76 34" fill="none" stroke="#ba55ff" stroke-width="4" stroke-linecap="round" />
            <path d="M 24 50 Q 38 62 50 50 T 76 50" fill="none" stroke="#ba55ff" stroke-width="4" stroke-linecap="round" />
            <path d="M 24 66 Q 38 54 50 66 T 76 66" fill="none" stroke="rgba(186, 85, 255, 0.45)" stroke-width="4" stroke-linecap="round" />
        </svg>`,
    "shell": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(121, 158, 49, 0.08)" stroke="#799e31" stroke-width="2" />
            <path d="M 24 36 L 42 36 L 47 26 L 53 26 L 58 36 L 76 36" fill="none" stroke="#799e31" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="22" y1="44" x2="78" y2="44" stroke="rgba(121, 158, 49, 0.55)" stroke-width="1.4" stroke-dasharray="3 3" />
            <path d="M 50 48 L 28 76" fill="none" stroke="#799e31" stroke-width="3" stroke-linecap="round" />
            <path d="M 50 48 L 72 76" fill="none" stroke="#799e31" stroke-width="3" stroke-linecap="round" />
            <path d="M 50 52 L 62 76 L 38 76 Z" fill="#799e31" opacity="0.28" />
        </svg>`,
    "conuslab": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(245, 194, 66, 0.08)" stroke="#f5c242" stroke-width="2" />
            <path d="M 24 32 L 34 44 L 44 32 L 54 44 L 64 32 L 74 44" fill="none" stroke="#f5c242" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M 34 52 L 44 68 L 24 68 Z" fill="#f5c242" opacity="0.75" />
            <path d="M 64 52 L 74 68 L 54 68 Z" fill="#f5c242" opacity="0.45" />
        </svg>`,
    "gravitation": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(0, 210, 255, 0.08)" stroke="#00d2ff" stroke-width="2" />
            <ellipse cx="50" cy="50" rx="28" ry="14" fill="none" stroke="rgba(0, 210, 255, 0.5)" stroke-width="1.6" transform="rotate(-18 50 50)" />
            <circle cx="50" cy="50" r="9" fill="#F5C242" />
            <circle cx="73" cy="38" r="4.5" fill="#00d2ff" />
        </svg>`,
    "glocken": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(255, 215, 0, 0.08)" stroke="#ffd700" stroke-width="2" />
            <path d="M 50 26 C 62 26 64 40 64 52 L 70 62 L 30 62 L 36 52 C 36 40 38 26 50 26 Z"
                  fill="rgba(255, 215, 0, 0.2)" stroke="#ffd700" stroke-width="2" stroke-linejoin="round" />
            <circle cx="50" cy="69" r="4.5" fill="#ffd700" />
        </svg>`,
    "langley": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(121, 158, 49, 0.08)" stroke="#799E31" stroke-width="2" />
            <path d="M 50 24 L 26 72 L 74 72 Z" fill="none" stroke="#799E31" stroke-width="2.5" stroke-linejoin="round" />
            <line x1="26" y1="72" x2="61" y2="46" stroke="rgba(121, 158, 49, 0.6)" stroke-width="1.8" />
            <line x1="74" y1="72" x2="39" y2="46" stroke="rgba(121, 158, 49, 0.6)" stroke-width="1.8" />
            <path d="M 34 72 A 8 8 0 0 0 32.5 67.5" fill="none" stroke="#F5C242" stroke-width="2" />
            <text x="40" y="68" font-family="Orbitron, sans-serif" font-size="10" fill="#F5C242">?</text>
        </svg>`,
    "batman": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(0, 210, 255, 0.08)" stroke="#00d2ff" stroke-width="2" />
            <path d="M 22 52 Q 30 40 38 46 Q 42 38 46 44 L 48 40 L 50 46 L 52 40 L 54 44 Q 58 38 62 46 Q 70 40 78 52 Q 66 50 62 58 Q 56 52 50 62 Q 44 52 38 58 Q 34 50 22 52 Z"
                  fill="rgba(0, 210, 255, 0.3)" stroke="#00d2ff" stroke-width="1.8" stroke-linejoin="round" />
        </svg>`,
    "worldclock": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(0, 210, 255, 0.08)" stroke="#00d2ff" stroke-width="2" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="#00d2ff" stroke-width="2" />
            <ellipse cx="50" cy="50" rx="11" ry="26" fill="none" stroke="rgba(0, 210, 255, 0.5)" stroke-width="1.4" />
            <line x1="24" y1="50" x2="76" y2="50" stroke="rgba(0, 210, 255, 0.5)" stroke-width="1.4" />
            <line x1="50" y1="50" x2="50" y2="34" stroke="#F5C242" stroke-width="2.5" stroke-linecap="round" />
            <line x1="50" y1="50" x2="61" y2="56" stroke="#F5C242" stroke-width="2.5" stroke-linecap="round" />
        </svg>`,
    "costablanca": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(245, 194, 66, 0.08)" stroke="#F5C242" stroke-width="2" />
            <circle cx="38" cy="38" r="10" fill="rgba(245, 194, 66, 0.25)" stroke="#F5C242" stroke-width="2" />
            <path d="M 38 22 v -5 M 38 54 v 5 M 22 38 h -4 M 54 38 h 4 M 27 27 l -3 -3 M 49 49 l 3 3 M 49 27 l 3 -3 M 27 49 l -3 3"
                  stroke="#F5C242" stroke-width="2" stroke-linecap="round" />
            <path d="M 20 70 Q 27 63 34 70 T 48 70 T 62 70 T 76 70" fill="none"
                  stroke="#00d2ff" stroke-width="2.5" stroke-linecap="round" />
            <path d="M 56 34 l 7 8 l 14 -16" fill="none" stroke="#799E31" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`,
    "tracker": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(121, 158, 49, 0.08)" stroke="#799E31" stroke-width="2" />
            <path d="M 24 72 Q 36 58 34 46 Q 33 36 44 38 Q 56 40 54 52 Q 52 62 64 58" fill="none"
                  stroke="rgba(121, 158, 49, 0.6)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" />
            <path d="M 66 26 C 74 26 79 32 79 39 C 79 48 66 58 66 58 C 66 58 53 48 53 39 C 53 32 58 26 66 26 Z"
                  fill="rgba(121, 158, 49, 0.25)" stroke="#799E31" stroke-width="2" />
            <circle cx="66" cy="39" r="4.5" fill="#799E31" />
        </svg>`,
    "kaimbo": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(245, 194, 66, 0.08)" stroke="#F5C242" stroke-width="2" />
            <path d="M 24 30 h 32 a 6 6 0 0 1 6 6 v 14 a 6 6 0 0 1 -6 6 h -18 l -8 8 v -8 h -6 a 6 6 0 0 1 -6 -6 v -14 a 6 6 0 0 1 6 -6 Z"
                  fill="rgba(245, 194, 66, 0.15)" stroke="#F5C242" stroke-width="2" stroke-linejoin="round" />
            <text x="40" y="49" text-anchor="middle" font-family="Orbitron, sans-serif" font-weight="700" font-size="14" fill="#F5C242">A</text>
            <path d="M 46 52 h 26 a 5 5 0 0 1 5 5 v 10 a 5 5 0 0 1 -5 5 h -4 v 7 l -7 -7 h -15 a 5 5 0 0 1 -5 -5 v -10 a 5 5 0 0 1 5 -5 Z"
                  fill="rgba(0, 210, 255, 0.12)" stroke="#00d2ff" stroke-width="2" stroke-linejoin="round" />
            <text x="60" y="67" text-anchor="middle" font-family="Orbitron, sans-serif" font-weight="700" font-size="12" fill="#00d2ff">文</text>
        </svg>`,
    "pagode": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(245, 194, 66, 0.08)" stroke="#F5C242" stroke-width="2" />
            <path d="M 22 62 L 26 52 Q 28 48 34 47 L 42 40 Q 45 38 52 38 L 62 38 Q 68 39 71 47 L 78 52 L 78 62 Z"
                  fill="rgba(245, 194, 66, 0.2)" stroke="#F5C242" stroke-width="2" stroke-linejoin="round" />
            <circle cx="35" cy="63" r="6" fill="rgba(8,20,42,0.8)" stroke="#F5C242" stroke-width="2" />
            <circle cx="66" cy="63" r="6" fill="rgba(8,20,42,0.8)" stroke="#F5C242" stroke-width="2" />
            <path d="M 60 24 q 5 5 0 10 M 66 20 q 8 9 0 18" fill="none" stroke="#00d2ff" stroke-width="2" stroke-linecap="round" />
        </svg>`,
    "voicerecorder": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(255, 140, 0, 0.08)" stroke="#ff8c00" stroke-width="2" />
            <rect x="42" y="24" width="16" height="30" rx="8" fill="rgba(255, 140, 0, 0.25)" stroke="#ff8c00" stroke-width="2" />
            <path d="M 34 46 a 16 16 0 0 0 32 0" fill="none" stroke="#ff8c00" stroke-width="2.5" stroke-linecap="round" />
            <line x1="50" y1="62" x2="50" y2="70" stroke="#ff8c00" stroke-width="2.5" stroke-linecap="round" />
            <g stroke="rgba(255, 140, 0, 0.6)" stroke-width="2" stroke-linecap="round">
                <line x1="24" y1="72" x2="24" y2="78" /><line x1="31" y1="68" x2="31" y2="78" />
                <line x1="66" y1="70" x2="66" y2="78" /><line x1="73" y1="74" x2="73" y2="78" />
                <line x1="80" y1="71" x2="80" y2="78" />
            </g>
        </svg>`,
    "mathtrainer": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="14" width="72" height="72" rx="10" fill="rgba(0, 210, 255, 0.08)" stroke="#00d2ff" stroke-width="2" />
            <rect x="26" y="24" width="48" height="52" rx="6" fill="rgba(0, 210, 255, 0.1)" stroke="#00d2ff" stroke-width="1.8" />
            <text x="50" y="45" text-anchor="middle" font-family="Orbitron, sans-serif" font-weight="700" font-size="16" fill="#00d2ff">+×</text>
            <path d="M 36 60 l 7 7 l 14 -14" fill="none" stroke="#799E31" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`,
    "pinkerfinder": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the real app icon (Doc: "das richtige Logo!"), not a redrawn one; hubs sit at the site root -->
            <!-- the PNG carries its own margin inside the rounded square, so it needs more of the
                 box than the drawn icons to look the same size (Doc: "'n tick größer") -->
            <image href="pinkerfinder/icon.png" x="4" y="4" width="92" height="92" />
        </svg>`,
    "docpad": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the calculator case with its stripe on top -->
            <rect x="24" y="8" width="52" height="84" rx="8" fill="rgba(0, 210, 255, 0.08)" stroke="#00D2FF" stroke-width="2" />
            <line x1="31" y1="14.5" x2="69" y2="14.5" stroke="#00D2FF" stroke-width="1.6" stroke-linecap="round" opacity="0.7" />
            <!-- the display: axes and a parabola -->
            <rect x="31" y="20" width="38" height="32" rx="3" fill="rgba(0, 210, 255, 0.12)" stroke="#00D2FF" stroke-width="1.4" />
            <g stroke="rgba(0, 210, 255, 0.55)" stroke-width="1">
                <line x1="33" y1="40" x2="67" y2="40" /><line x1="50" y1="22" x2="50" y2="50" />
            </g>
            <path d="M 36 24 Q 50 60 64 24" fill="none" stroke="#F5C242" stroke-width="2.2" stroke-linecap="round" />
            <!-- the keys, EXE in green -->
            <g fill="rgba(0, 210, 255, 0.35)">
                <rect x="31" y="58" width="8" height="5" rx="1.5" /><rect x="41" y="58" width="8" height="5" rx="1.5" /><rect x="51" y="58" width="8" height="5" rx="1.5" /><rect x="61" y="58" width="8" height="5" rx="1.5" />
                <rect x="31" y="66" width="8" height="5" rx="1.5" /><rect x="41" y="66" width="8" height="5" rx="1.5" /><rect x="51" y="66" width="8" height="5" rx="1.5" /><rect x="61" y="66" width="8" height="5" rx="1.5" />
                <rect x="31" y="74" width="8" height="5" rx="1.5" /><rect x="41" y="74" width="8" height="5" rx="1.5" /><rect x="51" y="74" width="8" height="5" rx="1.5" /><rect x="61" y="74" width="8" height="5" rx="1.5" />
                <rect x="31" y="82" width="8" height="5" rx="1.5" /><rect x="41" y="82" width="8" height="5" rx="1.5" /><rect x="51" y="82" width="8" height="5" rx="1.5" />
            </g>
            <rect x="61" y="82" width="8" height="5" rx="1.5" fill="rgb(121, 158, 49)" />
        </svg>`,
    "winkelpuzzle": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- three lines through one point: the given angle (blue), its vertical angle (red), a supplementary one (yellow) -->
            <line x1="10" y1="72" x2="90" y2="28" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2" stroke-linecap="round" />
            <line x1="18" y1="21" x2="82" y2="79" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2" stroke-linecap="round" />
            <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.6" stroke-linecap="round" />
            <path d="M64 42.3 A16 16 0 0 1 61.9 60.7" fill="none" stroke="#00D2FF" stroke-width="3" stroke-linecap="round" />
            <path d="M36 57.7 A16 16 0 0 1 38.1 39.3" fill="none" stroke="#D73728" stroke-width="3" stroke-linecap="round" />
            <path d="M61.9 60.7 A16 16 0 0 1 50 66" fill="none" stroke="#F5C242" stroke-width="2.2" stroke-linecap="round" />
            <circle cx="50" cy="50" r="2.6" fill="#ffffff" />
        </svg>`,
    "coordinatensystemtester": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the bare grid with axes; f(x) = -x^2 in gold, g(x) = x^-2 in cyan with its gap at the pole -->
            <g stroke="rgba(255, 255, 255, 0.12)" stroke-width="1">
                <line x1="20" y1="6" x2="20" y2="94" /><line x1="35" y1="6" x2="35" y2="94" /><line x1="65" y1="6" x2="65" y2="94" /><line x1="80" y1="6" x2="80" y2="94" />
                <line x1="6" y1="20" x2="94" y2="20" /><line x1="6" y1="35" x2="94" y2="35" /><line x1="6" y1="65" x2="94" y2="65" /><line x1="6" y1="80" x2="94" y2="80" />
            </g>
            <line x1="6" y1="50" x2="94" y2="50" stroke="rgba(255, 255, 255, 0.75)" stroke-width="1.6" />
            <line x1="50" y1="94" x2="50" y2="6" stroke="rgba(255, 255, 255, 0.75)" stroke-width="1.6" />
            <path d="M90 47 L94 50 L90 53" fill="none" stroke="rgba(255, 255, 255, 0.75)" stroke-width="1.6" />
            <path d="M47 10 L50 6 L53 10" fill="none" stroke="rgba(255, 255, 255, 0.75)" stroke-width="1.6" />
            <path d="M26 86 Q50 14 74 86" fill="none" stroke="#F5C242" stroke-width="2.4" stroke-linecap="round" />
            <path d="M94 47 C70 47 60 40 56 10" fill="none" stroke="#00D2FF" stroke-width="2.2" stroke-linecap="round" />
            <path d="M6 47 C30 47 40 40 44 10" fill="none" stroke="#00D2FF" stroke-width="2.2" stroke-linecap="round" />
        </svg>`,
    "ann": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- two inputs, one hidden layer of three, one output: the little net that learns to calculate -->
            <g stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.5">
                <line x1="18" y1="36" x2="50" y2="22" /><line x1="18" y1="36" x2="50" y2="50" /><line x1="18" y1="36" x2="50" y2="78" />
                <line x1="18" y1="64" x2="50" y2="22" /><line x1="18" y1="64" x2="50" y2="50" /><line x1="18" y1="64" x2="50" y2="78" />
                <line x1="50" y1="22" x2="82" y2="50" /><line x1="50" y1="50" x2="82" y2="50" /><line x1="50" y1="78" x2="82" y2="50" />
            </g>
            <circle cx="18" cy="36" r="6" fill="rgba(121, 158, 49, 0.4)" stroke="#799E31" stroke-width="1.8" />
            <circle cx="18" cy="64" r="6" fill="rgba(80, 170, 255, 0.4)" stroke="#50AAFF" stroke-width="1.8" />
            <circle cx="50" cy="22" r="6" fill="rgba(0, 210, 255, 0.25)" stroke="#00D2FF" stroke-width="1.8" />
            <circle cx="50" cy="50" r="6" fill="rgba(0, 210, 255, 0.25)" stroke="#00D2FF" stroke-width="1.8" />
            <circle cx="50" cy="78" r="6" fill="rgba(0, 210, 255, 0.25)" stroke="#00D2FF" stroke-width="1.8" />
            <circle cx="82" cy="50" r="7.5" fill="rgba(245, 194, 66, 0.35)" stroke="#F5C242" stroke-width="2" />
        </svg>`,
    "numberrecognition": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a 5x7 pixel digit "3" as the net sees it; the tall gold bar is the class it picks -->
            <g fill="rgba(255, 255, 255, 0.08)">
                <rect x="14" y="14" width="9" height="9" /><rect x="24" y="14" width="9" height="9" /><rect x="34" y="14" width="9" height="9" /><rect x="44" y="14" width="9" height="9" /><rect x="54" y="14" width="9" height="9" />
                <rect x="14" y="24" width="9" height="9" /><rect x="24" y="24" width="9" height="9" /><rect x="34" y="24" width="9" height="9" /><rect x="44" y="24" width="9" height="9" /><rect x="54" y="24" width="9" height="9" />
                <rect x="14" y="34" width="9" height="9" /><rect x="24" y="34" width="9" height="9" /><rect x="34" y="34" width="9" height="9" /><rect x="44" y="34" width="9" height="9" /><rect x="54" y="34" width="9" height="9" />
                <rect x="14" y="44" width="9" height="9" /><rect x="24" y="44" width="9" height="9" /><rect x="34" y="44" width="9" height="9" /><rect x="44" y="44" width="9" height="9" /><rect x="54" y="44" width="9" height="9" />
                <rect x="14" y="54" width="9" height="9" /><rect x="24" y="54" width="9" height="9" /><rect x="34" y="54" width="9" height="9" /><rect x="44" y="54" width="9" height="9" /><rect x="54" y="54" width="9" height="9" />
                <rect x="14" y="64" width="9" height="9" /><rect x="24" y="64" width="9" height="9" /><rect x="34" y="64" width="9" height="9" /><rect x="44" y="64" width="9" height="9" /><rect x="54" y="64" width="9" height="9" />
                <rect x="14" y="74" width="9" height="9" /><rect x="24" y="74" width="9" height="9" /><rect x="34" y="74" width="9" height="9" /><rect x="44" y="74" width="9" height="9" /><rect x="54" y="74" width="9" height="9" />
            </g>
            <g fill="#F5C242">
                <rect x="14" y="14" width="9" height="9" /><rect x="24" y="14" width="9" height="9" /><rect x="34" y="14" width="9" height="9" /><rect x="44" y="14" width="9" height="9" />
                <rect x="54" y="24" width="9" height="9" /><rect x="54" y="34" width="9" height="9" />
                <rect x="24" y="44" width="9" height="9" /><rect x="34" y="44" width="9" height="9" /><rect x="44" y="44" width="9" height="9" />
                <rect x="54" y="54" width="9" height="9" /><rect x="54" y="64" width="9" height="9" />
                <rect x="14" y="74" width="9" height="9" /><rect x="24" y="74" width="9" height="9" /><rect x="34" y="74" width="9" height="9" /><rect x="44" y="74" width="9" height="9" />
            </g>
            <g>
                <rect x="72" y="76" width="6" height="7" fill="rgba(157, 232, 255, 0.5)" />
                <rect x="80" y="30" width="6" height="53" fill="#F5C242" />
                <rect x="88" y="71" width="6" height="12" fill="rgba(157, 232, 255, 0.5)" />
            </g>
        </svg>`,
    "fallingpi": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the unit square, the quarter circle in it, darts inside (green) and outside (red) -->
            <rect x="18" y="18" width="64" height="64" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1.8" />
            <path d="M18 18 A64 64 0 0 1 82 82" fill="rgba(245, 194, 66, 0.1)" stroke="#F5C242" stroke-width="2.2" />
            <g fill="#799E31">
                <circle cx="30" cy="60" r="3" /><circle cx="45" cy="70" r="3" /><circle cx="28" cy="40" r="3" /><circle cx="55" cy="50" r="3" /><circle cx="40" cy="30" r="3" /><circle cx="65" cy="65" r="3" /><circle cx="36" cy="76" r="3" /><circle cx="26" cy="26" r="3" />
            </g>
            <g fill="#D73728">
                <circle cx="70" cy="25" r="3" /><circle cx="60" cy="30" r="3" /><circle cx="76" cy="44" r="3" /><circle cx="52" cy="22" r="3" />
            </g>
        </svg>`,
    "infektionssimulation": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a grid of people: healthy green, infected red in the middle, recovered grey; the curve below with its peak -->
            <g>
                <circle cx="20" cy="16" r="4" fill="#799E31" /><circle cx="32" cy="16" r="4" fill="#799E31" /><circle cx="44" cy="16" r="4" fill="#799E31" /><circle cx="56" cy="16" r="4" fill="#799E31" /><circle cx="68" cy="16" r="4" fill="#799E31" /><circle cx="80" cy="16" r="4" fill="#799E31" />
                <circle cx="20" cy="28" r="4" fill="#799E31" /><circle cx="32" cy="28" r="4" fill="#799E31" /><circle cx="44" cy="28" r="4" fill="#D73728" /><circle cx="56" cy="28" r="4" fill="#D73728" /><circle cx="68" cy="28" r="4" fill="#799E31" /><circle cx="80" cy="28" r="4" fill="#799E31" />
                <circle cx="20" cy="40" r="4" fill="#799E31" /><circle cx="32" cy="40" r="4" fill="#D73728" /><circle cx="44" cy="40" r="4" fill="rgba(255, 255, 255, 0.35)" /><circle cx="56" cy="40" r="4" fill="rgba(255, 255, 255, 0.35)" /><circle cx="68" cy="40" r="4" fill="#D73728" /><circle cx="80" cy="40" r="4" fill="#799E31" />
                <circle cx="20" cy="52" r="4" fill="#799E31" /><circle cx="32" cy="52" r="4" fill="#799E31" /><circle cx="44" cy="52" r="4" fill="#D73728" /><circle cx="56" cy="52" r="4" fill="#D73728" /><circle cx="68" cy="52" r="4" fill="#799E31" /><circle cx="80" cy="52" r="4" fill="#799E31" />
            </g>
            <line x1="14" y1="90" x2="86" y2="90" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1" />
            <path d="M14 90 C30 88 38 66 48 66 C58 66 66 88 86 90" fill="rgba(215, 55, 40, 0.18)" stroke="#D73728" stroke-width="2" stroke-linecap="round" />
            <line x1="48" y1="62" x2="48" y2="70" stroke="#F5C242" stroke-width="1.6" stroke-linecap="round" />
        </svg>`,
    "particleswarm": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- contour lines of the landscape, the swarm (cyan) on its way, the best spot found so far (gold) -->
            <g fill="none" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1.2">
                <ellipse cx="60" cy="60" rx="34" ry="28" transform="rotate(-20 60 60)" />
                <ellipse cx="60" cy="60" rx="22" ry="17" transform="rotate(-20 60 60)" />
                <ellipse cx="60" cy="60" rx="10" ry="7" transform="rotate(-20 60 60)" />
            </g>
            <g stroke="#00D2FF" stroke-width="1.4" stroke-linecap="round">
                <line x1="16" y1="22" x2="24" y2="28" /><line x1="30" y1="14" x2="36" y2="22" /><line x1="14" y1="48" x2="23" y2="50" />
                <line x1="82" y1="18" x2="76" y2="26" /><line x1="28" y1="80" x2="35" y2="74" /><line x1="86" y1="86" x2="80" y2="80" />
            </g>
            <g fill="#00D2FF">
                <circle cx="16" cy="22" r="3" /><circle cx="30" cy="14" r="3" /><circle cx="14" cy="48" r="3" /><circle cx="82" cy="18" r="3" /><circle cx="28" cy="80" r="3" /><circle cx="86" cy="86" r="3" /><circle cx="46" cy="40" r="3" /><circle cx="70" cy="74" r="3" />
            </g>
            <circle cx="60" cy="60" r="4.5" fill="#F5C242" />
        </svg>`,
    "fuzzy": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- lines of text; the hit glows red in the middle and fades to pink and white towards its edges -->
            <g fill="rgba(255, 255, 255, 0.28)">
                <rect x="12" y="20" width="22" height="7" rx="2" /><rect x="38" y="20" width="14" height="7" rx="2" /><rect x="56" y="20" width="32" height="7" rx="2" />
                <rect x="12" y="66" width="30" height="7" rx="2" /><rect x="46" y="66" width="18" height="7" rx="2" /><rect x="68" y="66" width="20" height="7" rx="2" />
                <rect x="12" y="82" width="16" height="7" rx="2" /><rect x="32" y="82" width="36" height="7" rx="2" />
            </g>
            <rect x="12" y="43" width="14" height="7" rx="2" fill="rgba(255, 255, 255, 0.28)" />
            <rect x="30" y="39" width="42" height="15" rx="4" fill="rgba(255, 255, 255, 0.9)" />
            <rect x="36" y="39" width="30" height="15" rx="4" fill="rgba(255, 150, 150, 0.95)" />
            <rect x="43" y="39" width="16" height="15" rx="4" fill="#D73728" />
            <rect x="76" y="43" width="12" height="7" rx="2" fill="rgba(255, 255, 255, 0.28)" />
        </svg>`,
    "morph": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a wobbly hand-drawn stroke on the left becomes the typeset lambda on the right -->
            <path d="M14 30 C22 22 27 34 22 44 C18 54 26 66 30 54 C33 46 20 40 16 60 C14 70 26 72 30 62" fill="none" stroke="rgba(255, 255, 255, 0.75)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="42" y1="50" x2="58" y2="50" stroke="#00D2FF" stroke-width="2" stroke-linecap="round" />
            <path d="M54 45 L59 50 L54 55" fill="none" stroke="#00D2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <text x="78" y="68" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="50" fill="#F5C242">λ</text>
        </svg>`,
    "equationocr": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the board: a handwritten x squared on the left, the recognised one typeset on the right, the scan line between -->
            <rect x="6" y="22" width="88" height="56" rx="6" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.5)" stroke-width="1.6" />
            <path d="M16 42 C22 48 28 58 34 64 M34 42 C28 50 22 58 16 64" fill="none" stroke="rgba(255, 255, 255, 0.8)" stroke-width="2.6" stroke-linecap="round" />
            <path d="M36 40 C38 34 44 34 43 39 C42 42 38 43 37 45 L44 45" fill="none" stroke="rgba(255, 255, 255, 0.8)" stroke-width="1.8" stroke-linecap="round" />
            <line x1="50" y1="26" x2="50" y2="74" stroke="#00D2FF" stroke-width="1.6" stroke-dasharray="3 2.5" />
            <text x="66" y="63" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="30" fill="#F5C242">x</text>
            <text x="81" y="48" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="17" fill="#F5C242">2</text>
        </svg>`,
    "handschrift": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a page: handwriting above, the transcribed lines below -->
            <rect x="20" y="8" width="60" height="84" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.55)" stroke-width="1.6" />
            <g fill="none" stroke="rgba(255, 255, 255, 0.8)" stroke-width="1.8" stroke-linecap="round">
                <path d="M28 24 C31 19 34 27 37 22 C40 17 43 26 46 22 C49 18 52 25 55 21 C58 18 61 24 64 21 L70 22" />
                <path d="M28 36 C32 31 35 38 39 34 C42 30 45 38 49 34 C52 31 55 37 58 33 L64 34" />
            </g>
            <line x1="26" y1="48" x2="74" y2="48" stroke="#00D2FF" stroke-width="1.2" stroke-dasharray="3 2.5" />
            <g fill="#799E31">
                <rect x="28" y="56" width="36" height="4.5" rx="1.5" /><rect x="28" y="65" width="44" height="4.5" rx="1.5" /><rect x="28" y="74" width="30" height="4.5" rx="1.5" /><rect x="28" y="83" width="40" height="4.5" rx="1.5" />
            </g>
        </svg>`,
    "collatz": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- one hailstone path: up and down, and at the end always 1 -->
            <line x1="8" y1="84" x2="92" y2="84" stroke="rgba(255, 255, 255, 0.3)" stroke-width="1" />
            <polyline points="10,70 18,52 24,62 32,34 38,46 46,22 52,36 58,50 64,42 70,58 78,66 86,84" fill="none" stroke="rgba(255, 255, 255, 0.75)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="46" cy="22" r="3.5" fill="#D73728" />
            <circle cx="32" cy="34" r="2.6" fill="#799E31" />
            <circle cx="64" cy="42" r="2.6" fill="#799E31" />
            <circle cx="86" cy="84" r="4" fill="#F5C242" />
            <text x="22" y="24" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#F5C242">3n+1</text>
        </svg>`,
    "hermanngitter": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the grid itself: dark tiles, light streets, and the grey ghosts at the crossings -->
            <rect x="10" y="10" width="84" height="84" rx="3" fill="rgba(255, 255, 255, 0.88)" />
            <g fill="rgb(8, 20, 42)">
                <rect x="14" y="14" width="20" height="20" /><rect x="42" y="14" width="20" height="20" /><rect x="70" y="14" width="20" height="20" />
                <rect x="14" y="42" width="20" height="20" /><rect x="42" y="42" width="20" height="20" /><rect x="70" y="42" width="20" height="20" />
                <rect x="14" y="70" width="20" height="20" /><rect x="42" y="70" width="20" height="20" /><rect x="70" y="70" width="20" height="20" />
            </g>
            <g fill="rgba(8, 20, 42, 0.32)">
                <circle cx="38" cy="38" r="3.6" /><circle cx="66" cy="38" r="3.6" /><circle cx="38" cy="66" r="3.6" /><circle cx="66" cy="66" r="3.6" />
            </g>
        </svg>`,
    "solita-avatar": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- a head that speaks: open mouth, the words leaving to the right -->
            <path d="M20 94 C20 78 32 70 50 70 C68 70 80 78 80 94" fill="rgba(245, 194, 66, 0.12)" stroke="#F5C242" stroke-width="1.8" />
            <circle cx="50" cy="42" r="24" fill="rgba(245, 194, 66, 0.08)" stroke="#F5C242" stroke-width="2" />
            <circle cx="41" cy="38" r="2.6" fill="#ffffff" /><circle cx="59" cy="38" r="2.6" fill="#ffffff" />
            <ellipse cx="50" cy="53" rx="6" ry="4" fill="#00D2FF" />
            <g fill="none" stroke="#00D2FF" stroke-width="1.8" stroke-linecap="round">
                <path d="M80 34 A12 12 0 0 1 80 50" /><path d="M86 28 A20 20 0 0 1 86 56" />
            </g>
        </svg>`,
    "stimmklon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- the microphone, and two voices beside it: Doc's (white) and the clone's (cyan) -->
            <rect x="40" y="10" width="20" height="36" rx="10" fill="rgba(245, 194, 66, 0.2)" stroke="#F5C242" stroke-width="2" />
            <path d="M32 40 C32 52 40 58 50 58 C60 58 68 52 68 40" fill="none" stroke="#F5C242" stroke-width="2" stroke-linecap="round" />
            <line x1="50" y1="58" x2="50" y2="68" stroke="#F5C242" stroke-width="2" stroke-linecap="round" />
            <line x1="40" y1="68" x2="60" y2="68" stroke="#F5C242" stroke-width="2" stroke-linecap="round" />
            <polyline points="6,82 12,74 18,90 24,70 30,88 36,78 42,84" fill="none" stroke="rgba(255, 255, 255, 0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <polyline points="58,84 64,76 70,90 76,72 82,88 88,78 94,82" fill="none" stroke="#00D2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`
};
