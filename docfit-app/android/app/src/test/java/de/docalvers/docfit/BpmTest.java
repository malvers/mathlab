package de.docalvers.docfit;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

/**
 * The Omron's bytes (Bpm): the blood pressure measurement 0x2A35 with and without its optional parts, kPa, the SFLOAT
 * special values, the clock bytes for 0x2A2B and the clock's lag, which time a reading gets, who it belongs to, the
 * notes from the status bits and the check for a reading sent twice. Made-up readings - nobody's real values.
 */
public class BpmTest {
    private static final TimeZone BERLIN = TimeZone.getTimeZone("Europe/Berlin");
    private static final long MIN = 60_000L;

    private static long local(int y, int mo, int d, int h, int mi, int s) {
        Calendar c = Calendar.getInstance(BERLIN, Locale.ROOT);
        c.clear();
        c.set(y, mo - 1, d, h, mi, s);
        return c.getTimeInMillis();
    }

    private static byte[] bytes(int... v) {
        byte[] b = new byte[v.length];
        for (int i = 0; i < v.length; i++) b[i] = (byte) v[i];
        return b;
    }

    @Test
    public void fullReadingAsTheOmronSendsIt() {
        // flags 0x1E: time stamp, pulse, user, status; mmHg; 128/84 mean 99, 2026-11-24 19:05:30, pulse 66, user 1,
        // status 0x0004 (irregular pulse)
        byte[] v = bytes(0x1E, 128, 0, 84, 0, 99, 0, 0xEA, 0x07, 11, 24, 19, 5, 30, 66, 0, 1, 0x04, 0x00);
        Bpm.Measurement m = Bpm.parse(v, BERLIN);
        assertEquals(128, m.sys);
        assertEquals(84, m.dia);
        assertEquals(66, m.pulse);
        assertEquals(1, m.user);
        assertEquals(0x04, m.status);
        assertEquals(local(2026, 11, 24, 19, 5, 30), m.time);
    }

    @Test
    public void onlyThePressures() {
        Bpm.Measurement m = Bpm.parse(bytes(0x00, 0x78, 0x00, 0x50, 0x00, 0x5A, 0x00), BERLIN);
        assertEquals(120, m.sys);
        assertEquals(80, m.dia);
        assertEquals(0, m.pulse);
        assertEquals(0, m.time);
        assertEquals(0, m.user);
        assertEquals(0, m.status);
    }

    @Test
    public void pulseAndUserWithoutTimeStamp() {
        // flags 0x0C: pulse, user 2
        Bpm.Measurement m = Bpm.parse(bytes(0x0C, 135, 0, 88, 0, 104, 0, 72, 0, 2), BERLIN);
        assertEquals(72, m.pulse);
        assertEquals(2, m.user);
        assertEquals(0, m.time);
    }

    @Test
    public void unknownUserCountsAsNone() {
        Bpm.Measurement m = Bpm.parse(bytes(0x08, 120, 0, 80, 0, 93, 0, 0xFF), BERLIN);
        assertEquals(0, m.user);
        assertEquals(0, Bpm.person(m.user));
    }

    @Test
    public void kilopascalBecomesWholeMmHg() {
        // 16.0 kPa / 10.7 kPa as mantissa 160 / 107 with exponent -1 (0xF in the top nibble)
        Bpm.Measurement m = Bpm.parse(bytes(0x01, 0xA0, 0xF0, 0x6B, 0xF0, 0x80, 0xF0), BERLIN);
        assertEquals(120, m.sys);   // 16.0 * 7.5006 = 120.01
        assertEquals(80, m.dia);    // 10.7 * 7.5006 = 80.26
    }

    @Test
    public void sfloatSpecialValuesAndSigns() {
        assertTrue(Double.isNaN(Bpm.sfloat(0x07FF)));   // not a number
        assertTrue(Double.isNaN(Bpm.sfloat(0x0800)));   // not at this resolution
        assertTrue(Double.isNaN(Bpm.sfloat(0x07FE)));   // + infinity
        assertTrue(Double.isNaN(Bpm.sfloat(0x0802)));   // - infinity
        assertEquals(120.0, Bpm.sfloat(0x0078), 1e-9);
        assertEquals(-1.0, Bpm.sfloat(0x0FFF), 1e-9);   // mantissa -1
        assertEquals(1200.0, Bpm.sfloat(0x1078), 1e-9); // exponent +1
        assertEquals(12.0, Bpm.sfloat(0xF078), 1e-9);   // exponent -1
    }

    @Test
    public void brokenReadingsAreNone() {
        assertNull(Bpm.parse(null, BERLIN));
        assertNull(Bpm.parse(bytes(0x00, 120, 0, 80), BERLIN));                       // too short
        assertNull(Bpm.parse(bytes(0x02, 120, 0, 80, 0, 93, 0, 0xEA, 0x07), BERLIN));  // time stamp cut off
        assertNull(Bpm.parse(bytes(0x00, 0xFF, 0x07, 80, 0, 93, 0), BERLIN));         // systolic NaN
        assertNull(Bpm.parse(bytes(0x00, 80, 0, 80, 0, 80, 0), BERLIN));              // systolic not above diastolic
    }

    @Test
    public void unknownDateMeansNoTimeStamp() {
        Bpm.Measurement m = Bpm.parse(bytes(0x02, 120, 0, 80, 0, 93, 0, 0, 0, 0, 0, 0, 0, 0), BERLIN);
        assertEquals(0, m.time);
    }

    @Test
    public void currentTimeBytes() {
        // Tuesday 24.11.2026 19:05:30 local
        byte[] b = Bpm.currentTime(local(2026, 11, 24, 19, 5, 30), BERLIN);
        assertArrayEquals(bytes(0xEA, 0x07, 11, 24, 19, 5, 30, 2, 0, 0x01), b);
        assertEquals(7, Bpm.currentTime(local(2026, 11, 29, 8, 0, 0), BERLIN)[7]);   // Sunday = 7
        assertEquals(1, Bpm.currentTime(local(2026, 11, 30, 8, 0, 0), BERLIN)[7]);   // Monday = 1
        // summer time: the local clock, not UTC
        assertEquals(14, Bpm.currentTime(local(2026, 7, 1, 14, 0, 0), BERLIN)[4]);
    }

    @Test
    public void clockLagOnlyWhenClearlyOff() {
        long now = local(2026, 11, 24, 19, 5, 30);
        assertEquals(0, Bpm.clockLag(Bpm.currentTime(now - 30_000, BERLIN), now, BERLIN));     // 30 s: fine
        assertEquals(60 * MIN, Bpm.clockLag(Bpm.currentTime(now - 60 * MIN, BERLIN), now, BERLIN));   // an hour behind
        assertEquals(-5 * MIN, Bpm.clockLag(Bpm.currentTime(now + 5 * MIN, BERLIN), now, BERLIN));    // ahead
        assertEquals(0, Bpm.clockLag(null, now, BERLIN));
        assertEquals(0, Bpm.clockLag(bytes(0, 0, 0, 0, 0, 0, 0, 0, 0, 0), now, BERLIN));   // "unknown"
    }

    @Test
    public void whichTimeAReadingGets() {
        long now = local(2026, 11, 24, 19, 10, 0);
        Bpm.Measurement taken = new Bpm.Measurement(120, 80, 60, local(2026, 11, 24, 19, 5, 0), 1, 0);
        assertEquals(taken.time, Bpm.when(taken, 0, now));
        assertEquals(taken.time, Bpm.when(new Bpm.Measurement(120, 80, 60, taken.time - 60 * MIN, 1, 0),
                60 * MIN, now));   // the clock was an hour behind: moved to the real moment
        Bpm.Measurement future = new Bpm.Measurement(120, 80, 60, now + 3 * 60 * MIN, 1, 0);
        assertEquals(now, Bpm.when(future, 0, now));
        assertTrue(Bpm.timeIsArrival(future, 0, now));
        Bpm.Measurement none = new Bpm.Measurement(120, 80, 60, 0, 1, 0);
        assertEquals(now, Bpm.when(none, 0, now));
        assertTrue(Bpm.timeIsArrival(none, 0, now));
        assertFalse(Bpm.timeIsArrival(taken, 0, now));
    }

    @Test
    public void userTwoGoesToTheSecondPerson() {
        assertEquals(0, Bpm.person(1));
        assertEquals(1, Bpm.person(2));
        assertEquals(0, Bpm.person(0));
        assertEquals(0, Bpm.person(3));
    }

    @Test
    public void notesFromTheStatusBits() {
        assertEquals("", Bpm.note(0, false));
        assertEquals("unregelmäßiger Herzschlag", Bpm.note(0x04, false));
        assertEquals("Bewegung beim Messen · Manschette zu locker", Bpm.note(0x03, false));
        assertEquals("Puls über dem Messbereich", Bpm.note(0x08, false));
        assertEquals("Puls unter dem Messbereich", Bpm.note(0x10, false));
        assertEquals("Messposition nicht richtig", Bpm.note(0x20, false));
        assertTrue(Bpm.note(0, true).startsWith("Zeit = Empfang"));
        assertTrue(Bpm.note(0x3F, true).length() <= Pressures.NOTE_MAX);
    }

    @Test
    public void aReadingSentTwiceIsKnown() {
        long t = local(2026, 11, 24, 19, 5, 0);
        List<Pressures.Reading> list = new ArrayList<>();
        list.add(new Pressures.Reading(t, 128, 84, 66, Pressures.OMRON, ""));
        assertTrue(Bpm.known(list, t, 128, 84));
        assertTrue(Bpm.known(list, t + 30_000, 128, 84));
        assertFalse(Bpm.known(list, t + 2 * MIN, 128, 84));   // a second measurement two minutes later
        assertFalse(Bpm.known(list, t, 127, 84));
    }

    @Test
    public void readingsCountFromMidnightOfThePairingDay() {
        assertEquals(local(2026, 11, 24, 0, 0, 0), Bpm.startOfDay(local(2026, 11, 24, 19, 5, 30), BERLIN));
    }

    @Test
    public void omronNames() {
        assertTrue(Bpm.isOmronName("BLEsmart_00000266AABBCCDDEEFF"));
        assertFalse(Bpm.isOmronName("TUYA_"));
        assertFalse(Bpm.isOmronName(null));
        assertEquals("00001810-0000-1000-8000-00805f9b34fb", Bpm.SERVICE.toString());
        assertEquals("00002a35-0000-1000-8000-00805f9b34fb", Bpm.MEASUREMENT.toString());
    }

    @Test
    public void omronPairingFrames() {
        byte[] key = Bpm.unhex("00112233445566778899aabbccddeeff");
        byte[] mode = Bpm.keyModeRequest();
        assertEquals(17, mode.length);
        assertEquals(0x02, mode[0]);
        for (int i = 1; i < 17; i++) assertEquals(0, mode[i]);
        assertEquals("0000112233445566778899aabbccddeeff", Bpm.hex(Bpm.keyWrite(key)));
        assertEquals("0100112233445566778899aabbccddeeff", Bpm.hex(Bpm.unlock(key)));
        // both transmission frames XOR to zero, as Omron's frames must
        for (byte[] f : new byte[][]{Bpm.START_TRANSMISSION, Bpm.END_TRANSMISSION}) {
            int x = 0;
            for (byte b : f) x ^= b;
            assertEquals(0, x);
            assertEquals(8, f[0]);   // the first byte is the frame's length
        }
    }

    @Test
    public void omronAnswers() {
        assertTrue(Bpm.isAnswer(bytes(0x82, 0x00, 0x00), 0x82, 0x00));
        assertFalse(Bpm.isAnswer(bytes(0x82, 0x01), 0x82, 0x00));
        assertFalse(Bpm.isAnswer(bytes(0x82), 0x82, 0x00));
        assertTrue(Bpm.isFrame(bytes(0x08, 0x80, 0x00, 0, 0, 0, 0, 0x88), 0x80));
        assertTrue(Bpm.isFrame(bytes(0x08, 0x8F, 0x00, 0, 0, 0, 0, 0x87), 0x8F));
        assertFalse(Bpm.isFrame(bytes(0x08, 0x8F, 0x01), 0x8F));
        assertFalse(Bpm.isFrame(null, 0x80));
    }

    @Test
    public void hexBothWays() {
        assertEquals("00ff10", Bpm.hex(bytes(0x00, 0xFF, 0x10)));
        assertArrayEquals(bytes(0x00, 0xFF, 0x10), Bpm.unhex("00ff10"));
        assertArrayEquals(bytes(0xAB), Bpm.unhex("AB"));
        assertNull(Bpm.unhex("abc"));
        assertNull(Bpm.unhex("zz"));
        assertNull(Bpm.unhex(null));
        assertEquals("-", Bpm.hex(null));
    }

    @Test
    public void omronMemoryFrames() {
        assertEquals("080100003c100025", Bpm.hex(Bpm.readCommand(Bpm.CLOCK_READ, Bpm.CLOCK_SIZE)));
        byte[] w = Bpm.writeCommand(Bpm.CLOCK_WRITE, new byte[16]);
        assertEquals(24, w.length);
        assertEquals(0x18, w[0]);
        assertEquals("01c0008010", Bpm.hex(java.util.Arrays.copyOfRange(w, 1, 6)));
        assertTrue(Bpm.frameOk(w));
        assertTrue(Bpm.frameOk(Bpm.readCommand(0x0010, 0x10)));
        byte[][] p = Bpm.pieces(w);
        assertEquals(2, p.length);
        assertEquals(16, p[0].length);
        assertEquals(8, p[1].length);
    }

    @Test
    public void omronAnswerPiecesBecomeOneFrame() {
        // the monitor's real answer to "start transmission" (24.11.2026): 24 bytes over receive channels 0 and 1
        Bpm.Frames f = new Bpm.Frames();
        assertNull(f.add(1, Bpm.unhex("ffffffff")));   // a piece before the start is ignored
        assertNull(f.add(0, Bpm.unhex("188000000010000000940266ffffffff")));
        byte[] frame = f.add(1, Bpm.unhex("fffffffff4ff00730000000000000000"));
        assertEquals(24, frame.length);
        assertTrue(Bpm.frameOk(frame));
        assertTrue(Bpm.isFrame(frame, 0x80));
        byte[] end = f.add(0, Bpm.unhex("088f0000000000870000000000000000"));
        assertEquals(8, end.length);
        assertTrue(Bpm.isFrame(end, 0x8F));
    }

    @Test
    public void readAnswerAndClockBlock() {
        byte[] data = Bpm.unhex("0102030405060708090a0b0c0d0e0f10");
        byte[] f = new byte[24];
        f[0] = 24;
        f[1] = (byte) 0x81;
        f[2] = 0;
        f[3] = 0x00;
        f[4] = 0x3C;
        f[5] = 16;
        System.arraycopy(data, 0, f, 6, 16);
        byte x = 0;
        for (int i = 0; i < 23; i++) x ^= f[i];
        f[23] = x;
        assertArrayEquals(data, Bpm.readData(f, 0x003C));
        assertNull(Bpm.readData(f, 0x0010));   // another address
        f[10] ^= 1;
        assertNull(Bpm.readData(f, 0x003C));   // checksum broken

        byte[] b = Bpm.clockBlock(data, local(2026, 11, 25, 5, 47, 30), BERLIN);
        assertEquals("0102030405060708", Bpm.hex(java.util.Arrays.copyOf(b, 8)));
        assertEquals("1a0b19052f1e", Bpm.hex(java.util.Arrays.copyOfRange(b, 8, 14)));   // 26 11 25 05 47 30
        int sum = 0;
        for (int i = 0; i < 14; i++) sum += b[i] & 0xFF;
        assertEquals((byte) sum, b[14]);
        assertEquals(0, b[15]);
        assertNull(Bpm.clockBlock(null, 0, BERLIN));
    }
}
