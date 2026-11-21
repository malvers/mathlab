package de.docalvers.docfit;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Calendar;
import java.util.List;

/**
 * The Vitafit VT701 protocol (Vt701), one weigh-in (ScaleSession), the repeat rule (Weighings.isRepeat, completion)
 * and the lines the scale tab shows for a result (ScaleTexts).
 *
 * The "real" frames are the bytes of a vendor-app weigh-in as published with openScale's description of the scale
 * (a stable 85.00 kg, a settling 85.15 kg, the resistances 393 and 389 ohms, the greeting frames). The others are put
 * together by hand from the frame rule; their check bytes are worked out in the comments.
 */
public class ScaleTest {
    private static byte[] hex(String s) {
        String[] p = s.trim().split("\\s+");
        byte[] b = new byte[p.length];
        for (int i = 0; i < p.length; i++) b[i] = (byte) Integer.parseInt(p[i], 16);
        return b;
    }

    // real frames
    private static final byte[] STABLE_8500 = hex("5a 0a 26 10 02 00 00 21 21 34 0a aa");
    private static final byte[] SETTLING_8515 = hex("5a 0a 26 10 01 00 00 21 21 43 7e aa");
    private static final byte[] OHM_393 = hex("5a 0b 26 11 00 00 00 00 00 01 89 b4 aa");
    private static final byte[] OHM_389 = hex("5a 0b 26 11 00 00 00 00 00 01 85 b8 aa");
    // by hand: the empty scale, stable at 0 kg - 0a^26^10^02 = 3e
    private static final byte[] STABLE_EMPTY = hex("5a 0a 26 10 02 00 00 00 00 00 3e aa");
    // by hand: 123.45 kg = 0x3039, stable - 0a^26^10^02^30^39 = 37
    private static final byte[] STABLE_12345 = hex("5a 0a 26 10 02 00 00 00 30 39 37 aa");
    // by hand: a resistance frame with 0 ohms (no contact) - 0b^26^11 = 3c
    private static final byte[] OHM_0 = hex("5a 0b 26 11 00 00 00 00 00 00 00 3c aa");
    // by hand: 0xFFFF = the scale could not measure (as on Doc's scale 19.11.2026) - 3c^ff^ff = 3c
    private static final byte[] OHM_FFFF = hex("5a 0b 26 11 00 00 00 00 00 ff ff 3c aa");
    // by hand: 2000 ohms = 0x07d0, beyond BodyComposition.MAX_OHM - 3c^07^d0 = eb
    private static final byte[] OHM_2000 = hex("5a 0b 26 11 00 00 00 00 00 07 d0 eb aa");

    // ---------- frames ----------

    @Test
    public void intactFramesAreRecognised() {
        assertTrue(Vt701.isScaleFrame(STABLE_8500));
        assertTrue(Vt701.isScaleFrame(SETTLING_8515));
        assertTrue(Vt701.isScaleFrame(OHM_393));
        assertTrue(Vt701.isScaleFrame(STABLE_12345));
        assertTrue(Vt701.isScaleFrame(OHM_0));
        assertTrue(Vt701.isScaleFrame(OHM_FFFF));
        assertTrue(Vt701.isScaleFrame(OHM_2000));
    }

    @Test
    public void brokenFramesAreRejected() {
        assertFalse(Vt701.isScaleFrame(hex("5a 0a 26 10 02 00 00 21 21 34 ff aa")));   // wrong check
        assertFalse(Vt701.isScaleFrame(hex("5a 0b 26 10 02 00 00 21 21 34 0a aa")));   // wrong length
        assertFalse(Vt701.isScaleFrame(hex("5a 0a 27 10 02 00 00 21 21 34 0a aa")));   // wrong product
        assertFalse(Vt701.isScaleFrame(hex("5a 0a 26 10 02 00 00 21 21 34 0a ab")));   // wrong end
        assertFalse(Vt701.isScaleFrame(hex("a5 05 26 33 00 10 aa")));                  // from the phone
        assertFalse(Vt701.isScaleFrame(new byte[5]));
        assertFalse(Vt701.isScaleFrame(null));
        assertEquals(-1, Vt701.weight(hex("5a 0a 26 10 02 00 00 21 21 34 ff aa")));
        assertEquals(-1, Vt701.impedance(hex("5a 0b 26 11 00 00 00 00 00 01 89 ff aa")));
    }

    @Test
    public void weightAndStability() {
        assertEquals(8500, Vt701.weight(STABLE_8500));
        assertTrue(Vt701.isStable(STABLE_8500));
        assertEquals(8515, Vt701.weight(SETTLING_8515));
        assertFalse(Vt701.isStable(SETTLING_8515));
        assertEquals(12345, Vt701.weight(STABLE_12345));
    }

    @Test
    public void resistance() {
        assertEquals(393, Vt701.impedance(OHM_393));
        assertEquals(389, Vt701.impedance(OHM_389));
        assertEquals(0, Vt701.impedance(OHM_0));
        assertEquals(Vt701.NO_IMPEDANCE, Vt701.impedance(OHM_FFFF));
        assertEquals(2000, Vt701.impedance(OHM_2000));
    }

    @Test
    public void weightAndResistanceFramesAreNotMixedUp() {
        assertEquals(-1, Vt701.impedance(STABLE_8500));
        assertEquals(-1, Vt701.weight(OHM_393));
        assertFalse(Vt701.isStable(OHM_393));
    }

    @Test
    public void phoneFrames() {
        List<byte[]> hello = Vt701.hello();
        assertEquals(3, hello.size());
        assertArrayEquals(hex("a5 05 26 33 00 10 aa"), hello.get(0));
        assertArrayEquals(hex("a5 04 26 44 66 aa"), hello.get(1));
        assertArrayEquals(hex("a5 05 26 17 01 35 aa"), hello.get(2));
        assertArrayEquals(hex("a5 05 26 10 02 31 aa"), Vt701.ackWeight());      // 05^26^10^02 = 31
        assertArrayEquals(hex("a5 05 26 11 00 32 aa"), Vt701.ackImpedance());   // 05^26^11^00 = 32
    }

    @Test
    public void framesInOneNotification() {
        assertEquals(1, Vt701.frames(STABLE_8500).size());
        byte[] glued = new byte[1 + STABLE_8500.length + OHM_393.length];
        glued[0] = 0x00;   // a stray byte in front
        System.arraycopy(STABLE_8500, 0, glued, 1, STABLE_8500.length);
        System.arraycopy(OHM_393, 0, glued, 1 + STABLE_8500.length, OHM_393.length);
        List<byte[]> f = Vt701.frames(glued);
        assertEquals(2, f.size());
        assertArrayEquals(STABLE_8500, f.get(0));
        assertArrayEquals(OHM_393, f.get(1));
        assertEquals(0, Vt701.frames(hex("5a 0a 26 10")).size());   // cut off
        assertEquals(0, Vt701.frames(null).size());
    }

    @Test
    public void scaleName() {
        assertTrue(Vt701.isScaleName("Vitafit"));
        assertTrue(Vt701.isScaleName("VITAFIT-701"));
        assertFalse(Vt701.isScaleName("Pixel Buds"));
        assertFalse(Vt701.isScaleName(null));
    }

    // ---------- one weigh-in ----------

    @Test
    public void wholeWeighIn() {
        ScaleSession s = new ScaleSession();
        assertEquals(3, s.start().size());
        assertEquals(ScaleSession.Phase.WAITING, s.phase());

        assertTrue(s.onNotification(SETTLING_8515, 1000).isEmpty());
        assertEquals(ScaleSession.Phase.SETTLING, s.phase());
        assertEquals(8515, s.shownWeight());

        List<byte[]> out = s.onNotification(STABLE_8500, 2000);
        assertEquals(1, out.size());
        assertArrayEquals(Vt701.ackWeight(), out.get(0));
        assertEquals(ScaleSession.Phase.IMPEDANCE, s.phase());
        assertEquals(8500, s.shownWeight());
        assertNull(s.takeResult());

        // the scale repeats the stable weight: no second confirmation, the kept weight stays
        assertTrue(s.onNotification(STABLE_8500, 2200).isEmpty());
        assertTrue(s.onNotification(SETTLING_8515, 2300).isEmpty());
        assertEquals(8500, s.shownWeight());

        out = s.onNotification(OHM_393, 3500);
        assertEquals(1, out.size());
        assertArrayEquals(Vt701.ackImpedance(), out.get(0));
        assertEquals(ScaleSession.Phase.DONE, s.phase());
        Weighings.Weighing r = s.takeResult();
        assertNotNull(r);
        assertEquals(8500, r.centiKg);
        assertEquals(393, r.ohm);
        assertEquals(2000, r.time);   // the moment the weight settled
        assertEquals(85.0, r.kg(), 1e-9);
        assertNull(s.takeResult());   // only once
    }

    @Test
    public void repeatedResultFramesGiveNoSecondResult() {
        ScaleSession s = new ScaleSession();
        s.onNotification(STABLE_8500, 1000);
        s.onNotification(OHM_393, 2000);
        assertNotNull(s.takeResult());
        assertTrue(s.onNotification(OHM_393, 2100).isEmpty());
        assertTrue(s.onNotification(OHM_389, 2200).isEmpty());
        assertTrue(s.onNotification(STABLE_8500, 2300).isEmpty());
        s.tick(99_000);
        s.connectionLost(99_000);
        assertNull(s.takeResult());
    }

    @Test
    public void resistanceWithoutWeightAndEmptyScaleAreIgnored() {
        ScaleSession s = new ScaleSession();
        assertTrue(s.onNotification(OHM_393, 1000).isEmpty());
        assertTrue(s.onNotification(STABLE_EMPTY, 1100).isEmpty());
        assertEquals(ScaleSession.Phase.WAITING, s.phase());
        assertNull(s.takeResult());
    }

    @Test
    public void zeroResistanceWaitsAndThenSavesTheWeightAlone() {
        ScaleSession s = new ScaleSession();
        s.onNotification(STABLE_8500, 10_000);
        assertTrue(s.onNotification(OHM_0, 11_000).isEmpty());   // no contact: keep waiting
        s.tick(10_000 + ScaleSession.IMPEDANCE_WAIT_MS - 1);
        assertNull(s.takeResult());
        s.tick(10_000 + ScaleSession.IMPEDANCE_WAIT_MS);
        Weighings.Weighing r = s.takeResult();
        assertNotNull(r);
        assertEquals(8500, r.centiKg);
        assertEquals(0, r.ohm);
        assertEquals(ScaleSession.Phase.DONE, s.phase());
    }

    @Test
    public void unmeasurableResistanceIsConfirmedAndSavesTheWeightAlone() {
        ScaleSession s = new ScaleSession();
        s.onNotification(STABLE_8500, 10_000);
        List<byte[]> out = s.onNotification(OHM_FFFF, 11_000);
        assertEquals(1, out.size());
        assertArrayEquals(Vt701.ackImpedance(), out.get(0));   // the scale wants its confirmation all the same
        assertEquals(ScaleSession.Phase.DONE, s.phase());
        Weighings.Weighing r = s.takeResult();
        assertNotNull(r);
        assertEquals(8500, r.centiKg);
        assertEquals(0, r.ohm);                                // stored as "not measured", never as 65535
        assertEquals(10_000, r.time);
        assertFalse(r.hasResistance());
        assertTrue(s.onNotification(OHM_393, 12_000).isEmpty());   // one session, one result
        assertNull(s.takeResult());

        ScaleSession far = new ScaleSession();   // any value outside BodyComposition's range is no measurement either
        far.onNotification(STABLE_8500, 0);
        assertEquals(1, far.onNotification(OHM_2000, 500).size());
        assertEquals(0, far.takeResult().ohm);
    }

    @Test
    public void lostConnectionKeepsTheWeight() {
        ScaleSession s = new ScaleSession();
        s.onNotification(STABLE_12345, 5000);
        s.connectionLost(6000);
        Weighings.Weighing r = s.takeResult();
        assertNotNull(r);
        assertEquals(12345, r.centiKg);
        assertEquals(0, r.ohm);

        ScaleSession nobody = new ScaleSession();
        nobody.onNotification(SETTLING_8515, 5000);
        nobody.connectionLost(6000);
        assertNull(nobody.takeResult());   // nothing settled, nothing saved
    }

    @Test
    public void bothFramesInOneNotification() {
        byte[] glued = new byte[STABLE_8500.length + OHM_389.length];
        System.arraycopy(STABLE_8500, 0, glued, 0, STABLE_8500.length);
        System.arraycopy(OHM_389, 0, glued, STABLE_8500.length, OHM_389.length);
        ScaleSession s = new ScaleSession();
        List<byte[]> out = s.onNotification(glued, 1000);
        assertEquals(2, out.size());
        assertArrayEquals(Vt701.ackWeight(), out.get(0));
        assertArrayEquals(Vt701.ackImpedance(), out.get(1));
        assertEquals(389, s.takeResult().ohm);
    }

    // ---------- repeats across connections ----------

    @Test
    public void repeatRule() {
        Weighings.Weighing a = new Weighings.Weighing(1_000_000, 8500, 0);
        assertTrue(Weighings.isRepeat(a, new Weighings.Weighing(1_000_000 + 60_000, 8500, 393)));
        assertTrue(Weighings.isRepeat(a, new Weighings.Weighing(1_000_000 + Weighings.SAME_WEIGH_IN_MS, 8500, 0)));
        assertFalse(Weighings.isRepeat(a, new Weighings.Weighing(1_000_000 + Weighings.SAME_WEIGH_IN_MS + 1, 8500, 0)));
        assertFalse(Weighings.isRepeat(a, new Weighings.Weighing(1_000_000 + 60_000, 8505, 0)));
        assertFalse(Weighings.isRepeat(null, a));
    }

    @Test
    public void aLaterResistanceCompletesAWeightOnlyRow() {
        Weighings.Weighing weightOnly = new Weighings.Weighing(1_000_000, 8500, 0);
        Weighings.Weighing old65535 = new Weighings.Weighing(1_000_000, 8500, Vt701.NO_IMPEDANCE);   // saved before
        Weighings.Weighing good = new Weighings.Weighing(1_000_000 + 90_000, 8500, 512);
        for (Weighings.Weighing last : new Weighings.Weighing[]{weightOnly, old65535}) {
            Weighings.Weighing c = Weighings.completion(last, good);
            assertNotNull(c);
            assertEquals(1_000_000, c.time);
            assertEquals(8500, c.centiKg);
            assertEquals(512, c.ohm);
        }
        assertNull(Weighings.completion(weightOnly, new Weighings.Weighing(1_090_000, 8500, 0)));        // still none
        assertNull(Weighings.completion(new Weighings.Weighing(1_000_000, 8500, 480), good));           // has one
        assertNull(Weighings.completion(weightOnly,
                new Weighings.Weighing(1_000_000 + Weighings.SAME_WEIGH_IN_MS + 1, 8500, 512)));        // too late
    }

    // ---------- what the scale tab says ----------

    private static final long NOV_2026 = 1_795_000_000_000L;   // a moment in November 2026
    private static final Profile COMPLETE = new Profile(180, 1990, Profile.MALE);   // the test man, nobody real
    private static final Profile EMPTY = new Profile(0, 0, Profile.UNSET);

    @Test
    public void weightWithoutResistanceSaysSo() {
        Weighings.Weighing none = new Weighings.Weighing(NOV_2026, 8500, 0);
        Weighings.Weighing old65535 = new Weighings.Weighing(NOV_2026, 8500, Vt701.NO_IMPEDANCE);
        for (Weighings.Weighing w : new Weighings.Weighing[]{none, old65535}) {
            assertTrue(ScaleTexts.weightOnly(w));
            assertFalse(w.hasResistance());
            assertTrue(ScaleTexts.fatMissing(w, COMPLETE));
            assertEquals(ScaleTexts.NOTE_NO_FAT, ScaleTexts.note(w, COMPLETE));
            assertEquals("Gewicht gespeichert – Körperfett nicht gemessen", ScaleTexts.done(Weighings.Added.NEW, w));
            assertTrue(Double.isNaN(BodyComposition.of(w, COMPLETE).fatPercent));
            assertEquals(85.00 / (1.8 * 1.8), BodyComposition.of(w, COMPLETE).bmi, 1e-9);   // the BMI still shows
        }
        assertTrue(ScaleTexts.NOTE_NO_FAT.startsWith("Kein Körperfett gemessen – barfuß"));
    }

    @Test
    public void missingProfileKeepsPriority() {
        Weighings.Weighing none = new Weighings.Weighing(NOV_2026, 8500, 0);
        assertFalse(ScaleTexts.fatMissing(none, EMPTY));
        assertEquals(ScaleTexts.NOTE_PROFILE, ScaleTexts.note(none, EMPTY));
        assertEquals(ScaleTexts.NOTE_PROFILE, ScaleTexts.note(new Weighings.Weighing(NOV_2026, 8500, 512), EMPTY));
    }

    @Test
    public void measuredWeighInAndOtherLines() {
        Weighings.Weighing good = new Weighings.Weighing(NOV_2026, 8500, 512);
        assertFalse(ScaleTexts.weightOnly(good));
        assertFalse(ScaleTexts.fatMissing(good, COMPLETE));
        // all well: no note under the tiles - the method and the resistance are under "Messmethode" in the settings
        assertEquals("", ScaleTexts.note(good, COMPLETE));
        assertTrue(ScaleTexts.method(good).startsWith("Letzter Widerstand: 512 Ω ("));
        assertTrue(ScaleTexts.method(good).contains("Jebb 2000"));
        assertTrue(ScaleTexts.method(good).contains("unplausibel"));
        assertTrue(ScaleTexts.method(good).contains("Ashwell 2016"));
        assertTrue(ScaleTexts.method(null).startsWith("Noch keine Messung mit Widerstand."));
        assertEquals("Fertig – gespeichert ✓", ScaleTexts.done(Weighings.Added.NEW, good));
        assertEquals("Fertig – Körperfett ergänzt ✓", ScaleTexts.done(Weighings.Added.COMPLETED, good));
        assertEquals("Fertig – war schon gespeichert", ScaleTexts.done(Weighings.Added.REPEAT, good));
        assertEquals("Fertig – war schon gespeichert",
                ScaleTexts.done(Weighings.Added.REPEAT, new Weighings.Weighing(NOV_2026, 8500, 0)));
        assertEquals(ScaleTexts.NOTE_EMPTY, ScaleTexts.note(null, COMPLETE));
        assertFalse(ScaleTexts.fatMissing(null, COMPLETE));
    }

    @Test
    public void weightPillLabelIsTheMomentInCapitals() {
        Calendar c = Calendar.getInstance();
        c.clear();
        c.set(2026, Calendar.NOVEMBER, 19, 7, 5);   // a Thursday morning
        assertEquals("DO 19.11.2026 · 07:05 UHR", ScaleTexts.when(new Weighings.Weighing(c.getTimeInMillis(), 8000, 0)));
        assertEquals("", ScaleTexts.when(null));
        // the compact bar: day and date only
        assertEquals("DO 19.11.", ScaleTexts.whenShort(new Weighings.Weighing(c.getTimeInMillis(), 8000, 0)));
        assertEquals("", ScaleTexts.whenShort(null));
    }
}
