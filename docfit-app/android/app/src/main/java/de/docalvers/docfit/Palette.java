package de.docalvers.docfit;

/**
 * Doc's three colour schemes, "wie immer" (Doc, 19.11.2026: "ein Gray-Design ... und auch ein helles"): the names,
 * keys and values of DocDo and the Stoffverteilungsplan (HTML/svp/svp-tokens.css, HTML/todo/index.html):
 * - "Blau" (key dark): DocFit's own navy, unchanged;
 * - "Grau" (key grey, html.svp-grey): neutral grey grounds, the accents as in Blau; page and cards one step further
 *   apart than in the svp (Doc, 20.11.2026: "Im Graumodus müsste sich der Hintergrund und die Cards noch ein bisschen
 *   mehr absetzen"): page #131315 instead of #1A1A1C, cards #2C2C30 instead of #252528 - contrast 1.33 instead of 1.14;
 * - "Hell" (key light, html.svp-light): white cards and dark text; orange as text would vanish on white, so lambda as
 *   text takes the svp blue (as in DocDo), the fills keep Doc's orange, softened like DocDo's pills (38 %).
 * The one place for DocFit's colours - the screen (MainActivity) takes every colour from here; the fasting page has
 * the same three in its CSS (web/fasting/fasting.css) and gets the key through DocFitApp.theme().
 */
final class Palette {
    static final String[] KEYS = {"dark", "grey", "light"};
    static final String[] NAMES = {"Blau", "Grau", "Hell"};
    /** the page colour of each scheme, for the dot next to its name */
    static final int[] DOTS = {0xFF0A1428, 0xFF131315, 0xFFF6F8FC};

    private static final int ORANGE = 0xFFF5C242, RED = 0xFFB02418, GREEN = 0xFF799E31;
    /** the svp's cyan (svp-tokens.css --cyan): rgb(90, 190, 230) on the dark grounds, rgb(28, 118, 158) on white */
    private static final int CYAN = 0xFF5ABEE6, CYAN_LIGHT = 0xFF1C769E;

    final String key;
    final boolean light;
    final int bg, card, text, muted;
    /** lambda as text and lines (title, links, states, the times in the list) */
    final int accent;
    final int phi, upsilon;
    /** the text on a phi (Start) or upsilon (Stopp) button */
    final int onPhi, onUpsilon;
    /** the chosen tab */
    final int chipOn, chipOnInk;
    /** the fitness bar from 1 to 10 (red, orange, green); Hell one step darker so the number stays readable on white */
    final int scoreLow, scoreMid, scoreHigh;
    /**
     * upsilon red as ink - a value in the "high" zone, an error, "Löschen": Doc's red is too dark on the navy and grey
     * grounds, so there a brighter red (#E5533F, contrast >= 4.5 on the page); Hell keeps Doc's red. Until 23.11.2026
     * also the running stopwatch (now runInk).
     */
    final int alarm;
    /**
     * the running stopwatch: its digits and "DocFit Stopp" above them. Red at first (Doc, 20.11.2026: "wir machen die
     * rot, wenn sie läuft"), cyan as a trial since Doc, 23.11.2026: "die Stoppuhr bitte mal in Cyan probieren" - the
     * svp's cyan, #5ABEE6 on Blau and Grau (contrast 8.7 / 8.8 on the page), the svp's darker light-scheme cyan #1C769E
     * on Hell (4.8 on the page). Back to red = alarm here; nothing else changes.
     */
    final int runInk;
    /**
     * the stopwatch digits while they read 00:00 (ready, or after Reset): green at first (Doc, 20.11.2026: "wenn das
     * Ding bereit ist, machen wir die Zahlen ... grün"), since Doc, 23.11.2026: "Wenn da steht 00:00, mach das bitte
     * fast weiß. Also im Dunkelmodus." - #F2F2F2 on Blau and Grau (contrast 16.4 / 16.6 on the page) - "Und im
     * Hell-Modus bitte Anthrazit." - #2F3236 on Hell (12.1 on the page). "DocFit Start" above them stays phi green.
     */
    final int idleInk;
    /**
     * the ends of the score as text on a card - "7 fit" in a weigh-in row (Doc, 23.11.2026: "in der entsprechenden
     * Farbe"): the bar's red, orange and green, each moved just enough for 4.5:1 on the card at every score - on Blau and
     * Grau a lighter red (#F06A55) and green (#7FA534), on Hell a darker orange (#946600) and green (#56731E)
     */
    private final int scoreInkLow, scoreInkMid, scoreInkHigh;
    /**
     * an icon that is not chosen (the tab bar): between muted and text - clearly readable, still visibly off (Doc,
     * 21.11.2026: the inactive icons "ein bisschen heller")
     */
    final int iconIdle;

    private Palette(String key, boolean light, int bg, int card, int text, int muted, int accent, int phi,
                    int onPhi, int onUpsilon, int chipOn, int chipOnInk) {
        this.key = key;
        this.light = light;
        this.bg = bg;
        this.card = card;
        this.text = text;
        this.muted = muted;
        this.accent = accent;
        this.phi = phi;
        this.upsilon = RED;
        this.onPhi = onPhi;
        this.onUpsilon = onUpsilon;
        this.chipOn = chipOn;
        this.chipOnInk = chipOnInk;
        this.scoreLow = RED;
        this.scoreMid = light ? 0xFFB07A00 : ORANGE;
        this.scoreHigh = light ? 0xFF5C7A20 : GREEN;
        this.alarm = light ? RED : 0xFFE5533F;
        this.runInk = light ? CYAN_LIGHT : CYAN;
        this.idleInk = light ? 0xFF2F3236 : 0xFFF2F2F2;
        this.scoreInkLow = light ? RED : 0xFFF06A55;
        this.scoreInkMid = light ? 0xFF946600 : ORANGE;
        this.scoreInkHigh = light ? 0xFF56731E : 0xFF7FA534;
        this.iconIdle = over(text, 0.45f, muted);
    }

    static Palette of(String key) {
        if ("light".equals(key)) {
            return new Palette("light", true, 0xFFF6F8FC, 0xFFFFFFFF, 0xFF182234, 0xFF60708C, 0xFF1E3C78, 0xFF5C7A20,
                    0xFFFFFFFF, 0xFFFFFFFF, over(ORANGE, 0.38f, 0xFFFFFFFF), 0xFF182234);
        }
        if ("grey".equals(key)) {
            // muted = rgba(212, 212, 216, .62) of svp-grey on its ground
            return new Palette("grey", false, 0xFF131315, 0xFF2C2C30, 0xFFD4D4D8, 0xFF8D8D90, ORANGE, GREEN,
                    0xFF131315, 0xFFD4D4D8, ORANGE, 0xFF131315);
        }
        return new Palette("dark", false, 0xFF0A1428, 0xFF0E244E, 0xFFEEEEEE, 0xFF8A93A6, ORANGE, GREEN,
                0xFF0A1428, 0xFFEEEEEE, ORANGE, 0xFF0A1428);
    }

    /** A fitness score 1..10 as text on a card, in its colour on the bar's scale (ScoreBar.colorFor), readable. */
    int scoreInk(int score) {
        return ScoreBar.colorFor(score, scoreInkLow, scoreInkMid, scoreInkHigh);
    }

    static int index(String key) {
        for (int i = 0; i < KEYS.length; i++) if (KEYS[i].equals(key)) return i;
        return 0;
    }

    /** colour c with alpha a laid over the opaque ground g */
    static int over(int c, float a, int g) {
        int r = 0xFF000000;
        for (int shift = 0; shift < 24; shift += 8) {
            int cc = (c >> shift) & 0xFF, gg = (g >> shift) & 0xFF;
            r |= Math.round(gg + (cc - gg) * a) << shift;
        }
        return r;
    }
}
