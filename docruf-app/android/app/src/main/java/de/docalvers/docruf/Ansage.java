package de.docalvers.docruf;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioDeviceInfo;
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
    private static final long STUCK_MS = 120000;  // the portrait goes even when a voice never reports back
    private static Ansage one;
    private static final long ANSWER_WINDOW_MS = 20000;

    // How many calls are being spoken right now, and who wants to hear about it (the screen shows Solita's
    // portrait meanwhile). Both are touched on the main thread only.
    static int speaking;
    static String saying = "";   // the sentence she speaks right now, shown under the circle
    static Runnable listener;
    // for the karaoke under the circle (Karaoke): her MP3 while it plays, or where the phone's voice is
    static MediaPlayer voice;
    static int readAt = -1;

    private final Context app;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final AudioManager am;
    private final AudioAttributes speech = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_MEDIA)
            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
            .build();
    private TextToSpeech tts;
    // held here: a MediaPlayer only referenced from a local variable can be garbage-collected mid-sentence,
    // which cuts her off (07.11.2026, "MediaPlayer finalized without being released" right after a choppy call)
    private final java.util.Set<MediaPlayer> playing = new java.util.HashSet<>();
    private boolean ttsReady;
    // the calls being spoken now, each with its ending; a tap on her portrait ends them all (stop)
    private final java.util.Set<Runnable> open = new java.util.HashSet<>();
    private volatile int stops;   // bumped by stop(): a call still loading then stays silent
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
        boolean[] over = {false};
        Runnable end = () -> {
            if (over[0]) return;
            over[0] = true;
            speaking = Math.max(0, speaking - 1);
            changed();
        };
        main.post(() -> {
            speaking++;
            saying = text == null ? "" : text;
            changed();
            main.postDelayed(end, STUCK_MS);
        });
        final int asked = stops;
        new Thread(() -> {
            PowerManager.WakeLock wl = app.getSystemService(PowerManager.class)
                    .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "docruf:ansage");
            wl.acquire(120000);
            File f = audio == null || audio.isEmpty() ? null : download(audio);
            // DocNote lets go of the DJI while she speaks (see yieldMic); then a moment for Android to leave call mode
            if (stops == asked && yieldMic(app, STUCK_MS)) {
                try {
                    Thread.sleep(800);
                } catch (InterruptedException ignored) {
                }
            }
            main.post(() -> {
                if (stops != asked) {   // tapped away while it was still loading: she stays silent
                    if (wl.isHeld()) wl.release();
                    yieldMic(app, 0);
                    main.removeCallbacks(end);
                    end.run();
                    return;
                }
                Runnable restore = louder(wl);
                Runnable[] self = new Runnable[1];
                Runnable done = () -> {
                    if (!open.remove(self[0])) return;   // ended already (stop)
                    restore.run();
                    yieldMic(app, ANSWER_WINDOW_MS);   // time to tap "Antworten"; listening asks again
                    main.removeCallbacks(end);
                    end.run();
                };
                self[0] = done;
                open.add(done);
                if (f != null) play(f, text, done);
                else read(text, done);
            });
        }, "docruf-ansage").start();
    }

    /**
     * A tap on her portrait while she speaks (Doc, 09.11.2026: "bitte das Sprechen abbrechen und auch nicht mehr
     * reagieren. Ich muss sie irgendwie abbrechen können"): she stops at once, a call still loading or queued
     * stays silent, and nothing follows - no answer window, DocNote takes the DJI again. Main thread.
     */
    void stop() {
        stops++;
        for (MediaPlayer p : new java.util.ArrayList<>(playing)) {
            try {
                p.stop();
            } catch (RuntimeException ignored) {
                // not started yet
            }
            release(p);
        }
        if (tts != null) tts.stop();
        pending = null;
        pendingDone = null;
        readAt = -1;
        for (Runnable r : new java.util.ArrayList<>(open)) r.run();
        yieldMic(app, 0);
        Log.i(RufService.TAG, "stopped by a tap");
    }

    private static void changed() {
        if (listener != null) listener.run();
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
        playing.add(mp);
        try {
            mp.setAudioAttributes(speech);
            mp.setDataSource(f.getPath());
            // only now: before setDataSource the player has no engine yet and refuses any device (09.11.2026)
            AudioDeviceInfo out = phoneSpeaker();
            boolean pinned = out != null && mp.setPreferredDevice(out);
            Log.i(RufService.TAG, "voice to speaker: " + (out == null ? "no (route is fine)" : pinned ? "pinned" : "refused"));
            mp.setOnCompletionListener(p -> {
                release(p);
                done.run();
            });
            mp.setOnErrorListener((p, what, extra) -> {
                release(p);
                read(text, done);
                return true;
            });
            mp.prepare();
            mp.start();
            voice = mp;
            main.postDelayed(() -> {
                AudioDeviceInfo r = playing.contains(mp) ? mp.getRoutedDevice() : null;
                if (r != null) Log.i(RufService.TAG, "voice routed to type " + r.getType());
            }, 800);
        } catch (Exception e) {
            release(mp);
            read(text, done);
        }
    }

    private void release(MediaPlayer p) {
        if (voice == p) voice = null;
        p.release();
        playing.remove(p);
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
            public void onRangeStart(String u, int start, int end, int frame) {
                main.post(() -> readAt = start);   // the word the phone's voice says now
            }

            @Override
            public void onDone(String u) {
                main.post(() -> readAt = -1);
                if (done != null) main.post(done);
            }

            @Override
            public void onError(String u) {
                main.post(() -> readAt = -1);
                if (done != null) main.post(done);
            }
        });
        if (tts.speak(text, TextToSpeech.QUEUE_ADD, null, id) != TextToSpeech.SUCCESS && done != null) done.run();
    }

    /**
     * Asks DocNote to let go of the DJI for ms (0 = done, take it again). While DocNote records through the DJI
     * over Bluetooth the phone is in call mode: her voice is capped to the call volume and the recognizer for the
     * answer hears only silence ("gaaanz leise und antworten geht ni" - Doc, 09.11.2026). True when a Bluetooth
     * microphone holds the call route right now: then wait a moment before playing or listening.
     */
    static boolean yieldMic(Context c, long ms) {
        c.sendBroadcast(new android.content.Intent("de.docalvers.docmitschrift.YIELD")
                .setPackage("de.docalvers.docmitschrift").putExtra("ms", ms));
        if (android.os.Build.VERSION.SDK_INT < 31) return false;
        AudioDeviceInfo call = c.getSystemService(AudioManager.class).getCommunicationDevice();
        return call != null && call.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_SCO;
    }

    /**
     * The phone's own speaker while a Bluetooth microphone without a speaker holds the call route, else null.
     * DocNote records through the DJI Mic Mini 2 as a Bluetooth headset: Android then puts the phone in call mode
     * and sends ALL media to that headset - which has no speaker, so she showed "spricht" and nobody heard her
     * (Doc, 09.11.2026: "wieso spricht denn die in das Mikrofon? Da hat er gar keinen Lautsprecher").
     * A real headset also plays music (A2DP or LE audio under the same address) and keeps her voice.
     */
    private AudioDeviceInfo phoneSpeaker() {
        if (android.os.Build.VERSION.SDK_INT < 31) return null;
        AudioDeviceInfo call = am.getCommunicationDevice();
        Log.i(RufService.TAG, "call route: " + (call == null ? "none" : call.getType() + " " + call.getProductName()));
        if (call == null || call.getType() != AudioDeviceInfo.TYPE_BLUETOOTH_SCO) return null;
        AudioDeviceInfo speaker = null;
        for (AudioDeviceInfo d : am.getDevices(AudioManager.GET_DEVICES_OUTPUTS)) {
            int t = d.getType();
            if (t == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER) speaker = d;
            else if ((t == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP || t == AudioDeviceInfo.TYPE_BLE_HEADSET)
                    && d.getAddress().equals(call.getAddress())) return null;
        }
        return speaker;
    }

    /** True when an external output is connected (Bluetooth or wired speakers/headphones, USB audio): media goes there. */
    private boolean external() {
        for (AudioDeviceInfo d : am.getDevices(AudioManager.GET_DEVICES_OUTPUTS)) {
            switch (d.getType()) {
                case AudioDeviceInfo.TYPE_BLUETOOTH_A2DP:
                case AudioDeviceInfo.TYPE_BLE_HEADSET:
                case AudioDeviceInfo.TYPE_BLE_SPEAKER:
                case AudioDeviceInfo.TYPE_WIRED_HEADSET:
                case AudioDeviceInfo.TYPE_WIRED_HEADPHONES:
                case AudioDeviceInfo.TYPE_USB_HEADSET:
                case AudioDeviceInfo.TYPE_USB_DEVICE:
                case AudioDeviceInfo.TYPE_LINE_ANALOG:
                case AudioDeviceInfo.TYPE_LINE_DIGITAL:
                    return true;
                default:
            }
        }
        return false;
    }

    /** Volume up, focus taken; the returned runnable undoes both and lets the CPU sleep again. */
    private Runnable louder(PowerManager.WakeLock wl) {
        int max = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        int was = am.getStreamVolume(AudioManager.STREAM_MUSIC);
        // speakers or headphones on the phone: the volume Doc set there stays - 70 % through his JBL boxes was far too loud
        // (Doc, 08.11.2026: "nicht so laut rufen, ich habe drüben jetzt die JBLs dran")
        int want = external() ? was : Math.round(max * LOUD);
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
