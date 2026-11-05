package de.docalvers.docmitschrift;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.media.AudioDeviceCallback;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Records Doc's day in pieces of five minutes: AAC, mono, 16 kHz, 32 kbit/s (about 14 MB an hour).
 * A piece is written as "yyyyMMdd-HHmmss.m4a.part" and only renamed to ".m4a" once it is closed,
 * so the Mac never fetches half a file, and a crash costs at most the piece being written.
 * The best microphone wins: USB (the DJI receiver) before Bluetooth before the phone's own,
 * and plugging one in or out starts a new piece on the new microphone.
 */
public class AufnahmeService extends Service {
    static final String TAG = "DocMitschrift";
    static final String CH_REC = "aufnahme";
    static final String CH_ALARM = "alarm";
    static final int NOTE_REC = 1;
    static final int NOTE_ALARM = 2;
    static final long PIECE_MS = 5 * 60 * 1000;
    static final String ACTION_STOP = "de.docalvers.docmitschrift.STOP";

    // read by the screen once a second
    static volatile boolean recording;
    static volatile long since;                 // ms when Doc pressed Start
    static volatile String mic = "";            // the input of the current piece
    static volatile String problem = "";        // the last thing that went wrong, empty when all is well
    static volatile long pieceSince;            // ms when the running piece began, 0 between pieces
    private static volatile MediaRecorder live; // the running recorder, for the level on the screen

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable rotate = this::nextPiece;
    private AudioManager audio;
    private PowerManager.WakeLock wake;
    private MediaRecorder recorder;
    private File current;
    private long pieceStart;
    private boolean bluetooth;
    private boolean stopping;
    private int failures;

    // Android reports every present device once right after registering, so only a real change of the
    // inputs starts a new piece (the first test on 05.11.2026 got a one-second piece from that report)
    private String inputs = "";
    private final AudioDeviceCallback devices = new AudioDeviceCallback() {
        @Override
        public void onAudioDevicesAdded(AudioDeviceInfo[] added) {
            if (recording && inputsChanged()) later(1500);
        }

        @Override
        public void onAudioDevicesRemoved(AudioDeviceInfo[] removed) {
            if (recording && inputsChanged()) later(500);
        }
    };

    public static void start(Context c) {
        c.startForegroundService(new Intent(c, AufnahmeService.class));
    }

    public static void stop(Context c) {
        c.startService(new Intent(c, AufnahmeService.class).setAction(ACTION_STOP));
    }

    /** Where the finished pieces wait for the Mac. */
    static File dir(Context c) {
        File d = new File(c.getFilesDir(), "aufnahmen");
        d.mkdirs();
        return d;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        channels(this);
        audio = getSystemService(AudioManager.class);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopping = true;
            end();
            stopForeground(STOP_FOREGROUND_REMOVE);
            stopSelf();
            return START_NOT_STICKY;
        }
        try {
            if (Build.VERSION.SDK_INT >= 30) startForeground(NOTE_REC, note(), ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
            else startForeground(NOTE_REC, note());
        } catch (RuntimeException e) {
            // Android only lets the microphone start while the app is on screen, so a restart from the
            // background fails here: then Doc must know at once that nothing is being recorded
            Log.w(TAG, "foreground refused", e);
            recording = false;
            alarm("Aufnahme läuft nicht", "Öffne DocMitschrift und tippe auf Start.");
            stopSelf();
            return START_NOT_STICKY;
        }
        if (!recording) begin();
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        if (recording && !stopping) {
            end();
            alarm("Aufnahme beendet", "Android hat die Aufnahme beendet. Öffne DocMitschrift und tippe auf Start.");
        }
        super.onDestroy();
    }

    private void begin() {
        recording = true;
        stopping = false;
        since = System.currentTimeMillis();
        problem = "";
        failures = 0;
        getSystemService(NotificationManager.class).cancel(NOTE_ALARM);
        wake = getSystemService(PowerManager.class).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "docmitschrift:aufnahme");
        wake.acquire(16L * 60 * 60 * 1000);
        inputsChanged();
        audio.registerAudioDeviceCallback(devices, handler);
        cleanParts();
        nextPiece();
    }

    private void end() {
        handler.removeCallbacksAndMessages(null);
        closePiece();
        if (recording) audio.unregisterAudioDeviceCallback(devices);
        if (wake != null && wake.isHeld()) wake.release();
        recording = false;
        mic = "";
    }

    private void later(long ms) {
        handler.removeCallbacks(rotate);
        handler.postDelayed(rotate, ms);
    }

    /** Closes the running piece and opens the next one, then waits five minutes. */
    private void nextPiece() {
        handler.removeCallbacks(rotate);
        closePiece();
        if (!recording) return;
        if (openPiece()) {
            failures = 0;
            handler.postDelayed(rotate, PIECE_MS);
        } else if (++failures < 5) {
            handler.postDelayed(rotate, 3000);
        } else {
            alarm("Aufnahme gestoppt", "Das Mikrofon lässt sich nicht öffnen: " + problem);
            stopping = true;
            end();
            stopForeground(STOP_FOREGROUND_REMOVE);
            stopSelf();
        }
        refreshNote();
    }

    private boolean openPiece() {
        pieceStart = System.currentTimeMillis();
        String name = new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.GERMANY).format(new Date(pieceStart));
        current = new File(dir(this), name + ".m4a.part");
        AudioDeviceInfo input = bestInput(true);
        bluetooth = input != null && isBluetooth(input.getType()) && routeBluetooth();
        if (input != null && isBluetooth(input.getType()) && !bluetooth) input = bestInput(false);
        MediaRecorder r = Build.VERSION.SDK_INT >= 31 ? new MediaRecorder(this) : new MediaRecorder();
        try {
            // VOICE_RECOGNITION leaves the voice as it is (no gain tricks); Bluetooth only works as a call
            r.setAudioSource(bluetooth ? MediaRecorder.AudioSource.VOICE_COMMUNICATION : MediaRecorder.AudioSource.VOICE_RECOGNITION);
            r.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            r.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            r.setAudioChannels(1);
            r.setAudioSamplingRate(16000);
            r.setAudioEncodingBitRate(32000);
            r.setOutputFile(current.getAbsolutePath());
            if (input != null && !bluetooth) r.setPreferredDevice(input);
            r.setOnErrorListener((m, what, extra) -> handler.post(() -> {
                problem = "Rekorder-Fehler " + what + "/" + extra;
                nextPiece();
            }));
            r.prepare();
            r.start();
        } catch (Exception e) {
            Log.w(TAG, "piece did not start", e);
            problem = e.getClass().getSimpleName() + (e.getMessage() == null ? "" : ": " + e.getMessage());
            r.release();
            current.delete();
            current = null;
            unrouteBluetooth();
            mic = "";
            return false;
        }
        recorder = r;
        live = r;
        pieceSince = pieceStart;
        mic = label(input);
        problem = "";
        return true;
    }

    private void closePiece() {
        MediaRecorder r = recorder;
        recorder = null;
        live = null;
        pieceSince = 0;
        if (r == null) return;
        boolean ok = true;
        try {
            r.stop();
        } catch (RuntimeException e) {
            ok = false;                         // stopped before any sound was written: the file is empty
        }
        r.release();
        unrouteBluetooth();
        File f = current;
        current = null;
        if (f == null) return;
        if (ok && f.length() > 0) {
            String n = f.getName();
            f.renameTo(new File(f.getParentFile(), n.substring(0, n.length() - ".part".length())));
            addRecorded(System.currentTimeMillis() - pieceStart);
        } else {
            f.delete();
        }
    }

    /** A ".part" left over from a crash has no index at its end and cannot be played: away with it. */
    private void cleanParts() {
        File[] all = dir(this).listFiles();
        if (all == null) return;
        for (File f : all) if (f.getName().endsWith(".part")) f.delete();
    }

    /** The loudest moment since the last call, 0 (silence, -50 dB and below) to 1 (full scale). Main thread only. */
    static float level() {
        MediaRecorder r = live;
        if (r == null) return 0;
        try {
            int amp = r.getMaxAmplitude();
            if (amp <= 0) return 0;
            double db = 20 * Math.log10(amp / 32767.0);
            return (float) Math.max(0, Math.min(1, (db + 50) / 50));
        } catch (RuntimeException e) {
            return 0;
        }
    }

    // ---- which microphone

    private AudioDeviceInfo bestInput(boolean withBluetooth) {
        AudioDeviceInfo best = null;
        int rank = -1;
        for (AudioDeviceInfo d : audio.getDevices(AudioManager.GET_DEVICES_INPUTS)) {
            if (!withBluetooth && isBluetooth(d.getType())) continue;
            int r = rank(d.getType());
            if (r > rank) {
                rank = r;
                best = d;
            }
        }
        return best;
    }

    private static int rank(int type) {
        switch (type) {
            case AudioDeviceInfo.TYPE_USB_DEVICE:
            case AudioDeviceInfo.TYPE_USB_HEADSET:
            case AudioDeviceInfo.TYPE_USB_ACCESSORY:
                return 3;
            case AudioDeviceInfo.TYPE_BLE_HEADSET:
            case AudioDeviceInfo.TYPE_BLUETOOTH_SCO:
                return Build.VERSION.SDK_INT >= 31 ? 2 : -1;
            case AudioDeviceInfo.TYPE_BUILTIN_MIC:
                return 1;
            default:
                return 0;
        }
    }

    private static boolean isBluetooth(int type) {
        return type == AudioDeviceInfo.TYPE_BLE_HEADSET || type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO;
    }

    private boolean inputsChanged() {
        StringBuilder now = new StringBuilder();
        for (AudioDeviceInfo d : audio.getDevices(AudioManager.GET_DEVICES_INPUTS)) now.append(d.getId()).append(',');
        boolean changed = !now.toString().equals(inputs);
        inputs = now.toString();
        return changed;
    }

    /** A Bluetooth microphone only opens as a call: pick it as the call device for the time of the piece. */
    private boolean routeBluetooth() {
        if (Build.VERSION.SDK_INT < 31) return false;
        try {
            for (AudioDeviceInfo d : audio.getAvailableCommunicationDevices()) {
                if (isBluetooth(d.getType())) {
                    audio.setMode(AudioManager.MODE_IN_COMMUNICATION);
                    return audio.setCommunicationDevice(d);
                }
            }
        } catch (RuntimeException e) {
            Log.w(TAG, "bluetooth route", e);
        }
        return false;
    }

    private void unrouteBluetooth() {
        if (!bluetooth || Build.VERSION.SDK_INT < 31) return;
        try {
            audio.clearCommunicationDevice();
            audio.setMode(AudioManager.MODE_NORMAL);
        } catch (RuntimeException e) {
            Log.w(TAG, "bluetooth unroute", e);
        }
        bluetooth = false;
    }

    private String label(AudioDeviceInfo d) {
        if (d == null) return "Telefon-Mikro";
        String name = d.getProductName() == null ? "" : d.getProductName().toString().trim();
        int t = d.getType();
        if (rank(t) == 3) return "USB" + (name.isEmpty() ? "" : " · " + name);
        if (bluetooth) return "Bluetooth" + (name.isEmpty() ? "" : " · " + name);
        return "Telefon-Mikro";
    }

    // ---- how much today

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("mitschrift", MODE_PRIVATE);
    }

    private static String today() {
        return new SimpleDateFormat("yyyyMMdd", Locale.GERMANY).format(new Date());
    }

    private void addRecorded(long ms) {
        SharedPreferences p = prefs(this);
        long sum = today().equals(p.getString("day", "")) ? p.getLong("ms", 0) : 0;
        p.edit().putString("day", today()).putLong("ms", sum + ms).apply();
    }

    /** Recorded today in ms, the running piece included. */
    static long recordedToday(Context c) {
        SharedPreferences p = prefs(c);
        long closed = today().equals(p.getString("day", "")) ? p.getLong("ms", 0) : 0;
        long running = pieceSince;
        return closed + (running > 0 ? System.currentTimeMillis() - running : 0);
    }

    // ---- notifications

    static void channels(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        NotificationChannel rec = new NotificationChannel(CH_REC, "Aufnahme", NotificationManager.IMPORTANCE_LOW);
        rec.setShowBadge(false);
        NotificationChannel alarm = new NotificationChannel(CH_ALARM, "Aufnahme gestoppt", NotificationManager.IMPORTANCE_HIGH);
        alarm.enableVibration(true);
        alarm.setVibrationPattern(new long[]{0, 400, 200, 400, 200, 400});
        nm.createNotificationChannel(rec);
        nm.createNotificationChannel(alarm);
    }

    static PendingIntent openApp(Context c) {
        Intent i = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(c, 0, i, PendingIntent.FLAG_IMMUTABLE);
    }

    private Notification note() {
        PendingIntent stop = PendingIntent.getService(this, 1,
                new Intent(this, AufnahmeService.class).setAction(ACTION_STOP), PendingIntent.FLAG_IMMUTABLE);
        return new Notification.Builder(this, CH_REC)
                .setSmallIcon(R.drawable.ic_mic)
                .setContentTitle("DocMitschrift nimmt auf")
                .setContentText(mic.isEmpty() ? "Mikrofon wird geöffnet …" : mic)
                .setWhen(since == 0 ? System.currentTimeMillis() : since)
                .setUsesChronometer(true)
                .setShowWhen(true)
                .setOngoing(true)
                .setContentIntent(openApp(this))
                .addAction(new Notification.Action.Builder(null, "Stopp", stop).build())
                .build();
    }

    private void refreshNote() {
        if (recording) getSystemService(NotificationManager.class).notify(NOTE_REC, note());
    }

    private void alarm(String title, String text) {
        Notification n = new Notification.Builder(this, CH_ALARM)
                .setSmallIcon(R.drawable.ic_mic)
                .setContentTitle(title)
                .setContentText(text)
                .setStyle(new Notification.BigTextStyle().bigText(text))
                .setContentIntent(openApp(this))
                .setAutoCancel(true)
                .build();
        getSystemService(NotificationManager.class).notify(NOTE_ALARM, n);
        problem = text;
    }
}
