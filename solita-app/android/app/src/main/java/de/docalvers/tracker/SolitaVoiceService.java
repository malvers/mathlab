package de.docalvers.tracker;

import android.app.KeyguardManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

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
 * wake-word "Solita". Keyless, on-device. On a hit it brings MainActivity to the foreground (over
 * the lock screen) and calls the plugin bridge, which signals the WebView so Solita's existing wake
 * logic reacts. This is Stufe B — it replaces the Web SpeechRecognition while the app is
 * backgrounded / locked (where the WebView's Web-SR is suspended).
 *
 * NATIVE-LIFECYCLE-DRIVEN mic ownership (see plan): the SERVICE (the FGS) stays ALIVE the whole
 * session — Android 14 forbids (re)starting a mic-FGS from the background, so we NEVER stop+start
 * the service from background. Only the RECOGNIZER toggles, via setListening(boolean):
 *   - FOREGROUND (MainActivity.onResume → setListening(false)): the recognizer is STOPPED and the
 *     AudioRecord is FREED so the foreground Web-SR can own the mic and run the proven conversation.
 *   - BACKGROUND / LOCKED (MainActivity.onPause → setListening(true)): the recognizer is (re)started
 *     WITHIN the already-alive FGS (allowed) so Vosk listens for the wake word with the screen off.
 * The Model stays loaded across toggles; only the Recognizer + SpeechService (AudioRecord) churn.
 *
 * Weg 1 (wakeword-solita-erkennung.md): a fixed word-list GRAMMAR so the invented word "Solita"
 * matches far better than free recognition. "Solita" is OOV → the German model transcribes it as the
 * IN-VOCAB homophones "solide"/"solider"; wake on those, gated to a short single/double token to cut
 * in-sentence "solide" false-fires.
 */
public class SolitaVoiceService extends Service implements RecognitionListener {

    public static final String CHANNEL = "solita_voice";
    public static final String CHANNEL_WAKE = "solita_wake";
    public static final int NOTIF_ID = 7;
    public static final int NOTIF_WAKE_ID = 8;
    public static volatile boolean running = false;
    public static volatile SolitaVoicePlugin bridge;   // set by the plugin; receives wake hits

    // Current desired recognizer state. Default FALSE (FIX 3): the service is started ONCE while foreground
    // (on login) — at that moment Web-SR must own the mic, not Vosk. We must NOT grab the AudioRecord just
    // because initVosk/onStartCommand finished while the activity is resumed. The recognizer only starts once
    // the lifecycle drives us into the background (MainActivity.onPause → setListening(true)). Starting is
    // additionally gated on !MainActivity.activityResumed so a post-login / OS-restart can never steal the
    // foreground mic. Toggled by setListening().
    private static volatile boolean wantListening = false;
    // Static service handle so the activity lifecycle (MainActivity.onResume/onPause) can drive the
    // recognizer without binding. Set in onCreate, cleared in onDestroy.
    private static volatile SolitaVoiceService instance;

    // Wake-word grammar (Weg 1): restrict recognition to the wake word + [unk]. Two spellings because
    // Vosk's transcription of an invented word is unstable; widen if it still misses.
    private static final String GRAMMAR = "[\"solide\", \"solider\", \"[unk]\"]";   // "Solita" is OOV → Vosk transcribes it as the IN-VOCAB words "solide"/"solider"; wake on those

    // Single-token wake gate: only fire WAKE when the FINAL text is a short utterance (<= this many
    // tokens) dominated by a wake token — i.e. the user said just "Solita", not a sentence that merely
    // happens to contain the everyday word "solide".
    private static final int WAKE_MAX_TOKENS = 2;

    private Model model;
    private SpeechService speech;
    // FIX 1 (recognizer leak): hold the Recognizer so stopRecognizer() can close() it. SpeechService.shutdown()
    // frees the AudioRecord but does NOT free the native Recognizer — without this it leaks each toggle.
    private Recognizer recognizer;
    // FIX 2 (onPause mic-acquire race): bounded retry counter for startRecognizer(). When the foreground Web-SR
    // hasn't released the AudioRecord yet, the first (re)start throws IOException; we retry a few times instead
    // of silently going deaf. Reset to 0 on a successful start.
    private int startRetries = 0;
    private final Handler main = new Handler(Looper.getMainLooper());
    // FIX 6 (main-thread block): run the recognizer TEARDOWN (stop()/shutdown()/close(), which join() the audio
    // thread) on a background single-thread executor, so MainActivity.onResume never blocks the UI thread on join().
    private final java.util.concurrent.ExecutorService teardownExec =
            java.util.concurrent.Executors.newSingleThreadExecutor();

    @Nullable @Override public IBinder onBind(Intent intent) { return null; }

    @Override public void onCreate() {
        super.onCreate();
        instance = this;
        createChannels();
        startInForeground();
        running = true;
        android.util.Log.i("SolitaVosk", "service onCreate — FGS up, starting Vosk init");
        initVosk();
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        // FIX 3: on a (re)start command (incl. START_STICKY OS restart) only grab the mic if we want to listen
        // AND the activity is not foreground. Guards a post-login / OS-restart mic-steal while Web-SR is active.
        if (wantListening && !MainActivity.activityResumed && model != null && speech == null) startRecognizer();
        return START_STICKY;
    }

    /**
     * NATIVE-LIFECYCLE mic ownership. Real stop/start of the RECOGNIZER (not setPause), so the
     * AudioRecord device is actually freed/re-acquired — the model + service stay alive.
     *   listen=false → STOP: free the mic so foreground Web-SR can use it (call from onResume).
     *   listen=true  → START: re-open the AudioRecord within the already-alive FGS (call from onPause).
     * Safe to call from any thread; the actual recognizer churn is marshalled to the main thread.
     * Static + null-guarded so the activity can call it whether or not the service is up yet.
     */
    public static void setListening(boolean listen) {
        wantListening = listen;
        SolitaVoiceService self = instance;
        if (self == null) return;          // service not up yet → wantListening is honored once initVosk finishes
        self.applyListening(listen);
    }

    private void applyListening(final boolean listen) {
        main.post(() -> {
            if (model == null) {
                // model still unpacking → initVosk will honor wantListening when it finishes
                android.util.Log.i("SolitaVosk", "applyListening(" + listen + ") deferred — model not ready");
                return;
            }
            if (listen) startRecognizer();
            else        stopRecognizer();
        });
    }

    // START: build a fresh Recognizer (grammar) + SpeechService and acquire the AudioRecord. No-op if
    // already listening. Model is reused — only the recognizer/audio is (re)created. Runs on the main thread
    // (the SpeechService ctor does NOT join()); cheap.
    private void startRecognizer() {
        if (speech != null) return;        // already listening
        if (model == null) return;         // not ready
        try {
            // FIX 1: keep the Recognizer in a field so stopRecognizer() can close() it (no native leak).
            recognizer = new Recognizer(model, 16000.0f, GRAMMAR);
            speech = new SpeechService(recognizer, 16000.0f);
            speech.startListening(this);
            startRetries = 0;              // FIX 2: clean acquisition → reset the retry budget
            android.util.Log.i("SolitaVosk", "recognizer STARTED — LISTENING (grammar: solide/solider)");
        } catch (java.io.IOException e) {
            android.util.Log.e("SolitaVosk", "recognizer/audio (re)start FAILED", e);
            speech = null;
            // FIX 1: a failed start may still have constructed the Recognizer → close it so we don't leak.
            try { if (recognizer != null) { recognizer.close(); recognizer = null; } } catch (Exception ignore) {}
            // FIX 2 (onPause mic-acquire race): the foreground Web-SR may not have released the AudioRecord yet.
            // RETRY (bounded) instead of silently going deaf, covering that handoff window.
            if (wantListening && speech == null && startRetries < 4) {
                startRetries++;
                android.util.Log.i("SolitaVosk", "recognizer start retry " + startRetries + "/4 in 250ms (mic likely still held by Web-SR)");
                main.postDelayed(() -> { if (wantListening && speech == null) startRecognizer(); }, 250);
            }
        }
    }

    // STOP: tear down the Recognizer + SpeechService and FREE the AudioRecord. Keeps the model loaded
    // so the next start is cheap. No-op if already stopped. FIX 6: the teardown (stop()/shutdown()/close())
    // join()s the audio thread, so we run it on a background executor — onResume must not block the UI thread.
    private void stopRecognizer() {
        final SpeechService s = speech;
        final Recognizer r = recognizer;
        speech = null;
        recognizer = null;
        startRetries = 0;                  // FIX 2: cancel any pending retry intent (we explicitly stopped)
        if (s == null && r == null) return;
        teardownExec.execute(() -> {
            // Order (FIX 1): stop() → shutdown() (frees the AudioRecord) → recognizer.close() (frees the native Recognizer).
            if (s != null) {
                try { s.stop(); } catch (Exception ignore) {}
                try { s.shutdown(); } catch (Exception ignore) {}   // frees the AudioRecord device
            }
            try { if (r != null) r.close(); } catch (Exception ignore) {}   // FIX 1: free the Recognizer (never the Model)
            android.util.Log.i("SolitaVosk", "recognizer STOPPED — mic freed + recognizer closed (model kept)");
        });
    }

    // Unpack the bundled assets/model into internal storage once, then listen IF we currently want to.
    private void initVosk() {
        android.util.Log.i("SolitaVosk", "unpack begin (assets/model → internal)");
        StorageService.unpack(this, "model", "model",
                (m) -> {
                    model = m;
                    android.util.Log.i("SolitaVosk", "unpack OK — model loaded, wantListening=" + wantListening
                            + " activityResumed=" + MainActivity.activityResumed);
                    // FIX 3: only grab the mic if we WANT to listen AND the activity is not in the foreground.
                    // While foreground the Web-SR owns the mic; starting here would steal it (post-login / OS restart).
                    if (wantListening && !MainActivity.activityResumed) startRecognizer();
                },
                (e) -> { android.util.Log.e("SolitaVosk", "model unpack FAILED: " + e); stopSelf(); });   // model missing/corrupt → give up cleanly
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
        android.util.Log.i("SolitaVosk", "heard: \"" + text + "\"");   // MEASURE: tag=SolitaVosk → adb logcat

        // Single-token wake gate: split into tokens, require a SHORT utterance dominated by a wake token.
        // This fires on "solita"/"solide"/"solider" said alone (or as a 2-word slip) but NOT on a sentence
        // that merely contains the everyday word "solide".
        String[] tokens = text.split("\\s+");
        boolean hasWakeToken = false;
        for (String w : tokens) {
            if (w.equalsIgnoreCase("solide") || w.equalsIgnoreCase("solider")) { hasWakeToken = true; break; }
        }
        boolean wake = hasWakeToken && tokens.length <= WAKE_MAX_TOKENS;
        if (hasWakeToken && !wake) {
            android.util.Log.i("SolitaVosk", "wake token present but gated out (" + tokens.length + " tokens): \"" + text + "\"");
            return;
        }
        if (!wake) return;

        android.util.Log.i("SolitaVosk", "*** WAKE matched in: \"" + text + "\" ***");
        wakeUpApp();                       // FIX 4: this now stops Vosk (mic free) BEFORE we emit the wake, then brings MainActivity foreground
        SolitaVoicePlugin b = bridge;
        if (b != null) b.emitWake(text);   // signal the WebView so it opens the conversation
    }

    // Bring MainActivity to the FOREGROUND on a background/locked wake. Android 14 throttles plain
    // background activity starts → use a high-priority full-screen Intent notification, which the OS
    // launches over the lock screen (requires USE_FULL_SCREEN_INTENT). Also fire the Intent directly,
    // which works when the device is already unlocked.
    private void wakeUpApp() {
        // FIX 4 (TTS self-trigger belt): we are on the recognition thread here. Stop Vosk NOW — definitively off
        // the instant the wake prompt is emitted — so the upcoming TTS / Web-SR handoff can never re-trigger us.
        // stopRecognizer() nulls speech/recognizer synchronously and offloads the join()ing teardown to the
        // background executor, so this is safe to call directly from this thread.
        stopRecognizer();

        Intent activity = new Intent(this, MainActivity.class);
        activity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_SINGLE_TOP
                | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        activity.putExtra("solita_woken_by_vosk", true);   // MainActivity may read this; the WebView signal comes via emitWake

        PendingIntent fullScreen = PendingIntent.getActivity(this, 1, activity,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

        boolean locked = false;
        try {
            KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            locked = km != null && km.isKeyguardLocked();
        } catch (Exception ignore) {}

        // Wake the screen so the full-screen Intent / activity is actually visible.
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                PowerManager.WakeLock wl = pm.newWakeLock(
                        PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP | PowerManager.ON_AFTER_RELEASE,
                        "solita:wake");
                wl.acquire(5000);
            }
        } catch (Exception ignore) {}

        // Direct start (works when unlocked / app already in recents).
        try { startActivity(activity); } catch (Exception ignore) {}

        // FIX 5 (FSI hardening): on Android 14+ the full-screen-Intent permission can be revoked per-app. If it's
        // not granted, the lock-screen wake won't surface — log a clear line (do NOT crash); the direct
        // startActivity above still covers the unlocked case.
        if (Build.VERSION.SDK_INT >= 34) {
            try {
                NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null && !nm.canUseFullScreenIntent()) {
                    android.util.Log.w("SolitaVosk", "FSI not granted — lock-screen wake may not surface");
                }
            } catch (Exception ignore) {}
        }

        // Full-screen Intent notification — the reliable path over the lock screen on Android 12+.
        Notification n = new NotificationCompat.Builder(this, CHANNEL_WAKE)
                .setContentTitle("Solita")
                .setContentText("Ich höre …")
                .setSmallIcon(android.R.drawable.ic_btn_speak_now)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setFullScreenIntent(fullScreen, true)
                .setContentIntent(fullScreen)
                .setAutoCancel(true)
                .setTimeoutAfter(8000)
                .build();
        try {
            ((NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE)).notify(NOTIF_WAKE_ID, n);
        } catch (Exception ignore) {}
        android.util.Log.i("SolitaVosk", "wakeUpApp fired (locked=" + locked + ")");
    }

    // ---- notification / foreground ----
    private void createChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Solita hört zu", NotificationManager.IMPORTANCE_LOW);
            ch.setShowBadge(false);
            nm.createNotificationChannel(ch);
            // High-importance channel for the wake full-screen Intent (must be HIGH for the heads-up / lock-screen launch).
            NotificationChannel wake = new NotificationChannel(CHANNEL_WAKE, "Solita Weckruf", NotificationManager.IMPORTANCE_HIGH);
            wake.setShowBadge(false);
            wake.setDescription("Bringt Solita nach dem Weckwort in den Vordergrund");
            nm.createNotificationChannel(wake);
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
        // Grab the model ref now; close it on the SAME background executor AFTER the recognizer teardown so the
        // join()ing stop()/shutdown()/close() never run on the main thread and the Model is freed only once the
        // Recognizer that referenced it is closed (ordering on a single-thread executor).
        final Model m = model;
        model = null;
        stopRecognizer();                      // FIX 6: enqueues stop()/shutdown()/close() on teardownExec
        teardownExec.execute(() -> { try { if (m != null) m.close(); } catch (Exception ignore) {} });
        teardownExec.shutdown();               // no new tasks; queued teardown + model.close() still run to completion
        instance = null;
        running = false;
        bridge = null;
        super.onDestroy();
    }
}
