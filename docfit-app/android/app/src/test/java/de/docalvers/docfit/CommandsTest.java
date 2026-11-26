package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Arrays;
import java.util.List;

/**
 * The command rule against what the small German model really returned for silently generated samples (six macOS
 * German voices, see docfit-app/test/): "DocFit Start" starts, "DocFit Stopp" stops, plain "Stopp" only while the
 * stopwatch runs, plain "Start" only while it stands still (Doc, 26.11.2026); plain "DocFit" and the look-alikes do
 * nothing, and a phrase or word inside talk does nothing either (LoudnessMeter). Plus the stopwatch format.
 */
public class CommandsTest {
    private static Commands.Word w(String t, double conf, double s, double e) {
        return new Commands.Word(t, conf, s, e);
    }

    /** A recording of {@code seconds}: quiet room noise, loud "speech" in the given spans {from, to}. */
    private static LoudnessMeter audio(double seconds, double[]... speech) {
        LoudnessMeter m = new LoudnessMeter(10);
        short[] block = new short[LoudnessMeter.RATE / 10];
        long n = Math.round(seconds * LoudnessMeter.RATE);
        for (long i = 0; i < n; i += block.length) {
            for (int k = 0; k < block.length; k++) {
                double t = (i + k) / (double) LoudnessMeter.RATE;
                boolean loud = false;
                for (double[] s : speech) loud |= t >= s[0] && t < s[1];
                block[k] = (short) ((k % 2 == 0 ? 1 : -1) * (loud ? 3000 : 30));
            }
            m.add(block, block.length);
        }
        return m;
    }

    // what the model heard for Anna "DocFit Start", the phrase alone between 0.51 s and 1.50 s
    private static final List<Commands.Word> DOCFIT_START =
            Arrays.asList(w("dock", 1, 0.51, 0.75), w("fit", 1, 0.75, 1.08), w("start", 1, 1.08, 1.50));
    private static final LoudnessMeter ALONE = audio(3, new double[]{0.51, 1.50});

    private static Commands.Kind kind(Commands.Loudness loud, Commands.Word... words) {
        return Commands.decide(Arrays.asList(words), loud).kind;
    }

    private static Commands.Kind kind(Commands.Word... words) {
        return kind(ALONE, words);
    }

    @Test
    public void startsOnDocFitStart() {
        Commands.Command c = Commands.decide(DOCFIT_START, ALONE);
        assertEquals(Commands.Kind.START, c.kind);
        assertEquals(1.50, c.at, 1e-9);                       // the end of the phrase: now the workout begins
        assertTrue(c.heard, c.heard.startsWith("dock 1.00, fit 1.00, start 1.00; loudness before 0.01"));
        // Reed "DocFit, Start": "fit" unsure, a pause before "start"
        LoudnessMeter reed = audio(3, new double[]{0.51, 1.02}, new double[]{1.29, 1.77});
        assertEquals(Commands.Kind.START, kind(reed, w("dock", 0.95, 0.51, 0.74), w("fit", 0.55, 0.75, 1.02),
                w("start", 1, 1.29, 1.77)));
    }

    @Test
    public void stopsOnDocFitStopp() {
        Commands.Command c = Commands.decide(Arrays.asList(w("dock", 0.85, 0.51, 0.75), w("fit", 1, 0.75, 1.02),
                w("stopp", 1, 1.02, 1.44)), audio(3, new double[]{0.51, 1.44}));
        assertEquals(Commands.Kind.STOP, c.kind);
        assertEquals(0.51, c.at, 1e-9);                       // the beginning of the phrase: then the workout ended
    }

    @Test
    public void singleWordsDoNothing() {
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.51, 0.75), w("fit", 1, 0.75, 1.08)));      // "DocFit"
        assertEquals(Commands.Kind.NONE, kind(w("stopp", 1, 0.48, 0.87)));                             // "Stopp"
        assertEquals(Commands.Kind.NONE, kind(w("stopp", 1, 0.48, 0.87), w("[unk]", 0.9, 0.9, 1.2)));  // "Stopp mal"
        assertEquals(Commands.Kind.NONE, kind(w("fit", 1, 1.23, 1.59)));                    // "Ich bin heute fit"
        assertEquals(Commands.Kind.NONE, kind(w("fit", 1, 0.75, 1.08), w("start", 1, 1.08, 1.5)));      // no "dock"
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.5, 0.75), w("start", 1, 0.75, 1.2)));      // no "fit"
        assertEquals(Commands.Kind.NONE, kind(w("start", 1, 0.5, 0.9), w("dock", 1, 0.9, 1.1), w("fit", 1, 1.1, 1.4)));
        assertEquals(Commands.Kind.NONE, kind());
    }

    @Test
    public void lookAlikesInTheResultDoNothing() {
        assertEquals(Commands.Kind.NONE, kind(w("doktor", 1, 0.1, 0.5), w("dock", 1, 0.51, 0.75), w("fit", 1, 0.75, 1.08),
                w("start", 1, 1.08, 1.5)));
        assertEquals(Commands.Kind.NONE, kind(w("topf", 1, 0.69, 0.99), w("stopp", 1, 0.99, 1.29)));   // "Ein Topf Suppe"
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.51, 0.75), w("fit", 1, 0.75, 1.08), w("stark", 1, 1.08, 1.5)));
    }

    @Test
    public void unsureWordsDoNothing() {
        // Anna "Doch, fit bin ich schon": the command word below 0.7
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.51, 0.81), w("fit", 1, 0.96, 1.23), w("stopp", 0.65, 1.53, 1.95)));
        assertEquals(Commands.Kind.NONE, kind(w("dock", 0.45, 0.51, 0.75), w("fit", 1, 0.75, 1.08), w("start", 1, 1.08, 1.5)));
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.51, 0.75), w("fit", 0.49, 0.75, 1.08), w("start", 1, 1.08, 1.5)));
        assertEquals(Commands.Kind.START, kind(w("dock", 0.5, 0.51, 0.75), w("fit", 0.5, 0.75, 1.08), w("start", 0.7, 1.08, 1.5)));
    }

    @Test
    public void partsMustFollowClosely() {
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.3, 0.6), w("fit", 1, 0.91, 1.1), w("start", 1, 1.1, 1.5)));
        assertEquals(Commands.Kind.NONE, kind(w("dock", 1, 0.3, 0.5), w("fit", 1, 0.5, 0.8), w("start", 1, 1.31, 1.6)));
    }

    @Test
    public void phraseInsideTalkDoesNothing() {
        // "Ich bin heute richtig fit. Doch fit starten ...": talk right before the words
        LoudnessMeter before = audio(4, new double[]{0.2, 2.0});
        Commands.Command c = Commands.decide(Arrays.asList(w("dock", 1, 1.0, 1.2), w("fit", 1, 1.2, 1.45),
                w("start", 0.9, 1.45, 1.8)), before);
        assertEquals(Commands.Kind.NONE, c.kind);
        assertTrue(c.heard, c.heard.startsWith("not alone: dock 1.00"));
        // talk right after "DocFit Start"
        assertEquals(Commands.Kind.NONE, kind(audio(4, new double[]{0.51, 3.0}), DOCFIT_START.toArray(new Commands.Word[0])));
        // an [unk] far away in the same result does not matter when the phrase itself stood alone
        LoudnessMeter later = audio(5, new double[]{0.51, 1.50}, new double[]{3.0, 3.3});
        assertEquals(Commands.Kind.START, kind(later, w("dock", 1, 0.51, 0.75), w("fit", 1, 0.75, 1.08),
                w("start", 1, 1.08, 1.50), w("[unk]", 0.8, 3.0, 3.3)));
    }

    @Test
    public void plainStoppStopsOnlyWhileRunning() {
        // "Stopp" said on its own between 0.48 s and 0.87 s (Doc, 20.11.2026: "wenn ich nur ‚Stopp' sage")
        LoudnessMeter alone = audio(3, new double[]{0.48, 0.87});
        List<Commands.Word> stopp = Arrays.asList(w("stopp", 1, 0.48, 0.87));
        Commands.Command c = Commands.decide(stopp, alone, true);
        assertEquals(Commands.Kind.STOP, c.kind);
        assertEquals(0.48, c.at, 1e-9);                                   // the beginning of the word
        assertTrue(c.heard, c.heard.contains("plain Stopp"));
        assertEquals(Commands.Kind.NONE, Commands.decide(stopp, alone, false).kind);   // standing still: nothing
        assertEquals(Commands.Kind.NONE, Commands.decide(stopp, alone).kind);
        // with noise around it in the same result it still counts
        assertEquals(Commands.Kind.STOP, Commands.decide(Arrays.asList(w("[unk]", 0.4, 0.1, 0.2),
                w("stopp", 0.95, 0.48, 0.87)), alone, true).kind);
        // "DocFit Stopp" goes on working while running
        assertEquals(Commands.Kind.STOP, Commands.decide(Arrays.asList(w("dock", 1, 0.51, 0.78), w("fit", 1, 0.78, 1.02),
                w("stopp", 1, 1.02, 1.44)), audio(3, new double[]{0.51, 1.44}), true).kind);
    }

    @Test
    public void plainStoppNeedsTheSameCare() {
        LoudnessMeter alone = audio(3, new double[]{0.48, 0.87});
        // unsure
        assertEquals(Commands.Kind.NONE, Commands.decide(Arrays.asList(w("stopp", 0.6, 0.48, 0.87)), alone, true).kind);
        // "Stopp mal": the next word follows at once - not on its own
        LoudnessMeter mal = audio(3, new double[]{0.48, 1.25});
        Commands.Command c = Commands.decide(Arrays.asList(w("stopp", 1, 0.48, 0.87), w("[unk]", 0.9, 0.9, 1.2)), mal, true);
        assertEquals(Commands.Kind.NONE, c.kind);
        assertTrue(c.heard, c.heard.startsWith("not alone"));
        // inside talk: loud before and after
        assertEquals(Commands.Kind.NONE, Commands.decide(Arrays.asList(w("stopp", 1, 1.0, 1.4)),
                audio(3, new double[]{0.2, 2.4}), true).kind);
        // another word of the grammar with it, or two of them: no plain Stopp
        assertEquals(Commands.Kind.NONE, Commands.decide(Arrays.asList(w("topf", 1, 0.2, 0.4), w("stopp", 1, 0.48, 0.87)),
                alone, true).kind);
        assertEquals(Commands.Kind.NONE, Commands.decide(Arrays.asList(w("dock", 1, 0.1, 0.3), w("stopp", 1, 0.48, 0.87)),
                alone, true).kind);
        assertEquals(Commands.Kind.NONE, Commands.decide(Arrays.asList(w("stopp", 1, 0.48, 0.87), w("stopp", 1, 1.0, 1.3)),
                alone, true).kind);
        // a plain "Start" never stops, and while the stopwatch runs it does nothing at all
        assertEquals(Commands.Kind.NONE, Commands.decide(Arrays.asList(w("start", 1, 0.48, 0.87)), alone, true).kind);
        // the log learns why a plain "Stopp" was turned down
        Commands.Command low = Commands.decide(Arrays.asList(w("stopp", 0.6, 0.48, 0.87)), alone, true);
        assertTrue(low.heard, low.heard.startsWith("unsure: stopp 0.60"));
    }

    @Test
    public void plainStartStartsWhileStandingStill() {
        // Doc, 26.11.2026: "Start würde da wirklich reichen" - said on its own, the app open in front of him
        LoudnessMeter alone = audio(3, new double[]{0.5, 0.9});
        Commands.Command c = Commands.decide(Arrays.asList(w("start", 0.95, 0.5, 0.9)), alone, false);
        assertEquals(Commands.Kind.START, c.kind);
        assertEquals(0.9, c.at, 1e-9);                        // the end of the word: now the workout begins
        assertTrue(c.heard, c.heard.contains("plain Start"));
        assertEquals(Commands.Kind.START, kind(alone, w("[unk]", 0.4, 0.1, 0.3), w("start", 1, 0.5, 0.9)));
        // the same care as for a plain "Stopp": sure enough, alone in the result, said on its own
        assertEquals(Commands.Kind.NONE, kind(alone, w("start", 0.69, 0.5, 0.9)));
        assertEquals(Commands.Kind.NONE, kind(alone, w("start", 1, 0.5, 0.9), w("start", 1, 1.0, 1.3)));
        assertEquals(Commands.Kind.NONE, kind(alone, w("statt", 1, 0.1, 0.4), w("start", 1, 0.5, 0.9)));
        assertEquals(Commands.Kind.NONE, kind(alone, w("fit", 1, 0.1, 0.4), w("start", 1, 0.5, 0.9)));   // no "dock"
        // "Der Start war gut": talk right before and after the word
        assertEquals(Commands.Kind.NONE, kind(audio(3, new double[]{0.1, 1.6}), w("start", 1, 0.5, 0.9)));
        // a plain "Stopp" while it stands still still does nothing
        assertEquals(Commands.Kind.NONE, kind(alone, w("stopp", 1, 0.5, 0.9)));
    }

    @Test
    public void aloneAtTheBorder() {
        assertTrue(Commands.alone(1000, 500, 500));            // half as loud: still alone
        assertFalse(Commands.alone(1000, 501, 10));
        assertFalse(Commands.alone(1000, 10, 501));
        assertFalse(Commands.alone(0, 0, 0));                 // nothing recorded
    }

    @Test
    public void loudnessMeterMeasuresWindows() {
        LoudnessMeter m = audio(2, new double[]{1.0, 1.5});
        assertEquals(3000, m.rms(1.0, 1.5), 1e-6);
        assertEquals(30, m.rms(0.0, 0.9), 1e-6);
        assertEquals(Math.sqrt((3000.0 * 3000 + 30.0 * 30) / 2), m.rms(1.25, 1.75), 1e-6);
        assertEquals(30, m.rms(1.6, 5.0), 1e-6);              // only what was recorded counts
        assertEquals(0, m.rms(3.0, 4.0), 1e-9);               // nothing recorded yet
        assertEquals(30, m.rms(-0.5, 0.5), 1e-6);             // before the stream: ignored
        LoudnessMeter longer = audio(12, new double[]{0.0, 1.0});
        assertEquals(0, longer.rms(0.0, 1.0), 1e-9);          // older than ten seconds: gone
        assertEquals(30, longer.rms(11.0, 12.0), 1e-6);
    }

    @Test
    public void stopwatchFormat() {
        assertEquals("00:00", Times.duration(0));
        assertEquals("00:00", Times.duration(-50));
        assertEquals("00:01", Times.duration(1999));            // seconds are cut, like a stopwatch
        assertEquals("00:59", Times.duration(59_999));
        assertEquals("12:34", Times.duration(754_567));
        assertEquals("59:59", Times.duration(3_599_999));
        assertEquals("1:00:00", Times.duration(3_600_000));     // from one hour on with the hour in front
        assertEquals("1:02:03", Times.duration(3_723_456));
        assertEquals("10:00:00", Times.duration(36_000_000));
    }
}
