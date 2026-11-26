package de.docalvers.docfit;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;

/**
 * The open Bluetooth blood pressure standard, as far as DocFit needs it for the Omron M400 Intelli IT (HEM-7155T,
 * Doc, 24.11.2026): the Bluetooth SIG "Blood Pressure Service" 0x1810 with its measurement 0x2A35 (sent as
 * indications, the stored readings oldest first) and the "Current Time Service" 0x1805 with the monitor's clock 0x2A2B.
 * No Omron app, no cloud: the readings go straight from the cuff to the phone.
 *
 * Seen on Doc's monitor (24.11.2026, listened to from the Mac): in pairing mode ("P" blinking) it sends the name
 * "BLEsmart_" + model + address, the service 0x1810 and Omron's manufacturer id 0x020E.
 *
 * Everything here is pure - reading the bytes, the clock bytes, the notes from the status bits, which person a reading
 * belongs to and whether it is new - and tested in BpmTest. BpLink does the Bluetooth.
 */
final class Bpm {
    static final UUID SERVICE = uuid16(0x1810), MEASUREMENT = uuid16(0x2A35);
    static final UUID TIME_SERVICE = uuid16(0x1805), CURRENT_TIME = uuid16(0x2A2B);
    static final UUID CCCD = uuid16(0x2902);

    /** 1 kPa in mmHg (the monitor may send kPa; DocFit stores whole mmHg) */
    static final double MMHG_PER_KPA = 7.500617;
    /** a clock this far off is set right and the readings of this transfer are moved by the difference */
    static final long CLOCK_SLACK_MS = 2 * 60_000L;
    /** a reading this far in the future has a wrong time: the time it arrived is taken instead */
    static final long FUTURE_SLACK_MS = 10 * 60_000L;
    /** the same values within this time count as the same reading (it came twice) */
    static final long SAME_MS = 60_000L;

    static UUID uuid16(int id) {
        return UUID.fromString(String.format(Locale.ROOT, "0000%04x-0000-1000-8000-00805f9b34fb", id));
    }

    /** Omron's monitors call themselves "BLEsmart_" + model + address. */
    static boolean isOmronName(String name) {
        return name != null && name.startsWith("BLEsmart_");
    }

    /** One reading as the monitor sent it, already in mmHg. */
    static final class Measurement {
        final int sys, dia, pulse;  // mmHg, beats per minute (0 = none)
        final long time;            // ms since 1970 in the phone's time zone; 0 = no time stamp
        final int user;             // the monitor's user (1 or 2); 0 = not sent or unknown
        final int status;           // the measurement status bits; 0 = all fine or not sent

        Measurement(int sys, int dia, int pulse, long time, int user, int status) {
            this.sys = sys;
            this.dia = dia;
            this.pulse = pulse;
            this.time = time;
            this.user = user;
            this.status = status;
        }
    }

    /**
     * The bytes of 0x2A35: flags (bit 0 kPa, 1 time stamp, 2 pulse, 3 user, 4 status), systolic, diastolic and mean
     * pressure as SFLOAT, then the optional parts in this order. Null when the bytes are too short or a pressure is
     * missing; a reading with the systolic not above the diastolic is no reading either.
     */
    static Measurement parse(byte[] v, TimeZone tz) {
        if (v == null || v.length < 7) return null;
        int flags = v[0] & 0xFF;
        boolean kpa = (flags & 0x01) != 0;
        double s = sfloat(u16(v, 1)), d = sfloat(u16(v, 3));
        if (Double.isNaN(s) || Double.isNaN(d)) return null;
        if (kpa) {
            s *= MMHG_PER_KPA;
            d *= MMHG_PER_KPA;
        }
        int at = 7;
        long time = 0;
        if ((flags & 0x02) != 0) {
            if (v.length < at + 7) return null;
            time = dateTime(v, at, tz);
            at += 7;
        }
        int pulse = 0;
        if ((flags & 0x04) != 0) {
            if (v.length < at + 2) return null;
            double p = sfloat(u16(v, at));
            pulse = Double.isNaN(p) || p <= 0 ? 0 : (int) Math.round(p);
            at += 2;
        }
        int user = 0;
        if ((flags & 0x08) != 0) {
            if (v.length < at + 1) return null;
            int u = v[at] & 0xFF;
            user = u == 0xFF ? 0 : u;
            at += 1;
        }
        int status = 0;
        if ((flags & 0x10) != 0) {
            if (v.length < at + 2) return null;
            status = u16(v, at);
        }
        int sys = (int) Math.round(s), dia = (int) Math.round(d);
        if (sys <= 0 || dia <= 0 || sys <= dia) return null;
        return new Measurement(sys, dia, pulse, time, user, status);
    }

    /**
     * The 16-bit SFLOAT of the medical device standard (IEEE 11073-20601): a 4-bit exponent and a 12-bit mantissa,
     * both signed; NaN for "not a number", "not at this resolution" and the infinities.
     */
    static double sfloat(int raw) {
        int mantissa = raw & 0x0FFF;
        int exponent = raw >> 12 & 0x0F;
        if (mantissa == 0x07FF || mantissa == 0x0800 || mantissa == 0x07FE || mantissa == 0x0802
                || mantissa == 0x0801) {
            return Double.NaN;
        }
        if (mantissa >= 0x0800) mantissa -= 0x1000;
        if (exponent >= 0x08) exponent -= 0x10;
        return mantissa * Math.pow(10, exponent);
    }

    /** The 7-byte date-time (year, month, day, hours, minutes, seconds) in local time; 0 when it says "unknown". */
    static long dateTime(byte[] v, int at, TimeZone tz) {
        int year = u16(v, at), month = v[at + 2] & 0xFF, day = v[at + 3] & 0xFF;
        if (year == 0 || month == 0 || day == 0) return 0;
        Calendar c = Calendar.getInstance(tz, Locale.ROOT);
        c.clear();
        c.set(year, month - 1, day, v[at + 4] & 0xFF, v[at + 5] & 0xFF, v[at + 6] & 0xFF);
        return c.getTimeInMillis();
    }

    /**
     * The 10 bytes for 0x2A2B: the date-time, the weekday (1 Monday ... 7 Sunday), 1/256 seconds (0) and the reason
     * for the change (0x01 = set by hand, here: by the phone).
     */
    static byte[] currentTime(long millis, TimeZone tz) {
        return currentTime(millis, tz, 0x01);
    }

    /** The same with another "adjust reason" in the last byte (0x00 = none given). */
    static byte[] currentTime(long millis, TimeZone tz, int adjustReason) {
        Calendar c = Calendar.getInstance(tz, Locale.ROOT);
        c.setTimeInMillis(millis);
        int year = c.get(Calendar.YEAR);
        int weekday = (c.get(Calendar.DAY_OF_WEEK) + 5) % 7 + 1;   // Calendar: 1 Sunday ... 7 Saturday
        return new byte[]{(byte) year, (byte) (year >> 8), (byte) (c.get(Calendar.MONTH) + 1),
                (byte) c.get(Calendar.DAY_OF_MONTH), (byte) c.get(Calendar.HOUR_OF_DAY), (byte) c.get(Calendar.MINUTE),
                (byte) c.get(Calendar.SECOND), (byte) weekday, 0, (byte) adjustReason};
    }

    /** How far the monitor's clock is behind the phone (ms; negative = ahead), read from 0x2A2B; 0 when unknown. */
    static long clockLag(byte[] currentTime, long phoneNow, TimeZone tz) {
        if (currentTime == null || currentTime.length < 7) return 0;
        long device = dateTime(currentTime, 0, tz);
        if (device == 0) return 0;
        long lag = phoneNow - device;
        return Math.abs(lag) > CLOCK_SLACK_MS ? lag : 0;
    }

    /**
     * When a reading was taken: its time stamp moved by the clock's lag; without a time stamp, or with one in the
     * future (the clock was wrong), the time it arrived.
     */
    static long when(Measurement m, long clockLag, long arrived) {
        return timeIsArrival(m, clockLag, arrived) ? arrived : m.time + clockLag;
    }

    /** True when the reading's own time cannot be used (none, or in the future) and the time it arrived stands in. */
    static boolean timeIsArrival(Measurement m, long clockLag, long arrived) {
        return m.time == 0 || m.time + clockLag > arrived + FUTURE_SLACK_MS;
    }

    /** The monitor's user 2 goes to DocFit's second person, everything else to the first (Doc, 24.11.2026). */
    static int person(int user) {
        return user == 2 ? 1 : 0;
    }

    /** The readings the monitor's status bits warn about, as a short German note ("" when all is fine). */
    static String note(int status, boolean timeIsArrival) {
        List<String> parts = new ArrayList<>();
        if ((status & 0x01) != 0) parts.add("Bewegung beim Messen");
        if ((status & 0x02) != 0) parts.add("Manschette zu locker");
        if ((status & 0x04) != 0) parts.add("unregelmäßiger Herzschlag");
        int range = status >> 3 & 0x03;
        if (range == 1) parts.add("Puls über dem Messbereich");
        else if (range == 2) parts.add("Puls unter dem Messbereich");
        if ((status & 0x20) != 0) parts.add("Messposition nicht richtig");
        if (timeIsArrival) parts.add("Zeit = Empfang (Omron ohne gültige Uhrzeit)");
        return String.join(" · ", parts);
    }

    /** True when the list already holds these values at (nearly) this time - the monitor sent the reading again. */
    static boolean known(List<Pressures.Reading> list, long time, int sys, int dia) {
        for (Pressures.Reading r : list) {
            if (r.sys == sys && r.dia == dia && Math.abs(r.time - time) < SAME_MS) return true;
        }
        return false;
    }

    /** Midnight at the start of the day of {@code millis}: readings before the day of pairing are left out. */
    static long startOfDay(long millis, TimeZone tz) {
        Calendar c = Calendar.getInstance(tz, Locale.ROOT);
        c.setTimeInMillis(millis);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTimeInMillis();
    }

    // ---------- Omron's own pairing step (protocol as documented by the open-source omblepy; see BpLink) ----------

    /** "start transmission" and "end transmission" on Omron's send channel (each frame XORs to 0) */
    static final byte[] START_TRANSMISSION = unhex("0800000000100018"), END_TRANSMISSION = unhex("080f000000000007");

    // the monitor's clock (HEM-7155T, as omblepy's driver sets it): read 16 bytes at 0x003C, write them back at 0x0080
    static final int CLOCK_READ = 0x003C, CLOCK_WRITE = 0x0080, CLOCK_SIZE = 16;

    /** "read memory": 0x08 0x01 0x00, address (big endian), size, 0x00 and the byte that XORs the frame to 0. */
    static byte[] readCommand(int address, int size) {
        byte[] f = {0x08, 0x01, 0x00, (byte) (address >> 8), (byte) address, (byte) size, 0x00, 0};
        f[7] = xor(f, 7);
        return f;
    }

    /** "write memory": length + 8, 0x01 0xC0, address (big endian), length, the data, 0x00 and the XOR byte. */
    static byte[] writeCommand(int address, byte[] data) {
        int n = data.length;
        byte[] f = new byte[n + 8];
        f[0] = (byte) (n + 8);
        f[1] = 0x01;
        f[2] = (byte) 0xC0;
        f[3] = (byte) (address >> 8);
        f[4] = (byte) address;
        f[5] = (byte) n;
        System.arraycopy(data, 0, f, 6, n);
        f[n + 6] = 0x00;
        f[n + 7] = xor(f, n + 7);
        return f;
    }

    /** True when the frame's bytes (as many as its first byte says) XOR to 0. */
    static boolean frameOk(byte[] f) {
        if (f == null || f.length == 0 || (f[0] & 0xFF) > f.length || (f[0] & 0xFF) < 3) return false;
        return xor(f, f[0] & 0xFF) == 0;
    }

    /** The data of a "read memory" answer (type 0x81 0x00, address echoed, count, data); null when it is none. */
    static byte[] readData(byte[] f, int address) {
        if (!frameOk(f) || (f[1] & 0xFF) != 0x81 || f[2] != 0 || f.length < 6) return null;
        if (((f[3] & 0xFF) << 8 | (f[4] & 0xFF)) != address) return null;
        int n = f[5] & 0xFF;
        if (6 + n > (f[0] & 0xFF)) return null;
        return java.util.Arrays.copyOfRange(f, 6, 6 + n);
    }

    /**
     * The clock block to write: the first 8 bytes as read, then year - 2000, month, day, hour, minute, second (local
     * time), the sum of these 14 bytes (low byte) and 0x00.
     */
    static byte[] clockBlock(byte[] read, long millis, TimeZone tz) {
        if (read == null || read.length < 8) return null;
        Calendar c = Calendar.getInstance(tz, Locale.ROOT);
        c.setTimeInMillis(millis);
        byte[] b = new byte[16];
        System.arraycopy(read, 0, b, 0, 8);
        b[8] = (byte) (c.get(Calendar.YEAR) - 2000);
        b[9] = (byte) (c.get(Calendar.MONTH) + 1);
        b[10] = (byte) c.get(Calendar.DAY_OF_MONTH);
        b[11] = (byte) c.get(Calendar.HOUR_OF_DAY);
        b[12] = (byte) c.get(Calendar.MINUTE);
        b[13] = (byte) c.get(Calendar.SECOND);
        int sum = 0;
        for (int i = 0; i < 14; i++) sum += b[i] & 0xFF;
        b[14] = (byte) sum;
        b[15] = 0;
        return b;
    }

    /** A frame cut into the 16-byte pieces that go to the send channels one after the other. */
    static byte[][] pieces(byte[] f) {
        int n = (f.length + 15) / 16;
        byte[][] out = new byte[n][];
        for (int i = 0; i < n; i++) out[i] = java.util.Arrays.copyOfRange(f, 16 * i, Math.min(f.length, 16 * i + 16));
        return out;
    }

    /**
     * Puts the monitor's answers back together: each comes in 16-byte notifications, the first on receive channel 0,
     * the rest on 1, 2, 3; the first byte is the frame's length.
     */
    static final class Frames {
        private final java.io.ByteArrayOutputStream buf = new java.io.ByteArrayOutputStream();
        private boolean started;

        /** @return the whole frame once it is complete, else null */
        byte[] add(int channel, byte[] v) {
            if (v == null || v.length == 0) return null;
            if (channel == 0) {
                buf.reset();
                started = true;
            }
            if (!started) return null;
            buf.write(v, 0, v.length);
            byte[] all = buf.toByteArray();
            int len = all[0] & 0xFF;
            if (len == 0 || all.length < len) return null;
            started = false;
            buf.reset();
            return java.util.Arrays.copyOf(all, len);
        }
    }

    private static byte xor(byte[] f, int n) {
        byte x = 0;
        for (int i = 0; i < n; i++) x ^= f[i];
        return x;
    }

    /** Pairing mode: "take a new key" - 0x02 and 16 zero bytes. */
    static byte[] keyModeRequest() {
        return withOpcode(0x02, new byte[16]);
    }

    /** The key itself: 0x00 and the 16 bytes. */
    static byte[] keyWrite(byte[] key) {
        return withOpcode(0x00, key);
    }

    /** A normal connection: "this is DocFit" - 0x01 and the key. */
    static byte[] unlock(byte[] key) {
        return withOpcode(0x01, key);
    }

    private static byte[] withOpcode(int op, byte[] key) {
        byte[] b = new byte[17];
        b[0] = (byte) op;
        System.arraycopy(key, 0, b, 1, 16);
        return b;
    }

    /** An answer on the unlock characteristic that starts with these two bytes (e.g. 0x82 0x00 = "ready for a key"). */
    static boolean isAnswer(byte[] v, int b0, int b1) {
        return v != null && v.length >= 2 && (v[0] & 0xFF) == b0 && (v[1] & 0xFF) == b1;
    }

    /** A frame on Omron's receive channels: length, type (e.g. 0x80 0x00 = "transmission started"). */
    static boolean isFrame(byte[] v, int type) {
        return v != null && v.length >= 3 && (v[1] & 0xFF) == type && v[2] == 0;
    }

    static String hex(byte[] v) {
        if (v == null) return "-";
        StringBuilder b = new StringBuilder();
        for (byte x : v) b.append(String.format(Locale.ROOT, "%02x", x & 0xFF));
        return b.toString();
    }

    /** Hex text as bytes; null when it is not whole bytes of hex. */
    static byte[] unhex(String h) {
        if (h == null || h.length() % 2 != 0) return null;
        byte[] b = new byte[h.length() / 2];
        for (int i = 0; i < b.length; i++) {
            int hi = Character.digit(h.charAt(2 * i), 16), lo = Character.digit(h.charAt(2 * i + 1), 16);
            if (hi < 0 || lo < 0) return null;
            b[i] = (byte) (hi << 4 | lo);
        }
        return b;
    }

    private static int u16(byte[] v, int at) {
        return (v[at] & 0xFF) | (v[at + 1] & 0xFF) << 8;
    }

    private Bpm() {
    }
}
