package de.docalvers.tracker;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
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

/**
 * Always-on foreground service: feeds the mic into Vosk (offline German model) and detects the
 * wake-word "Solita". Keyless, on-device. On a hit it calls the plugin bridge, which forwards the
 * text to the WebView so Solita's existing wake logic reacts. This is Stufe B — it replaces the Web
 * SpeechRecognition the Android WebView lacks.
 *
 * Weg 1 (wakeword-solita-erkennung.md): a fixed word-list GRAMMAR so the invented word "Solita"
 * matches far better than free recognition (which hears "solide"). Free dictation of the QUERY after
 * the wake word is the next step (would switch the recognizer to the full model).
 */
public class SolitaVoiceService extends Service implements RecognitionListener {

    public static final String CHANNEL = "solita_voice";
    public static final int NOTIF_ID = 7;
    public static volatile boolean running = false;
    public static volatile SolitaVoicePlugin bridge;   // set by the plugin; receives wake hits

    // Wake-word grammar (Weg 1): restrict recognition to the wake word + [unk]. Two spellings because
    // Vosk's transcription of an invented word is unstable; widen if it still misses.
    private static final String GRAMMAR = "[\"solita\", \"solida\", \"[unk]\"]";

    private Model model;
    private SpeechService speech;

    @Nullable @Override public IBinder onBind(Intent intent) { return null; }

    @Override public void onCreate() {
        super.onCreate();
        createChannel();
        startInForeground();
        running = true;
        initVosk();
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) { return START_STICKY; }

    // Unpack the bundled assets/model into internal storage once, then listen continuously.
    private void initVosk() {
        StorageService.unpack(this, "model", "model",
                (m) -> {
                    model = m;
                    try {
                        Recognizer recognizer = new Recognizer(m, 16000.0f, GRAMMAR);
                        speech = new SpeechService(recognizer, 16000.0f);
                        speech.startListening(this);
                    } catch (java.io.IOException e) {
                        stopSelf();     // recognizer/audio init failed → give up cleanly
                    }
                },
                (e) -> stopSelf());     // model missing/corrupt → give up cleanly
    }

    // ---- RecognitionListener: act on FINAL results only ----
    @Override public void onPartialResult(String hypothesis) { }
    @Override public void onResult(String hypothesis) { handle(hypothesis); }
    @Override public void onFinalResult(String hypothesis) { handle(hypothesis); }
    @Override public void onError(Exception e) { }     // transient hiccup → keep running
    @Override public void onTimeout() { }

    private void handle(String hypothesis) {
        if (hypothesis == null) return;
        String text;
        try { text = new JSONObject(hypothesis).optString("text", ""); } catch (Exception e) { text = ""; }
        text = text.trim();
        if (text.isEmpty()) return;
        boolean wake = false;
        for (String w : text.split("\\s+")) {
            if (w.equalsIgnoreCase("solita") || w.equalsIgnoreCase("solida")) { wake = true; break; }
        }
        SolitaVoicePlugin b = bridge;
        if (wake && b != null) b.emitWake(text);
    }

    // ---- notification / foreground ----
    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Solita hört zu", NotificationManager.IMPORTANCE_LOW);
            ch.setShowBadge(false);
            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(ch);
        }
    }

    private void startInForeground() {
        Notification n = buildNotification();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
        } else {
            startForeground(NOTIF_ID, n);
        }
    }

    private Notification buildNotification() {
        PendingIntent tap = PendingIntent.getActivity(this, 0,
                new Intent(this, MainActivity.class),
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        return new NotificationCompat.Builder(this, CHANNEL)
                .setContentTitle("Solita hört aufs Weckwort")
                .setContentText("Sag „Solita“ …")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .setOngoing(true)
                .setContentIntent(tap)
                .build();
    }

    @Override public void onDestroy() {
        if (speech != null) { speech.stop(); speech.shutdown(); }
        if (model != null) model.close();
        running = false;
        bridge = null;
        super.onDestroy();
    }
}
