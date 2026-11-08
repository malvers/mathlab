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
import android.media.AudioRouting;
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
 *
 * Start by hand records at once, whatever the timetable says, until Doc taps Stopp (Doc, 07.11.2026:
 * "wenn ich das selber triggere, soll es definitiv auch aufnehmen" - a talk on Monday at ten). Such a
 * recording is called "Gespräch HH:MM" and its pieces end in "-hand.m4a", so the Mac keeps it out of a
 * lesson that happens to stand in the timetable at the same time.
 *
 * Start also makes DocMitschrift ready for the timetable (Plan, since 06.11.2026): the service stays in
 * the foreground all day and opens the microphone a minute before each lesson and closes it two minutes
 * after (Doc: "am Anfang jeder Stunde eine Minute vorher ... soll bitte die Aufzeichnung automatisch
 * starten"). It has to stay running for that - Android only lets the microphone start from a tap, never
 * from the background - so a ready service records without anybody touching it. Stopp ends only the
 * recording: it stays ready for the next lesson, and a lesson stopped by hand does not start again before
 * its end. "Aus" in the notification switches DocMitschrift off completely.
 * Every finished piece goes encrypted over the bridge to the Mac (Bruecke); without network or without
 * a bridge it waits here for the USB cable, as before.
 */
public class AufnahmeService extends Service {
    static final String TAG = "DocMitschrift";
    static final String CH_REC = "aufnahme";
    static final String CH_ALARM = "alarm";
    static final String CH_START = "stundenbeginn";
    static final int NOTE_REC = 1;
    static final int NOTE_ALARM = 2;
    static final int NOTE_START = 3;
    static final long PIECE_MS = 5 * 60 * 1000;
    static final long HOUR_MS = 60 * 60 * 1000;
    static final String ACTION_STOP = "de.docalvers.docmitschrift.STOP";    // end the recording, stay ready
    static final String ACTION_OFF = "de.docalvers.docmitschrift.OFF";      // switch off completely
    static final String ACTION_HAND = "de.docalvers.docmitschrift.HAND";    // Start on the screen: record now
    static final String ACTION_START = "de.docalvers.docmitschrift.START";  // the "Stunde beginnt" notification
    static final String ACTION_TICK = "de.docalvers.docmitschrift.TICK";
    static final String ACTION_READY = "de.docalvers.docmitschrift.READY";  // the app was opened: be ready again
    static final String HAND_SUFFIX = "-hand";  // in the names of the pieces recorded by hand

    // read by the screen once a second
    static volatile boolean running;            // Doc pressed Start: ready (and recording in the lessons)
    static volatile boolean recording;          // the microphone is open right now
    static volatile boolean hand;               // the running recording was started by hand
    static volatile String lesson = "";         // the window being recorded ("Gespräch 10:02" by hand)
    static volatile long nextVon;               // the next window, 0 when none
    static volatile String nextName = "";
    static volatile long since;                 // ms when this recording began
    static volatile String mic = "";            // the input of the current piece
    static volatile String problem = "";        // the last thing that went wrong, empty when all is well
    static volatile boolean noSound = false;    // recording, but the microphone gives pure silence (see listen)
    // Which microphone really recorded each piece, for the transcript page on the Mac (Doc, 08.11.2026: "unter
    // die Zeit schreiben, welches Mic da wirklich dran war"). Goes along in the status, the last MIC_LOG pieces.
    static final int MIC_LOG = 60;
    static volatile String micLog = "{}";
    private final java.util.LinkedHashSet<String> pieceMics = new java.util.LinkedHashSet<>();
    private boolean pieceSilent, pieceSound;
    static volatile long pieceSince;            // ms when the running piece began, 0 between pieces
    private static volatile MediaRecorder live; // the running recorder, for the level on the screen

    private final Handler handler = new Handler(Looper.getMainLooper());
    // every five minutes: a new piece - unless the lesson is over, then the timetable decides
    private final Runnable rotate = () -> {
        if (wanted() != null) nextPiece();
        else evaluate();
    };
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

    /** Start on the screen: record now, until Stopp - and be ready for the lessons afterwards. */
    public static void start(Context c) {
        c.startForegroundService(new Intent(c, AufnahmeService.class).setAction(ACTION_HAND));
    }

    /** Stopp on the screen: end the recording, stay ready for the next lesson. */
    /** Ready for the lessons, recording nothing now (unless a lesson runs): the app does this when it is opened
        and the service is gone, e.g. after an update (MainActivity.onResume). */
    static void ready(Context c) {
        c.startForegroundService(new Intent(c, AufnahmeService.class).setAction(ACTION_READY));
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
        micLog = prefs(this).getString("mikros", "{}");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? null : intent.getAction();
        if (ACTION_OFF.equals(action)) {
            off();
            return START_NOT_STICKY;
        }
        if (ACTION_STOP.equals(action)) {
            if (!running) {                         // nothing to stop
                stopSelf(startId);
                return START_NOT_STICKY;
            }
            if (!recording) return START_STICKY;    // a second tap on Stopp: the first one did it
            Log.i(TAG, "stop pressed: " + lesson);
            // a lesson stopped by hand stays quiet until its end - also when a talk by hand ran into it
            Plan.Fenster cur = Plan.current(Plan.load(this), System.currentTimeMillis());
            if (cur != null) prefs(this).edit().putLong("pauseBis", cur.bis).apply();
            end();
            hand = false;
            lesson = "";
            getSystemService(NotificationManager.class).cancel(NOTE_START);
            Bruecke.sendPieces(this);
            if (!Plan.exists(this)) {               // no timetable: nothing to be ready for
                off();
                return START_NOT_STICKY;
            }
            evaluate();
            return START_STICKY;
        }
        if (ACTION_TICK.equals(action)) {
            // an alarm reached a service that is no longer in the foreground: it must not start one itself
            if (!running) {
                stopSelf(startId);
                return START_NOT_STICKY;
            }
            Bruecke.fetchPlan(this, this::evaluate);
            Bruecke.sendPieces(this);
            evaluate();
            return START_STICKY;
        }
        try {
            if (Build.VERSION.SDK_INT >= 30) startForeground(NOTE_REC, note(), ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
            else startForeground(NOTE_REC, note());
        } catch (RuntimeException e) {
            // Android only lets the microphone start while the app is on screen, so a restart from the
            // background fails here: then Doc must know at once that nothing is being recorded
            Log.w(TAG, "foreground refused", e);
            running = false;
            recording = false;
            alarm("Aufnahme läuft nicht", "Öffne DocMitschrift und tippe auf Start.");
            stopSelf();
            return START_NOT_STICKY;
        }
        Log.i(TAG, "start: " + action);
        running = true;
        stopping = false;
        prefs(this).edit().putBoolean("bereit", true).apply();
        getSystemService(NotificationManager.class).cancel(NOTE_ALARM);
        if (ACTION_HAND.equals(action) && !recording) {
            hand = true;
            lesson = "Gespräch " + new SimpleDateFormat("HH:mm", Locale.GERMANY).format(new Date());
            Log.i(TAG, "recording by hand: " + lesson);
            begin();
        }
        Bruecke.fetchPlan(this, this::evaluate);
        Bruecke.sendPieces(this);
        evaluate();
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        if (running && !stopping) {
            end();
            alarm("Aufnahme beendet", "Android hat DocMitschrift beendet. Öffne DocMitschrift und tippe auf Start.");
        }
        running = false;
        hand = false;
        super.onDestroy();
    }

    /** "Aus" in the notification: no recording, no lessons, no alarms until the next Start. */
    private void off() {
        Log.i(TAG, "off");
        stopping = true;
        prefs(this).edit().putBoolean("bereit", false).remove("pauseBis").apply();
        unschedule(this);
        end();
        running = false;
        hand = false;
        lesson = "";
        stopForeground(STOP_FOREGROUND_REMOVE);
        getSystemService(NotificationManager.class).cancel(NOTE_START);
        Bruecke.sendStatus(this, status());
        stopSelf();
    }

    // ---- the timetable

    /** The window to record now: by hand until Stopp, else the lesson from the timetable - unless Doc
     *  stopped that lesson by hand. */
    private Plan.Fenster wanted() {
        if (!running) return null;
        if (hand) return new Plan.Fenster(0, Long.MAX_VALUE, lesson);
        long now = System.currentTimeMillis();
        if (now < prefs(this).getLong("pauseBis", 0)) return null;
        return Plan.current(Plan.load(this), now);
    }

    /** Opens or closes the microphone as the timetable says, and sets the alarm for the next edge. */
    private void evaluate() {
        if (!running) return;
        long now = System.currentTimeMillis();
        Plan.Fenster w = wanted();
        Plan.Fenster n = Plan.next(Plan.load(this), now);
        nextVon = n == null ? 0 : n.von;
        nextName = n == null ? "" : n.name;
        if (w != null && !recording) {
            lesson = w.name;
            Log.i(TAG, "lesson begins: " + w.name);
            begin();
            if (!w.name.isEmpty()) announce(w.name);
        } else if (w != null && recording && !hand && !w.name.equals(lesson)) {
            // the next lesson follows straight on: the microphone stays open, the name changes
            lesson = w.name;
            Log.i(TAG, "lesson begins: " + w.name);
            announce(w.name);
        } else if (w == null && recording) {
            Log.i(TAG, "lesson over: " + lesson);
            end();
            lesson = "";
            getSystemService(NotificationManager.class).cancel(NOTE_START);
            Bruecke.sendPieces(this);
        }
        schedule(this);
        refreshNote();
        Bruecke.sendStatus(this, status());
    }

    /** The next alarm: the edge of the running or the next window, at the latest in an hour (fresh plan). */
    static void schedule(Context c) {
        long now = System.currentTimeMillis();
        java.util.List<Plan.Fenster> plan = Plan.load(c);
        Plan.Fenster cur = Plan.current(plan, now), nx = Plan.next(plan, now);
        long t = now + HOUR_MS;
        if (cur != null) t = Math.min(t, cur.bis);
        if (nx != null) t = Math.min(t, nx.von);
        t = Math.max(t, now + 5000);
        android.app.AlarmManager am = c.getSystemService(android.app.AlarmManager.class);
        PendingIntent pi = tickIntent(c);
        if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms())
            am.setAndAllowWhileIdle(android.app.AlarmManager.RTC_WAKEUP, t, pi);
        else am.setExactAndAllowWhileIdle(android.app.AlarmManager.RTC_WAKEUP, t, pi);
    }

    static void unschedule(Context c) {
        c.getSystemService(android.app.AlarmManager.class).cancel(tickIntent(c));
    }

    private static PendingIntent tickIntent(Context c) {
        return PendingIntent.getBroadcast(c, 7, new Intent(c, TaktEmpfaenger.class),
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    /** Android ended the service, but a lesson is on: ask Doc for the one tap Android insists on. */
    static void askToStart(Context c) {
        long now = System.currentTimeMillis();
        Plan.Fenster w = Plan.current(Plan.load(c), now);
        if (w == null || now < prefs(c).getLong("pauseBis", 0)) return;
        channels(c);
        PendingIntent go = PendingIntent.getForegroundService(c, 3,
                new Intent(c, AufnahmeService.class).setAction(ACTION_START), PendingIntent.FLAG_IMMUTABLE);
        Notification n = new Notification.Builder(c, CH_ALARM)
                .setSmallIcon(R.drawable.ic_mic)
                .setContentTitle("Stunde beginnt – DocMitschrift ist aus")
                .setContentText("Tippe hier, dann nimmt sie auf: " + w.name)
                .setContentIntent(go)
                .setAutoCancel(true)
                .setTimeoutAfter(Math.max(60000, w.bis - now))
                .build();
        c.getSystemService(NotificationManager.class).notify(NOTE_ALARM, n);
    }

    /** The message Doc wanted when a lesson's recording starts by itself (06.11.2026, 07:05). */
    private void announce(String name) {
        Notification n = new Notification.Builder(this, CH_START)
                .setSmallIcon(R.drawable.ic_mic)
                .setContentTitle("● Aufnahme läuft")
                .setContentText(name)
                .setContentIntent(openApp(this))
                .setAutoCancel(true)
                .setTimeoutAfter(90000)
                .build();
        getSystemService(NotificationManager.class).notify(NOTE_START, n);
    }

    /** For the Mac: is the phone ready, is it recording, which lesson, what comes next. */
    static org.json.JSONObject status() {
        org.json.JSONObject o = new org.json.JSONObject();
        try {
            o.put("bereit", running);
            o.put("aufnahme", recording);
            o.put("hand", hand);
            o.put("stunde", lesson);
            o.put("seit", recording ? since : 0);
            o.put("mikro", mic);
            o.put("naechste", nextVon);
            o.put("naechsteName", nextName);
            o.put("problem", noSound ? "kein Ton: " + mic : problem.isEmpty() ? Bruecke.problem : problem);
            o.put("stand", System.currentTimeMillis());
            o.put("stuecke", new org.json.JSONObject(micLog));
        } catch (org.json.JSONException ignored) {
        }
        return o;
    }

    // ---- no sound (Doc, 08.11.2026: "wir können nicht davon ausgehen, dass wenn der Adapter steckt, auch das
    // Mikrofon verwendet wird"). The DJI receiver is there as a USB microphone even with its transmitter off or
    // not paired, and then gives pure silence. A real microphone never does: its own noise alone is far above
    // SILENT_AMP. After SILENT_SECONDS of it the screen says "kein Ton" in red, a loud notification comes, and
    // the Mac (bruecke.mjs) has Solita call once per recording.
    // Marie measured the receiver with its transmitter off at -91 dB flat (08.11.2026), i.e. amplitude 0 or 1;
    // kept well below any real microphone, also a quiet one in a still room, so a pause never rings
    static final int SILENT_AMP = 3;            // loudest moment per second below this: about -81 dBFS
    static final int SILENT_SECONDS = 15;
    private int quietSeconds;
    private static int heard;                   // loudest moment the screen's level() took away meanwhile (main thread)
    private final Runnable listen = new Runnable() {
        @Override
        public void run() {
            MediaRecorder r = recorder;
            if (r == null) return;
            int amp;
            try {
                amp = Math.max(r.getMaxAmplitude(), heard);   // getMaxAmplitude resets on every call: the pill
            } catch (RuntimeException e) {                     // calls it too, so its peaks count here as well
                amp = heard;
            }
            heard = 0;
            quietSeconds = amp < SILENT_AMP ? quietSeconds + 1 : 0;
            boolean silent = quietSeconds >= SILENT_SECONDS;
            if (silent) pieceSilent = true;
            if (amp >= SILENT_AMP) pieceSound = true;
            if (silent != noSound) {
                noSound = silent;
                if (silent) {
                    Log.w(TAG, "no sound from " + mic + " for " + quietSeconds + " s");
                    alarm("Kein Ton – " + mic, "DocNote nimmt nur Stille auf. Ist der Sender an und verbunden?");
                } else {
                    Log.i(TAG, "sound again from " + mic);
                    getSystemService(NotificationManager.class).cancel(NOTE_ALARM);
                    problem = "";
                }
                refreshNote();
                Bruecke.sendStatus(AufnahmeService.this, status());
            }
            handler.postDelayed(this, 1000);
        }
    };

    private void begin() {
        recording = true;
        stopping = false;
        since = System.currentTimeMillis();
        problem = "";
        failures = 0;
        quietSeconds = 0;
        noSound = false;
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
        noSound = false;
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
            running = false;
            hand = false;
            stopForeground(STOP_FOREGROUND_REMOVE);
            stopSelf();
        }
        refreshNote();
        Bruecke.sendStatus(this, status());            // every five minutes: the Mac knows the phone is alive
    }

    private boolean openPiece() {
        pieceStart = System.currentTimeMillis();
        String name = new SimpleDateFormat("yyyyMMdd-HHmmss", Locale.GERMANY).format(new Date(pieceStart))
                + (hand ? HAND_SUFFIX : "");
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
        // What Android really records from, not what was asked for (Doc, 08.11.2026: "nimmt dann wirklich das
        // Mikro auf, oder erkennt die App nur den Adapter?"). Android may refuse the USB receiver at 16 kHz mono
        // (seen in DocCall) and quietly take the phone's own microphone - then the screen says so.
        String asked = label(input);
        mic = routedLabel(r.getRoutedDevice());
        checkRoute(name, asked, mic);
        pieceMics.clear();
        pieceSilent = false;
        pieceSound = false;
        if (!MIC_UNKNOWN.equals(mic)) pieceMics.add(mic);
        if (Build.VERSION.SDK_INT >= 28) {
            r.addOnRoutingChangedListener((AudioRouting router) -> {
                if (recorder != r) return;
                String now = routedLabel(router.getRoutedDevice());
                if (now.equals(mic)) return;
                mic = now;
                checkRoute(name, asked, now);
                if (!MIC_UNKNOWN.equals(now)) pieceMics.add(now);
                refreshNote();
            }, handler);
        }
        problem = "";
        handler.removeCallbacks(listen);        // one listener across the pieces; the silence count carries on
        handler.postDelayed(listen, 1000);
        return true;
    }

    private void closePiece() {
        MediaRecorder r = recorder;
        recorder = null;
        live = null;
        pieceSince = 0;
        handler.removeCallbacks(listen);
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
            String done = n.substring(0, n.length() - ".part".length());
            f.renameTo(new File(f.getParentFile(), done));
            addRecorded(System.currentTimeMillis() - pieceStart);
            logMic(done);
            Bruecke.sendStatus(this, status());         // first which microphone it was (same queue, so it is there
            Bruecke.sendPieces(this);                   // before the piece), then the piece, encrypted (no-op without bridge)
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
            heard = Math.max(heard, amp);
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

    /**
     * The microphone the screen names at the bottom (Doc, 08.11.2026): while recording the one really in use
     * (a Bluetooth one that would not open shows as "Telefon Mic"), otherwise the best one connected now.
     */
    static String shownMic(Context c) {
        if (recording && !mic.isEmpty()) return noSound ? mic + MIC_SILENT : mic;
        AudioDeviceInfo best = null;
        int rank = -1;
        for (AudioDeviceInfo d : c.getSystemService(AudioManager.class).getDevices(AudioManager.GET_DEVICES_INPUTS)) {
            int r = rank(d.getType());
            if (r > rank) {
                rank = r;
                best = d;
            }
        }
        if (best == null || rank < 2) return MIC_PHONE;
        String name = deviceName(best);
        return rank == 3 ? usbText(name) : btText(name);
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

    /** The device Android routes the recorder to; right after start it may not be known yet (the routing
        listener tells a moment later). Shown in grey until then, never the asked-for one in its colour. */
    static final String MIC_UNKNOWN = "Mikro wird geprüft";

    // The names on the screen, short (Doc, 08.11.2026: "Telefon Mic", "DJI Mic BT", "DJI Adapter"). A microphone
    // that is not Doc's DJI keeps its own name, so the screen never claims the DJI for a car or an earbud.
    static final String MIC_PHONE = "Telefon Mic";

    static String usbText(String name) {
        String n = name.toLowerCase(Locale.ROOT);
        return n.contains("wireless mic") || n.contains("dji") ? "DJI Adapter" : "USB" + (name.isEmpty() ? "" : " · " + name);
    }

    static String btText(String name) {
        return name.toLowerCase(Locale.ROOT).contains("dji") ? "DJI Mic BT" : "BT" + (name.isEmpty() ? "" : " · " + name);
    }

    /** Its colour on the screen: 4 = no sound (red), 3 = USB / DJI receiver (green), 2 = Bluetooth (orange), 1 = phone (cyan), 0 = not known yet. */
    static final String MIC_SILENT = " · kein Ton";

    static int micKind(String text) {
        if (text.endsWith(MIC_SILENT)) return 4;
        if (text.equals("DJI Adapter") || text.startsWith("USB")) return 3;
        if (text.equals("DJI Mic BT") || text.startsWith("BT")) return 2;
        if (text.equals(MIC_PHONE)) return 1;
        return 0;
    }

    private static String routedLabel(AudioDeviceInfo d) {
        if (d == null) return MIC_UNKNOWN;
        String name = deviceName(d);
        int t = d.getType();
        if (rank(t) == 3) return usbText(name);
        if (isBluetooth(t)) return btText(name);
        return MIC_PHONE;
    }

    /** The piece's microphone(s) into the log the status carries: "DJI Adapter", "Telefon Mic → DJI Adapter",
        "DJI Adapter · kein Ton" (silent throughout) or "… · zeitweise kein Ton". Kept in the prefs as well, so a
        restart of the service does not lose what the Mac has not seen yet. */
    private void logMic(String piece) {
        String said = pieceMics.isEmpty() ? MIC_UNKNOWN : String.join(" → ", pieceMics);
        if (pieceSilent) said += pieceSound ? " · zeitweise kein Ton" : MIC_SILENT;
        try {
            org.json.JSONObject all = new org.json.JSONObject(prefs(this).getString("mikros", "{}"));
            all.put(piece, said);
            java.util.List<String> keys = new java.util.ArrayList<>();
            for (java.util.Iterator<String> it = all.keys(); it.hasNext(); ) keys.add(it.next());
            java.util.Collections.sort(keys);
            for (int i = 0; i < keys.size() - MIC_LOG; i++) all.remove(keys.get(i));
            micLog = all.toString();
            prefs(this).edit().putString("mikros", micLog).apply();
        } catch (org.json.JSONException e) {
            Log.w(TAG, "mic log", e);
        }
        Log.i(TAG, "piece " + piece + ": " + said);
    }

    /** Asked for one microphone, Android records from another: into the log with the piece's name. */
    private static void checkRoute(String piece, String asked, String routed) {
        if (MIC_UNKNOWN.equals(routed)) return;
        if (asked.equals(routed)) Log.i(TAG, "piece " + piece + ": records from " + routed);
        else Log.w(TAG, "piece " + piece + ": asked for " + asked + ", Android records from " + routed);
    }

    private String label(AudioDeviceInfo d) {
        if (d == null) return MIC_PHONE;
        String name = deviceName(d);
        int t = d.getType();
        if (rank(t) == 3) return usbText(name);
        if (bluetooth) return btText(name);
        return MIC_PHONE;
    }

    /** The device's own name, without Android's "USB-Audio - " in front ("USB · Wireless Mic Rx"). */
    private static String deviceName(AudioDeviceInfo d) {
        String n = d.getProductName() == null ? "" : d.getProductName().toString().trim();
        return n.startsWith("USB-Audio - ") ? n.substring("USB-Audio - ".length()).trim() : n;
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
        // a short message when a lesson's recording starts by itself
        NotificationChannel start = new NotificationChannel(CH_START, "Stundenbeginn", NotificationManager.IMPORTANCE_DEFAULT);
        start.setShowBadge(false);
        nm.createNotificationChannel(rec);
        nm.createNotificationChannel(alarm);
        nm.createNotificationChannel(start);
    }

    static PendingIntent openApp(Context c) {
        Intent i = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(c, 0, i, PendingIntent.FLAG_IMMUTABLE);
    }

    private Notification note() {
        PendingIntent stop = PendingIntent.getService(this, 1,
                new Intent(this, AufnahmeService.class).setAction(ACTION_STOP), PendingIntent.FLAG_IMMUTABLE);
        if (!recording) {
            // ready between the lessons: the microphone is closed, the next lesson is named; "Aus" ends it all
            PendingIntent off = PendingIntent.getService(this, 4,
                    new Intent(this, AufnahmeService.class).setAction(ACTION_OFF), PendingIntent.FLAG_IMMUTABLE);
            return new Notification.Builder(this, CH_REC)
                    .setSmallIcon(R.drawable.ic_mic)
                    .setContentTitle("DocMitschrift bereit")
                    .setContentText(nextVon == 0 ? "Keine Stunde mehr im Plan" : "Nächste Stunde: " + when(nextVon) + " · " + nextName)
                    .setShowWhen(false)
                    .setOngoing(true)
                    .setContentIntent(openApp(this))
                    .addAction(new Notification.Action.Builder(null, "Aus", off).build())
                    .build();
        }
        return new Notification.Builder(this, CH_REC)
                .setSmallIcon(R.drawable.ic_mic)
                .setContentTitle("DocMitschrift nimmt auf" + (lesson.isEmpty() ? "" : " · " + lesson))
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
        if (running) getSystemService(NotificationManager.class).notify(NOTE_REC, note());
    }

    /** "Mo 07:59" for a time this week, "heute 09:49" for today. */
    static String when(long ms) {
        Date d = new Date(ms);
        boolean today = new SimpleDateFormat("yyyyMMdd", Locale.GERMANY).format(d).equals(today());
        return (today ? "heute " : new SimpleDateFormat("EE dd.MM. ", Locale.GERMANY).format(d))
                + new SimpleDateFormat("HH:mm", Locale.GERMANY).format(d);
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
