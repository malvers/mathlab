package de.docalvers.docfit;

import android.annotation.SuppressLint;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;
import org.vosk.Model;
import org.vosk.Recognizer;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Listens all the time while DocFit is open, on the phone itself: the microphone feeds Vosk (Kaldi, small German
 * model, closed grammar - see Commands), no network, no cost per word, no Google beep between sentences. Why Vosk and
 * not Android's SpeechRecognizer: that one ends after every sentence and has to be restarted (with its chime and a gap
 * in which a "Stopp" gets lost), and offline only where Google's on-device model is installed; a keyword grammar is
 * exactly what two commands need.
 *
 * The audio loop is our own (not Vosk's SpeechService) so we count the samples ourselves: the moment a command stands
 * for (the end of "DocFit Start", the beginning of "DocFit Stopp") is taken from Vosk's word times and mapped back to
 * the wall clock - the stopwatch starts and stops when Doc spoke, not when the recognizer was sure. The same
 * samples feed a LoudnessMeter, so Commands can tell "DocFit Start" said on its own from words inside a sentence.
 *
 * Every command, and every command phrase turned down, goes to the log with the words and confidences (only the
 * grammar's words, never what else was said), so a false start or stop can be traced:
 *   adb logcat -s DocFit
 */
final class KeywordListener {
    interface Callback {
        void onCommand(Commands.Kind kind, long wallMillis);

        void onProblem(String what);
    }

    private static final String TAG = "DocFit";
    private static final int RATE = 16000;
    private final Model model;
    private final Callback callback;
    private final Handler main = new Handler(Looper.getMainLooper());
    private volatile boolean running;
    private volatile boolean watchRunning;   // the stopwatch runs: a plain "Stopp" counts too (Commands)
    private Thread thread;

    KeywordListener(Model model, Callback callback) {
        this.model = model;
        this.callback = callback;
    }

    /** Tells the listener whether the stopwatch runs - only then a plain "Stopp" is a command. */
    void setWatchRunning(boolean on) {
        watchRunning = on;
    }

    boolean isRunning() {
        return running;
    }

    /** Start listening (the RECORD_AUDIO permission must be granted). */
    @SuppressLint("MissingPermission")
    void start() {
        if (running) return;
        running = true;
        thread = new Thread(this::loop, "docfit-ohr");
        thread.start();
    }

    void stop() {
        running = false;
        Thread t = thread;
        thread = null;
        if (t != null) {
            try {
                t.join(1500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    @SuppressLint("MissingPermission")
    private void loop() {
        int min = AudioRecord.getMinBufferSize(RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
        AudioRecord rec = null;
        Recognizer recognizer = null;
        try {
            recognizer = new Recognizer(model, RATE, Commands.GRAMMAR);
            recognizer.setWords(true);
            // VOICE_RECOGNITION: the microphone path tuned for speech recognition, without the call's processing
            rec = new AudioRecord(MediaRecorder.AudioSource.VOICE_RECOGNITION, RATE, AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT, Math.max(min, RATE / 2 * 2));
            if (rec.getState() != AudioRecord.STATE_INITIALIZED) throw new IllegalStateException("Mikrofon nicht bereit");
            short[] buf = new short[RATE / 10];   // 100 ms
            long samples = 0;
            LoudnessMeter loudness = new LoudnessMeter(10);
            AutoGain gain = new AutoGain();
            rec.startRecording();
            while (running) {
                int n = rec.read(buf, 0, buf.length);
                if (n <= 0) continue;
                long wallNow = System.currentTimeMillis();   // the newest sample of this block arrived about now
                samples += n;
                loudness.add(buf, n);   // the loudness check on the samples as recorded ...
                double lift = gain.apply(buf, n);   // ... the recognizer hears quiet speech lifted (AutoGain)
                if (recognizer.acceptWaveForm(buf, n)) {
                    Commands.Command c = Commands.decide(words(recognizer.getResult()), loudness, watchRunning);
                    // START / STOP / NONE (not alone, unsure), with the gain of the last block: how loud Doc spoke
                    if (!c.heard.isEmpty()) {
                        Log.i(TAG, c.kind + ": " + c.heard + String.format(Locale.ROOT, "; gain %.1f", lift));
                    }
                    if (c.kind != Commands.Kind.NONE) {
                        long streamMs = samples * 1000 / RATE;
                        long when = wallNow - (streamMs - Math.round(c.at * 1000));
                        main.post(() -> callback.onCommand(c.kind, when));
                    }
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "listener", e);
            String msg = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
            main.post(() -> callback.onProblem(msg));
            running = false;
        } finally {
            if (rec != null) {
                try {
                    rec.stop();
                } catch (Exception ignored) {
                }
                rec.release();
            }
            if (recognizer != null) recognizer.close();
        }
    }

    /** Vosk's result JSON {"result":[{"word","conf","start","end"}, ...], "text": ...} as words. */
    static List<Commands.Word> words(String json) {
        List<Commands.Word> out = new ArrayList<>();
        try {
            JSONArray a = new JSONObject(json).optJSONArray("result");
            if (a == null) return out;
            for (int i = 0; i < a.length(); i++) {
                JSONObject w = a.getJSONObject(i);
                out.add(new Commands.Word(w.optString("word"), w.optDouble("conf", 0), w.optDouble("start", 0), w.optDouble("end", 0)));
            }
        } catch (Exception e) {
            Log.w(TAG, "result " + json, e);
        }
        return out;
    }
}
