package de.docalvers.docfit;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.content.res.Configuration;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.Settings;
import android.text.InputFilter;
import android.text.InputType;
import android.text.method.DigitsKeyListener;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.vosk.LibVosk;
import org.vosk.LogLevel;
import org.vosk.Model;
import org.vosk.android.StorageService;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.function.IntConsumer;

/**
 * DocFit - a stopwatch for the morning workout that listens (Doc, 16.11.2026: "wenn ich sage DocFit ... soll das Ding
 * ... eine Stoppuhr starten. Und wenn ich sage Stopp, soll der die Stoppuhr stoppen. ... die Zeit soll dann in eine Liste
 * eingetragen werden mit Datum und Uhrzeit"), and the Vitafit body-fat scale (Doc, 19.11.2026: "ja, bau das in DocFit
 * ein").
 *
 * Three tabs under the title:
 * - "Stoppuhr": the command to say next ("DocFit Start", while running "DocFit Stopp" - Doc, 20.11.2026: "‚bereit'
 *   und ‚gestoppt' bitte weg, nimmt Platz weg") with a line saying whether the phone is listening, the big stopwatch
 *   (green while ready), Start, Stopp and Reset as three equal buttons (Reset clears the stopped time), and the list
 *   of times - newest first, swipe a row away to delete it (with "Rückgängig"; deleting the time on the display clears
 *   the display too, LastRun). While DocFit is open the screen stays on. The microphone listens (KeywordListener) for
 *   "DocFit Start" / "DocFit Stopp" only while this tab is shown - on "Waage" and in the background voice control is
 *   off (Doc, 19.11.2026: the stopwatch started while he was on the scale tab); a running stopwatch keeps its start.
 *   Start and stop confirm with a short buzz and a beep.
 * - "Waage": while it is open the phone looks for the scale (ScaleLink). A state line says what happens ("Stell dich
 *   auf die Waage …", connecting, measuring, done), the last weigh-in stands big with fat, water, muscle and BMI
 *   (BodyComposition, from the profile Doc enters under "Profil"), waist and hip typed in by hand with their ratios
 *   (Girths), a fitness score 1-10 with what the values mean (FitnessScore, ScoreBar), and the list of weigh-ins
 *   below, swipe to delete, tap to enter waist and hip. Scrolling the list up pushes the big card away until a compact
 *   bar is left (CollapsingHeader: date and weight, fat, fitness - or the state of a running weigh-in).
 * - "Fasten" (Doc, 19.11.2026: "DocFit ... eine extra Rubrik ... Fasting", 20.11.: "schreibt bitte Fasten, wir haben es
 *   ja nun mal Deutsch"): Doc's fasts from his workbook, a chart
 *   grid per fast like his Excel dashboard and all fasts on top of each other from day 1 - the page web/fasting/
 *   (Chart.js, offline) shown in a WebView from the APK's assets; its data file is private and never in git.
 * The gear next to the title opens the settings: the colour scheme as in Doc's other apps - Blau, Grau, Hell (Palette)
 * - and "Messmethode", where the scale's values come from. All tabs share one page margin (PAGE_SIDE).
 * Everything stays on the phone (Entries, Weighings, Profile in the app's preferences; no internet permission).
 */
public class MainActivity extends Activity implements KeywordListener.Callback, ScaleLink.Callback {
    // the colours of the chosen scheme (Palette: Blau / Grau / Hell), set in onCreate before the screen is built;
    // LAMBDA = lambda as text (Hell: the svp blue), the fills take theirs from pal
    private Palette pal;
    private int LAMBDA, UPSILON, PHI, TEXT, MUTED, CARD, BG;
    private static final int ASK_MIC = 1, ASK_BT = 2;
    private static final int TAB_WATCH = 0, TAB_SCALE = 1, TAB_FAST = 2;
    private static final String FASTING_PAGE = "file:///android_asset/fasting/index.html";
    private static final long DEBOUNCE_MS = 1500;   // one word must not start and at once stop again
    private static final long UNDO_MS = 5000;
    // the page margin left and right, the same on every tab (Doc, 20.11.2026: "Links und rechts geht das breiter")
    private static final int PAGE_SIDE = 12;

    private final Handler ui = new Handler(Looper.getMainLooper());
    private SharedPreferences prefs;
    private Entries entries;
    private Typeface orbitron;
    private TextView state, ear, empty, undoText;
    private DigitsView timer;
    private Button startBtn, stopBtn, resetBtn;
    private View undoBar, watchPage, scalePage;
    private RecyclerView list;
    private WatchAdapter adapter;
    private Model model;
    private KeywordListener listener;
    private String earProblem;
    private boolean resumed, askedMic, askedBt, asking;
    private long runStart;          // wall clock of the start, 0 = not running
    private LastRun last = LastRun.NONE;   // the last stopped run, shown until the next start or a reset
    private long lastChange;
    private ToneGenerator tone;

    // the scale
    private Weighings weighings;
    private Profile profile;
    private ScaleLink scale;
    private int tab;
    private String doneText;
    private TextView tabWatch, tabScale, tabFast, scaleState, resWhen, resNote, scaleEmpty;
    private DigitsView resWeight;
    // the tiles under the weight: value, range bar and reference line (Ranges)
    private Tile tFat, tWater, tMuscle, tBmi, tWaist, tWhtr, tHip, tWhr;
    // the big card gives way to the list; collapsed, the compact bar shows the newest weigh-in or a running one
    private CollapsingHeader scaleHead;
    private View compactPills;
    private TextView compactWhen, compactState;
    private DigitsView compactWeight, compactFat, compactFit;
    private boolean scaleWasBusy;
    private RecyclerView scaleList;
    private ScaleAdapter scaleAdapter;
    private View fitBox, fitHead;
    private DigitsView fitNumber;
    private TextView fitWord, fitText, fitNote;
    private ScoreBar fitBar;

    // the fasting page, created the first time its tab opens
    private FrameLayout fastPage;
    private WebView fastWeb;
    // the screen's frame: title row (with the gear), tab bar and the column around the pages - they step aside when the
    // fasting tab is shown on its side
    private LinearLayout frame;
    private View head, tabBar;

    private final Runnable tick = new Runnable() {
        @Override
        public void run() {
            if (runStart == 0) return;
            timer.setText(Times.duration(System.currentTimeMillis() - runStart));
            ui.postDelayed(this, 50);
        }
    };

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);   // Doc: the screen stays on while open
        prefs = getSharedPreferences("docfit", MODE_PRIVATE);
        runStart = prefs.getLong("runStart", 0);
        entries = new Entries(this);
        long shownDuration = prefs.getLong("lastDuration", -1);
        if (prefs.contains("lastStart")) {
            last = new LastRun(prefs.getLong("lastStart", 0), shownDuration);
        } else {   // stored before 19.11.2026: only the duration
            last = LastRun.upgrade(shownDuration, entries.size() > 0 ? entries.get(0) : null);
            saveLast();
        }
        weighings = new Weighings(this);
        profile = Profile.load(prefs);
        scale = new ScaleLink(this, this);
        orbitron = getResources().getFont(R.font.orbitron);
        pal = Palette.of(prefs.getString("theme", "dark"));
        LAMBDA = pal.accent;
        UPSILON = pal.upsilon;
        PHI = pal.phi;
        TEXT = pal.text;
        MUTED = pal.muted;
        CARD = pal.card;
        BG = pal.bg;
        paintWindow();
        setContentView(build());
        int savedTab = prefs.getInt("tab", TAB_WATCH);
        showTab(savedTab == TAB_SCALE || savedTab == TAB_FAST ? savedTab : TAB_WATCH);
        refresh();
        if (runStart != 0) ui.post(tick);
        try {
            tone = new ToneGenerator(AudioManager.STREAM_MUSIC, 80);
        } catch (RuntimeException e) {
            tone = null;   // no beep then, the buzz is still there
        }
        // the German model ships in the APK's assets and is unpacked once into the app's own storage
        LibVosk.setLogLevel(LogLevel.WARNINGS);
        StorageService.unpack(this, "model-de", "model", m -> {
            model = m;
            listener = new KeywordListener(m, this);
            listener.setWatchRunning(runStart != 0);
            listenIfAllowed();
            refresh();
        }, e -> {
            earProblem = "Spracherkennung fehlt: " + e.getMessage();
            refresh();
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        resumed = true;
        listenIfAllowed();
        updateScale();
        refresh();
        if (fastWeb != null) fastWeb.onResume();
        applyFastingChrome();   // the phone may have been turned while another app was in front
    }

    @Override
    protected void onPause() {
        super.onPause();
        resumed = false;
        if (listener != null) listener.stop();
        scale.stop();
        refresh();
        refreshScale();
        if (fastWeb != null) fastWeb.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        ui.removeCallbacksAndMessages(null);
        scale.stop();
        if (listener != null) listener.stop();
        if (model != null) model.close();
        if (tone != null) tone.release();
        if (fastWeb != null) fastWeb.destroy();
    }

    /** Page, status bar and navigation bar in the scheme's ground; dark system icons on Hell. */
    @SuppressWarnings("deprecation")
    private void paintWindow() {
        Window w = getWindow();
        w.setBackgroundDrawable(new ColorDrawable(BG));
        w.setStatusBarColor(BG);
        w.setNavigationBarColor(BG);
        View d = w.getDecorView();
        int lightBars = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        d.setSystemUiVisibility(pal.light ? d.getSystemUiVisibility() | lightBars : d.getSystemUiVisibility() & ~lightBars);
    }

    /**
     * The settings behind the gear. "Farbschema": Blau / Grau / Hell like in DocDo, each with a dot of its page colour;
     * the choice is kept in the app's preferences ("theme", DocDo's keys) and the screen is built again in it.
     * "Messmethode": the newest resistance and where the scale tab's values come from (Doc, 20.11.2026: "tu ihn unter
     * Einstellungen irgendwohin, damit wir da nicht den Platz verschwenden").
     */
    private void openSettings() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(20), 0, dp(20), dp(8));
        box.addView(smallLabel("FARBSCHEMA"));
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams rp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rp.topMargin = dp(8);
        box.addView(row, rp);
        TextView methodLabel = smallLabel("MESSMETHODE");
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(22);
        box.addView(methodLabel, lp);
        TextView method = text(ScaleTexts.method(weighings.newestMeasured()), 13, TEXT, false);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        box.addView(method, lp);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);
        AlertDialog d = dialog("Einstellungen").setView(scroll).setNegativeButton("Schließen", null).create();
        int current = Palette.index(pal.key);
        for (int i = 0; i < Palette.KEYS.length; i++) {
            boolean on = i == current;
            TextView b = text(Palette.NAMES[i], 14, on ? pal.chipOnInk : TEXT, true);
            b.setGravity(Gravity.CENTER);
            b.setMaxLines(1);
            GradientDrawable dot = new GradientDrawable();
            dot.setShape(GradientDrawable.OVAL);
            dot.setColor(Palette.DOTS[i]);
            dot.setStroke(Math.max(1, dp(1)), MUTED);
            dot.setSize(dp(14), dp(14));
            b.setCompoundDrawablesRelativeWithIntrinsicBounds(dot, null, null, null);
            b.setCompoundDrawablePadding(dp(6));
            b.setPadding(dp(8), 0, dp(8), 0);
            GradientDrawable g = round(on ? pal.chipOn : 0x00000000, 10);
            g.setStroke(Math.max(1, dp(1)), on ? pal.chipOn : MUTED);
            b.setBackground(g);
            String key = Palette.KEYS[i];
            b.setOnClickListener(v -> {
                d.dismiss();
                if (key.equals(pal.key)) return;
                prefs.edit().putString("theme", key).apply();
                recreate();
            });
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(44), 1f);
            cp.setMargins(i == 0 ? 0 : dp(4), 0, i == Palette.KEYS.length - 1 ? 0 : dp(4), 0);
            row.addView(b, cp);
        }
        show(d);
    }

    /**
     * Turning the phone (Doc, 19.11.2026: "ja, drehen lassen" - the big fasting charts on their side): the manifest keeps
     * the activity on a turn (configChanges), so the stopwatch, the voice listener, a weigh-in and the page with an open
     * big chart simply go on. Only the "Fasten" tab may turn; Stoppuhr and Waage stay upright - their buttons and the
     * scale card do not fit into a phone's height on its side.
     */
    private void allowTurn() {
        setRequestedOrientation(tab == TAB_FAST ? ActivityInfo.SCREEN_ORIENTATION_FULL_USER
                : ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        applyFastingChrome();
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration c) {
        super.onConfigurationChanged(c);
        applyFastingChrome();
    }

    /**
     * The fasting tab on its side shows only the charts (Doc, 19.11.2026: "Wenn man es quer dreht, kann der Header oben
     * mit DocFit natürlich weg ... Und selbst das Zahnrad kann dann weg"): title with the gear, tabs and status bar step
     * aside until the phone stands upright again. The way out on its side: turn it, or Back (inside the page first).
     */
    @SuppressWarnings("deprecation")
    private void applyFastingChrome() {
        if (frame == null) return;
        boolean full = tab == TAB_FAST
                && getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
        head.setVisibility(full ? View.GONE : View.VISIBLE);
        tabBar.setVisibility(full ? View.GONE : View.VISIBLE);
        frame.setPadding(full ? 0 : dp(PAGE_SIDE), full ? 0 : dp(12), full ? 0 : dp(PAGE_SIDE), full ? 0 : dp(12));
        if (full) getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    /** On the fasting tab Back first goes back inside the page (a fast -> the comparison, a big chart -> closed). */
    @Override
    public void onBackPressed() {
        if (tab == TAB_FAST && fastWeb != null && fastWeb.canGoBack()) {
            fastWeb.goBack();
        } else {
            super.onBackPressed();
        }
    }

    /** Voice control runs only while DocFit is in front with the "Stoppuhr" tab shown. */
    private void listenIfAllowed() {
        if (!resumed || tab != TAB_WATCH || listener == null || listener.isRunning()) return;
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            if (!askedMic && !asking) {   // one permission question at a time, Android drops a second one
                askedMic = true;
                asking = true;
                requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, ASK_MIC);
            }
            return;
        }
        earProblem = null;
        listener.start();
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] results) {
        super.onRequestPermissionsResult(req, perms, results);
        asking = false;
        if (req == ASK_MIC && (results.length == 0 || results[0] != PackageManager.PERMISSION_GRANTED)) {
            earProblem = "Ohne Mikrofon nur mit den Knöpfen";
        }
        listenIfAllowed();
        updateScale();
        refresh();
    }

    // ---------- the stopwatch ----------

    @Override
    public void onCommand(Commands.Kind kind, long wallMillis) {
        long now = System.currentTimeMillis();
        if (tab != TAB_WATCH || now - lastChange < DEBOUNCE_MS) return;   // never from the scale tab
        if (kind == Commands.Kind.START && runStart == 0) start(Math.max(now - 3000, Math.min(wallMillis, now)));
        else if (kind == Commands.Kind.STOP && runStart != 0) stop(Math.max(runStart, Math.min(wallMillis, now)));
    }

    @Override
    public void onProblem(String what) {
        earProblem = "Hört nicht zu: " + what;
        refresh();
    }

    private void start(long at) {
        runStart = at;
        lastChange = System.currentTimeMillis();
        prefs.edit().putLong("runStart", runStart).apply();
        if (listener != null) listener.setWatchRunning(true);
        confirm(true);
        ui.removeCallbacks(tick);
        ui.post(tick);
        refresh();
    }

    private void stop(long at) {
        long duration = at - runStart;
        entries.addNewest(new Entries.Entry(runStart, duration));
        adapter.notifyItemInserted(0);
        list.scrollToPosition(0);
        last = new LastRun(runStart, duration);
        runStart = 0;
        lastChange = System.currentTimeMillis();
        prefs.edit().putLong("runStart", 0).apply();
        if (listener != null) listener.setWatchRunning(false);
        saveLast();
        ui.removeCallbacks(tick);
        confirm(false);
        refresh();
    }

    /** "Reset": the display back to 00:00 (ready, green); the time stays in the list. */
    private void reset() {
        if (!LastRun.canReset(runStart != 0, last)) return;
        last = LastRun.NONE;
        saveLast();
        refresh();
    }

    private void saveLast() {
        prefs.edit().putLong("lastStart", last.start).putLong("lastDuration", last.duration).apply();
    }

    /** A short buzz and a beep for the start (and a finished weigh-in), two for the stop. */
    private void confirm(boolean started) {
        Vibrator v = getSystemService(Vibrator.class);
        if (v != null && v.hasVibrator()) {
            v.vibrate(started ? VibrationEffect.createOneShot(120, VibrationEffect.DEFAULT_AMPLITUDE)
                    : VibrationEffect.createWaveform(new long[]{0, 90, 90, 90}, -1));
        }
        if (tone != null) tone.startTone(started ? ToneGenerator.TONE_PROP_BEEP : ToneGenerator.TONE_PROP_BEEP2, 250);
    }

    private void refresh() {
        boolean running = runStart != 0;
        // the command to say next instead of a state word (Doc, 20.11.2026: "schreiben nur hin, ohne
        // Anführungszeichen, DocFit Start. Und wenn es läuft, DocFit Stopp") - exactly the words Commands listens for
        state.setText(running ? "DocFit Stopp" : "DocFit Start");
        // "DocFit Stopp" in the red of the running stopwatch, not orange (Doc, 20.11.2026: "entscheide du")
        state.setTextColor(running ? pal.alarm : PHI);
        if (!running) timer.setText(Times.duration(last.shown() ? last.duration : 0));
        // ready green, running red, stopped orange - never grey (Doc, 20.11.2026: "wenn das Ding bereit ist, machen wir
        // die Zahlen ... grün", "Wenn die Stoppuhr läuft, ist die grau ... wir machen die rot")
        timer.setTextColor(running ? pal.alarm : last.shown() ? LAMBDA : PHI);
        boolean canReset = LastRun.canReset(running, last);
        startBtn.setEnabled(!running);
        stopBtn.setEnabled(running);
        resetBtn.setEnabled(canReset);
        startBtn.setAlpha(running ? 0.35f : 1f);
        stopBtn.setAlpha(running ? 1f : 0.35f);
        resetBtn.setAlpha(canReset ? 1f : 0.35f);
        // no word and no sign for listening (Doc, 20.11.2026: "‚hört zu' braucht man nicht", then "den Kreis bitte
        // wegmachen"); only a problem says what it is
        ear.setText(earProblem == null ? "" : earProblem);
        ear.setVisibility(earProblem == null ? View.GONE : View.VISIBLE);
        empty.setVisibility(entries.size() == 0 ? View.VISIBLE : View.GONE);
    }

    // ---------- the scale ----------

    private String[] bluetoothPermissions() {
        return Build.VERSION.SDK_INT >= 31
                ? new String[]{Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT}
                : new String[]{Manifest.permission.ACCESS_FINE_LOCATION};
    }

    private boolean hasBluetoothPermission() {
        for (String p : bluetoothPermissions()) {
            if (checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED) return false;
        }
        return true;
    }

    /** The scale is looked for only while the "Waage" tab is open and DocFit is in front. */
    private void updateScale() {
        if (!resumed || tab != TAB_SCALE) {
            scale.stop();
        } else if (!hasBluetoothPermission()) {
            askBluetooth(false);
        } else {
            scale.start();
        }
        refreshScale();
    }

    /**
     * Explains in German why DocFit wants "Geräte in der Nähe", then asks Android. On its own only once per start of
     * the app; a tap on the state line asks again - or opens the app's settings once Android no longer asks.
     */
    private void askBluetooth(boolean byTap) {
        if (asking || (!byTap && askedBt)) return;
        if (byTap && askedBt && !anyRationale()) {
            try {
                startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                        Uri.fromParts("package", getPackageName(), null)));
            } catch (ActivityNotFoundException e) {
                // no settings app: nothing more to offer
            }
            return;
        }
        askedBt = true;
        asking = true;
        String what = Build.VERSION.SDK_INT >= 31
                ? "Dafür fragt Android gleich nach „Geräte in der Nähe“. Den Standort benutzt DocFit nicht."
                : "Dafür fragt Android gleich nach dem Standort – das verlangt Android für die Bluetooth-Suche, "
                + "DocFit benutzt ihn nicht.";
        AlertDialog d = dialog("Waage per Bluetooth")
                .setMessage("DocFit sucht deine Vitafit-Waage per Bluetooth und liest Gewicht und Körperwiderstand. "
                        + what + " Alle Messungen bleiben auf diesem Smartphone.")
                .setPositiveButton("Weiter", (x, w) -> requestPermissions(bluetoothPermissions(), ASK_BT))
                .setNegativeButton("Nicht jetzt", (x, w) -> {
                    asking = false;
                    refreshScale();
                })
                .setOnCancelListener(x -> {
                    asking = false;
                    refreshScale();
                })
                .create();
        show(d);
    }

    private boolean anyRationale() {
        for (String p : bluetoothPermissions()) if (shouldShowRequestPermissionRationale(p)) return true;
        return false;
    }

    private void onScaleStateTapped() {
        if (tab != TAB_SCALE) return;
        if (!hasBluetoothPermission()) {
            askBluetooth(true);
        } else if (scale.status() == ScaleLink.Status.BLUETOOTH_OFF) {
            try {
                startActivity(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE));
            } catch (SecurityException | ActivityNotFoundException e) {
                // then Doc switches Bluetooth on in the quick settings; ScaleLink notices it
            }
        }
    }

    @Override
    public void onScaleStatus(ScaleLink.Status status, int centiKg) {
        boolean busy = scaleBusy();
        // somebody steps on the scale: the big card comes back, whatever the list was scrolled to
        if (busy && !scaleWasBusy && scaleHead != null) scaleHead.setOpen(true, true);
        scaleWasBusy = busy;
        refreshScale();
    }

    /** A weigh-in is under way: the scale is connecting, waiting for a foot, weighing or measuring the resistance. */
    private boolean scaleBusy() {
        if (!scale.isActive()) return false;
        switch (scale.status()) {
            case CONNECTING:
            case WAITING:
            case SETTLING:
            case IMPEDANCE:
                return true;
            default:
                return false;
        }
    }

    @Override
    public void onScaleResult(Weighings.Weighing w) {
        Weighings.Added added = weighings.add(w);
        switch (added) {
            case NEW:
                scaleAdapter.notifyItemInserted(0);
                scaleList.scrollToPosition(0);
                scaleHead.setOpen(true, true);
                confirm(true);
                break;
            case COMPLETED:
                scaleAdapter.notifyItemChanged(0);
                scaleHead.setOpen(true, true);
                confirm(true);
                break;
            default:
                break;
        }
        doneText = ScaleTexts.done(added, w);
        refreshScale();
    }

    private void refreshScale() {
        if (scaleState == null) return;
        String s;
        int color;
        int w = scale.statusWeight();
        boolean problem = false;   // something to fix: the compact bar shows it instead of the values, like a weigh-in
        if (!hasBluetoothPermission() || scale.status() == ScaleLink.Status.NO_PERMISSION && scale.isActive()) {
            s = "Bluetooth nicht erlaubt – hier tippen";
            color = UPSILON;
            problem = true;
        } else if (!scale.isActive()) {
            s = "Stell dich auf die Waage …";
            color = MUTED;
        } else {
            switch (scale.status()) {
                case BLUETOOTH_OFF:
                    s = "Bluetooth ist aus – hier tippen zum Einschalten";
                    color = UPSILON;
                    problem = true;
                    break;
                case CONNECTING:
                    s = "Waage gefunden – verbinde …";
                    color = LAMBDA;
                    break;
                case WAITING:
                    s = "Verbunden – stell dich drauf …";
                    color = LAMBDA;
                    break;
                case SETTLING:
                    s = "Misst … " + Times.kg(w / 100.0);
                    color = LAMBDA;
                    break;
                case IMPEDANCE:
                    s = Times.kg(w / 100.0) + " – still stehen, misst Körperfett …";
                    color = LAMBDA;
                    break;
                case DONE:
                    s = doneText != null ? doneText : "Fertig ✓";
                    color = PHI;
                    break;
                default:
                    s = "Stell dich auf die Waage …";
                    color = TEXT;
            }
        }
        scaleState.setText(s);
        scaleState.setTextColor(color);
        boolean live = problem || scaleBusy();
        compactState.setText(s);
        compactState.setTextColor(color);
        compactState.setVisibility(live ? View.VISIBLE : View.INVISIBLE);
        compactPills.setVisibility(live ? View.INVISIBLE : View.VISIBLE);

        if (weighings.size() == 0) {
            resWeight.setText("–");
            resWeight.setTextColor(MUTED);
            resWhen.setText(ScaleTexts.when(null));
            for (Tile t : new Tile[]{tFat, tWater, tMuscle, tBmi, tWaist, tWhtr, tHip, tWhr}) t.show("–", null);
            showNote(ScaleTexts.note(null, profile), MUTED);
            fitBox.setVisibility(View.GONE);
            compactWhen.setText("");
            compactWeight.setText("–");
            compactFat.setText("–");
            compactFit.setText("–");
            compactFit.setTextColor(MUTED);
        } else {
            Weighings.Weighing last = weighings.get(0);
            BodyComposition bc = BodyComposition.of(last, profile);
            FitnessScore fit = FitnessScore.of(last, profile);
            resWeight.setText(Times.kg(last.kg()));
            resWeight.setTextColor(LAMBDA);
            resWhen.setText(ScaleTexts.when(last));
            Calendar when = Calendar.getInstance();
            when.setTimeInMillis(last.time);
            int age = profile.ageIn(when.get(Calendar.YEAR));
            tFat.show(Times.one(bc.fatPercent, "%"), Ranges.fat(bc.fatPercent, profile.sex, age));
            tWater.show(Times.one(bc.waterPercent, "%"), Ranges.water(bc.waterPercent, profile.sex));
            tMuscle.show(Times.one(bc.muscleKg, "kg"), Ranges.muscle(bc.muscleKg, profile.heightCm, profile.sex));
            tBmi.show(Times.one(bc.bmi, ""), Double.isNaN(bc.bmi) ? null : Ranges.bmi(bc.bmi));
            showGirths(last);
            // a weight without a usable resistance says so plainly instead of four silent dashes
            showNote(ScaleTexts.note(last, profile), ScaleTexts.fatMissing(last, profile) ? LAMBDA : MUTED);
            showFitness(fit);
            compactWhen.setText(ScaleTexts.whenShort(last));
            compactWeight.setText(Times.kg(last.kg()));
            compactFat.setText(Times.one(bc.fatPercent, "%"));
            compactFit.setText(fit.score > 0 ? String.valueOf(fit.score) : "–");
            compactFit.setTextColor(fit.score > 0
                    ? ScoreBar.colorFor(fit.score, pal.scoreLow, pal.scoreMid, pal.scoreHigh) : MUTED);
        }
        scaleEmpty.setVisibility(weighings.size() == 0 ? View.VISIBLE : View.GONE);
    }

    /** The note under the score; gone when there is nothing to say. */
    private void showNote(String note, int color) {
        resNote.setText(note);
        resNote.setTextColor(color);
        resNote.setVisibility(note.isEmpty() ? View.GONE : View.VISIBLE);
    }

    /**
     * BAUCH and HÜFTE of the newest weigh-in ("+" = tap to enter them), BAUCH/GRÖSSE and BAUCH/HÜFTE made of them,
     * each with its range bar (Ranges: WHO 2008, Ashwell 2016).
     */
    private void showGirths(Weighings.Weighing last) {
        if (last.hasWaist()) {
            tWaist.show(Girths.cm(last.waistMm), Ranges.waist(last.waistMm, profile.sex));
        } else {
            tWaist.offer("+ Bauch eintragen");
        }
        if (last.hasHip()) {
            tHip.show(Girths.cm(last.hipMm), null);
            tHip.note.setText("für Bauch/Hüfte");   // no reading of its own
        } else {
            tHip.offer("+ Hüfte eintragen");
        }
        int whtr = Girths.waistToHeight(last.waistMm, profile.heightCm);
        if (whtr > 0) tWhtr.show(Girths.ratio(whtr), Ranges.waistToHeight(whtr));
        else tWhtr.offer(last.hasWaist() ? "Größe im Profil fehlt" : "+ Bauch eintragen");
        int whr = Girths.waistToHip(last.waistMm, last.hipMm);
        if (whr > 0) tWhr.show(Girths.ratio(whr), Ranges.waistToHip(whr, profile.sex));
        else tWhr.offer(last.hasWaist() ? "+ Hüfte eintragen" : "+ Bauch eintragen");
    }

    /** The ink of a value in the colour of its zone: green good, orange borderline, red high; plain without one. */
    private int zoneColor(Ranges.Scale s) {
        Ranges.Zone z = s == null ? null : s.zone();
        if (z == null) return TEXT;
        return z == Ranges.Zone.GOOD ? PHI : z == Ranges.Zone.BORDER ? pal.scoreMid : pal.alarm;
    }

    /**
     * One tile under the weight (Doc, 20.11.2026: "Wir müssen die Informationen immer in die jeweilige Kachel bringen
     * ... Und in jede Kachel so einen kleinen Slider"): label, value in the colour of its zone, the range bar and the
     * reference line - all in the shared pill.
     */
    private final class Tile {
        final TileInfo.Key key;
        final DigitsView value;
        final RangeBar bar;
        final TextView note;
        boolean offering;   // empty, showing "+ … eintragen"

        Tile(TileInfo.Key key, DigitsView value, RangeBar bar, TextView note) {
            this.key = key;
            this.value = value;
            this.bar = bar;
            this.note = note;
        }

        /**
         * A tap: the detail sheet with explanation and course (Doc, 20.11.2026); an empty Bauch / Hüfte tile goes
         * straight to the entry, the filled ones have "Ändern" in their sheet.
         */
        void tapped() {
            if (weighings.size() == 0) return;
            if (offering && TileInfo.typedIn(key)) editGirths(0);
            else openInfo(key);
        }

        /** A value with its reading; without a value ("–") no bar and no line - nothing to read yet. */
        void show(String text, Ranges.Scale s) {
            offering = false;
            boolean has = s != null && s.hasValue();
            value.setText(text);
            value.setTextColor(has ? zoneColor(s) : TEXT);
            bar.setScale(has ? s : null);
            note.setText(has ? s.note : "");
            note.setTextColor(MUTED);
        }

        /**
         * Nothing typed in yet: "–" and, where the bar would be, what to tap in λ (Doc, 20.11.2026, looking for where
         * to enter the hip: it must be obvious). The whole tile opens the dialog.
         */
        void offer(String what) {
            offering = true;
            value.setText("–");
            value.setTextColor(MUTED);
            bar.setScale(null);
            note.setText(what);
            note.setTextColor(what.startsWith("+") ? LAMBDA : MUTED);
        }
    }

    /** The score block under the tiles; without a score only the short hint why. */
    private void showFitness(FitnessScore f) {
        fitBox.setVisibility(View.VISIBLE);
        boolean has = f.score > 0;
        fitHead.setVisibility(has ? View.VISIBLE : View.GONE);
        fitBar.setVisibility(has ? View.VISIBLE : View.GONE);
        fitNote.setVisibility(has ? View.VISIBLE : View.GONE);
        // with a score only the bar, its word and the disclaimer - what the values mean stands in their tiles (Doc,
        // 20.11.2026: "Den Text unter ‚8 fit' weg ... das steht ja schon oben"); without one the hint why
        fitText.setText(f.text);
        fitText.setTextColor(MUTED);
        fitText.setVisibility(has ? View.GONE : View.VISIBLE);
        if (!has) return;
        int color = ScoreBar.colorFor(f.score, pal.scoreLow, pal.scoreMid, pal.scoreHigh);
        fitNumber.setText(String.valueOf(f.score));
        fitNumber.setTextColor(color);
        fitWord.setText(FitnessScore.word(f.score));
        fitWord.setTextColor(color);
        fitBar.setScore(f.score);
    }

    /** Height, birth year and sex - empty until Doc types them, stored only on the phone. */
    private void editProfile() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(24), dp(4), dp(24), 0);
        box.addView(text("Für Körperfett, Wasser, Muskel, BMI und Bauch/Größe. Bleibt nur auf diesem Smartphone.", 14,
                MUTED, false));
        EditText height = numberField(box, "GRÖSSE IN CM", profile.hasHeight() ? String.valueOf(profile.heightCm) : "", 3);
        EditText year = numberField(box, "GEBURTSJAHR", profile.birthYear >= Profile.MIN_YEAR
                ? String.valueOf(profile.birthYear) : "", 4);
        TextView label = smallLabel("GESCHLECHT");
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        box.addView(label, lp);
        final char[] sex = {profile.sex};
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        TextView male = chip("männlich"), female = chip("weiblich");
        Runnable paint = () -> {
            paintChip(male, sex[0] == Profile.MALE);
            paintChip(female, sex[0] == Profile.FEMALE);
        };
        male.setOnClickListener(v -> {
            sex[0] = Profile.MALE;
            paint.run();
        });
        female.setOnClickListener(v -> {
            sex[0] = Profile.FEMALE;
            paint.run();
        });
        paint.run();
        LinearLayout.LayoutParams c1 = new LinearLayout.LayoutParams(0, dp(44), 1f);
        c1.rightMargin = dp(5);
        LinearLayout.LayoutParams c2 = new LinearLayout.LayoutParams(0, dp(44), 1f);
        c2.leftMargin = dp(5);
        row.addView(male, c1);
        row.addView(female, c2);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        box.addView(row, lp);

        AlertDialog d = dialog("Profil")
                .setView(box)
                .setPositiveButton("Speichern", null)   // set below, so a wrong entry keeps the dialog open
                .setNegativeButton("Abbrechen", null)
                .create();
        show(d);
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            int h = number(height), y = number(year);
            int thisYear = Calendar.getInstance().get(Calendar.YEAR);
            if (h != 0 && (h < Profile.MIN_HEIGHT || h > Profile.MAX_HEIGHT)) {
                height.setError("zwischen " + Profile.MIN_HEIGHT + " und " + Profile.MAX_HEIGHT + " cm");
                return;
            }
            if (y != 0 && (y < Profile.MIN_YEAR || y > thisYear)) {
                year.setError("vierstellig, zwischen " + Profile.MIN_YEAR + " und " + thisYear);
                return;
            }
            profile = new Profile(h, y, sex[0]);
            profile.save(prefs);
            d.dismiss();
            scaleAdapter.notifyDataSetChanged();
            refreshScale();
        });
    }

    /**
     * Waist and hip for one weigh-in (Doc, 20.11.2026: "Zum Eingeben brauchen wir noch irgendwo ein Feld für
     * Bauchumfang", "ja, bitte auch ein Feld für Hüftumfang"): cm with one decimal, either field may stay empty. Opened
     * by a tap on a row of MESSUNGEN, or on BAUCH / HÜFTE for the newest weigh-in. Stored with that weigh-in only.
     */
    private void editGirths(int pos) {
        if (pos < 0 || pos >= weighings.size()) return;
        Weighings.Weighing w = weighings.get(pos);
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(24), dp(4), dp(24), dp(8));
        box.addView(text("Messung vom " + Times.day(w.time) + ", " + Times.clock(w.time) + " Uhr. In cm, z. B. 94,5 – "
                + "leer lassen, was nicht gemessen ist.", 14, MUTED, false));
        EditText waist = cmField(box, "BAUCHUMFANG IN CM", w.waistMm);
        box.addView(text("in der Mitte zwischen unterster Rippe und Beckenkamm, nach dem Ausatmen", 12, MUTED, false));
        EditText hip = cmField(box, "HÜFTUMFANG IN CM", w.hipMm);
        box.addView(text("an der breitesten Stelle des Gesäßes", 12, MUTED, false));
        // and the same as a sketch (Doc, 20.11.2026: "mach bitte ein Bild drunter, so eine Art Skizze")
        GirthSketch sketch = new GirthSketch(this, orbitron, MUTED, LAMBDA, PHI, "Bauch", "Hüfte");
        LinearLayout.LayoutParams sp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(150));
        sp.topMargin = dp(10);
        box.addView(sketch, sp);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);
        AlertDialog d = dialog("Bauch und Hüfte")
                .setView(scroll)
                .setPositiveButton("Speichern", null)   // set below, so a wrong entry keeps the dialog open
                .setNegativeButton("Abbrechen", null)
                .create();
        waist.requestFocus();
        Window win = d.getWindow();
        if (win != null) win.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE);
        show(d);
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            String range = "zwischen " + Girths.MIN_MM / 10 + " und " + Girths.MAX_MM / 10 + " cm, z. B. 94,5";
            int a = Girths.parseMm(waist.getText().toString()), b = Girths.parseMm(hip.getText().toString());
            if (a < 0) {
                waist.setError(range);
                return;
            }
            if (b < 0) {
                hip.setError(range);
                return;
            }
            int row = weighings.setGirths(w.time, a, b);
            d.dismiss();
            if (row >= 0) scaleAdapter.notifyItemChanged(row);
            refreshScale();
        });
    }

    /** A field for a circumference: digits with a decimal comma (or point), on the phone's number pad. */
    private EditText cmField(LinearLayout box, String label, int mm) {
        EditText e = numberField(box, label, Girths.field(mm), 6);
        e.setKeyListener(DigitsKeyListener.getInstance("0123456789,."));
        e.setRawInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);   // number pad, with ","
        e.setHint("z. B. 94,5");
        e.setHintTextColor(MUTED);
        return e;
    }

    /** The number in a field: 0 when empty, -1 when it is no number. */
    private static int number(EditText e) {
        String s = e.getText().toString().trim();
        if (s.isEmpty()) return 0;
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException x) {
            return -1;
        }
    }

    // ---------- the screen ----------

    private int dp(float v) {
        return Math.round(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics()));
    }

    private GradientDrawable round(int color, float radiusDp) {
        GradientDrawable g = new GradientDrawable();
        g.setColor(color);
        g.setCornerRadius(dp(radiusDp));
        return g;
    }

    private TextView text(String s, float sp, int color, boolean orb) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(color);
        if (orb) t.setTypeface(orbitron);
        return t;
    }

    private Button button(String s, int color) {
        Button b = new Button(this);
        b.setText(s);
        b.setAllCaps(false);
        b.setTypeface(orbitron);
        b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        b.setTextColor(pal.onPhi);
        b.setBackground(round(color, 14));
        b.setStateListAnimator(null);
        return b;
    }

    private TextView chip(String s) {
        TextView t = text(s, 15, MUTED, true);
        t.setGravity(Gravity.CENTER);
        return t;
    }

    private void paintChip(TextView t, boolean on) {
        t.setBackground(round(on ? pal.chipOn : CARD, 11));
        t.setTextColor(on ? pal.chipOnInk : MUTED);
    }

    // DocFit's pills: rounded boxes in the card colour with a small label above the value - one style for the weight,
    // the tiles (KÖRPERFETT, WASSER, ... BAUCH/GRÖSSE) and the compact bar (Doc, 19.11.2026: "Der Einzige, der keine
    // Pille hat, ist Gewicht"; the weight's label is the date and time of the weigh-in, not "Gewicht"). They stand
    // right on the page, no card around them (Doc, 20.11.2026: "erst die große Kachel, wo alles drin ist, dann noch
    // kleine Kacheln darin").
    private static final float PILL_RADIUS = 12, PILL_LABEL_SP = 11, PILL_SPACING = 0.08f;
    private static final int PILL_GAP = 6;

    private TextView pillLabel(String s) {
        TextView l = text(s, PILL_LABEL_SP, MUTED, true);
        l.setLetterSpacing(PILL_SPACING);
        l.setMaxLines(1);
        l.setGravity(Gravity.CENTER_HORIZONTAL);
        // a long label ("BAUCH/GRÖSSE" with a big system font) gets a little smaller instead of being cut
        l.setAutoSizeTextTypeUniformWithConfiguration(8, (int) PILL_LABEL_SP, 1, TypedValue.COMPLEX_UNIT_SP);
        return l;
    }

    /** A value in its pill: a rounded box in the card colour on the page, the small label above, the value below. */
    private LinearLayout pill(TextView label, DigitsView value, int valueHeightDp) {
        LinearLayout t = new LinearLayout(this);
        t.setOrientation(LinearLayout.VERTICAL);
        t.setGravity(Gravity.CENTER_HORIZONTAL);
        t.setBackground(round(CARD, PILL_RADIUS));
        t.setPadding(dp(6), dp(6), dp(6), dp(6));
        t.addView(label, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        t.addView(value, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(valueHeightDp)));
        return t;
    }

    /** Pills keep a small gap above and to their left neighbour; the outer ones line up with the page margin. */
    private LinearLayout.LayoutParams pillParams(int width, float weight, boolean first) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT, weight);
        lp.setMargins(first ? 0 : dp(PILL_GAP), dp(PILL_GAP), 0, 0);
        return lp;
    }

    /** The small Orbitron label above a field or a section of a dialog. */
    private TextView smallLabel(String s) {
        TextView l = text(s, 12, MUTED, true);
        l.setLetterSpacing(0.1f);
        return l;
    }

    private EditText numberField(LinearLayout box, String label, String value, int maxLen) {
        TextView l = smallLabel(label);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        box.addView(l, lp);
        EditText e = new EditText(this);
        e.setInputType(InputType.TYPE_CLASS_NUMBER);
        e.setFilters(new InputFilter[]{new InputFilter.LengthFilter(maxLen)});
        e.setTypeface(orbitron);
        e.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        e.setTextColor(TEXT);
        e.setText(value);
        e.setSingleLine(true);
        box.addView(e, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return e;
    }

    /** A dialog in the scheme (dark, or light on Hell) with the title in Orbitron. */
    private AlertDialog.Builder dialog(String title) {
        TextView t = text(title, 18, LAMBDA, true);
        t.setPadding(dp(24), dp(20), dp(24), dp(4));
        int style = pal.light ? android.R.style.Theme_DeviceDefault_Light_Dialog_Alert
                : android.R.style.Theme_DeviceDefault_Dialog_Alert;
        return new AlertDialog.Builder(this, style).setCustomTitle(t);
    }

    private void show(AlertDialog d) {
        d.show();
        for (int which : new int[]{DialogInterface.BUTTON_POSITIVE, DialogInterface.BUTTON_NEGATIVE}) {
            Button b = d.getButton(which);
            if (b == null) continue;
            b.setTypeface(orbitron);
            b.setAllCaps(false);
            b.setTextColor(which == DialogInterface.BUTTON_POSITIVE ? LAMBDA : MUTED);
        }
    }

    private TextView tabButton(String s, int which) {
        TextView t = text(s, 15, MUTED, true);
        t.setGravity(Gravity.CENTER);
        t.setMaxLines(1);   // three tabs: smaller rather than cut on a narrow phone or with big system fonts
        t.setAutoSizeTextTypeUniformWithConfiguration(10, 15, 1, TypedValue.COMPLEX_UNIT_SP);
        t.setOnClickListener(v -> showTab(which));
        return t;
    }

    private void showTab(int which) {
        tab = which;
        prefs.edit().putInt("tab", which).apply();
        watchPage.setVisibility(which == TAB_WATCH ? View.VISIBLE : View.GONE);
        scalePage.setVisibility(which == TAB_SCALE ? View.VISIBLE : View.GONE);
        fastPage.setVisibility(which == TAB_FAST ? View.VISIBLE : View.GONE);
        if (which == TAB_FAST) openFasting();
        allowTurn();
        paintChip(tabWatch, which == TAB_WATCH);
        paintChip(tabScale, which == TAB_SCALE);
        paintChip(tabFast, which == TAB_FAST);
        undoBar.setVisibility(View.GONE);   // an undo belongs to the list it came from
        ui.removeCallbacks(hideUndo);
        if (which == TAB_WATCH) listenIfAllowed();
        else if (listener != null) listener.stop();   // scale and fasting tab: voice control off
        updateScale();
        refresh();
    }

    private View build() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(BG);
        LinearLayout col = new LinearLayout(this);
        frame = col;
        col.setOrientation(LinearLayout.VERTICAL);
        col.setPadding(dp(PAGE_SIDE), dp(12), dp(PAGE_SIDE), dp(12));
        root.addView(col, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // the title, and on the right the gear for the colour scheme (as in DocDo)
        FrameLayout head = new FrameLayout(this);
        this.head = head;
        TextView title = text("DocFit", 20, LAMBDA, true);
        title.setGravity(Gravity.CENTER);
        head.addView(title, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER_VERTICAL));
        ImageView gear = new ImageView(this);
        gear.setImageResource(R.drawable.ic_gear);
        gear.setColorFilter(MUTED);
        gear.setPadding(dp(8), dp(8), dp(8), dp(8));
        gear.setContentDescription("Einstellungen");
        gear.setOnClickListener(v -> openSettings());
        head.addView(gear, new FrameLayout.LayoutParams(dp(40), dp(40), Gravity.END | Gravity.CENTER_VERTICAL));
        col.addView(head, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout tabs = new LinearLayout(this);
        tabBar = tabs;
        tabs.setOrientation(LinearLayout.HORIZONTAL);
        tabs.setBackground(round(CARD, 14));
        tabs.setPadding(dp(4), dp(4), dp(4), dp(4));
        tabWatch = tabButton("Stoppuhr", TAB_WATCH);
        tabScale = tabButton("Waage", TAB_SCALE);
        tabFast = tabButton("Fasten", TAB_FAST);
        tabs.addView(tabWatch, new LinearLayout.LayoutParams(0, dp(40), 1f));
        tabs.addView(tabScale, new LinearLayout.LayoutParams(0, dp(40), 1f));
        tabs.addView(tabFast, new LinearLayout.LayoutParams(0, dp(40), 1f));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(12);
        col.addView(tabs, lp);

        FrameLayout pages = new FrameLayout(this);
        watchPage = buildWatchPage();
        scalePage = buildScalePage();
        pages.addView(watchPage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        pages.addView(scalePage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        fastPage = new FrameLayout(this);
        fastPage.setBackgroundColor(BG);
        pages.addView(fastPage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        col.addView(pages, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));

        // "Gelöscht … Rückgängig", for a few seconds after a swipe
        LinearLayout bar = new LinearLayout(this);
        bar.setOrientation(LinearLayout.HORIZONTAL);
        bar.setGravity(Gravity.CENTER_VERTICAL);
        bar.setBackground(round(CARD, 12));
        bar.setPadding(dp(16), dp(4), dp(8), dp(4));
        undoText = text("", 14, TEXT, false);
        bar.addView(undoText, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView undoBtn = text("Rückgängig", 14, LAMBDA, true);
        undoBtn.setPadding(dp(12), dp(14), dp(12), dp(14));
        bar.addView(undoBtn);
        bar.setVisibility(View.GONE);
        FrameLayout.LayoutParams fl = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM);
        fl.setMargins(dp(16), 0, dp(16), dp(16));
        root.addView(bar, fl);
        undoBar = bar;
        bar.setTag(undoBtn);
        return root;
    }

    /**
     * The fasting page (web/fasting/ in the APK's assets) in a WebView, made the first time the tab opens. JavaScript for
     * the charts, DOM storage for the chosen measure; no file or content access beyond the assets, and the app has no
     * internet permission - the page and its data never leave the phone. Debug builds can be inspected from the Mac
     * (chrome://inspect).
     */
    private void openFasting() {
        if (fastWeb != null) return;
        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) WebView.setWebContentsDebuggingEnabled(true);
        fastWeb = new WebView(this);
        fastWeb.setBackgroundColor(BG);
        WebSettings s = fastWeb.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);    // file:///android_asset stays readable
        s.setAllowContentAccess(false);
        fastWeb.addJavascriptInterface(new FastingBridge(pal.key), "DocFitApp");   // the page asks for the scheme
        fastWeb.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"file".equals(request.getUrl().getScheme());   // nothing outside the page
            }
        });
        fastPage.addView(fastWeb, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        fastWeb.loadUrl(FASTING_PAGE);
    }

    private View buildWatchPage() {
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);

        state = text("DocFit Start", 26, PHI, true);
        state.setGravity(Gravity.CENTER);
        state.setLetterSpacing(0.12f);
        // more air between the parts (Doc, 20.11.2026: "in Y auseinanderziehen, damit es gefälliger aussieht")
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(28);
        page.addView(state, lp);

        // only when the microphone is missing or the recognizer failed
        ear = text("", 14, UPSILON, false);
        ear.setGravity(Gravity.CENTER);
        ear.setVisibility(View.GONE);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(4);
        page.addView(ear, lp);

        // the big stopwatch: digits in fixed cells so the running time does not wobble, as wide as the buttons below
        // (Doc, 20.11.2026: "Die Stoppuhr kann so breit wie die Buttons – dann wird sie insgesamt größer")
        timer = new DigitsView(this, orbitron, 96, MUTED);
        timer.setFitWidth(Times.duration(0));
        timer.setText(Times.duration(0));
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(28);
        page.addView(timer, lp);

        // no hint line under the stopwatch: the command stands above it (Doc, 20.11.2026: "das ist doppelt")
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setBaselineAligned(false);
        startBtn = button("Start", PHI);
        stopBtn = button("Stopp", UPSILON);
        stopBtn.setTextColor(pal.onUpsilon);
        startBtn.setOnClickListener(v -> { if (runStart == 0) start(System.currentTimeMillis()); });
        stopBtn.setOnClickListener(v -> { if (runStart != 0) stop(System.currentTimeMillis()); });
        // the quiet third button: clears the stopped time from the display, the list keeps it (Doc, 20.11.2026:
        // "das Zurücksetzen nennen wir Reset, und versucht die bitte gleich breit zu machen")
        resetBtn = button("Reset", CARD);
        resetBtn.setTextColor(LAMBDA);
        resetBtn.setOnClickListener(v -> reset());
        Button[] buttons = {startBtn, stopBtn, resetBtn};
        for (int i = 0; i < buttons.length; i++) {
            Button b = buttons[i];
            b.setMaxLines(1);
            b.setPadding(dp(6), 0, dp(6), 0);
            b.setAutoSizeTextTypeUniformWithConfiguration(10, 17, 1, TypedValue.COMPLEX_UNIT_SP);
            LinearLayout.LayoutParams bp = new LinearLayout.LayoutParams(0, dp(56), 1f);   // three equal widths
            bp.leftMargin = i == 0 ? 0 : dp(5);
            bp.rightMargin = i == buttons.length - 1 ? 0 : dp(5);
            row.addView(b, bp);
        }
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(32);
        page.addView(row, lp);

        page.addView(sectionHead("ZEITEN", null, null), headParams());

        adapter = new WatchAdapter();
        list = listView(adapter, pos -> {
            Entries.Entry gone = entries.remove(pos);
            adapter.notifyItemRemoved(pos);
            LastRun before = last;
            last = last.afterDelete(gone);   // the time on the display goes with its row
            saveLast();
            offerUndo("Gelöscht: " + Times.duration(gone.duration), () -> {
                entries.insert(pos, gone);
                adapter.notifyItemInserted(Math.min(pos, entries.size() - 1));
                last = last.afterUndo(gone, before, runStart != 0);
                saveLast();
                refresh();
            });
            refresh();
        });
        empty = emptyText("Noch keine Zeiten.");
        page.addView(listBox(list, empty), new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        return page;
    }

    /**
     * The scale tab: the big card (state line, the newest weigh-in in pills, the fitness score) over the list of
     * weigh-ins. Scrolling the list up pushes the card away until the compact bar is left (CollapsingHeader); back at
     * the list's top the card comes down again (Doc, 20.11.2026: "Wenn ich nach oben scrolle, müssen wir das
     * intelligenter machen, so dass ich unten die einzelnen Daten sehen kann").
     */
    private View buildScalePage() {
        LinearLayout head = new LinearLayout(this);
        head.setOrientation(LinearLayout.VERTICAL);

        // what is happening, two lines high so the page does not jump; a tap fixes permission or Bluetooth
        scaleState = text("Stell dich auf die Waage …", 16, TEXT, true);
        scaleState.setGravity(Gravity.CENTER);
        scaleState.setMinLines(2);
        scaleState.setPadding(0, dp(6), 0, dp(4));
        scaleState.setOnClickListener(v -> onScaleStateTapped());
        head.addView(scaleState, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        // the weight in a pill like the tiles below, its label the moment of the weigh-in (Doc, 19.11.2026: "Gewicht
        // braucht man da nicht schreiben ... in die Pille rein, das Datum und die Uhrzeit")
        resWhen = pillLabel("");
        resWeight = new DigitsView(this, orbitron, 48, MUTED);
        resWeight.setText("–");
        LinearLayout weightPill = pill(resWhen, resWeight, 66);
        weightPill.setOnClickListener(v -> { if (weighings.size() > 0) openInfo(TileInfo.Key.WEIGHT); });
        head.addView(weightPill, pillParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, true));
        LinearLayout r1 = new LinearLayout(this), r2 = new LinearLayout(this), r3 = new LinearLayout(this),
                r4 = new LinearLayout(this);
        tFat = tile(r1, "KÖRPERFETT", TileInfo.Key.FAT);
        tWater = tile(r1, "WASSER", TileInfo.Key.WATER);
        tMuscle = tile(r2, "MUSKEL", TileInfo.Key.MUSCLE);
        tBmi = tile(r2, "BMI", TileInfo.Key.BMI);
        tWaist = tile(r3, "BAUCH", TileInfo.Key.WAIST);
        tWhtr = tile(r3, "BAUCH/GRÖSSE", TileInfo.Key.WHTR);
        tHip = tile(r4, "HÜFTE", TileInfo.Key.HIP);
        tWhr = tile(r4, "BAUCH/HÜFTE", TileInfo.Key.WHR);
        head.addView(r1);
        head.addView(r2);
        head.addView(r3);
        head.addView(r4);
        head.addView(buildFitness());
        resNote = text("", 12, MUTED, false);
        resNote.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        head.addView(resNote, lp);

        View tail = sectionHead("MESSUNGEN", "Profil", v -> editProfile());
        tail.setPadding(0, dp(6), 0, 0);

        scaleAdapter = new ScaleAdapter();
        scaleList = listView(scaleAdapter, pos -> {
            Weighings.Weighing gone = weighings.remove(pos);
            scaleAdapter.notifyItemRemoved(pos);
            offerUndo("Gelöscht: " + Times.kg(gone.kg()), () -> {
                weighings.insert(pos, gone);
                scaleAdapter.notifyItemInserted(Math.min(pos, weighings.size() - 1));
                refreshScale();
            });
            refreshScale();
        });
        scaleEmpty = emptyText("Noch keine Messungen.");
        scaleHead = new CollapsingHeader(this, head, tail, listBox(scaleList, scaleEmpty), scaleList, buildCompact());
        return scaleHead;
    }

    /**
     * The compact bar of the collapsed scale card: date and weight, fat and fitness of the newest weigh-in in pills -
     * or, while a weigh-in runs or something needs fixing, the state line in their place. A tap opens the card again.
     */
    private View buildCompact() {
        FrameLayout bar = new FrameLayout(this);
        bar.setBackgroundColor(BG);   // covers the strip of the card left under it
        bar.setPadding(0, 0, 0, dp(2));
        LinearLayout pills = new LinearLayout(this);
        pills.setOrientation(LinearLayout.HORIZONTAL);
        pills.setBaselineAligned(false);
        compactWhen = pillLabel("");
        compactWeight = new DigitsView(this, orbitron, 18, LAMBDA);
        pills.addView(pill(compactWhen, compactWeight, 24), pillParams(0, 1.4f, true));
        compactFat = new DigitsView(this, orbitron, 18, TEXT);
        pills.addView(pill(pillLabel("FETT"), compactFat, 24), pillParams(0, 1f, false));
        compactFit = new DigitsView(this, orbitron, 18, MUTED);
        pills.addView(pill(pillLabel("FITNESS"), compactFit, 24), pillParams(0, 1f, false));
        bar.addView(pills, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        compactPills = pills;
        compactState = text("", 14, TEXT, true);
        compactState.setGravity(Gravity.CENTER);
        compactState.setMaxLines(2);
        compactState.setPadding(0, dp(PILL_GAP), 0, 0);
        compactState.setVisibility(View.INVISIBLE);
        bar.addView(compactState, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        bar.setOnClickListener(v -> {
            scaleList.scrollToPosition(0);
            scaleHead.setOpen(true, true);
        });
        return bar;
    }

    /**
     * The fitness score under the tiles (Doc, 19.11.2026: "Ein Indikator von grottenschlecht bis 10 Top-Athlet"):
     * the number and its word in the colour of the bar, the bar, one or two sentences on the values, the disclaimer.
     * A box in the card colour on the page, like the pills.
     */
    private View buildFitness() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackground(round(CARD, PILL_RADIUS));
        box.setPadding(dp(12), dp(4), dp(12), dp(8));
        LinearLayout head = new LinearLayout(this);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        fitNumber = new DigitsView(this, orbitron, 30, MUTED);
        fitNumber.setGravity(Gravity.START);
        fitNumber.setPadding(0, 0, dp(10), 0);
        head.addView(fitNumber, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(42)));
        fitWord = text("", 18, MUTED, true);
        head.addView(fitWord, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView label = text("FITNESS", 11, MUTED, true);
        label.setLetterSpacing(0.08f);
        head.addView(label);
        box.addView(head);
        fitBar = new ScoreBar(this, pal.scoreLow, pal.scoreMid, pal.scoreHigh);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(10));
        lp.topMargin = dp(2);
        box.addView(fitBar, lp);
        fitText = text("", 13, TEXT, false);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        box.addView(fitText, lp);
        fitNote = text(FitnessScore.DISCLAIMER, 11, MUTED, false);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(4);
        box.addView(fitNote, lp);
        box.setLayoutParams(pillParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, true));
        fitBox = box;
        fitHead = head;
        box.setVisibility(View.GONE);
        return box;
    }

    /**
     * One tile under the weight, two to a row: the shared pill with the value, and under it the range bar and the
     * reference line. Both tiles of a row are as high as the higher one.
     */
    private Tile tile(LinearLayout row, String label, TileInfo.Key key) {
        DigitsView v = new DigitsView(this, orbitron, 20, TEXT);
        v.setText("–");
        RangeBar bar = new RangeBar(this, pal.scoreHigh, pal.scoreMid, pal.scoreLow, TEXT, CARD);
        bar.setScale(null);
        TextView note = text("", 10, MUTED, false);
        note.setGravity(Gravity.CENTER_HORIZONTAL);
        // always one line (Doc, 20.11.2026: "dass da immer nur eine Zeile steht"): a little smaller rather than wrapped
        note.setMaxLines(1);
        note.setAutoSizeTextTypeUniformWithConfiguration(7, 10, 1, TypedValue.COMPLEX_UNIT_SP);
        LinearLayout p = pill(pillLabel(label), v, 28);
        LinearLayout.LayoutParams bp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(12));
        bp.topMargin = dp(4);
        p.addView(bar, bp);
        LinearLayout.LayoutParams np = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        np.topMargin = dp(3);
        p.addView(note, np);
        row.setBaselineAligned(false);
        LinearLayout.LayoutParams lp = pillParams(0, 1f, row.getChildCount() == 0);
        lp.height = ViewGroup.LayoutParams.MATCH_PARENT;   // as high as its neighbour
        row.addView(p, lp);
        Tile t = new Tile(key, v, bar, note);
        p.setOnClickListener(x -> t.tapped());
        return t;
    }

    /**
     * The detail sheet of a value (Doc, 20.11.2026: "dass man dort genauere Informationen findet, warum das schlecht,
     * gut oder whatsoever ist", then "natürlich der Verlauf"): the newest value with its word, the course over all
     * weigh-ins with the zones behind it (and the goal lines for the waist), every zone with its numbers, then what it
     * is, how it is measured, what moves it, why it matters, the source and the disclaimer (TileInfo, History).
     */
    private void openInfo(TileInfo.Key key) {
        if (weighings.size() == 0) return;
        TileInfo info = TileInfo.of(key);
        Weighings.Weighing newest = weighings.get(0);
        Ranges.Scale scale = History.scale(newest, key, profile);
        List<Weighings.Weighing> all = new ArrayList<>();
        for (int i = 0; i < weighings.size(); i++) all.add(weighings.get(i));
        List<History.Point> points = History.series(all, key, profile);
        int dec = History.decimals(key);
        String unit = History.unit(key);

        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(20), 0, dp(20), dp(8));
        double now = History.value(newest, key, profile);
        String shown = Double.isNaN(now) ? "–"
                : String.format(java.util.Locale.GERMANY, "%." + dec + "f", now) + (unit.isEmpty() ? "" : " " + unit);
        String word = scale == null ? null : scale.word();
        TextView value = text(shown + (word == null ? "" : "  ·  " + word), 20, scale == null ? TEXT : zoneColor(scale), true);
        box.addView(value);

        // the course
        box.addView(smallLabel("VERLAUF"), sectionParams(16));
        if (points.isEmpty()) {
            box.addView(text("Noch kein Wert eingetragen.", 13, MUTED, false), sectionParams(4));
        } else {
            HistoryChart chart = new HistoryChart(this, orbitron, LAMBDA, TEXT, MUTED, CARD,
                    pal.scoreHigh, pal.scoreMid, pal.scoreLow);
            chart.setData(points, scale, History.goals(key, profile), dec);
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(170));
            cp.topMargin = dp(6);
            box.addView(chart, cp);
            if (points.size() == 1) box.addView(text(TileInfo.FEW, 12, MUTED, false), sectionParams(2));
        }

        // the zones with their numbers, the value's own marked
        if (scale != null) {
            box.addView(smallLabel("BEREICHE"), sectionParams(16));
            Ranges.Band current = scale.band();
            for (int i = 0; i < scale.bands.length; i++) {
                Ranges.Band b = scale.bands[i];
                LinearLayout row = new LinearLayout(this);
                row.setOrientation(LinearLayout.HORIZONTAL);
                row.setGravity(Gravity.CENTER_VERTICAL);
                GradientDrawable dot = new GradientDrawable();
                dot.setShape(GradientDrawable.OVAL);
                dot.setColor(b.zone == Ranges.Zone.GOOD ? pal.scoreHigh : b.zone == Ranges.Zone.BORDER ? pal.scoreMid : pal.scoreLow);
                dot.setSize(dp(10), dp(10));
                boolean here = b == current;
                TextView w = text(b.word + (here ? "  ← jetzt" : ""), 14, here ? TEXT : MUTED, here);
                w.setCompoundDrawablesRelativeWithIntrinsicBounds(dot, null, null, null);
                w.setCompoundDrawablePadding(dp(8));
                row.addView(w, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
                row.addView(text(scale.span(i), 14, here ? TEXT : MUTED, false));
                box.addView(row, sectionParams(4));
            }
        }

        String[][] parts = {{"WAS ES IST", info.what}, {"WIE GEMESSEN", info.how}, {"WAS ES VERÄNDERT", info.moves},
                {"WARUM ES ZÄHLT", info.why}, {"QUELLE", info.source}};
        for (String[] part : parts) {
            box.addView(smallLabel(part[0]), sectionParams(16));
            box.addView(text(part[1], 14, TEXT, false), sectionParams(4));
        }
        box.addView(text(TileInfo.LEGEND, 12, MUTED, false), sectionParams(16));
        box.addView(text(FitnessScore.DISCLAIMER, 12, MUTED, false), sectionParams(4));

        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);
        AlertDialog.Builder b = dialog(info.title).setView(scroll).setNegativeButton("Schließen", null);
        if (TileInfo.typedIn(key)) {
            b.setPositiveButton(newest.hasWaist() || newest.hasHip() ? "Ändern" : "Eintragen", (x, which) -> editGirths(0));
        }
        show(b.create());
    }

    private LinearLayout.LayoutParams sectionParams(int topDp) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(topDp);
        return lp;
    }

    private View sectionHead(String title, String action, View.OnClickListener onAction) {
        LinearLayout head = new LinearLayout(this);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        TextView t = text(title, 13, MUTED, true);
        t.setLetterSpacing(0.12f);
        head.addView(t, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        if (action != null) {
            TextView a = text(action, 13, LAMBDA, true);
            a.setPadding(dp(10), dp(10), 0, dp(10));
            a.setOnClickListener(onAction);
            head.addView(a);
        } else {
            head.setMinimumHeight(dp(38));
        }
        return head;
    }

    private LinearLayout.LayoutParams headParams() {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(28);
        return lp;
    }

    /** A list with swipe-to-delete; the bottom stays free for the undo bar. */
    private RecyclerView listView(RecyclerView.Adapter<?> a, IntConsumer onSwiped) {
        RecyclerView rv = new RecyclerView(this);
        rv.setLayoutManager(new LinearLayoutManager(this));
        rv.setAdapter(a);
        rv.setPadding(0, 0, 0, dp(64));
        rv.setClipToPadding(false);
        new ItemTouchHelper(new ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) {
            @Override
            public boolean onMove(@NonNull RecyclerView r, @NonNull RecyclerView.ViewHolder x, @NonNull RecyclerView.ViewHolder y) {
                return false;
            }

            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder vh, int dir) {
                int pos = vh.getBindingAdapterPosition();
                if (pos != RecyclerView.NO_POSITION) onSwiped.accept(pos);
            }
        }).attachToRecyclerView(rv);
        return rv;
    }

    private TextView emptyText(String s) {
        TextView t = text(s, 14, MUTED, false);
        t.setGravity(Gravity.CENTER_HORIZONTAL);
        t.setPadding(0, dp(18), 0, 0);
        return t;
    }

    private FrameLayout listBox(RecyclerView rv, TextView emptyView) {
        FrameLayout box = new FrameLayout(this);
        box.addView(rv, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        box.addView(emptyView, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return box;
    }

    private final Runnable hideUndo = () -> undoBar.setVisibility(View.GONE);

    private void offerUndo(String what, Runnable restore) {
        undoText.setText(what);
        ((View) undoBar.getTag()).setOnClickListener(v -> {
            restore.run();
            undoBar.setVisibility(View.GONE);
            ui.removeCallbacks(hideUndo);
        });
        undoBar.setVisibility(View.VISIBLE);
        ui.removeCallbacks(hideUndo);
        ui.postDelayed(hideUndo, UNDO_MS);
    }

    /** What the fasting page may ask the app: only the key of the colour scheme (dark / grey / light). */
    private static final class FastingBridge {
        private final String theme;

        FastingBridge(String theme) {
            this.theme = theme;
        }

        @JavascriptInterface
        public String theme() {
            return theme;
        }
    }

    private static final class Row extends RecyclerView.ViewHolder {
        final TextView day, sub, extra;
        final DigitsView value;

        Row(View v, TextView day, TextView sub, TextView extra, DigitsView value) {
            super(v);
            this.day = day;
            this.sub = sub;
            this.extra = extra;
            this.value = value;
        }
    }

    /** One row of either list: day and time (and the body values) on the left, the big value on the right. */
    private Row newRow() {
        LinearLayout v = new LinearLayout(this);
        v.setOrientation(LinearLayout.HORIZONTAL);
        v.setGravity(Gravity.CENTER_VERTICAL);
        v.setBackground(round(CARD, 12));
        // the rows use the width: date flush left, value flush right (Doc, 20.11.2026: "Das kann durchaus noch ein
        // bisschen nach links und rechts")
        v.setPadding(dp(12), dp(10), dp(12), dp(10));
        RecyclerView.LayoutParams lp = new RecyclerView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        v.setLayoutParams(lp);
        LinearLayout left = new LinearLayout(this);
        left.setOrientation(LinearLayout.VERTICAL);
        TextView day = text("", 15, TEXT, false);
        TextView sub = text("", 13, MUTED, false);
        TextView extra = text("", 12, MUTED, false);
        extra.setVisibility(View.GONE);
        left.addView(day);
        left.addView(sub);
        left.addView(extra);
        v.addView(left, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        DigitsView value = new DigitsView(this, orbitron, 22, LAMBDA);   // the times stand digit under digit
        value.setGravity(Gravity.END);
        value.setPadding(dp(10), 0, 0, 0);
        v.addView(value);
        return new Row(v, day, sub, extra, value);
    }

    private final class WatchAdapter extends RecyclerView.Adapter<Row> {
        @NonNull
        @Override
        public Row onCreateViewHolder(@NonNull ViewGroup parent, int type) {
            return newRow();
        }

        @Override
        public void onBindViewHolder(@NonNull Row r, int i) {
            Entries.Entry e = entries.get(i);
            r.day.setText(Times.day(e.start));
            r.sub.setText("Start " + Times.clock(e.start) + " Uhr");
            r.value.setText(Times.duration(e.duration));
        }

        @Override
        public int getItemCount() {
            return entries.size();
        }
    }

    private final class ScaleAdapter extends RecyclerView.Adapter<Row> {
        @NonNull
        @Override
        public Row onCreateViewHolder(@NonNull ViewGroup parent, int type) {
            Row r = newRow();
            r.value.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
            // a tap enters waist and hip for this weigh-in: the row answers with a ripple
            int ink = (MUTED & 0x00FFFFFF) | 0x40000000;
            r.itemView.setBackground(new RippleDrawable(ColorStateList.valueOf(ink), round(CARD, 12), null));
            r.itemView.setOnClickListener(v -> editGirths(r.getBindingAdapterPosition()));
            return r;
        }

        @Override
        public void onBindViewHolder(@NonNull Row r, int i) {
            Weighings.Weighing w = weighings.get(i);
            BodyComposition bc = BodyComposition.of(w, profile);
            r.day.setText(Times.day(w.time));
            r.sub.setText(Times.clock(w.time) + " Uhr");
            List<String> parts = new ArrayList<>();
            if (!Double.isNaN(bc.fatPercent)) parts.add("Fett " + Times.one(bc.fatPercent, "%"));
            if (!Double.isNaN(bc.waterPercent)) parts.add("Wasser " + Times.one(bc.waterPercent, "%"));
            if (!Double.isNaN(bc.muscleKg)) parts.add("Muskel " + Times.one(bc.muscleKg, "kg"));
            if (parts.isEmpty() && !w.hasResistance()) parts.add("nur Gewicht");
            if (w.hasWaist()) parts.add("Bauch " + Girths.cm(w.waistMm));
            if (w.hasHip()) parts.add("Hüfte " + Girths.cm(w.hipMm));
            String extra = String.join(" · ", parts);
            r.extra.setText(extra);
            r.extra.setVisibility(extra.isEmpty() ? View.GONE : View.VISIBLE);
            r.value.setText(Times.kg(w.kg()));
        }

        @Override
        public int getItemCount() {
            return weighings.size();
        }
    }
}
