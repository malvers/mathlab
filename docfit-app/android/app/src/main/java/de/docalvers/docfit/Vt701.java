package de.docalvers.docfit;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The language of the Vitafit VT701 body-fat scale (FCC ID 2A2DS-HB917) over Bluetooth LE. Pure Java, tested in
 * ScaleTest.
 *
 * Where the knowledge comes from: the openScale project (https://github.com/oliexdev/openScale, GPLv3) decoded this
 * scale from a Bluetooth log of the vendor app and documented it in its VitafitVT701Handler. This class is our own
 * implementation, written from that description - no openScale code is used.
 *
 * What the scale speaks:
 * - GATT service 0xFFF0; the scale notifies on characteristic 0xFFF1, the phone writes to 0xFFF2.
 * - Every message in both directions is one frame:
 *   {@code start, length, 0x26, type, payload..., check, 0xAA}
 *   start is 0x5A from the scale and 0xA5 from the phone; length is the number of bytes after the length byte
 *   (0x26 up to and including 0xAA); check is the XOR of the length byte and every byte up to the end of the payload.
 * - Type 0x10 streams the weight: the first payload byte says whether it has settled (0x02 = stable), the weight in
 *   units of 10 g sits big-endian in bytes 8 and 9 of the frame.
 * - The phone confirms a stable weight with a type 0x10 frame carrying 0x02; then the scale measures the resistance
 *   between the feet and sends it in a type 0x11 frame (ohms, big-endian in bytes 9 and 10), which the phone confirms
 *   with a type 0x11 frame carrying 0x00. When the scale could not measure (no skin contact: socks, feet off the
 *   electrodes, stepped off early) the resistance is 0xFFFF ({@link #NO_IMPEDANCE}, seen on Doc's scale 19.11.2026);
 *   it wants that frame confirmed all the same. The scale itself sends nothing else - fat, water and muscle are
 *   computed on the phone (BodyComposition).
 * - Right after subscribing the phone greets the scale with three fixed frames (types 0x33, 0x44, 0x17).
 */
final class Vt701 {
    static final UUID SERVICE = uuid16(0xFFF0);
    static final UUID NOTIFY = uuid16(0xFFF1);
    static final UUID WRITE = uuid16(0xFFF2);
    /** The standard descriptor that switches notifications on (Client Characteristic Configuration). */
    static final UUID CCCD = uuid16(0x2902);
    /** The scale advertises a name starting with this; matched without regard to case. */
    static final String NAME_PREFIX = "vitafit";

    static final int FROM_SCALE = 0x5A, FROM_PHONE = 0xA5, PRODUCT = 0x26, END = 0xAA;
    static final int TYPE_WEIGHT = 0x10, TYPE_IMPEDANCE = 0x11;
    static final int STABLE = 0x02;
    /** The resistance the scale sends when it could not measure one. */
    static final int NO_IMPEDANCE = 0xFFFF;

    private Vt701() {
    }

    static UUID uuid16(int shortId) {
        return UUID.fromString(String.format("0000%04x-0000-1000-8000-00805f9b34fb", shortId));
    }

    static boolean isScaleName(String name) {
        return name != null && name.toLowerCase(java.util.Locale.ROOT).startsWith(NAME_PREFIX);
    }

    /** The three greeting frames the phone sends once notifications are on. */
    static List<byte[]> hello() {
        List<byte[]> l = new ArrayList<>();
        l.add(command(0x33, 0x00));
        l.add(command(0x44));
        l.add(command(0x17, 0x01));
        return l;
    }

    /** "I have the stable weight" - asks the scale to measure the resistance. */
    static byte[] ackWeight() {
        return command(TYPE_WEIGHT, STABLE);
    }

    /** "I have the resistance". */
    static byte[] ackImpedance() {
        return command(TYPE_IMPEDANCE, 0x00);
    }

    /** A phone-to-scale frame of the given type around the payload bytes (each 0..255). */
    static byte[] command(int type, int... payload) {
        return frame(FROM_PHONE, type, payload);
    }

    static byte[] frame(int start, int type, int... payload) {
        byte[] f = new byte[payload.length + 6];
        f[0] = (byte) start;
        f[1] = (byte) (payload.length + 4);   // 0x26, type, payload, check, end
        f[2] = (byte) PRODUCT;
        f[3] = (byte) type;
        for (int i = 0; i < payload.length; i++) f[4 + i] = (byte) payload[i];
        f[f.length - 2] = (byte) xor(f, 1, f.length - 2);
        f[f.length - 1] = (byte) END;
        return f;
    }

    /** The XOR of {@code f[from]} up to, not including, {@code f[to]}. */
    static int xor(byte[] f, int from, int to) {
        int x = 0;
        for (int i = from; i < to; i++) x ^= f[i] & 0xFF;
        return x;
    }

    private static int u8(byte[] f, int i) {
        return f[i] & 0xFF;
    }

    private static int u16(byte[] f, int i) {
        return (u8(f, i) << 8) | u8(f, i + 1);
    }

    /** True for a complete, intact frame from the scale: start, product, end, length and check all match. */
    static boolean isScaleFrame(byte[] f) {
        return f != null && f.length >= 6
                && u8(f, 0) == FROM_SCALE && u8(f, 2) == PRODUCT && u8(f, f.length - 1) == END
                && u8(f, 1) == f.length - 2
                && xor(f, 1, f.length - 2) == u8(f, f.length - 2);
    }

    /**
     * The intact scale frames inside one notification. Normally a notification is exactly one frame; should the
     * phone ever see two glued together, or a stray byte in front, they are still found.
     */
    static List<byte[]> frames(byte[] data) {
        List<byte[]> out = new ArrayList<>();
        if (data == null) return out;
        int i = 0;
        while (i + 1 < data.length) {
            if (u8(data, i) == FROM_SCALE) {
                int end = i + 2 + u8(data, i + 1);
                if (end <= data.length) {
                    byte[] f = java.util.Arrays.copyOfRange(data, i, end);
                    if (isScaleFrame(f)) {
                        out.add(f);
                        i = end;
                        continue;
                    }
                }
            }
            i++;
        }
        return out;
    }

    static int type(byte[] f) {
        return u8(f, 3);
    }

    /** A weight frame (stable or still settling): the weight in units of 10 g, or -1. */
    static int weight(byte[] f) {
        if (!isScaleFrame(f) || type(f) != TYPE_WEIGHT || f.length < 12) return -1;
        return u16(f, 8);
    }

    /** Whether a weight frame says the weight has settled. */
    static boolean isStable(byte[] f) {
        return weight(f) >= 0 && u8(f, 4) == STABLE;
    }

    /** A resistance frame: the resistance between the feet in ohms (0 or {@link #NO_IMPEDANCE}: none), or -1. */
    static int impedance(byte[] f) {
        if (!isScaleFrame(f) || type(f) != TYPE_IMPEDANCE || f.length < 13) return -1;
        return u16(f, 9);
    }
}
