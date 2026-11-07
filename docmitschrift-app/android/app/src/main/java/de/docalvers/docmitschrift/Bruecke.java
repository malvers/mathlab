package de.docalvers.docmitschrift;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * The way to Doc's Mac without the USB cable (Doc, 06.11.2026: "Können wir das nicht über R2 pipen?" -
 * "Verschlüsselt ist klar ... AES 256"). Every finished piece, the status and the timetable travel
 * AES-256-GCM encrypted through the Worker docmitschrift-app/bruecke/worker.js into a private R2 bucket;
 * the Mac (bruecke.mjs) fetches a piece and deletes it there at once. Only this phone and the Mac hold
 * the key: files/bruecke.json, put into the app's private folder over USB by "bruecke.mjs telefon".
 * Without that file nothing leaves the phone and the cable still works as before.
 * Box: "DMB1" | 12-byte nonce | ciphertext | 16-byte tag, with the object's name as additional data.
 */
final class Bruecke {
    private static final String TAG = AufnahmeService.TAG;
    private static final byte[] MAGIC = {'D', 'M', 'B', '1'};
    private static final ExecutorService ONE = Executors.newSingleThreadExecutor();   // one transfer at a time
    private static final SecureRandom RANDOM = new SecureRandom();

    static volatile String problem = "";        // the last transfer error, empty when all is well
    static volatile long lastSent;              // ms of the last piece the bridge took

    private static final class Cfg {
        String url, token;
        byte[] key;
    }

    private Bruecke() {
    }

    private static Cfg cfg(Context c) {
        File f = new File(c.getFilesDir(), "bruecke.json");
        if (!f.exists()) return null;
        try {
            JSONObject o = new JSONObject(new String(read(f), StandardCharsets.UTF_8));
            Cfg k = new Cfg();
            k.url = o.getString("url").replaceAll("/+$", "");
            k.token = o.getString("token");
            k.key = Base64.decode(o.getString("key"), Base64.DEFAULT);
            return k.key.length == 32 && k.url.startsWith("https://") ? k : null;
        } catch (Exception e) {
            Log.w(TAG, "bruecke.json unreadable", e);
            return null;
        }
    }

    static boolean configured(Context c) {
        return cfg(c) != null;
    }

    // ---- AES-256-GCM

    static byte[] seal(byte[] key, String aad, byte[] plain) throws GeneralSecurityException {
        byte[] iv = new byte[12];
        RANDOM.nextBytes(iv);
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"), new GCMParameterSpec(128, iv));
        c.updateAAD(aad.getBytes(StandardCharsets.UTF_8));
        byte[] ct = c.doFinal(plain);                       // ciphertext followed by the 16-byte tag
        byte[] box = new byte[4 + 12 + ct.length];
        System.arraycopy(MAGIC, 0, box, 0, 4);
        System.arraycopy(iv, 0, box, 4, 12);
        System.arraycopy(ct, 0, box, 16, ct.length);
        return box;
    }

    static byte[] open(byte[] key, String aad, byte[] box) throws GeneralSecurityException {
        if (box.length < 32 || box[0] != 'D' || box[1] != 'M' || box[2] != 'B' || box[3] != '1')
            throw new GeneralSecurityException("no DMB1 box");
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"), new GCMParameterSpec(128, box, 4, 12));
        c.updateAAD(aad.getBytes(StandardCharsets.UTF_8));
        return c.doFinal(box, 16, box.length - 16);
    }

    // ---- the Worker

    /** One request; the answer's body lands in `out` when it is 200. Returns the HTTP code. */
    private static int http(Cfg k, String method, String route, byte[] body, ByteArrayOutputStream out) throws IOException {
        HttpURLConnection h = (HttpURLConnection) new URL(k.url + route).openConnection();
        try {
            h.setConnectTimeout(15000);
            h.setReadTimeout(90000);
            h.setRequestMethod(method);
            h.setRequestProperty("Authorization", "Bearer " + k.token);
            if (body != null) {
                h.setDoOutput(true);
                h.setFixedLengthStreamingMode(body.length);
                h.setRequestProperty("Content-Type", "application/octet-stream");
                try (OutputStream o = h.getOutputStream()) {
                    o.write(body);
                }
            }
            int code = h.getResponseCode();
            if (code == 200 && out != null) {
                try (InputStream in = h.getInputStream()) {
                    byte[] buf = new byte[16384];
                    for (int n; (n = in.read(buf)) > 0; ) out.write(buf, 0, n);
                }
            }
            return code;
        } finally {
            h.disconnect();
        }
    }

    /** Sends every finished piece, oldest first. A piece is deleted here only once the bridge has taken it. */
    static void sendPieces(Context c) {
        Context app = c.getApplicationContext();
        ONE.execute(() -> {
            Cfg k = cfg(app);
            if (k == null) return;
            File[] all = AufnahmeService.dir(app).listFiles((d, n) -> n.matches("\\d{8}-\\d{6}(" + AufnahmeService.HAND_SUFFIX + ")?\\.m4a"));
            if (all == null || all.length == 0) return;
            Arrays.sort(all);
            for (File f : all) {
                try {
                    byte[] box = seal(k.key, "stueck/" + f.getName(), read(f));
                    int code = http(k, "PUT", "/stueck/" + f.getName(), box, null);
                    if (code / 100 != 2) {
                        problem = "Brücke antwortet " + code + " – das Stück bleibt hier";
                        return;
                    }
                    if (!f.delete()) Log.w(TAG, "sent but not deleted: " + f.getName());
                    lastSent = System.currentTimeMillis();
                    problem = "";
                } catch (IOException e) {
                    problem = "Kein Netz zur Brücke – die Stücke bleiben hier, bis es wieder geht";
                    return;
                } catch (GeneralSecurityException e) {
                    problem = "Verschlüsseln ging nicht: " + e.getMessage();
                    return;
                }
            }
        });
    }

    /** What the phone is doing, for the Mac (and the "Notizen" button of the plans). */
    static void sendStatus(Context c, JSONObject status) {
        Context app = c.getApplicationContext();
        byte[] plain = status.toString().getBytes(StandardCharsets.UTF_8);
        ONE.execute(() -> {
            Cfg k = cfg(app);
            if (k == null) return;
            try {
                http(k, "PUT", "/status", seal(k.key, "status", plain), null);
            } catch (Exception e) {
                Log.i(TAG, "status not sent: " + e);
            }
        });
    }

    /** Fetches Doc's timetable from the bridge; `then` runs on the main thread once it is stored. */
    static void fetchPlan(Context c, Runnable then) {
        Context app = c.getApplicationContext();
        ONE.execute(() -> {
            Cfg k = cfg(app);
            if (k == null) return;
            try {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                if (http(k, "GET", "/plan", null, out) != 200) return;
                byte[] plain = open(k.key, "plan", out.toByteArray());
                if (Plan.store(app, new String(plain, StandardCharsets.UTF_8)) && then != null)
                    new Handler(Looper.getMainLooper()).post(then);
            } catch (Exception e) {
                Log.i(TAG, "plan not fetched: " + e);
            }
        });
    }

    static byte[] read(File f) throws IOException {
        try (InputStream in = new FileInputStream(f)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream((int) Math.max(32, f.length()));
            byte[] buf = new byte[65536];
            for (int n; (n = in.read(buf)) > 0; ) out.write(buf, 0, n);
            return out.toByteArray();
        }
    }
}
