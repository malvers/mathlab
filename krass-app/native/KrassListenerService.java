package de.docalvers.krass;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import org.json.JSONObject;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;
import org.vosk.android.StorageService;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Always-on foreground service: feeds the microphone into Vosk (offline German model) and counts
 * every spoken "krass". Keyless, on-device, no cloud. Counts are persisted per day in SharedPreferences
 * (key = yyyy-MM-dd); the day rolls over automatically because each result is written under today's key.
 * START_STICKY + foreground keep it alive; the persistent notification is mandatory on modern Android.
 */
public class KrassListenerService extends Service implements RecognitionListener {

    public static final String CHANNEL = "krass_counter";
    public static final int NOTIF_ID = 1;
    public static final String PREFS = "krass_counts";      // SharedPreferences: "yyyy-MM-dd" -> int
    public static volatile boolean running = false;          // read by the plugin for getStats().running

    // Words that count (case-insensitive). "krass" + the agent wake-word. Two spellings of the new
    // word, because Vosk's transcription of an invented word is unstable. NOTE: the German small model
    // knows "krass" well; "solita/solida" are not German words, so the model may hear them as "solide"
    // (a real word) or miss them — widen this list (e.g. add "solide") if recognition misses it.
    private static final String[] TRIGGERS = { "krass", "solita", "solida" };

    private Model model;
    private SpeechService speech;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onCreate() {
        super.onCreate();
        createChannel();
        startInForeground(todayCount());
        running = true;
        initVosk();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) { return START_STICKY; }

    // Unpack the bundled assets/model into internal storage once, then listen continuously.
    private void initVosk() {
        StorageService.unpack(this, "model", "model",
                (m) -> {
                    model = m;
                    Recognizer recognizer = new Recognizer(m, 16000.0f);
                    speech = new SpeechService(recognizer, 16000.0f);
                    speech.startListening(this);
                },
                (e) -> stopSelf());     // model missing/corrupt → give up cleanly
    }

    // ---- RecognitionListener: count on FINAL results only (partials would double-count) ----
    @Override public void onPartialResult(String hypothesis) { }
    @Override public void onResult(String hypothesis) { countKrass(hypothesis); }
    @Override public void onFinalResult(String hypothesis) { countKrass(hypothesis); }
    @Override public void onError(Exception e) { }     // transient mic/recognizer hiccup → keep running
    @Override public void onTimeout() { }

    private void countKrass(String hypothesis) {
        if (hypothesis == null) return;
        String text;
        try { text = new JSONObject(hypothesis).optString("text", ""); } catch (Exception e) { text = ""; }
        if (text.trim().isEmpty()) return;
        int hits = 0;
        for (String w : text.split("\\s+")) {
            for (String t : TRIGGERS) if (w.equalsIgnoreCase(t)) { hits++; break; }
        }
        if (hits == 0) return;
        String day = today();
        SharedPreferences p = prefs();
        int total = p.getInt(day, 0) + hits;
        p.edit().putInt(day, total).apply();
        notifyCount(total);
    }

    // ---- notification / foreground ----
    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "KRASS Zähler", NotificationManager.IMPORTANCE_LOW);
            ch.setShowBadge(false);
            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(ch);
        }
    }

    private void startInForeground(int count) {
        Notification n = buildNotification(count);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
        } else {
            startForeground(NOTIF_ID, n);
        }
    }

    private void notifyCount(int count) {
        ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).notify(NOTIF_ID, buildNotification(count));
    }

    private Notification buildNotification(int count) {
        PendingIntent tap = PendingIntent.getActivity(this, 0,
                new Intent(this, MainActivity.class),
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        return new NotificationCompat.Builder(this, CHANNEL)
                .setContentTitle("KRASS heute: " + count)
                .setContentText("Zählt im Hintergrund mit …")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .setOngoing(true)
                .setContentIntent(tap)
                .build();
    }

    // ---- helpers ----
    private SharedPreferences prefs() { return getSharedPreferences(PREFS, Context.MODE_PRIVATE); }
    private String today() { return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date()); }
    private int todayCount() { return prefs().getInt(today(), 0); }

    @Override
    public void onDestroy() {
        if (speech != null) { speech.stop(); speech.shutdown(); }
        if (model != null) model.close();
        running = false;
        super.onDestroy();
    }
}
