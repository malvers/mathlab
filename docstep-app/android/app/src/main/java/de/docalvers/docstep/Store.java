package de.docalvers.docstep;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Learned walks in the app's private folder, one file per walk (gait is biometric data: nothing leaves the
 * phone, the app has no internet permission and no backup). A file keeps the whole resampled recording, not
 * the template, so a better detector or other parameters in a later version apply to old walks too.
 * Plain Java (a folder, no Context), so the tests can use it.
 */
final class Store {
    private Store() {
    }

    private static final int MAGIC = 0x44535450;   // "DSTP"
    private static final int VERSION = 1;

    /** One learned walk: who, when, and the three axes at Gait.RATE. */
    static final class Walk {
        final String name;
        final long created;
        final float rate;
        final float[][] xyz;
        File file;

        Walk(String name, long created, float rate, float[][] xyz) {
            this.name = name;
            this.created = created;
            this.rate = rate;
            this.xyz = xyz;
        }
    }

    static File save(File dir, Walk w) throws IOException {
        if (!dir.isDirectory() && !dir.mkdirs()) throw new IOException("no folder " + dir);
        File f = new File(dir, w.created + ".walk");
        for (int i = 1; f.exists(); i++) f = new File(dir, w.created + "-" + i + ".walk");
        File tmp = new File(dir, f.getName() + ".tmp");
        try (DataOutputStream out = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(tmp)))) {
            out.writeInt(MAGIC);
            out.writeInt(VERSION);
            out.writeUTF(w.name);
            out.writeLong(w.created);
            out.writeFloat(w.rate);
            int n = w.xyz[0].length;
            out.writeInt(n);
            for (int a = 0; a < 3; a++) for (int i = 0; i < n; i++) out.writeFloat(w.xyz[a][i]);
        }
        if (!tmp.renameTo(f)) throw new IOException("cannot write " + f);
        w.file = f;
        return f;
    }

    static Walk read(File f) throws IOException {
        try (DataInputStream in = new DataInputStream(new BufferedInputStream(new FileInputStream(f)))) {
            if (in.readInt() != MAGIC) throw new IOException("not a walk: " + f);
            int version = in.readInt();
            if (version != VERSION) throw new IOException("unknown version " + version);
            String name = in.readUTF();
            long created = in.readLong();
            float rate = in.readFloat();
            int n = in.readInt();
            if (n < 0 || n > 10_000_000) throw new IOException("bad length " + n);
            float[][] xyz = new float[3][n];
            for (int a = 0; a < 3; a++) for (int i = 0; i < n; i++) xyz[a][i] = in.readFloat();
            Walk w = new Walk(name, created, rate, xyz);
            w.file = f;
            return w;
        }
    }

    /** All walks, oldest first; unreadable files are skipped. */
    static List<Walk> all(File dir) {
        List<Walk> out = new ArrayList<>();
        File[] files = dir.listFiles((d, n) -> n.endsWith(".walk"));
        if (files == null) return out;
        for (File f : files) {
            try {
                out.add(read(f));
            } catch (IOException e) {
                // a broken file must not take the others with it
            }
        }
        out.sort((a, b) -> Long.compare(a.created, b.created));
        return out;
    }

    /** Walks grouped by name, in the order each person was first learned. */
    static Map<String, List<Walk>> byName(List<Walk> walks) {
        Map<String, List<Walk>> m = new LinkedHashMap<>();
        for (Walk w : walks) m.computeIfAbsent(w.name, k -> new ArrayList<>()).add(w);
        return m;
    }

    /** Deletes every walk of this person; returns how many. */
    static int delete(File dir, String name) {
        int n = 0;
        for (Walk w : all(dir)) if (w.name.equals(name) && w.file.delete()) n++;
        return n;
    }

    /** The people with their templates, rebuilt from the stored walks (walks too short for a template are left out). */
    static List<Gait.Person> people(List<Walk> walks) {
        List<Gait.Person> out = new ArrayList<>();
        for (Map.Entry<String, List<Walk>> e : byName(walks).entrySet()) {
            Gait.Person p = new Gait.Person(e.getKey());
            for (Walk w : e.getValue()) {
                try {
                    p.templates.add(new Gait.Template(Gait.segments(atRate(w))));
                } catch (IllegalArgumentException ignored) {
                    // not enough walking in this one
                }
            }
            if (!p.templates.isEmpty()) out.add(p);
        }
        return out;
    }

    /** The walk at Gait.RATE (only differs when a later version changes the rate). */
    static float[][] atRate(Walk w) {
        if (Math.abs(w.rate - Gait.RATE) < 1e-3) return w.xyz;
        int n = w.xyz[0].length;
        long[] t = new long[n];
        for (int i = 0; i < n; i++) t[i] = Math.round(i * 1e9 / w.rate);
        return Gait.resample3(t, w.xyz[0], w.xyz[1], w.xyz[2], n);
    }
}
