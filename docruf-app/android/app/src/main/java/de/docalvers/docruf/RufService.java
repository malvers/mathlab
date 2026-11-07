package de.docalvers.docruf;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Person;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Keeps one open line to the call topic on ntfy.sh. Every call becomes a notification, a receipt for the
 * Mac (the message id on <topic>-ok, so the watcher knows the phone got it) and, when Doc wants it,
 * Solita's voice from the phone. Runs as a foreground service, restarts after a reboot or an update.
 */
public class RufService extends Service {
    static final String TAG = "DocRuf";
    static final String HOST = "https://ntfy.sh/";
    static final String CH_LINE = "leitung";
    static final String CH_CALL = "rufe";
    static final int NOTE_LINE = 1;
    static final long STALE_S = 600;            // a call found after a long gap is only listed, not rung

    // read by the screen once a second
    static volatile String state = "aus";        // aus | verbinde | verbunden | getrennt | kein Kanal
    static volatile long lastBeat;               // ms of the last line from ntfy.sh

    private volatile boolean running;
    private volatile HttpURLConnection conn;
    private Thread listener;

    public static void start(Context c) {
        c.startForegroundService(new Intent(c, RufService.class));
    }

    @Override
    public void onCreate() {
        super.onCreate();
        channels(this);
        running = true;
        listener = new Thread(this::listen, "docruf-listen");
        listener.start();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification n = new Notification.Builder(this, CH_LINE)
                .setSmallIcon(R.drawable.ic_ruf)
                .setContentTitle("DocCall hört zu")
                .setContentText("Solita kann Dich hier rufen.")
                .setOngoing(true)
                .setContentIntent(openApp(this))
                .build();
        if (Build.VERSION.SDK_INT >= 34) startForeground(NOTE_LINE, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_REMOTE_MESSAGING);
        else startForeground(NOTE_LINE, n);
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        running = false;
        HttpURLConnection c = conn;
        if (c != null) c.disconnect();
        if (listener != null) listener.interrupt();
        state = "aus";
        super.onDestroy();
    }

    static void channels(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        NotificationChannel line = new NotificationChannel(CH_LINE, "Leitung", NotificationManager.IMPORTANCE_LOW);
        line.setShowBadge(false);
        NotificationChannel call = new NotificationChannel(CH_CALL, "Rufe", NotificationManager.IMPORTANCE_HIGH);
        call.enableVibration(true);
        call.setVibrationPattern(new long[]{0, 400, 200, 400, 200, 400});
        nm.createNotificationChannel(line);
        nm.createNotificationChannel(call);
    }

    static PendingIntent openApp(Context c) {
        Intent i = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(c, 0, i, PendingIntent.FLAG_IMMUTABLE);
    }

    /** The stream: one JSON object per line, an open event, a keepalive every 45 s, and the calls. */
    private void listen() {
        String topic = BuildConfig.TOPIC;
        if (topic.isEmpty()) {
            state = "kein Kanal";
            return;
        }
        int wait = 2;
        while (running) {
            state = "verbinde";
            try {
                // since = time of the last line we saw, so a call sent during a gap still comes in (ntfy.sh keeps 12 h)
                long since = Rufe.prefs(this).getLong("since", 0);
                URL u = new URL(HOST + topic + "/json" + (since > 0 ? "?since=" + since : ""));
                HttpURLConnection c = (HttpURLConnection) u.openConnection();
                conn = c;
                c.setConnectTimeout(15000);
                c.setReadTimeout(120000);
                BufferedReader in = new BufferedReader(new InputStreamReader(c.getInputStream(), StandardCharsets.UTF_8));
                String line;
                while (running && (line = in.readLine()) != null) {
                    if (line.isEmpty()) continue;
                    JSONObject m = new JSONObject(line);
                    lastBeat = System.currentTimeMillis();
                    String event = m.optString("event");
                    if (event.equals("open")) {
                        state = "verbunden";
                        wait = 2;
                    } else if (event.equals("message")) {
                        arrived(topic, m);
                    }
                    if (m.optLong("time") > 0) Rufe.prefs(this).edit().putLong("since", m.optLong("time")).apply();
                }
                in.close();
            } catch (Exception e) {
                Log.w(TAG, "line dropped: " + e);
            }
            if (!running) break;
            state = "getrennt";
            try {
                Thread.sleep(wait * 1000L);
            } catch (InterruptedException e) {
                break;
            }
            wait = Math.min(wait * 2, 30);
        }
    }

    private void arrived(String topic, JSONObject m) {
        String id = m.optString("id");
        if (id.isEmpty() || Rufe.has(this, id)) return;
        long time = m.optLong("time");
        JSONObject att = m.optJSONObject("attachment");
        String audio = "";
        if (att != null && (att.optString("type").startsWith("audio") || att.optString("name").endsWith(".mp3"))) {
            audio = att.optString("url");
        }
        String title = m.optString("title", "Solita");
        if (title.isEmpty()) title = "Solita";
        String text = m.optString("message");
        Rufe.add(this, id, time, title, text, audio);
        if (System.currentTimeMillis() / 1000 - time > STALE_S) return;

        NotificationManager nm = getSystemService(NotificationManager.class);
        boolean speak = Rufe.speak(this);
        // DocCall in front and speaking aloud: no banner, Solita appears in the circle with her sentence under it
        // (Doc, 07.11.2026); otherwise a message from her, with her face, and on a dark phone her call screen
        boolean inApp = MainActivity.visible && speak;
        if (!inApp) nm.notify(id.hashCode(), callNote(id, time, title, text));
        // a receipt promises that Doc notices the call, otherwise the Mac falls back to its speakers
        if ((inApp || nm.areNotificationsEnabled() || speak) && receipt(topic, id)) Rufe.acked(this, id);
        if (speak) Ansage.get(this).say(text, audio);
    }

    /**
     * The call as a message from Solita, with her round portrait (a conversation, so Android shows her face),
     * and a full-screen intent: on a locked or dark phone DocCall itself comes up like an incoming call
     * ("Denk an den Film Her", Doc, 07.11.2026). With the phone in use Android shows the banner instead.
     */
    private Notification callNote(String id, long time, String title, String text) {
        Notification.Builder b = new Notification.Builder(this, CH_CALL)
                .setSmallIcon(R.drawable.ic_ruf)
                .setColor(0xFFF5C242)
                .setCategory(Notification.CATEGORY_MESSAGE)
                .setWhen(time * 1000)
                .setShowWhen(true)
                .setAutoCancel(true)
                .setContentIntent(openApp(this))
                .setFullScreenIntent(PendingIntent.getActivity(this, id.hashCode() + 2,
                        new Intent(this, MainActivity.class).setAction(MainActivity.ACTION_CALL)
                                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP),
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE), true)
                .addAction(Sprechen.action(this, id, id.hashCode()))
                .addAction(Antwort.action(this, id, id.hashCode()));
        if (Build.VERSION.SDK_INT >= 30) {
            Person her = solita(this);
            conversation(this, her);
            Person doc = new Person.Builder().setName("Doc").build();
            Notification.MessagingStyle style = new Notification.MessagingStyle(doc)
                    .addMessage(new Notification.MessagingStyle.Message(text, time * 1000, her));
            if (!title.equals("Solita")) style.setConversationTitle(title);   // e.g. "Probe"
            b.setStyle(style).setShortcutId(SHORTCUT);
        } else {
            b.setContentTitle(title).setContentText(text).setStyle(new Notification.BigTextStyle().bigText(text));
        }
        return b.build();
    }

    static final String SHORTCUT = "solita";
    private static Icon face;

    /** Solita's portrait cut round, for her messages and her conversation. */
    static synchronized Icon solitaIcon(Context c) {
        if (face != null) return face;
        Bitmap src = BitmapFactory.decodeResource(c.getResources(), R.drawable.solita);
        int n = 256;
        Bitmap out = Bitmap.createBitmap(n, n, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(out);
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG | Paint.FILTER_BITMAP_FLAG);
        cv.drawCircle(n / 2f, n / 2f, n / 2f, p);
        p.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        cv.drawBitmap(src, null, new Rect(0, 0, n, n), p);
        src.recycle();
        face = Icon.createWithBitmap(out);
        return face;
    }

    static Person solita(Context c) {
        return new Person.Builder().setName("Solita").setKey(SHORTCUT).setIcon(solitaIcon(c)).setImportant(true).build();
    }

    /** Android shows a message with a face only for a conversation, which needs a long-lived shortcut. */
    private static void conversation(Context c, Person her) {
        if (Build.VERSION.SDK_INT < 30) return;
        try {
            ShortcutInfo si = new ShortcutInfo.Builder(c, SHORTCUT)
                    .setShortLabel("Solita")
                    .setLongLived(true)
                    .setPerson(her)
                    .setIcon(solitaIcon(c))
                    .setIntent(new Intent(c, MainActivity.class).setAction(Intent.ACTION_MAIN))
                    .build();
            c.getSystemService(ShortcutManager.class).pushDynamicShortcut(si);
        } catch (Exception e) {
            Log.w(TAG, "no conversation shortcut: " + e);
        }
    }

    /** Tells the Mac that this call reached the phone, so it does not fall back to its speakers. */
    private static boolean receipt(String topic, String id) {
        try {
            HttpURLConnection c = (HttpURLConnection) new URL(HOST + topic + "-ok").openConnection();
            c.setConnectTimeout(10000);
            c.setReadTimeout(10000);
            c.setDoOutput(true);
            c.setRequestMethod("POST");
            try (OutputStream o = c.getOutputStream()) {
                o.write(id.getBytes(StandardCharsets.UTF_8));
            }
            boolean ok = c.getResponseCode() == 200;
            c.disconnect();
            return ok;
        } catch (Exception e) {
            Log.w(TAG, "receipt failed: " + e);
            return false;
        }
    }

    /**
     * A call from the phone to itself: the whole way through ntfy.sh, receipt included. The phone cannot make
     * Solita's voice, so her recording of the sentence (res/raw/probe.mp3, Google Studio-C) travels along.
     */
    static void probe(Context c) {
        String topic = BuildConfig.TOPIC;
        if (topic.isEmpty()) return;
        String text = "Doc, hier ist Solita. Das ist mein Probe-Ruf. Wenn Du mich hörst, steht die Leitung.";
        new Thread(() -> {
            try {
                // the text rides in the query, which keeps umlauts intact; the body is the attachment
                URL u = new URL(HOST + topic + "?title=Probe&message=" + URLEncoder.encode(text, "UTF-8"));
                HttpURLConnection h = (HttpURLConnection) u.openConnection();
                h.setConnectTimeout(10000);
                h.setReadTimeout(20000);
                h.setDoOutput(true);
                h.setRequestMethod("PUT");
                h.setRequestProperty("Filename", "solita.mp3");
                try (InputStream in = c.getResources().openRawResource(R.raw.probe); OutputStream o = h.getOutputStream()) {
                    byte[] buf = new byte[16384];
                    for (int n; (n = in.read(buf)) > 0; ) o.write(buf, 0, n);
                }
                h.getResponseCode();
                h.disconnect();
            } catch (Exception e) {
                Log.w(TAG, "probe failed: " + e);
            }
        }, "docruf-probe").start();
    }
}
