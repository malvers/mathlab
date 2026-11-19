package de.docalvers.docfit;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.GradientDrawable;
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
 * - "Stoppuhr": the state in words (BEREIT / LÄUFT / GESTOPPT) with a line saying whether the phone is listening, the
 *   big stopwatch, Start and Stopp as a fallback for the voice, "Zurücksetzen" to clear the stopped time, and the list
 *   of times - newest first, swipe a row away to delete it (with "Rückgängig"; deleting the time on the display clears
 *   the display too, LastRun). While DocFit is open the screen stays on. The microphone listens (KeywordListener) for
 *   "DocFit Start" / "DocFit Stopp" only while this tab is shown - on "Waage" and in the background voice control is
 *   off (Doc, 19.11.2026: the stopwatch started while he was on the scale tab); a running stopwatch keeps its start.
 *   Start and stop confirm with a short buzz and a beep.
 * - "Waage": while it is open the phone looks for the scale (ScaleLink). A state line says what happens ("Stell dich
 *   auf die Waage …", connecting, measuring, done), the last weigh-in stands big with fat, water, muscle and BMI
 *   (BodyComposition, from the profile Doc enters under "Profil"), a fitness score 1-10 with what the values mean
 *   (FitnessScore, ScoreBar), and the list of weigh-ins below, swipe to delete.
 * - "Fasting" (Doc, 19.11.2026: "DocFit ... eine extra Rubrik ... Fasting"): Doc's fasts from his workbook, a chart
 *   grid per fast like his Excel dashboard and all fasts on top of each other from day 1 - the page web/fasting/
 *   (Chart.js, offline) shown in a WebView from the APK's assets; its data file is private and never in git.
 * The gear next to the title chooses the colour scheme, as in Doc's other apps: Blau, Grau, Hell (Palette).
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
    private DigitsView resWeight, resFat, resWater, resMuscle, resBmi;
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
     * "Farbschema" behind the gear: Blau / Grau / Hell like in DocDo, each with a dot of its page colour. The choice is
     * kept in the app's preferences ("theme", DocDo's keys) and the screen is built again in it.
     */
    private void chooseTheme() {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setPadding(dp(20), dp(12), dp(20), dp(4));
        AlertDialog d = dialog("Farbschema").setView(row).setNegativeButton("Schließen", null).create();
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
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(44), 1f);
            lp.setMargins(dp(4), 0, dp(4), 0);
            row.addView(b, lp);
        }
        show(d);
    }

    /**
     * Turning the phone (Doc, 19.11.2026: "ja, drehen lassen" - the big fasting charts on their side): the manifest keeps
     * the activity on a turn (configChanges), so the stopwatch, the voice listener, a weigh-in and the page with an open
     * big chart simply go on. Only the "Fasting" tab may turn; Stoppuhr and Waage stay upright - their buttons and the
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
        frame.setPadding(full ? 0 : dp(20), full ? 0 : dp(16), full ? 0 : dp(20), full ? 0 : dp(12));
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
        saveLast();
        ui.removeCallbacks(tick);
        confirm(false);
        refresh();
    }

    /** "Zurücksetzen": the display back to 00:00 (BEREIT); the time stays in the list. */
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
        state.setText(running ? "LÄUFT" : last.shown() ? "GESTOPPT" : "BEREIT");
        state.setTextColor(running ? LAMBDA : last.shown() ? UPSILON : PHI);
        if (!running) timer.setText(Times.duration(last.shown() ? last.duration : 0));
        timer.setTextColor(running ? TEXT : last.shown() ? LAMBDA : MUTED);
        boolean canReset = LastRun.canReset(running, last);
        startBtn.setEnabled(!running);
        stopBtn.setEnabled(running);
        resetBtn.setEnabled(canReset);
        startBtn.setAlpha(running ? 0.35f : 1f);
        stopBtn.setAlpha(running ? 1f : 0.35f);
        resetBtn.setAlpha(canReset ? 1f : 0.35f);
        if (earProblem != null) {
            ear.setText(earProblem);
            ear.setTextColor(UPSILON);
        } else if (listener == null) {
            ear.setText("Lade Spracherkennung …");
            ear.setTextColor(MUTED);
        } else if (listener.isRunning()) {
            ear.setText(running ? "● hört zu – sag „DocFit Stopp“" : "● hört zu – sag „DocFit Start“");
            ear.setTextColor(PHI);
        } else {
            ear.setText("○ hört gerade nicht zu");
            ear.setTextColor(MUTED);
        }
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
        refreshScale();
    }

    @Override
    public void onScaleResult(Weighings.Weighing w) {
        Weighings.Added added = weighings.add(w);
        switch (added) {
            case NEW:
                scaleAdapter.notifyItemInserted(0);
                scaleList.scrollToPosition(0);
                confirm(true);
                break;
            case COMPLETED:
                scaleAdapter.notifyItemChanged(0);
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
        if (!hasBluetoothPermission() || scale.status() == ScaleLink.Status.NO_PERMISSION && scale.isActive()) {
            s = "Bluetooth nicht erlaubt – hier tippen";
            color = UPSILON;
        } else if (!scale.isActive()) {
            s = "Stell dich auf die Waage …";
            color = MUTED;
        } else {
            switch (scale.status()) {
                case BLUETOOTH_OFF:
                    s = "Bluetooth ist aus – hier tippen zum Einschalten";
                    color = UPSILON;
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

        DigitsView[] tiles = {resFat, resWater, resMuscle, resBmi};
        if (weighings.size() == 0) {
            resWeight.setText("–");
            resWeight.setTextColor(MUTED);
            resWhen.setText(ScaleTexts.when(null));
            for (DigitsView t : tiles) t.setText("–");
            resNote.setText(ScaleTexts.note(null, profile));
            resNote.setTextColor(MUTED);
            fitBox.setVisibility(View.GONE);
        } else {
            Weighings.Weighing last = weighings.get(0);
            BodyComposition bc = BodyComposition.of(last, profile);
            resWeight.setText(Times.kg(last.kg()));
            resWeight.setTextColor(LAMBDA);
            resWhen.setText(ScaleTexts.when(last));
            resFat.setText(Times.one(bc.fatPercent, "%"));
            resWater.setText(Times.one(bc.waterPercent, "%"));
            resMuscle.setText(Times.one(bc.muscleKg, "kg"));
            resBmi.setText(Times.one(bc.bmi, ""));
            // a weight without a usable resistance says so plainly instead of four silent dashes
            resNote.setText(ScaleTexts.note(last, profile));
            resNote.setTextColor(ScaleTexts.fatMissing(last, profile) ? LAMBDA : MUTED);
            showFitness(FitnessScore.of(last, profile));
        }
        scaleEmpty.setVisibility(weighings.size() == 0 ? View.VISIBLE : View.GONE);
    }

    /** The score block under the tiles; without a score only the short hint why. */
    private void showFitness(FitnessScore f) {
        fitBox.setVisibility(View.VISIBLE);
        boolean has = f.score > 0;
        fitHead.setVisibility(has ? View.VISIBLE : View.GONE);
        fitBar.setVisibility(has ? View.VISIBLE : View.GONE);
        fitNote.setVisibility(has ? View.VISIBLE : View.GONE);
        fitText.setText(f.text);
        fitText.setTextColor(has ? TEXT : MUTED);
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
        box.addView(text("Für Körperfett, Wasser, Muskel und BMI. Bleibt nur auf diesem Smartphone.", 14, MUTED, false));
        EditText height = numberField(box, "GRÖSSE IN CM", profile.hasHeight() ? String.valueOf(profile.heightCm) : "", 3);
        EditText year = numberField(box, "GEBURTSJAHR", profile.birthYear >= Profile.MIN_YEAR
                ? String.valueOf(profile.birthYear) : "", 4);
        TextView label = text("GESCHLECHT", 12, MUTED, true);
        label.setLetterSpacing(0.1f);
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

    // DocFit's pills: the dark rounded boxes behind the values of the result card (KÖRPERFETT, WASSER, ...) with their
    // small label above the value - one style for the weight and the four tiles (Doc, 19.11.2026: "Der Einzige, der
    // keine Pille hat, ist Gewicht"; the weight's label is the date and time of the weigh-in, not "Gewicht")
    private static final float PILL_RADIUS = 12, PILL_LABEL_SP = 11, PILL_SPACING = 0.08f;

    private TextView pillLabel(String s) {
        TextView l = text(s, PILL_LABEL_SP, MUTED, true);
        l.setLetterSpacing(PILL_SPACING);
        l.setMaxLines(1);
        return l;
    }

    /** A value in its pill: the page colour as a rounded box on the card, the small label above, the value below. */
    private LinearLayout pill(TextView label, DigitsView value, int valueHeightDp) {
        LinearLayout t = new LinearLayout(this);
        t.setOrientation(LinearLayout.VERTICAL);
        t.setGravity(Gravity.CENTER_HORIZONTAL);
        t.setBackground(round(BG, PILL_RADIUS));
        t.setPadding(dp(6), dp(8), dp(6), dp(8));
        t.addView(label);
        t.addView(value, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(valueHeightDp)));
        return t;
    }

    /** The pills of the result card stand a little apart from each other and from the card's edge. */
    private LinearLayout.LayoutParams pillParams(int width, float weight) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(width, ViewGroup.LayoutParams.WRAP_CONTENT, weight);
        lp.setMargins(dp(4), dp(4), dp(4), dp(4));
        return lp;
    }

    private EditText numberField(LinearLayout box, String label, String value, int maxLen) {
        TextView l = text(label, 12, MUTED, true);
        l.setLetterSpacing(0.1f);
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
        col.setPadding(dp(20), dp(16), dp(20), dp(12));
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
        gear.setContentDescription("Farbschema");
        gear.setOnClickListener(v -> chooseTheme());
        head.addView(gear, new FrameLayout.LayoutParams(dp(40), dp(40), Gravity.END | Gravity.CENTER_VERTICAL));
        col.addView(head, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout tabs = new LinearLayout(this);
        tabBar = tabs;
        tabs.setOrientation(LinearLayout.HORIZONTAL);
        tabs.setBackground(round(CARD, 14));
        tabs.setPadding(dp(4), dp(4), dp(4), dp(4));
        tabWatch = tabButton("Stoppuhr", TAB_WATCH);
        tabScale = tabButton("Waage", TAB_SCALE);
        tabFast = tabButton("Fasting", TAB_FAST);
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

        state = text("BEREIT", 26, PHI, true);
        state.setGravity(Gravity.CENTER);
        state.setLetterSpacing(0.12f);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        page.addView(state, lp);

        ear = text("Lade Spracherkennung …", 14, MUTED, false);
        ear.setGravity(Gravity.CENTER);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(4);
        page.addView(ear, lp);

        // the big stopwatch: digits in fixed cells so the running time does not wobble, smaller only if it does not fit
        timer = new DigitsView(this, orbitron, 96, MUTED);
        timer.setText(Times.duration(0));
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(118));
        lp.topMargin = dp(10);
        page.addView(timer, lp);

        TextView hint = text("Sag „DocFit Start“ zum Starten und „DocFit Stopp“ zum Anhalten.", 13, MUTED, false);
        hint.setGravity(Gravity.CENTER);
        page.addView(hint, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setBaselineAligned(false);   // the smaller "Zurücksetzen" text must not push its button down
        startBtn = button("Start", PHI);
        stopBtn = button("Stopp", UPSILON);
        stopBtn.setTextColor(pal.onUpsilon);
        startBtn.setOnClickListener(v -> { if (runStart == 0) start(System.currentTimeMillis()); });
        stopBtn.setOnClickListener(v -> { if (runStart != 0) stop(System.currentTimeMillis()); });
        // the quiet third button: clears the stopped time from the display, the list keeps it
        resetBtn = button("Zurücksetzen", CARD);
        resetBtn.setTextColor(LAMBDA);
        resetBtn.setMaxLines(1);
        resetBtn.setPadding(dp(8), 0, dp(8), 0);
        resetBtn.setAutoSizeTextTypeUniformWithConfiguration(10, 17, 1, TypedValue.COMPLEX_UNIT_SP);
        resetBtn.setOnClickListener(v -> reset());
        LinearLayout.LayoutParams b1 = new LinearLayout.LayoutParams(0, dp(56), 1f);
        b1.rightMargin = dp(6);
        LinearLayout.LayoutParams b2 = new LinearLayout.LayoutParams(0, dp(56), 1f);
        b2.leftMargin = dp(6);
        b2.rightMargin = dp(6);
        LinearLayout.LayoutParams b3 = new LinearLayout.LayoutParams(0, dp(56), 1.6f);   // the longest word
        b3.leftMargin = dp(6);
        row.addView(startBtn, b1);
        row.addView(stopBtn, b2);
        row.addView(resetBtn, b3);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(18);
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

    private View buildScalePage() {
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);

        // what is happening, two lines high so the page does not jump; a tap fixes permission or Bluetooth
        scaleState = text("Stell dich auf die Waage …", 16, TEXT, true);
        scaleState.setGravity(Gravity.CENTER);
        scaleState.setMinLines(2);
        scaleState.setPadding(0, dp(6), 0, dp(6));
        scaleState.setOnClickListener(v -> onScaleStateTapped());
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(10);
        page.addView(scaleState, lp);

        // the last weigh-in, big
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackground(round(CARD, 16));
        card.setPadding(dp(14), dp(12), dp(14), dp(12));
        // the weight in a pill like the tiles below, its label the moment of the weigh-in (Doc, 19.11.2026: "Gewicht
        // braucht man da nicht schreiben ... in die Pille rein, das Datum und die Uhrzeit")
        resWhen = pillLabel("");
        resWeight = new DigitsView(this, orbitron, 52, MUTED);
        resWeight.setText("–");
        card.addView(pill(resWhen, resWeight, 76), pillParams(ViewGroup.LayoutParams.MATCH_PARENT, 0));
        LinearLayout r1 = new LinearLayout(this), r2 = new LinearLayout(this);
        resFat = tile(r1, "KÖRPERFETT");
        resWater = tile(r1, "WASSER");
        resMuscle = tile(r2, "MUSKEL");
        resBmi = tile(r2, "BMI");
        card.addView(r1);
        card.addView(r2);
        card.addView(buildFitness());
        resNote = text("", 12, MUTED, false);
        resNote.setGravity(Gravity.CENTER);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        card.addView(resNote, lp);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        page.addView(card, lp);

        page.addView(sectionHead("MESSUNGEN", "Profil", v -> editProfile()), headParams());

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
        page.addView(listBox(scaleList, scaleEmpty), new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        return page;
    }

    /**
     * The fitness score under the four tiles (Doc, 19.11.2026: "Ein Indikator von grottenschlecht bis 10 Top-Athlet"):
     * the number and its word in the colour of the bar, the bar, one or two sentences on the values, the disclaimer.
     */
    private View buildFitness() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackground(round(BG, 12));
        box.setPadding(dp(12), dp(6), dp(12), dp(10));
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
        LinearLayout.LayoutParams outer = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        outer.setMargins(dp(4), dp(4), dp(4), dp(4));
        box.setLayoutParams(outer);
        fitBox = box;
        fitHead = head;
        box.setVisibility(View.GONE);
        return box;
    }

    /** One of the four small values in the result card: label above, value below. */
    private DigitsView tile(LinearLayout row, String label) {
        DigitsView v = new DigitsView(this, orbitron, 20, TEXT);
        v.setText("–");
        row.addView(pill(pillLabel(label), v, 28), pillParams(0, 1f));
        return v;
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
        lp.topMargin = dp(14);
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

    /** One row of either list: day and time (and the body values) on the left, the big value on the right. */
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

    private Row newRow() {
        LinearLayout v = new LinearLayout(this);
        v.setOrientation(LinearLayout.HORIZONTAL);
        v.setGravity(Gravity.CENTER_VERTICAL);
        v.setBackground(round(CARD, 12));
        v.setPadding(dp(16), dp(12), dp(16), dp(12));
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
            String extra = parts.isEmpty() ? (w.hasResistance() ? "" : "nur Gewicht") : String.join(" · ", parts);
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
