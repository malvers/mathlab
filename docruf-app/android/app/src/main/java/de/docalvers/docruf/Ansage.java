package de.docalvers.docruf;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;

/**
 * Speaks a call aloud: Solita's own MP3 when the Mac sent one (attachments stay on ntfy.sh for 3 h),
 * otherwise the phone's voice reads the text. Media volume goes up to at least 70 % for the call and
 * back afterwards; other sound on the phone ducks while she speaks.
 */
final class Ansage {
    private static final float LOUD = 0.7f;
    private static Ansage one;

    private final Context app;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final AudioManager am;
    private final AudioAttributes speech = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build();
    private TextToSpeech tts;
    private boolean ttsReady;
    private String pending;
    private Runnable pendingDone;

    static synchronized Ansage get(Context c) {
        if (one == null) one = new Ansage(c.getApplicationContext());
        return one;
    }

    private Ansage(Context app) {
        this.app = app;
        am = app.getSystemService(AudioManager.class);
        main.post(() -> tts = new TextToSpeech(app, status -> {
            if (status != TextToSpeech.SUCCESS) return;
            tts.setLanguage(Locale.GERMANY);
            tts.setAudioAttributes(speech);
            ttsReady = true;
            if (pending != null) {
                String t = pending;
                pending = null;
                read(t, pendingDone);
            }
        }));
    }

    /** From any thread. audio may be empty or expired, then the text is read instead. */
    void say(String text, String audio) {
        new Thread(() -> {
            PowerManager.WakeLock wl = app.getSystemService(PowerManager.class)
                    .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "docruf:ansage");
            wl.acquire(120000);
            File f = audio == null || audio.isEmpty() ? null : download(audio);
            main.post(() -> {
                Runnable done = louder(wl);
                if (f != null) play(f, text, done);
                else read(text, done);
            });
        }, "docruf-ansage").start();
    }

    private File download(String url) {
        try {
            HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
            c.setConnectTimeout(10000);
            c.setReadTimeout(20000);
            if (c.getResponseCode() != 200) return null;
            File f = new File(app.getCacheDir(), "ruf.mp3");
            try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(f)) {
                byte[] buf = new byte[16384];
                for (int n; (n = in.read(buf)) > 0; ) out.write(buf, 0, n);
            }
            c.disconnect();
            return f;
        } catch (Exception e) {
            Log.w(RufService.TAG, "no audio: " + e);
            return null;
        }
    }

    private void play(File f, String text, Runnable done) {
        MediaPlayer mp = new MediaPlayer();
        try {
            mp.setAudioAttributes(speech);
            mp.setDataSource(f.getPath());
            mp.setOnCompletionListener(p -> {
                p.release();
                done.run();
            });
            mp.setOnErrorListener((p, what, extra) -> {
                p.release();
                read(text, done);
                return true;
            });
            mp.prepare();
            mp.start();
        } catch (Exception e) {
            mp.release();
            read(text, done);
        }
    }

    private void read(String text, Runnable done) {
        if (!ttsReady) {
            // the voice is still loading right after the app started: speak as soon as it is there
            pending = text;
            pendingDone = done;
            return;
        }
        String id = "ruf-" + System.nanoTime();
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String u) {
            }

            @Override
            public void onDone(String u) {
                if (done != null) main.post(done);
            }

            @Override
            public void onError(String u) {
                if (done != null) main.post(done);
            }
        });
        if (tts.speak(text, TextToSpeech.QUEUE_ADD, null, id) != TextToSpeech.SUCCESS && done != null) done.run();
    }

    /** Volume up, focus taken; the returned runnable undoes both and lets the CPU sleep again. */
    private Runnable louder(PowerManager.WakeLock wl) {
        int max = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        int was = am.getStreamVolume(AudioManager.STREAM_MUSIC);
        int want = Math.round(max * LOUD);
        if (was < want) am.setStreamVolume(AudioManager.STREAM_MUSIC, want, 0);
        AudioFocusRequest focus = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                .setAudioAttributes(speech)
                .build();
        am.requestAudioFocus(focus);
        boolean[] once = {false};
        return () -> {
            if (once[0]) return;
            once[0] = true;
            am.abandonAudioFocusRequest(focus);
            if (was < want && am.getStreamVolume(AudioManager.STREAM_MUSIC) == want) {
                am.setStreamVolume(AudioManager.STREAM_MUSIC, was, 0);
            }
            if (wl.isHeld()) wl.release();
        };
    }
}
