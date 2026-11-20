package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/** The three colour schemes: DocDo's keys, unknown keys fall back to Blau, and every text is readable on its ground. */
public class PaletteTest {
    @Test
    public void keysLikeDocDo() {
        assertEquals("dark", Palette.of("dark").key);
        assertEquals("grey", Palette.of("grey").key);
        assertEquals("light", Palette.of("light").key);
        assertEquals("dark", Palette.of(null).key);
        assertEquals("dark", Palette.of("blue").key);
        assertEquals(2, Palette.index("light"));
        assertEquals(0, Palette.index("nonsense"));
    }

    @Test
    public void blauStaysDocFitsNavy() {
        Palette p = Palette.of("dark");
        assertEquals(0xFF0A1428, p.bg);
        assertEquals(0xFF0E244E, p.card);
        assertEquals(0xFFF5C242, p.accent);
    }

    @Test
    public void greyCardsStandOutFromThePage() {
        // Doc, 20.11.2026: "Im Graumodus müsste sich der Hintergrund und die Cards noch ein bisschen mehr absetzen"
        Palette g = Palette.of("grey");
        assertEquals(0xFF131315, g.bg);
        assertEquals(0xFF2C2C30, g.card);
        assertTrue(contrast(g.card, g.bg) >= 1.3);                            // was 1.14 (#252528 on #1A1A1C)
        assertTrue(contrast(g.card, g.bg) > contrast(Palette.of("dark").card, Palette.of("dark").bg));
        assertEquals(g.bg, Palette.DOTS[Palette.index("grey")]);
    }

    @Test
    public void overMixesTowardsTheGround() {
        assertEquals(0xFFFFFFFF, Palette.over(0xFF000000, 0f, 0xFFFFFFFF));
        assertEquals(0xFF000000, Palette.over(0xFF000000, 1f, 0xFFFFFFFF));
        assertEquals(0xFF808080, Palette.over(0xFF000000, 0.5f, 0xFFFFFFFF));   // 127.5 rounds to 128
    }

    @Test
    public void textIsReadableInEveryScheme() {
        for (String k : Palette.KEYS) {
            Palette p = Palette.of(k);
            assertTrue(k + " text", contrast(p.text, p.card) >= 7);
            assertTrue(k + " muted", contrast(p.muted, p.card) >= 3);
            assertTrue(k + " accent", contrast(p.accent, p.card) >= 4.5);
            // the pills stand on the page in the card colour (since 20.11.2026): label, values, weight on the card
            assertTrue(k + " pill label", contrast(p.muted, p.card) >= 3);   // date, KÖRPERFETT, WHtR · GUT ...
            assertTrue(k + " pill value", contrast(p.text, p.card) >= 7);    // the tiles' values
            assertTrue(k + " weight", contrast(p.accent, p.card) >= 4.5);    // the weight in its pill, "+" for a girth
            // WHtR / WHR in the colour of their reading, 20sp Orbitron in a pill: good, increased, high
            assertTrue(k + " good", contrast(p.phi, p.card) >= 3);
            assertTrue(k + " increased", contrast(p.scoreMid, p.card) >= 3);
            assertTrue(k + " high", contrast(p.alarm, p.card) >= 3);
            // the stopwatch digits while ready are green (Doc, 20.11.2026), and "DocFit Start" above them
            assertTrue(k + " ready", contrast(p.phi, p.bg) >= 4.5);
            assertTrue(k + " running", contrast(p.alarm, p.bg) >= 4.5);   // the digits while the stopwatch runs
            assertTrue(k + " tab", contrast(p.chipOnInk, p.chipOn) >= 4.5);
            assertTrue(k + " stopp", contrast(p.onUpsilon, p.upsilon) >= 3);
            assertTrue(k + " start", contrast(p.onPhi, p.phi) >= 3);
        }
    }

    private static double contrast(int a, int b) {
        double la = luminance(a), lb = luminance(b);
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    }

    private static double luminance(int c) {
        double[] rgb = {(c >> 16) & 0xFF, (c >> 8) & 0xFF, c & 0xFF};
        for (int i = 0; i < 3; i++) {
            double v = rgb[i] / 255.0;
            rgb[i] = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
}
