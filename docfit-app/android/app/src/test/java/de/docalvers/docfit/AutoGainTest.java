package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/** AutoGain: quiet speech lifted up to four times, loud speech left alone, never clipped, falling back slowly. */
public class AutoGainTest {
    /** 100 ms at 16 kHz, alternating +peak / -peak. */
    private static short[] block(int peak) {
        short[] b = new short[1600];
        for (int i = 0; i < b.length; i++) b[i] = (short) (i % 2 == 0 ? peak : -peak);
        return b;
    }

    @Test
    public void quietSpeechIsLiftedAtMostFourTimes() {
        AutoGain g = new AutoGain();
        short[] b = block(1000);
        assertEquals(4, g.apply(b, b.length), 1e-9);
        assertEquals(4000, b[0]);
        assertEquals(-4000, b[1]);
    }

    @Test
    public void speechIsBroughtToTheTarget() {
        AutoGain g = new AutoGain();
        short[] b = block(6000);
        assertEquals(2, g.apply(b, b.length), 1e-9);
        assertEquals(12000, b[0]);
    }

    @Test
    public void loudSpeechStaysAsItIsAndNeverClips() {
        AutoGain g = new AutoGain();
        short[] b = block(20000);
        assertEquals(1, g.apply(b, b.length), 1e-9);          // never quieter, never louder than recorded
        assertEquals(20000, b[0]);
        short[] max = block(Short.MAX_VALUE);
        assertEquals(1, g.apply(max, max.length), 1e-9);
        assertEquals(Short.MAX_VALUE, max[0]);
    }

    @Test
    public void afterLoudSpeechTheGainRisesOnlySlowly() {
        AutoGain g = new AutoGain();
        short[] loud = block(12000);
        g.apply(loud, loud.length);
        short[] quiet = block(1000);
        double next = g.apply(quiet, quiet.length);
        assertTrue("right after: about 1, not 4 - " + next, next < 1.1);
        double later = 0;
        for (int i = 0; i < 100; i++) later = g.apply(block(1000), 1600);   // ten seconds of quiet
        assertEquals(4, later, 1e-9);
    }

    @Test
    public void shortReadsDecayByTheirLength() {
        AutoGain a = new AutoGain(), b = new AutoGain();
        a.apply(block(12000), 1600);
        b.apply(block(12000), 1600);
        a.apply(block(0), 1600);                               // one block of 100 ms ...
        b.apply(block(0), 800);                                // ... or two of 50 ms: the same
        double ga = a.apply(block(1000), 1600);
        b.apply(block(0), 800);
        double gb = b.apply(block(1000), 1600);
        assertEquals(ga, gb, 1e-9);
    }

    @Test
    public void silenceAndEmptyReads() {
        AutoGain g = new AutoGain();
        assertEquals(1, g.apply(new short[0], 0), 1e-9);
        short[] zero = block(0);
        assertEquals(4, g.apply(zero, zero.length), 1e-9);    // digital silence stays silence
        assertEquals(0, zero[0]);
    }
}
