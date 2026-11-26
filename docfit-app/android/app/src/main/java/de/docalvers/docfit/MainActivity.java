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
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.text.InputType;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.ForegroundColorSpan;
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
import java.util.TimeZone;
import java.util.function.IntConsumer;

/**
 * DocFit - a stopwatch for the morning workout that listens (Doc, 16.11.2026: "wenn ich sage DocFit ... soll das Ding
 * ... eine Stoppuhr starten. Und wenn ich sage Stopp, soll der die Stoppuhr stoppen. ... die Zeit soll dann in eine Liste
 * eingetragen werden mit Datum und Uhrzeit"), and the Vitafit body-fat scale (Doc, 19.11.2026: "ja, bau das in DocFit
 * ein").
 *
 * Three tabs under the title - Stoppuhr, Waage, Blutdruck - and the fasting view behind the gear:
 * - "Stoppuhr": the command to say next ("DocFit Start", while running "DocFit Stopp" - Doc, 20.11.2026: "‚bereit'
 *   und ‚gestoppt' bitte weg, nimmt Platz weg") with a line saying whether the phone is listening, the big stopwatch
 *   (green while ready), Start, Stopp and Reset as three equal buttons (Reset clears the stopped time), and the list
 *   of times - newest first, swipe a row away to delete it (with "Rückgängig"; deleting the time on the display clears
 *   the display too, LastRun). While DocFit is open the screen stays on. The microphone listens (KeywordListener) for
 *   "DocFit Start" / "DocFit Stopp" only while this tab is shown - on "Waage" and in the background voice control is
 *   off (Doc, 19.11.2026: the stopwatch started while he was on the scale tab); a running stopwatch keeps its start.
 *   Start and stop confirm with a short buzz and a beep. On top of the tab, under the tab bar, the exercise the time
 *   is for (Doc, 20.11.2026: two "Rubriken", "Planks" and "Two Balls"): one of two chips, the last choice remembered
 *   ("kind"); a stopped time takes the chip chosen at that moment (it may still be switched while the clock runs), and
 *   the list shows it in front of the start time. Voice control is the same for both.
 * - "Waage": while it is open the phone looks for the scale (ScaleLink). A state line says what happens ("Stell dich
 *   auf die Waage …", connecting, measuring, done), the last weigh-in stands big with fat, water, muscle and BMI
 *   (BodyComposition, from the profile Doc enters under "Profil"), waist and hip typed in by hand with their ratios
 *   (Girths), a fitness score 1-10 with what the values mean (FitnessScore, ScoreBar), and the list of weigh-ins
 *   below, swipe to delete; a tap shows that weigh-in in the card (again, or on the newest: back to the newest), a long
 *   press enters waist and hip (Doc, 23.11.2026). Scrolling the list up pushes the big card away until a compact
 *   bar is left (CollapsingHeader: date and weight, fat, fitness - or the state of a running weigh-in).
 *   Two people use the scale (Doc, 20.11.2026): Doc and a second person, each with her own profile, list, tiles and
 *   girths (Profile / Weighings slot "" and "2"; her name only in the phone's preferences). A result goes to the one
 *   whose newest weight is within 5 kg (the nearer of both; Weighings.whose), near neither DocFit asks "Doc oder …?"
 *   with "Keiner" to drop it. A switch on top of the tab shows the other person; DocFit opens on Doc, and the view
 *   follows a result to its person. "Zu …" in a weigh-in's waist and hip dialog moves it to the other person, if the
 *   guess was wrong (until 23.11.2026 the long press did).
 *   Under the gear, "Personen": each one on or off ("profileOn" / "profile2On"); off = out of the switch and of the
 *   assignment, her data stays. With one on there is no switch and every result is hers - still asked when it is
 *   more than 5 kg from her newest ("Ist das …?"). At least one stays on.
 * - "Blutdruck" (Doc, 20.11.2026, where "Fasten" was): readings typed in by hand (Doc, 21.11.2026 - replacing the
 *   rule of 19.11. "no typing", for when the Omron does not send or in Spain without it): systolic, diastolic, pulse,
 *   date and time (now, changeable), a note; per person like the scale (the same switch). The list colours each
 *   reading by its ESH category and says where it came from ("Hand" or "Omron"). The Omron M400 Intelli IT (Doc,
 *   24.11.2026): "Omron koppeln" once (its Bluetooth key held until "P" blinks), then while this tab is open its
 *   readings come in by themselves over the open Bluetooth blood pressure standard (BpLink, Bpm): user 1 to Doc, user
 *   2 to the second person, nothing from before the day of the first pairing, the monitor's clock set each time.
 *   Swipe or long press deletes, with "Rückgängig" (Pressures).
 * - "Blutzucker" (Doc, 21.11.2026, the drop): readings typed in by hand - one number, its unit found by itself (below 35
 *   mmol/L, else mg/dL, a chip to override), date and time, when it was measured (nüchtern / vor dem Essen / nach dem
 *   Essen (2 h) / sonstige), a note; always shown in both units (his meter says mmol/L, he thinks in mg/dL). Fasting and
 *   two hours after a meal are coloured by their limits. Per person like the scale; long press deletes (Glucoses).
 * - "Verlauf" (Doc, 26.11.2026): the course of the running values - Gewicht, Körperfett, Bauch, Blutdruck (Sys/Dia),
 *   Puls, Blutzucker nüchtern, the stopwatch times per exercise - over 4 weeks, 3 months, 1 year or everything, per
 *   person (Trends, HistoryChart). In the stopwatch's ZEITEN a tap selects a time; the exercise chips then move it to
 *   another exercise, with "Rückgängig" (Doc, 26.11.2026).
 * - Fastenmodus (Doc, 21.11.2026): in the fasting view "Fasten starten" (planned 5 / 7 days / own, start now or
 *   earlier), a running fast shows a slim banner on top ("Fasten · Tag 3 von 5 · 62 h", "Beenden"). A fast is a time
 *   range (Fasts): every measurement in it belongs to it by its time, also after start or end are changed. It stands
 *   as a card next to the workbook's fasts on the fasting page, built from the live measurements (FastLive, through
 *   DocFitApp.liveFasts()). While it runs: a red / orange hint card when the newest systolic value or glucose is low
 *   (a hint, not a diagnosis), and a morning reminder "Wiegen + Blutzucker nüchtern" (FastReminder, set under the gear).
 * - "Fasten" (Doc, 19.11.2026: "DocFit ... eine extra Rubrik ... Fasting", 20.11.: "schreibt bitte Fasten, wir haben es
 *   ja nun mal Deutsch"): Doc's fasts from his workbook, a chart
 *   grid per fast like his Excel dashboard and all fasts on top of each other from day 1 - the page web/fasting/
 *   (Chart.js, offline) shown in a WebView from the APK's assets; its data file is private and never in git. Since
 *   20.11.2026 no longer a tab but the first entry of the settings (Doc: into the menu under the gear, at the very
 *   top); while it is shown neither tab is lit, a tap on one of them or Back (at the page's start) leaves it again.
 * No title row (since 21.11.2026): the small gear at the right end of the tab row opens the settings: "Fasten", the
 * colour scheme as in Doc's other apps - Blau, Grau, Hell (Palette) - "Personen" and "Messmethode", where the scale's
 * values come from. All pages share one page margin (PAGE_SIDE).
 * Everything stays on the phone (Entries, Weighings, Profile in the app's preferences; no internet permission).
 */
public class MainActivity extends Activity implements KeywordListener.Callback, ScaleLink.Callback, BpLink.Callback {
    // the colours of the chosen scheme (Palette: Blau / Grau / Hell), set in onCreate before the screen is built;
    // LAMBDA = lambda as text (Hell: the svp blue), the fills take theirs from pal
    private Palette pal;
    private int LAMBDA, UPSILON, PHI, TEXT, MUTED, CARD, BG;
    private static final int ASK_MIC = 1, ASK_BT = 2;
    // the paired Omron's address and the first day whose readings count (only on this phone, never synced)
    private static final String OMRON_ADDRESS = "omronAddress", OMRON_SINCE = "omronSince", OMRON_KEY = "omronKey",
            OMRON_CLOCK = "omronClockSet", OMRON_CLOCK_OFFSET = "omronClockOffset", OMRON_CLOCK_NEEDED = "omronClockNeeded";
    // the Omron's clock is set rarely (BpLink: a clock transmission makes the monitor keep that connection's readings
    // for the next one): when a reading had no time (batteries out), when summer/winter time changed since, or after
    // 30 days (drift)
    private static final long OMRON_CLOCK_EVERY_MS = 30L * 24 * 3_600_000L;
    // TAB_FAST is the fasting view, opened from the settings (no tab of its own since 20.11.2026)
    private static final int TAB_WATCH = 0, TAB_SCALE = 1, TAB_FAST = 2, TAB_BP = 3, TAB_GLU = 4, TAB_HIST = 5;
    private static final String FASTING_PAGE = "file:///android_asset/fasting/index.html";
    private static final long DEBOUNCE_MS = 1500;   // one word must not start and at once stop again
    private static final long UNDO_MS = 5000;
    // the page margin left and right, the same on every tab (Doc, 20.11.2026: "Links und rechts geht das breiter")
    private static final int PAGE_SIDE = 12;
    // the height of a tab and of a person chip (Doc, 21.11.2026: the tabs "genau so flach" as Doc | …), in dp
    private static final int TAB_HEIGHT = 36;

    private final Handler ui = new Handler(Looper.getMainLooper());
    private SharedPreferences prefs;
    private Entries entries;
    private Typeface orbitron;
    private TextView state, ear, empty, undoText;
    private DigitsView timer;
    private Button startBtn, stopBtn, resetBtn;
    private View undoBar, watchPage, scalePage, bpPage, gluPage, histPage;
    // the "Verlauf" tab (Doc, 26.11.2026): its cards, the stretch of time (Trends.RANGE_WORDS) and the person switch
    private LinearLayout histCards;
    private final TextView[] histRangeChips = new TextView[Trends.RANGE_WORDS.length];
    private final TextView[] histPersonChips = new TextView[SLOTS.length];
    private View histPersonRow;
    private int histRange;
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

    // the scale: both people's lists and profiles (0 = Doc, 1 = the second person), and the one shown - weighings and
    // profile always point at the shown person's, so the whole tab draws whoever is chosen
    private static final String[] SLOTS = {"", "2"};
    private final Weighings[] lists = new Weighings[2];
    private final Profile[] profiles = new Profile[2];
    private final String[] names = new String[2];
    private final TextView[] personChips = new TextView[2];
    private TextView listTitle;
    // blood pressure: both people's readings, the shown person's, and the tab's own person switch
    private final Pressures[] bpLists = new Pressures[SLOTS.length];
    private Pressures pressures;
    private RecyclerView bpList;
    private BpAdapter bpAdapter;
    private TextView bpEmpty, bpTitle;
    // the Omron M400 Intelli IT over Bluetooth (BpLink): its state line, "Omron koppeln", what the last transfer brought
    private BpLink bp;
    private TextView bpState;
    private Button bpPair;
    private String bpDoneText;
    private int bpNew, bpNewOther, bpSkipped, bpNoTime;
    private boolean bpJustPaired, pendingPair, bpClockNow;
    private BpLink.Status bpLast = BpLink.Status.IDLE;
    private final TextView[] bpPersonChips = new TextView[SLOTS.length];
    private View bpPersonRow;
    // blood glucose: both people's readings, the shown person's, and the tab's own person switch
    private final Glucoses[] gluLists = new Glucoses[SLOTS.length];
    private Glucoses glucoses;
    private RecyclerView gluList;
    private GluAdapter gluAdapter;
    private TextView gluEmpty, gluTitle;
    private final TextView[] gluPersonChips = new TextView[SLOTS.length];
    private View gluPersonRow;
    // the fasting mode: both people's fasts and the shown person's, the banner on top with its hint card, the head of
    // the fasting view above the page, and the page's live data (DocFitApp.liveFasts, built on the main thread)
    private final Fasts[] fastLists = new Fasts[SLOTS.length];
    private Fasts fasts;
    private LinearLayout fastBanner, fastHead;
    private TextView fastBannerText, fastWarn;
    private FrameLayout fastWebBox;
    private volatile String liveFastsJson = "{\"fasts\":[],\"days\":{}}";
    private static final int REQ_NOTIFY = 41;
    private final Runnable fastTick = new Runnable() {
        @Override
        public void run() {
            refreshFast();
            ui.postDelayed(this, 60_000);
        }
    };
    // who is switched on in the settings ("Personen"); off = not in the switch, not assigned, data kept
    private final boolean[] on = new boolean[SLOTS.length];
    private View personRow;
    private int person;
    private Weighings weighings;
    /** the weigh-in the scale card shows, by its moment (Weighings.shownIndex); 0 = the newest */
    private long pickedWeighing;
    private Profile profile;
    private ScaleLink scale;
    // the private Supabase tables, so the web page /docfit/ shows the same (Sync, SyncPanel; offline first)
    private Sync sync;
    private int tab;
    private String doneText;
    // a result near neither person waits for the answer to "Doc oder …?" (pendingWeigh); one answered "Keiner" is
    // remembered, so the scale's repeats of it (the resistance comes a moment later) are not stored either
    private Weighings.Weighing pendingWeigh, rejectedWeigh;
    private AlertDialog askDialog;
    private ImageView tabWatch, tabScale, tabBp, tabGlu, tabHist;
    private TextView scaleState, resWhen, resNote, scaleEmpty;
    // the tab the fasting view was opened from - Back at the page's start returns there
    private int backTab = TAB_WATCH;
    // the exercise a stopped time is filed under (Entries.KINDS) and its chips on the stopwatch tab
    private String kind;
    private final TextView[] kindChips = new TextView[Entries.KINDS.length];
    // a time selected in ZEITEN (its start, 0 = none) and the line under the chips that says so
    private long pickedRun;
    private TextView pickHint;
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
    // the screen's frame: the tab bar (with the gear) and the column around the pages - they step aside when the
    // fasting view is shown on its side
    private LinearLayout frame;
    private View tabBar;

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
        for (int i = 0; i < SLOTS.length; i++) {
            lists[i] = new Weighings(this, SLOTS[i]);
            bpLists[i] = new Pressures(this, SLOTS[i]);
            gluLists[i] = new Glucoses(this, SLOTS[i]);
            fastLists[i] = new Fasts(this, SLOTS[i]);
            profiles[i] = Profile.load(prefs, SLOTS[i]);
            on[i] = prefs.getBoolean("profile" + SLOTS[i] + "On", true);
        }
        if (Weighings.countOn(on) == 0) on[0] = true;   // at least one stays on
        names[0] = "Doc";
        names[1] = prefs.getString("profile2Name", "Gast");   // her name lives only on the phone
        person = Weighings.firstOn(on);   // DocFit opens on Doc (or the first one on)
        weighings = lists[person];
        profile = profiles[person];
        pressures = bpLists[person];
        glucoses = gluLists[person];
        fasts = fastLists[person];
        kind = Entries.kindOrDefault(prefs.getString("kind", null));
        scale = new ScaleLink(this, this);
        bp = new BpLink(this, this);
        bp.setKey(omronKey());
        bp.setClockDue(omronClockDue());
        bp.setPaired(prefs.getString(OMRON_ADDRESS, null));
        sync = new Sync(this, changed -> {
            if (changed) reloadFromSync();
        });
        sync.start();
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
        showTab(savedTab == TAB_SCALE || savedTab == TAB_FAST || savedTab == TAB_BP
                || savedTab == TAB_GLU || savedTab == TAB_HIST ? savedTab : TAB_WATCH);
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
        sync.foreground(true);
        listenIfAllowed();
        updateScale();
        updateBp();
        refresh();
        if (tab == TAB_HIST) refreshHist();
        if (fastWeb != null) fastWeb.onResume();
        applyFastingChrome();   // the phone may have been turned while another app was in front
        refreshFast();
        ui.removeCallbacks(fastTick);
        ui.postDelayed(fastTick, 60_000);
        FastReminder.schedule(this);   // set again after a restart of the phone
    }

    @Override
    protected void onPause() {
        super.onPause();
        resumed = false;
        sync.foreground(false);
        if (listener != null) listener.stop();
        scale.stop();
        if (!bp.isPairing()) bp.stop();   // Android's "Koppeln?" question pauses DocFit - the pairing goes on
        refresh();
        refreshScale();
        refreshBpState();
        if (fastWeb != null) fastWeb.onPause();
        ui.removeCallbacks(fastTick);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        ui.removeCallbacksAndMessages(null);
        scale.stop();
        bp.stop();
        if (listener != null) listener.stop();
        if (model != null) model.close();
        if (tone != null) tone.release();
        if (fastWeb != null) fastWeb.destroy();
        if (askDialog != null) askDialog.dismiss();   // an unanswered question stores nothing
        sync.stop();
    }

    /**
     * Sync took over changes from the server (made on the web): read the lists, readings and profiles again from the
     * preferences - the objects held here would otherwise write their old state back.
     */
    private void reloadFromSync() {
        entries = new Entries(this);
        for (int i = 0; i < SLOTS.length; i++) {
            lists[i] = new Weighings(this, SLOTS[i]);
            bpLists[i] = new Pressures(this, SLOTS[i]);
            gluLists[i] = new Glucoses(this, SLOTS[i]);
            fastLists[i] = new Fasts(this, SLOTS[i]);
            profiles[i] = Profile.load(prefs, SLOTS[i]);
            on[i] = prefs.getBoolean("profile" + SLOTS[i] + "On", true);
        }
        if (Weighings.countOn(on) == 0) on[0] = true;
        names[1] = prefs.getString("profile2Name", "Gast");
        if (!on[person]) person = Weighings.firstOn(on);
        weighings = lists[person];
        profile = profiles[person];
        pressures = bpLists[person];
        glucoses = gluLists[person];
        fasts = fastLists[person];
        if (adapter != null) adapter.notifyDataSetChanged();
        if (scaleAdapter != null) scaleAdapter.notifyDataSetChanged();
        if (bpAdapter != null) bpAdapter.notifyDataSetChanged();
        if (gluAdapter != null) gluAdapter.notifyDataSetChanged();
        paintPersons();
        refresh();
        refreshScale();
        refreshBp();
        refreshGlu();
        refreshFast();   // a fast started or ended on the web: banner and fasting page
        if (tab == TAB_HIST) refreshHist();
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
     * The settings behind the gear. First "Fasten", the fasting view (Doc, 20.11.2026: no longer a tab, into the menu
     * under the gear, at the very top), a row outlined like the scheme chips with a "›". "Farbschema": Blau / Grau /
     * Hell like in DocDo, each with a dot of its page colour; the choice is kept in the app's preferences ("theme",
     * DocDo's keys) and the screen is built again in it.
     * "Messmethode": the newest resistance and where the scale tab's values come from (Doc, 20.11.2026: "tu ihn unter
     * Einstellungen irgendwohin, damit wir da nicht den Platz verschwenden").
     */
    private void openSettings() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(20), 0, dp(20), dp(8));
        LinearLayout fast = new LinearLayout(this);
        fast.setOrientation(LinearLayout.HORIZONTAL);
        fast.setGravity(Gravity.CENTER_VERTICAL);
        fast.setPadding(dp(14), 0, dp(14), 0);
        // phi green like everything below the tabs (Doc, 21.11.2026: top row orange, the rest green)
        GradientDrawable fg = round(0x00000000, 10);
        fg.setStroke(Math.max(1, dp(1)), PHI);
        fast.setBackground(fg);
        fast.addView(text("Fasten", 15, PHI, true), new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView chevron = text("›", 22, PHI, false);
        chevron.setTranslationY(-dp(3));   // the glyph sits low in its line; centred on "Fasten" by eye
        fast.addView(chevron);
        fast.setContentDescription("Fasten öffnen");
        box.addView(fast, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(48)));
        TextView schemeLabel = smallLabel("FARBSCHEMA");
        LinearLayout.LayoutParams sp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        sp.topMargin = dp(22);
        box.addView(schemeLabel, sp);
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams rp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rp.topMargin = dp(8);
        box.addView(row, rp);
        // "Personen": who is on - off takes her out of the switch and the assignment, her data stays (Doc, 20.11.2026)
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(22);
        box.addView(smallLabel("PERSONEN"), lp);
        LinearLayout people = new LinearLayout(this);
        people.setOrientation(LinearLayout.HORIZONTAL);
        TextView peopleHint = text("Aus: nicht im Umschalter, keine Zuordnung – die Daten bleiben gespeichert.", 12,
                MUTED, false);
        for (int i = 0; i < SLOTS.length; i++) {
            int who = i;
            TextView c = text(names[i], 14, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setMaxLines(1);
            c.setPadding(dp(8), 0, dp(8), 0);
            paintGreen(c, on[i]);
            c.setOnClickListener(v -> {
                if (togglePerson(who)) {
                    paintGreen(c, on[who]);
                    peopleHint.setTextColor(MUTED);
                } else {
                    peopleHint.setText("Mindestens eine Person bleibt an.");
                    peopleHint.setTextColor(UPSILON);
                }
            });
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(44), 1f);
            cp.setMargins(i == 0 ? 0 : dp(4), 0, i == SLOTS.length - 1 ? 0 : dp(4), 0);
            people.addView(c, cp);
        }
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        box.addView(people, lp);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        box.addView(peopleHint, lp);

        AlertDialog[] settingsDialog = new AlertDialog[1];   // set below; the sync row closes it before its own dialog
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(22);
        box.addView(new SyncPanel(this, sync, pal, orbitron).section(() -> {
            if (settingsDialog[0] != null) settingsDialog[0].dismiss();
        }), lp);

        // the morning reminder while a fast runs (FastReminder): on/off and the time
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(22);
        box.addView(smallLabel("ERINNERUNG BEIM FASTEN"), lp);
        LinearLayout remindRow = new LinearLayout(this);
        remindRow.setOrientation(LinearLayout.HORIZONTAL);
        remindRow.setGravity(Gravity.CENTER_VERTICAL);
        TextView remindOn = text("", 14, TEXT, true);
        remindOn.setGravity(Gravity.CENTER);
        TextView remindAt = text("", 16, LAMBDA, true);
        remindAt.setGravity(Gravity.CENTER);
        Runnable paintRemind = () -> {
            boolean onNow = FastReminder.on(this);
            remindOn.setText(onNow ? "an" : "aus");
            paintPick(remindOn, onNow);
            int m = FastReminder.minute(this);
            remindAt.setText(String.format(java.util.Locale.GERMANY, "%02d:%02d Uhr", m / 60, m % 60));
            remindAt.setAlpha(onNow ? 1f : 0.4f);
        };
        remindOn.setOnClickListener(v -> {
            prefs.edit().putBoolean("fastRemind", !FastReminder.on(this)).apply();
            FastReminder.schedule(this);
            paintRemind.run();
        });
        remindAt.setOnClickListener(v -> {
            int m = FastReminder.minute(this);
            new TimePickerDialog(this, pal.light ? android.R.style.Theme_DeviceDefault_Light_Dialog
                    : android.R.style.Theme_DeviceDefault_Dialog, (clock, h, min) -> {
                prefs.edit().putInt("fastRemindAt", h * 60 + min).apply();
                FastReminder.schedule(this);
                paintRemind.run();
            }, m / 60, m % 60, true).show();
        });
        paintRemind.run();
        remindRow.addView(remindOn, new LinearLayout.LayoutParams(dp(72), dp(TAB_HEIGHT)));
        LinearLayout.LayoutParams ap = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f);
        ap.leftMargin = dp(10);
        remindRow.addView(remindAt, ap);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        box.addView(remindRow, lp);
        box.addView(text("„Wiegen + Blutzucker nüchtern“ – nur solange ein Fasten läuft.", 12, MUTED, false));

        TextView methodLabel = smallLabel("MESSMETHODE");
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(22);
        box.addView(methodLabel, lp);
        TextView method = text(ScaleTexts.method(weighings.newestMeasured()), 13, TEXT, false);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        box.addView(method, lp);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);
        // no "Schließen" button at the bottom: a cross at the top right, in the title row (Doc, 21.11.2026)
        FrameLayout titleRow = new FrameLayout(this);
        TextView titleText = text("Einstellungen", 18, LAMBDA, true);
        titleText.setPadding(dp(24), dp(20), dp(56), dp(4));
        titleRow.addView(titleText, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        ImageView close = new ImageView(this);
        close.setImageResource(R.drawable.ic_close);
        close.setColorFilter(pal.iconIdle);
        close.setPadding(dp(12), dp(12), dp(12), dp(12));   // a 24 dp cross in a 48 dp touch target
        close.setContentDescription("Schließen");
        FrameLayout.LayoutParams cl = new FrameLayout.LayoutParams(dp(48), dp(48), Gravity.END | Gravity.TOP);
        cl.setMargins(0, dp(8), dp(8), 0);
        titleRow.addView(close, cl);
        AlertDialog d = dialog("Einstellungen").setCustomTitle(titleRow).setView(scroll).create();
        settingsDialog[0] = d;
        close.setOnClickListener(v -> d.dismiss());
        fast.setOnClickListener(v -> {
            d.dismiss();
            if (tab != TAB_FAST) showTab(TAB_FAST);
        });
        int current = Palette.index(pal.key);
        for (int i = 0; i < Palette.KEYS.length; i++) {
            boolean on = i == current;
            TextView b = text(Palette.NAMES[i], 14, TEXT, true);
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
            paintPick(b, on);
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
     * mit DocFit natürlich weg ... Und selbst das Zahnrad kann dann weg"): the tabs with the gear and the status bar step
     * aside until the phone stands upright again. The way out on its side: turn it, or Back (inside the page first).
     */
    @SuppressWarnings("deprecation")
    private void applyFastingChrome() {
        if (frame == null) return;
        boolean full = tab == TAB_FAST
                && getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
        tabBar.setVisibility(full ? View.GONE : View.VISIBLE);
        if (fastHead != null) fastHead.setVisibility(full ? View.GONE : View.VISIBLE);
        refreshFast();
        frame.setPadding(full ? 0 : dp(PAGE_SIDE), full ? 0 : dp(12), full ? 0 : dp(PAGE_SIDE), full ? 0 : dp(12));
        if (full) getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    /**
     * In the fasting view Back first goes back inside the page (a fast -> the comparison, a big chart -> closed), then to
     * the tab it was opened from - it is no tab of its own any more, so Back does not close DocFit there.
     */
    @Override
    public void onBackPressed() {
        if (tab == TAB_FAST && fastWeb != null && fastWeb.canGoBack()) {
            fastWeb.goBack();
        } else if (tab == TAB_FAST) {
            showTab(backTab);
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
        updateBp();
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
        entries.addNewest(new Entries.Entry(runStart, duration, kind));
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
        // the same ink ready and running (Doc, 23.11.2026: "Macht DocFit Start/Stopp weiß bitte.")
        state.setTextColor(pal.commandInk);
        String shown = Times.duration(last.shown() ? last.duration : 0);
        if (!running) timer.setText(shown);
        // 00:00 pal.idleInk, running pal.runInk, a stopped time orange - never grey (Doc, 20.11.2026: "Wenn die
        // Stoppuhr läuft, ist die grau ... wir machen die rot"; 23.11.2026 cyan as a trial: "die Stoppuhr bitte mal in
        // Cyan probieren", and "Wenn da steht 00:00, mach das bitte fast weiß", in Hell "Anthrazit")
        boolean zero = shown.equals(Times.duration(0));
        timer.setTextColor(running ? pal.runInk : zero ? pal.idleInk : LAMBDA);
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
        boolean omron = tab == TAB_BP;
        AlertDialog d = dialog(omron ? "Blutdruck per Bluetooth" : "Waage per Bluetooth")
                .setMessage((omron ? "DocFit verbindet sich per Bluetooth mit deinem Omron und liest Blutdruck und Puls. "
                        : "DocFit sucht deine Vitafit-Waage per Bluetooth und liest Gewicht und Körperwiderstand. ")
                        + what + " Alle Messungen bleiben auf diesem Smartphone.")
                .setPositiveButton("Weiter", (x, w) -> requestPermissions(bluetoothPermissions(), ASK_BT))
                .setNegativeButton("Nicht jetzt", (x, w) -> {
                    asking = false;
                    pendingPair = false;
                    refreshScale();
                    refreshBpState();
                })
                .setOnCancelListener(x -> {
                    asking = false;
                    pendingPair = false;
                    refreshScale();
                    refreshBpState();
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

    /**
     * A result from the scale goes to the person whose newest weight is near (Weighings.whose); near neither, DocFit
     * asks "Doc oder …?" first and stores nothing until then (Doc, 20.11.2026: another person's weigh-in had landed in
     * his list).
     */
    @Override
    public void onScaleResult(Weighings.Weighing w) {
        if (rejectedWeigh != null && Weighings.isRepeat(rejectedWeigh, w)) {   // the rest of a weigh-in dropped
            doneText = ScaleTexts.DISCARDED;
            refreshScale();
            return;
        }
        if (pendingWeigh != null && Weighings.isRepeat(pendingWeigh, w)) {     // e.g. the resistance, while asking
            Weighings.Weighing completed = Weighings.completion(pendingWeigh, w);
            if (completed != null) pendingWeigh = completed;
            return;
        }
        Weighings.Weighing[] newest = new Weighings.Weighing[SLOTS.length];
        for (int i = 0; i < newest.length; i++) newest[i] = newest(i);
        int who = Weighings.whose(newest, on, w);
        if (who == Weighings.ASK) {
            askWhose(w);
            return;
        }
        store(w, who);
    }

    private Weighings.Weighing newest(int who) {
        return lists[who].size() == 0 ? null : lists[who].get(0);
    }

    /** "Doc oder …?" in the app's dialog: a button per person, "Keiner" drops it. No typing, no way around. */
    private void askWhose(Weighings.Weighing w) {
        if (askDialog != null) askDialog.dismiss();
        pendingWeigh = w;
        rejectedWeigh = null;
        doneText = ScaleTexts.ASKING;
        refreshScale();
        if (scaleHead != null) scaleHead.setOpen(true, true);
        boolean one = Weighings.countOn(on) == 1;
        int only = Weighings.firstOn(on);
        TextView msg = text(one ? ScaleTexts.askOneText(w) : ScaleTexts.ask(w), 16, TEXT, false);
        msg.setLineSpacing(0, 1.2f);
        msg.setPadding(dp(24), dp(10), dp(24), dp(6));
        AlertDialog.Builder b = one
                ? dialog(ScaleTexts.askOne(names[only])).setView(msg)
                        .setPositiveButton("Ja", (x, y) -> answerWhose(only))
                        .setNegativeButton("Nein", (x, y) -> answerWhose(Weighings.ASK))
                : dialog(ScaleTexts.askTitle(names[0], names[1])).setView(msg)
                        .setPositiveButton(names[0], (x, y) -> answerWhose(0))
                        .setNegativeButton(names[1], (x, y) -> answerWhose(1))
                        .setNeutralButton("Keiner", (x, y) -> answerWhose(Weighings.ASK));
        AlertDialog d = b.setCancelable(false).create();
        askDialog = d;
        show(d);
        if (one) return;
        Button second = d.getButton(DialogInterface.BUTTON_NEGATIVE);
        if (second != null) second.setTextColor(LAMBDA);   // both people alike; only "Keiner" stays quiet
        Button none = d.getButton(DialogInterface.BUTTON_NEUTRAL);
        if (none != null) {
            none.setTypeface(orbitron);
            none.setAllCaps(false);
            none.setTextColor(MUTED);
        }
    }

    private void answerWhose(int who) {
        Weighings.Weighing w = pendingWeigh;
        pendingWeigh = null;
        askDialog = null;
        if (w == null) return;
        if (who == Weighings.ASK) {
            rejectedWeigh = w;
            doneText = ScaleTexts.DISCARDED;
            refreshScale();
        } else {
            store(w, who);
        }
    }

    /** The person shown on the scale tab: her list, tiles and profile; Doc on every start. */
    private void showPerson(int who) {
        if (who == person) return;
        person = who;
        weighings = lists[who];
        profile = profiles[who];
        pressures = bpLists[who];
        if (bpAdapter != null) bpAdapter.notifyDataSetChanged();
        refreshBp();
        glucoses = gluLists[who];
        if (gluAdapter != null) gluAdapter.notifyDataSetChanged();
        refreshGlu();
        fasts = fastLists[who];
        refreshFast();
        if (tab == TAB_FAST) reloadFastPage();
        undoBar.setVisibility(View.GONE);   // an undo belongs to the list it came from
        ui.removeCallbacks(hideUndo);
        pickedWeighing = 0;                 // and so does a picked weigh-in: the other person starts at her newest
        paintPersons();
        if (scaleAdapter != null) scaleAdapter.notifyDataSetChanged();
        refreshScale();
        if (tab == TAB_HIST) refreshHist();
    }

    private void paintPersons() {
        // phi green (Doc, 21.11.2026: "probieren wir mal grün"): the shown person filled, the other outlined
        for (int i = 0; i < personChips.length; i++) if (personChips[i] != null) paintGreen(personChips[i], i == person);
        if (listTitle != null) listTitle.setText("MESSUNGEN · " + names[person].toUpperCase(java.util.Locale.GERMAN));
        // only those on are in the switch, and with one on there is none
        for (int i = 0; i < personChips.length; i++) {
            if (personChips[i] != null) personChips[i].setVisibility(on[i] ? View.VISIBLE : View.GONE);
        }
        if (personRow != null) personRow.setVisibility(Weighings.countOn(on) > 1 ? View.VISIBLE : View.GONE);
        for (int i = 0; i < bpPersonChips.length; i++) {
            if (bpPersonChips[i] == null) continue;
            paintGreen(bpPersonChips[i], i == person);
            bpPersonChips[i].setVisibility(on[i] ? View.VISIBLE : View.GONE);
        }
        if (bpPersonRow != null) bpPersonRow.setVisibility(Weighings.countOn(on) > 1 ? View.VISIBLE : View.GONE);
        if (bpTitle != null) bpTitle.setText("MESSUNGEN · " + names[person].toUpperCase(java.util.Locale.GERMAN));
        for (int i = 0; i < gluPersonChips.length; i++) {
            if (gluPersonChips[i] == null) continue;
            paintGreen(gluPersonChips[i], i == person);
            gluPersonChips[i].setVisibility(on[i] ? View.VISIBLE : View.GONE);
        }
        if (gluPersonRow != null) gluPersonRow.setVisibility(Weighings.countOn(on) > 1 ? View.VISIBLE : View.GONE);
        if (gluTitle != null) gluTitle.setText("MESSUNGEN · " + names[person].toUpperCase(java.util.Locale.GERMAN));
        for (int i = 0; i < histPersonChips.length; i++) {
            if (histPersonChips[i] == null) continue;
            paintGreen(histPersonChips[i], i == person);
            histPersonChips[i].setVisibility(on[i] ? View.VISIBLE : View.GONE);
        }
        if (histPersonRow != null) histPersonRow.setVisibility(Weighings.countOn(on) > 1 ? View.VISIBLE : View.GONE);
    }

    /** "Personen" in the settings: a person on or off; the last one on stays on. Her data is never touched. */
    private boolean togglePerson(int i) {
        if (on[i] && Weighings.countOn(on) == 1) return false;
        on[i] = !on[i];
        prefs.edit().putBoolean("profile" + SLOTS[i] + "On", on[i]).apply();
        if (!on[person]) {
            showPerson(Weighings.firstOn(on));
        } else {
            paintPersons();
        }
        return true;
    }

    /**
     * "Zu …" in a weigh-in's waist and hip dialog (the long press until 23.11.2026): move it to the other person (a wrong
     * guess by weight), with "Rückgängig".
     */
    private void moveWeighing(int pos) {
        if (pos < 0 || pos >= weighings.size()) return;
        int from = person, to = 1 - person;
        if (!on[to]) return;   // the other one is switched off: nowhere to move it
        Weighings.Weighing w = weighings.get(pos);
        TextView msg = text(ScaleTexts.moveQuestion(w, names[to]), 16, TEXT, false);
        msg.setLineSpacing(0, 1.2f);
        msg.setPadding(dp(24), dp(10), dp(24), dp(6));
        AlertDialog d = dialog("Verschieben").setView(msg)
                .setPositiveButton("Zu " + names[to], (x, y) -> {
                    if (pos >= lists[from].size() || lists[from].get(pos) != w) return;   // the list changed meanwhile
                    lists[from].remove(pos);
                    int at = lists[to].insertByTime(w);
                    scaleAdapter.notifyItemRemoved(pos);
                    offerUndo("Zu " + names[to] + " verschoben", () -> {
                        if (at < lists[to].size() && lists[to].get(at) == w) lists[to].remove(at);
                        lists[from].insert(pos, w);
                        if (person == from) scaleAdapter.notifyItemInserted(Math.min(pos, weighings.size() - 1));
                        else scaleAdapter.notifyDataSetChanged();
                        refreshScale();
                    });
                    refreshScale();
                })
                .setNegativeButton("Abbrechen", null)
                .create();
        show(d);
    }

    /** A result into a person's list (or completing her newest weigh-in), and the tab shows that person. */
    private void store(Weighings.Weighing w, int who) {
        showPerson(who);
        if (pickedWeighing != 0) {   // a result from the scale always shows the newest again, no row framed
            pickedWeighing = 0;
            scaleAdapter.notifyDataSetChanged();
        }
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
        doneText = ScaleTexts.doneFor(names[who], added, w);
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
            s = "";   // nothing happening: no line (Doc, 21.11.2026: "Stell dich auf die Waage" weg)
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
                    s = "";
                    color = TEXT;
            }
        }
        scaleState.setText(s);
        scaleState.setTextColor(color);
        scaleState.setVisibility(s.isEmpty() ? View.GONE : View.VISIBLE);
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
            // the newest - or the weigh-in tapped in the list (Doc, 23.11.2026: "wenn es nur klickt, würde ich gerne
            // oben die Werte sehen, die zu dem Eintrag gehören"); the pill above says from when
            Weighings.Weighing last = weighings.get(shownWeighing());
            BodyComposition bc = BodyComposition.of(last, profile);
            FitnessScore fit = FitnessScore.of(last, profile);
            resWeight.setText(Times.kg(last.kg()));
            resWeight.setTextColor(LAMBDA);
            resWhen.setText(ScaleTexts.when(last));
            Calendar when = Calendar.getInstance();
            when.setTimeInMillis(last.time);
            int age = profile.ageIn(when.get(Calendar.YEAR));
            if (bc.fatImplausible) tFat.implausible(Times.one(bc.fatPercent, "%"));
            else tFat.show(Times.one(bc.fatPercent, "%"), Ranges.fat(bc.fatPercent, profile.sex, age));
            tWater.show(Times.one(bc.waterPercent, "%"), Ranges.water(bc.waterPercent, profile.sex));
            tMuscle.show(Times.one(bc.muscleKg, "kg"), Ranges.muscle(bc.muscleKg, profile.heightCm, profile.sex));
            tBmi.show(Times.one(bc.bmi, ""), Double.isNaN(bc.bmi) ? null : Ranges.bmi(bc.bmi));
            showGirths(last);
            // a weight without a usable resistance says so plainly instead of four silent dashes
            showNote(ScaleTexts.note(last, profile), ScaleTexts.fatMissing(last, profile) ? LAMBDA : MUTED);
            showFitness(fit);
            compactWhen.setText(ScaleTexts.whenShort(last));
            compactWeight.setText(Times.kg(last.kg()));
            compactFat.setText(bc.fatImplausible ? "?" : Times.one(bc.fatPercent, "%"));
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
         * straight to the entry, the filled ones have "Ändern" in their sheet - always for the weigh-in on the card.
         */
        void tapped() {
            if (weighings.size() == 0) return;
            if (offering && TileInfo.typedIn(key)) editGirths(shownWeighing());
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
         * A body fat that cannot be right (BodyComposition.fatImplausible, Doc, 21.11.2026): the number in orange, no
         * bar, and the line says what to do.
         */
        void implausible(String text) {
            offering = false;
            value.setText(text);
            value.setTextColor(pal.scoreMid);
            bar.setScale(null);
            note.setText("unplausibel – bitte wiederholen");
            note.setTextColor(pal.scoreMid);
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

        AlertDialog d = dialog(person == 0 ? "Profil" : "Profil · " + names[person])
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
            profiles[person] = profile;
            profile.save(prefs, SLOTS[person]);
            d.dismiss();
            scaleAdapter.notifyDataSetChanged();
            refreshScale();
        });
    }

    /** The row of the weigh-in the scale card shows: the picked one, else the newest (0). */
    private int shownWeighing() {
        return weighings.shownIndex(pickedWeighing);
    }

    /**
     * A tap on a weigh-in in MESSUNGEN: the card shows its values (Doc, 23.11.2026: "wenn es nur klickt, würde ich
     * gerne oben die Werte sehen, die zu dem Eintrag gehören"); the picked one again, or the newest, brings the newest
     * back. A card pushed away comes down, so the values are in sight.
     */
    private void pickWeighing(int pos) {
        if (pos < 0 || pos >= weighings.size()) return;
        int before = shownWeighing();
        pickedWeighing = weighings.pickAfterTap(pickedWeighing, pos);
        int after = shownWeighing();
        scaleAdapter.notifyItemChanged(before);
        if (after != before) scaleAdapter.notifyItemChanged(after);
        refreshScale();
        scaleHead.setOpen(true, true);
    }

    /**
     * Waist and hip for one weigh-in (Doc, 20.11.2026: "Zum Eingeben brauchen wir noch irgendwo ein Feld für
     * Bauchumfang", "ja, bitte auch ein Feld für Hüftumfang"): cm with one decimal, either field may stay empty. Opened
     * by a long press on a row of MESSUNGEN (Doc, 23.11.2026: "Das müssen wir auf langes Klicken machen"), or on BAUCH /
     * HÜFTE for the weigh-in on the card. Stored with that weigh-in only. "Zu …" moves the weigh-in to the other person
     * (the long press did that before), if she is switched on.
     * A weigh-in without a hip gets this person's last hip in the field (Doc, 23.11.2026: "defaultmäßig beim Hüftumfang
     * ... einsetzen"), selected on focus so a new value simply types over it; emptied, the weigh-in keeps no hip.
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
        EditText hip = cmField(box, "HÜFTUMFANG IN CM", weighings.hipForField(w));
        if (!w.hasHip()) hip.setSelectAllOnFocus(true);
        box.addView(text("an der breitesten Stelle des Gesäßes", 12, MUTED, false));
        // and the same as a sketch (Doc, 20.11.2026: "mach bitte ein Bild drunter, so eine Art Skizze")
        GirthSketch sketch = new GirthSketch(this, orbitron, MUTED, LAMBDA, PHI, "Bauch", "Hüfte");
        LinearLayout.LayoutParams sp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(150));
        sp.topMargin = dp(10);
        box.addView(sketch, sp);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);
        AlertDialog.Builder db = dialog("Bauch und Hüfte")
                .setView(scroll)
                .setPositiveButton("Speichern", null)   // set below, so a wrong entry keeps the dialog open
                .setNegativeButton("Abbrechen", null);
        int other = 1 - person;
        if (on[other]) db.setNeutralButton("Zu " + names[other], (x, y) -> moveWeighing(weighings.indexOf(w.time)));
        AlertDialog d = db.create();
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

    /** A person chip in phi green: filled when on (shown, or switched on in the settings), else outlined. */
    private void paintGreen(TextView t, boolean on) {
        GradientDrawable g = round(on ? PHI : 0x00000000, 10);
        g.setStroke(Math.max(1, dp(1)), PHI);
        t.setBackground(g);
        t.setTextColor(on ? pal.onPhi : PHI);
    }

    /**
     * A choice among a few below the tabs - the colour schemes in the settings and the exercise on the stopwatch tab:
     * the chosen one phi green, the others a neutral grey outline (Doc, 21.11.2026: the tab row is orange, everything
     * below it green).
     */
    private void paintPick(TextView t, boolean on) {
        if (on) {
            paintGreen(t, true);
            return;
        }
        GradientDrawable g = round(0x00000000, 10);
        g.setStroke(Math.max(1, dp(1)), MUTED);
        t.setBackground(g);
        t.setTextColor(pal.iconIdle);
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

    /** One cell of the tab bar: an icon, centred, with its name for TalkBack. */
    private ImageView tabIcon(int drawable, String name, View.OnClickListener onTap) {
        ImageView t = new ImageView(this);
        t.setImageResource(drawable);
        t.setScaleType(ImageView.ScaleType.FIT_CENTER);
        t.setPadding(0, dp(7), 0, dp(7));   // a 22 dp icon in the 36 dp cell
        t.setContentDescription(name);
        t.setOnClickListener(onTap);
        return t;
    }

    /**
     * The shown tab: the icon on lambda orange, the chosen-chip colours of the scheme (Doc, 21.11.2026: not green like
     * Doc | …); the others a little brighter than muted (pal.iconIdle).
     */
    private void paintTab(ImageView t, boolean on) {
        t.setBackground(on ? round(pal.chipOn, 11) : null);
        t.setColorFilter(on ? pal.chipOnInk : pal.iconIdle);
        t.setSelected(on);
    }

    private void showTab(int which) {
        if (which == TAB_FAST && tab != TAB_FAST) backTab = tab;
        if (which != TAB_WATCH && pickedRun != 0) {
            pickedRun = 0;
            if (adapter != null) adapter.notifyDataSetChanged();
            paintKinds();
        }
        tab = which;
        prefs.edit().putInt("tab", which).apply();
        watchPage.setVisibility(which == TAB_WATCH ? View.VISIBLE : View.GONE);
        scalePage.setVisibility(which == TAB_SCALE ? View.VISIBLE : View.GONE);
        bpPage.setVisibility(which == TAB_BP ? View.VISIBLE : View.GONE);
        gluPage.setVisibility(which == TAB_GLU ? View.VISIBLE : View.GONE);
        histPage.setVisibility(which == TAB_HIST ? View.VISIBLE : View.GONE);
        if (which == TAB_HIST) refreshHist();
        fastPage.setVisibility(which == TAB_FAST ? View.VISIBLE : View.GONE);
        if (which == TAB_FAST) {
            openFasting();
            reloadFastPage();
        }
        allowTurn();
        paintTab(tabWatch, which == TAB_WATCH);   // in the fasting view none is lit
        paintTab(tabScale, which == TAB_SCALE);
        paintTab(tabBp, which == TAB_BP);
        paintTab(tabGlu, which == TAB_GLU);
        paintTab(tabHist, which == TAB_HIST);
        undoBar.setVisibility(View.GONE);   // an undo belongs to the list it came from
        ui.removeCallbacks(hideUndo);
        if (which == TAB_WATCH) listenIfAllowed();
        else if (listener != null) listener.stop();   // scale and fasting tab: voice control off
        updateScale();
        updateBp();
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

        // no title row any more (Doc, 21.11.2026: the header with "DocFit" and the gear took far too much room), and the
        // tabs are icons: stopwatch, scale, heart, drop and the gear - five cells of exactly the same width, TAB_HEIGHT high
        // ("das Zahnrad rechts sieht komisch aus"); the shown tab sits on lambda orange (paintTab)
        // while the shown person fasts: a slim banner on top, "Fasten · Tag 3 von 5 · 62 h" and "Beenden", and under it
        // the hint card when a value is low (refreshFast)
        fastBanner = new LinearLayout(this);
        fastBanner.setOrientation(LinearLayout.HORIZONTAL);
        fastBanner.setGravity(Gravity.CENTER_VERTICAL);
        fastBanner.setBackground(round(CARD, 12));
        fastBanner.setPadding(dp(12), dp(4), dp(4), dp(4));
        fastBannerText = text("", 13, TEXT, true);
        fastBannerText.setMaxLines(1);
        fastBannerText.setAutoSizeTextTypeUniformWithConfiguration(9, 13, 1, TypedValue.COMPLEX_UNIT_SP);
        fastBannerText.setOnClickListener(v -> showTab(TAB_FAST));
        fastBanner.addView(fastBannerText, new LinearLayout.LayoutParams(0, dp(32), 1f));
        fastBannerText.setGravity(Gravity.CENTER_VERTICAL);
        TextView endFast = text("Beenden", 13, pal.chipOnInk, true);
        endFast.setGravity(Gravity.CENTER);
        endFast.setPadding(dp(12), 0, dp(12), 0);
        endFast.setBackground(round(pal.chipOn, 9));
        endFast.setOnClickListener(v -> {
            if (fasts.active() != null) endFast(fasts.active());
        });
        fastBanner.addView(endFast, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dp(30)));
        fastBanner.setVisibility(View.GONE);
        LinearLayout.LayoutParams bl = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        bl.bottomMargin = dp(6);
        col.addView(fastBanner, bl);
        fastWarn = text("", 13, TEXT, false);
        fastWarn.setPadding(dp(12), dp(8), dp(12), dp(8));
        fastWarn.setLineSpacing(0, 1.15f);
        fastWarn.setVisibility(View.GONE);
        col.addView(fastWarn, bl);

        LinearLayout tabs = new LinearLayout(this);
        tabBar = tabs;
        tabs.setOrientation(LinearLayout.HORIZONTAL);
        tabs.setGravity(Gravity.CENTER_VERTICAL);
        tabs.setBackground(round(CARD, 14));
        tabs.setPadding(dp(3), dp(3), dp(3), dp(3));
        tabWatch = tabIcon(R.drawable.ic_tab_timer, "Stoppuhr", v -> showTab(TAB_WATCH));
        tabScale = tabIcon(R.drawable.ic_tab_scale, "Waage", v -> showTab(TAB_SCALE));
        tabBp = tabIcon(R.drawable.ic_tab_heart, "Blutdruck", v -> showTab(TAB_BP));
        tabGlu = tabIcon(R.drawable.ic_tab_drop, "Blutzucker", v -> showTab(TAB_GLU));
        tabHist = tabIcon(R.drawable.ic_tab_chart, "Verlauf", v -> showTab(TAB_HIST));
        ImageView gear = tabIcon(R.drawable.ic_tab_settings, "Einstellungen", v -> openSettings());
        paintTab(gear, false);   // the gear opens a dialog, it is never "the shown tab"
        for (ImageView t : new ImageView[]{tabWatch, tabScale, tabBp, tabGlu, tabHist, gear}) {
            tabs.addView(t, new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f));
        }
        col.addView(tabs, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        FrameLayout pages = new FrameLayout(this);
        watchPage = buildWatchPage();
        scalePage = buildScalePage();
        pages.addView(watchPage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        pages.addView(scalePage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        bpPage = buildBpPage();
        pages.addView(bpPage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        gluPage = buildGluPage();
        pages.addView(gluPage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        histPage = buildHistPage();
        pages.addView(histPage, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        fastPage = new FrameLayout(this);
        fastPage.setBackgroundColor(BG);
        LinearLayout fastCol = new LinearLayout(this);
        fastCol.setOrientation(LinearLayout.VERTICAL);
        fastHead = new LinearLayout(this);
        fastHead.setOrientation(LinearLayout.VERTICAL);
        fastHead.setPadding(0, dp(10), 0, dp(6));
        fastCol.addView(fastHead, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        fastWebBox = new FrameLayout(this);
        fastCol.addView(fastWebBox, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        fastPage.addView(fastCol, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
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
        // the page asks for the scheme and for the fasts recorded in DocFit (FastLive)
        fastWeb.addJavascriptInterface(new FastingBridge(pal.key, () -> liveFastsJson), "DocFitApp");
        fastWeb.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"file".equals(request.getUrl().getScheme());   // nothing outside the page
            }
        });
        fastWebBox.addView(fastWeb, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        liveFastsJson = buildLiveJson();
        fastWeb.loadUrl(FASTING_PAGE);
    }

    /** The exercise chip tapped: remembered, and the time stopped next is filed under it. */
    /**
     * An exercise chip: with a time selected in ZEITEN it moves that time to this exercise (Doc, 26.11.2026: "den Wert
     * selektieren und oben die Tasten drücken, bringt den in die andere Kategorie"), with "Rückgängig"; otherwise it
     * chooses the exercise of the next time.
     */
    private void chooseKind(String k) {
        int at = pickedRun == 0 ? -1 : entries.indexOf(pickedRun);
        if (at >= 0) {
            Entries.Entry old = entries.get(at);
            pickedRun = 0;
            if (!k.equals(old.kind)) {
                entries.replace(at, Entries.withKind(old, k));
                offerUndo(Times.day(old.start) + " → " + k, () -> {
                    int i = entries.indexOf(old.start);
                    if (i >= 0) {
                        entries.replace(i, old);
                        adapter.notifyItemChanged(i);
                    }
                });
            }
            adapter.notifyDataSetChanged();
            paintKinds();
            return;
        }
        pickedRun = 0;
        if (k.equals(kind)) return;
        kind = k;
        prefs.edit().putString("kind", k).apply();
        paintKinds();
    }

    /** A tap on a time in ZEITEN selects it (the chips then show and change its exercise); a second tap lets go. */
    private void pickRun(int pos) {
        if (pos < 0 || pos >= entries.size()) return;
        long start = entries.get(pos).start;
        pickedRun = pickedRun == start ? 0 : start;
        adapter.notifyDataSetChanged();
        paintKinds();
    }

    private void paintKinds() {
        int at = pickedRun == 0 ? -1 : entries.indexOf(pickedRun);
        if (at < 0) pickedRun = 0;
        // with a time selected the chips show ITS exercise; otherwise the one for the next time
        String shown = at >= 0 ? entries.get(at).kind : kind;
        for (int i = 0; i < kindChips.length; i++) {
            // the second row is green, the top row orange (Doc, 21.11.2026): the chosen exercise phi green, the other a
            // neutral grey outline - both alike, no colour of their own
            if (kindChips[i] != null) paintPick(kindChips[i], Entries.KINDS[i].equals(shown));
        }
        if (pickHint != null) {
            pickHint.setText(at >= 0 ? Times.day(entries.get(at).start) + " ausgewählt – oben die Übung tippen" : "");
            pickHint.setVisibility(at >= 0 ? View.VISIBLE : View.GONE);
        }
    }

    private View buildWatchPage() {
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);

        // the exercise the next time is for, under the tab bar and above the command (Doc, 20.11.2026)
        LinearLayout kinds = new LinearLayout(this);
        kinds.setOrientation(LinearLayout.HORIZONTAL);
        for (int i = 0; i < Entries.KINDS.length; i++) {
            String k = Entries.KINDS[i];
            TextView c = text(k, 15, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setMaxLines(1);
            c.setPadding(dp(8), 0, dp(8), 0);
            c.setAutoSizeTextTypeUniformWithConfiguration(10, 15, 1, TypedValue.COMPLEX_UNIT_SP);
            c.setOnClickListener(v -> chooseKind(k));
            kindChips[i] = c;
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(40), 1f);
            cp.leftMargin = i == 0 ? 0 : dp(5);
            cp.rightMargin = i == Entries.KINDS.length - 1 ? 0 : dp(5);
            kinds.addView(c, cp);
        }
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        page.addView(kinds, lp);
        pickHint = text("", 12, LAMBDA, false);
        pickHint.setGravity(Gravity.CENTER);
        pickHint.setVisibility(View.GONE);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        page.addView(pickHint, lp);
        paintKinds();

        state = text("DocFit Start", 26, pal.commandInk, true);
        state.setGravity(Gravity.CENTER);
        state.setLetterSpacing(0.12f);
        // more air between the parts (Doc, 20.11.2026: "in Y auseinanderziehen, damit es gefälliger aussieht")
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(24);
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
     * The blood pressure tab: the person switch, "+ Messung eintragen" (Doc, 21.11.2026), "Omron koppeln" while no
     * Omron is paired and the Omron's state line (Doc, 24.11.2026), then the list.
     */
    private View buildBpPage() {
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);

        // whose readings: the same person as on the scale tab (one switch state for both)
        LinearLayout persons = new LinearLayout(this);
        persons.setOrientation(LinearLayout.HORIZONTAL);
        bpPersonRow = persons;
        for (int i = 0; i < SLOTS.length; i++) {
            int who = i;
            TextView c = text(names[i], 14, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setMaxLines(1);
            c.setPadding(dp(8), 0, dp(8), 0);
            c.setOnClickListener(v -> showPerson(who));
            bpPersonChips[i] = c;
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f);
            cp.leftMargin = i == 0 ? 0 : dp(5);
            cp.rightMargin = i == SLOTS.length - 1 ? 0 : dp(5);
            persons.addView(c, cp);
        }
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(12);
        page.addView(persons, lp);

        // lambda orange like the shown tab, with the scheme's ink on it (Doc, 21.11.2026)
        Button add = button("+ Messung eintragen", pal.chipOn);
        add.setTextColor(pal.chipOnInk);
        add.setOnClickListener(v -> enterPressure());
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        lp.topMargin = dp(16);
        page.addView(add, lp);

        // the Omron M400 Intelli IT (Doc, 24.11.2026): paired once from here, then its readings come in by themselves
        bpPair = button("Omron koppeln", CARD);
        bpPair.setTextColor(LAMBDA);
        bpPair.setOnClickListener(v -> pairOmron());
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(48));
        lp.topMargin = dp(10);
        page.addView(bpPair, lp);
        bpState = text("", 13, MUTED, false);
        bpState.setGravity(Gravity.CENTER);
        bpState.setPadding(0, dp(4), 0, dp(4));
        bpState.setOnClickListener(v -> onBpStateTapped());
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(6);
        page.addView(bpState, lp);

        View head = sectionHead("MESSUNGEN", null, null);
        bpTitle = (TextView) ((ViewGroup) head).getChildAt(0);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        page.addView(head, lp);

        bpAdapter = new BpAdapter();
        bpList = listView(bpAdapter, this::deletePressure);
        bpEmpty = emptyText("Noch keine Messungen.");
        page.addView(listBox(bpList, bpEmpty), new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        paintPersons();
        refreshBp();
        refreshBpState();
        return page;
    }

    private void refreshBp() {
        if (bpEmpty != null) bpEmpty.setVisibility(pressures.size() == 0 ? View.VISIBLE : View.GONE);
        refreshFast();   // a low value during a fast shows the hint card at once
    }

    /** A reading gone (swipe or long press), with "Rückgängig". */
    private void deletePressure(int pos) {
        if (pos < 0 || pos >= pressures.size()) return;
        Pressures list = pressures;
        Pressures.Reading gone = list.remove(pos);
        bpAdapter.notifyItemRemoved(pos);
        offerUndo("Gelöscht: " + gone.sys + "/" + gone.dia, () -> {
            list.insert(pos, gone);
            if (list == pressures) bpAdapter.notifyItemInserted(Math.min(pos, pressures.size() - 1));
            refreshBp();
        });
        refreshBp();
    }

    // ---------- the Omron ----------

    /**
     * The 16-byte key DocFit stores in the Omron when pairing (BpLink): random, made once on this phone and kept only in
     * its settings - never in the code, never synced.
     */
    private byte[] omronKey() {
        byte[] k = Bpm.unhex(prefs.getString(OMRON_KEY, null));
        if (k != null && k.length == 16) return k;
        k = new byte[16];
        new java.security.SecureRandom().nextBytes(k);
        prefs.edit().putString(OMRON_KEY, Bpm.hex(k)).apply();
        return k;
    }

    private boolean omronClockDue() {
        if (prefs.getBoolean(OMRON_CLOCK_NEEDED, false)) return true;
        long set = prefs.getLong(OMRON_CLOCK, 0), now = System.currentTimeMillis();
        if (set == 0) return false;   // not known yet: the first reading with a time says the clock runs
        int offset = TimeZone.getDefault().getOffset(now);
        return prefs.getInt(OMRON_CLOCK_OFFSET, offset) != offset || now - set > OMRON_CLOCK_EVERY_MS;
    }

    /** The Omron's clock runs right as of now (set by DocFit, or a reading came with a time). */
    private void omronClockFine() {
        long now = System.currentTimeMillis();
        prefs.edit().putLong(OMRON_CLOCK, now).putInt(OMRON_CLOCK_OFFSET, TimeZone.getDefault().getOffset(now))
                .remove(OMRON_CLOCK_NEEDED).apply();
    }

    @Override
    public void onBpClockSet() {
        omronClockFine();
        bpClockNow = true;
        bp.setClockDue(false);
    }

    private boolean omronPaired() {
        return prefs.getString(OMRON_ADDRESS, null) != null;
    }

    /** The Omron is waited for only while the "Blutdruck" tab is open and DocFit is in front (like the scale). */
    private void updateBp() {
        if (bp == null) return;
        if (!resumed || tab != TAB_BP) {
            bp.stop();
        } else if (!hasBluetoothPermission()) {
            if (omronPaired() || pendingPair) askBluetooth(false);
        } else {
            bp.setClockDue(omronClockDue());
            bp.start();
            if (pendingPair) {
                pendingPair = false;
                bp.pair();
            }
        }
        refreshBpState();
    }

    /** "Omron koppeln": how to put the monitor into pairing mode, then the search. */
    private void pairOmron() {
        AlertDialog d = dialog("Omron koppeln")
                .setMessage("Schalte das Omron aus. Dann halte seine Bluetooth-Taste 3 bis 5 Sekunden gedrückt, bis "
                        + "„P“ blinkt, und tippe hier auf „Suchen“. Android fragt einmal, ob es koppeln darf – bitte "
                        + "bestätigen.\n\nBeim ersten Koppeln übernimmt DocFit nur Messungen ab heute; ältere im "
                        + "Gerät bleiben draußen.")
                .setPositiveButton("Suchen", (x, w) -> {
                    if (!hasBluetoothPermission()) {
                        pendingPair = true;
                        askBluetooth(true);
                        return;
                    }
                    bp.start();
                    bp.pair();
                })
                .setNegativeButton("Abbrechen", null)
                .create();
        show(d);
    }

    private void onBpStateTapped() {
        if (tab != TAB_BP) return;
        if (!hasBluetoothPermission()) {
            askBluetooth(true);
            return;
        }
        switch (bp.status()) {
            case BLUETOOTH_OFF:
                try {
                    startActivity(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE));
                } catch (SecurityException | ActivityNotFoundException e) {
                    // then Doc switches Bluetooth on in the quick settings; BpLink notices it
                }
                break;
            case PAIR_FAILED:
            case BOND_LOST:
                pairOmron();
                break;
            case PAIR_SEARCH:
            case PAIRING:
                break;
            default:
                if (omronPaired()) omronMenu();
        }
    }

    /** A tap on the state line of a paired Omron: what to do when nothing comes, pair again, or forget it. */
    private void omronMenu() {
        AlertDialog d = dialog("Omron M400 Intelli IT")
                .setMessage("Nach dem Messen kommen die Werte von selbst, solange dieser Reiter offen ist. Kommt "
                        + "nichts, drück kurz die Bluetooth-Taste am Omron.\n\n„Entkoppeln“ vergisst das Omron in "
                        + "DocFit; aus Android entfernst du es unter Einstellungen › Bluetooth.")
                .setPositiveButton("Neu koppeln", (x, w) -> pairOmron())
                .setNegativeButton("Entkoppeln", (x, w) -> {
                    prefs.edit().remove(OMRON_ADDRESS).apply();
                    bp.setPaired(null);
                    bpDoneText = null;
                    refreshBpState();
                })
                .create();
        show(d);
    }

    @Override
    public void onBpStatus(BpLink.Status status) {
        if (status == BpLink.Status.LOADING && bpLast != BpLink.Status.LOADING) {   // a transfer begins
            bpNew = 0;
            bpNewOther = 0;
            bpSkipped = 0;
            bpNoTime = 0;
        }
        bpLast = status;
        refreshBpState();
    }

    /** Paired: keep the address; the first pairing also fixes the first day whose readings count (Doc, 24.11.2026). */
    @Override
    public void onBpPaired(String address) {
        SharedPreferences.Editor e = prefs.edit().putString(OMRON_ADDRESS, address);
        if (!prefs.contains(OMRON_SINCE)) {
            e.putLong(OMRON_SINCE, Bpm.startOfDay(System.currentTimeMillis(), TimeZone.getDefault()));
        }
        e.apply();
        bpJustPaired = true;
        refreshBpState();
    }

    /**
     * A reading from the Omron: its time (moved by how far the monitor's clock was off), left out when it has no time
     * of its own, when it is from before the day of the first pairing (e.g. the seller's) or already there, else stored with the monitor's user 1
     * for Doc and user 2 for the second person, its warnings as the note.
     */
    @Override
    public void onBpReading(Bpm.Measurement m, long clockLag) {
        long now = System.currentTimeMillis();
        // no time of its own (the monitor's clock was never set) or one in the future: left out - otherwise the old
        // readings in the memory all arrive "now" (24.11.2026: 57 of them, the seller's among them, at 19:37)
        if (Bpm.timeIsArrival(m, clockLag, now)) {
            bpNoTime++;
            prefs.edit().putBoolean(OMRON_CLOCK_NEEDED, true).apply();   // its clock is off: set it next time
            bp.setClockDue(true);
            return;
        }
        if (prefs.getLong(OMRON_CLOCK, 0) == 0) omronClockFine();
        long t = Bpm.when(m, clockLag, now);
        if (t < prefs.getLong(OMRON_SINCE, 0)) {
            bpSkipped++;
            return;
        }
        int slot = Bpm.person(m.user);
        Pressures list = bpLists[slot];
        if (list.has(t, m.sys, m.dia)) return;
        int at = list.add(new Pressures.Reading(t, m.sys, m.dia, m.pulse, Pressures.OMRON, Bpm.note(m.status, false)));
        if (slot == 0) bpNew++;
        else bpNewOther++;
        if (list == pressures && bpAdapter != null) {
            bpAdapter.notifyItemInserted(at);
            bpList.scrollToPosition(at);
        }
        refreshBp();
    }

    /** The Omron let go: what the transfer brought, in one line. */
    @Override
    public void onBpTransferDone() {
        int n = bpNew + bpNewOther;
        String s = bpJustPaired ? "Omron gekoppelt ✓"
                : bpClockNow && n == 0 ? "Uhr des Omron gestellt ✓ – neue Werte kommen beim nächsten Mal"
                : n == 0 ? "Omron: nichts Neues" : n == 1 ? "1 neue Messung vom Omron ✓" : n + " neue Messungen vom Omron ✓";
        if (bpJustPaired && n > 0) s += " · " + n + " neu";
        if (bpNewOther > 0) s += " (" + bpNewOther + " für " + names[1] + ")";
        if (bpSkipped > 0) s += " · " + bpSkipped + " ältere übersprungen";
        if (bpNoTime > 0) s += " · " + bpNoTime + " ohne Uhrzeit übersprungen";
        bpDoneText = s;
        bpJustPaired = false;
        bpClockNow = false;
        refreshBpState();
    }

    private void refreshBpState() {
        if (bpState == null || bp == null) return;
        boolean paired = omronPaired();
        BpLink.Status st = bp.status();
        String s;
        int color;
        if (!hasBluetoothPermission()) {
            s = paired || pendingPair ? "Bluetooth nicht erlaubt – hier tippen" : "";
            color = UPSILON;
        } else if (!bp.isActive()) {
            s = "";
            color = MUTED;
        } else {
            switch (st) {
                case BLUETOOTH_OFF:
                    s = "Bluetooth ist aus – hier tippen zum Einschalten";
                    color = UPSILON;
                    break;
                case NO_PERMISSION:
                    s = "Bluetooth nicht erlaubt – hier tippen";
                    color = UPSILON;
                    break;
                case PAIR_SEARCH:
                    s = "Suche das Omron – „P“ muss blinken …";
                    color = LAMBDA;
                    break;
                case PAIRING:
                    s = "Omron gefunden – kopple … bitte am Smartphone bestätigen";
                    color = LAMBDA;
                    break;
                case PAIR_FAILED:
                    s = "Koppeln hat nicht geklappt – hier tippen für einen neuen Versuch";
                    color = UPSILON;
                    break;
                case BOND_LOST:
                    s = "Kopplung verloren – hier tippen und neu koppeln";
                    color = UPSILON;
                    break;
                case WAITING:
                    s = "Omron gekoppelt – nach dem Messen kommen die Werte von selbst";
                    color = MUTED;
                    break;
                case LOADING:
                    s = "Omron verbunden – lädt Messungen …";
                    color = LAMBDA;
                    break;
                case DONE:
                    s = bpDoneText != null ? bpDoneText : "Fertig ✓";
                    color = PHI;
                    break;
                default:
                    s = "";
                    color = MUTED;
            }
        }
        bpState.setText(s);
        bpState.setTextColor(color);
        bpState.setVisibility(s.isEmpty() ? View.GONE : View.VISIBLE);
        boolean busy = st == BpLink.Status.PAIR_SEARCH || st == BpLink.Status.PAIRING;
        bpPair.setVisibility(paired || busy && bp.isActive() ? View.GONE : View.VISIBLE);
    }

    /** The ESH category as a colour: optimal / normal green, high-normal orange, hypertension red. */
    private int bpColor(Pressures.Category c) {
        switch (c) {
            case OPTIMAL:
            case NORMAL:
                return PHI;
            case HIGH_NORMAL:
                return pal.scoreMid;
            default:
                return pal.alarm;
        }
    }

    /**
     * Typing a reading in (Doc, 21.11.2026): systolic, diastolic and pulse on the number pad, date and time (now,
     * tap to change), an optional note. "Speichern" checks the values (Pressures.check) and keeps the dialog open with
     * the reason when something is off.
     */
    private void enterPressure() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(24), dp(4), dp(24), 0);
        if (Weighings.countOn(on) > 1) box.addView(text("Für " + names[person] + ".", 14, MUTED, false));
        EditText sys = numberField(box, "SYSTOLISCH (mmHg)", "", 3);
        EditText dia = numberField(box, "DIASTOLISCH (mmHg)", "", 3);
        EditText pulse = numberField(box, "PULS (pro Minute)", "", 3);
        Calendar when = Calendar.getInstance();
        when.set(Calendar.SECOND, 0);
        when.set(Calendar.MILLISECOND, 0);
        TextView whenLabel = smallLabel("DATUM / UHRZEIT");
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        box.addView(whenLabel, lp);
        TextView whenText = text("", 16, LAMBDA, true);
        whenText.setPadding(0, dp(10), 0, dp(10));
        Runnable showWhen = () -> whenText.setText(Times.day(when.getTimeInMillis()) + " · "
                + Times.clock(when.getTimeInMillis()) + " Uhr");
        showWhen.run();
        int style = pal.light ? android.R.style.Theme_DeviceDefault_Light_Dialog
                : android.R.style.Theme_DeviceDefault_Dialog;
        whenText.setOnClickListener(v -> new DatePickerDialog(this, style, (picker, y, m, day) -> {
            when.set(y, m, day);
            showWhen.run();
            new TimePickerDialog(this, style, (clock, h, min) -> {
                when.set(Calendar.HOUR_OF_DAY, h);
                when.set(Calendar.MINUTE, min);
                showWhen.run();
            }, when.get(Calendar.HOUR_OF_DAY), when.get(Calendar.MINUTE), true).show();
        }, when.get(Calendar.YEAR), when.get(Calendar.MONTH), when.get(Calendar.DAY_OF_MONTH)).show());
        box.addView(whenText);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        box.addView(smallLabel("NOTIZ (OPTIONAL)"), lp);
        EditText note = new EditText(this);
        note.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        note.setFilters(new InputFilter[]{new InputFilter.LengthFilter(Pressures.NOTE_MAX)});
        note.setTextColor(TEXT);
        note.setSingleLine(true);
        box.addView(note, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        TextView error = text("", 14, pal.alarm, false);
        error.setVisibility(View.GONE);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(10);
        box.addView(error, lp);
        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);

        AlertDialog d = dialog("Blutdruck eintragen").setView(scroll)
                .setPositiveButton("Speichern", null)   // set below, so a wrong entry keeps the dialog open
                .setNegativeButton("Abbrechen", null)
                .create();
        show(d);
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            int s1 = number(sys), d1 = number(dia), p1 = number(pulse);
            String why = Pressures.check(s1, d1, p1);
            if (why != null) {
                error.setText(why);
                error.setVisibility(View.VISIBLE);
                return;
            }
            int at = pressures.add(new Pressures.Reading(when.getTimeInMillis(), s1, d1, p1, Pressures.HAND,
                    note.getText().toString()));
            bpAdapter.notifyItemInserted(at);
            bpList.scrollToPosition(at);
            refreshBp();
            d.dismiss();
        });
    }

    /** A person switch for a tab of its own (blood glucose): the people in phi green, the shown one filled. */
    private LinearLayout personSwitch(TextView[] chips) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        for (int i = 0; i < SLOTS.length; i++) {
            int who = i;
            TextView c = text(names[i], 14, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setMaxLines(1);
            c.setPadding(dp(8), 0, dp(8), 0);
            c.setOnClickListener(v -> showPerson(who));
            chips[i] = c;
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f);
            cp.leftMargin = i == 0 ? 0 : dp(5);
            cp.rightMargin = i == SLOTS.length - 1 ? 0 : dp(5);
            row.addView(c, cp);
        }
        return row;
    }

    // ---------- the "Verlauf" tab ----------

    /**
     * The "Verlauf" tab (Doc, 26.11.2026: "ein Tab mit den Verlaufsdaten ... für die laufenden Werte"; the fasting view
     * stays where it is): the person switch, the stretch of time (4 Wochen / 3 Monate / 1 Jahr / Alles) and a card per
     * value with its newest value and its course - Gewicht, Körperfett, Bauch (with the zones and goal lines of the
     * detail sheets), Blutdruck (systolic and diastolic in one chart), Puls, Blutzucker nüchtern and, for Doc, the
     * stopwatch times per exercise (Trends, HistoryChart).
     */
    private View buildHistPage() {
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        histRange = Math.max(0, Math.min(prefs.getInt("histRange", 1), Trends.RANGE_WORDS.length - 1));

        LinearLayout persons = personSwitch(histPersonChips);
        histPersonRow = persons;
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(12);
        page.addView(persons, lp);

        LinearLayout ranges = new LinearLayout(this);
        ranges.setOrientation(LinearLayout.HORIZONTAL);
        for (int i = 0; i < Trends.RANGE_WORDS.length; i++) {
            int r = i;
            // one size for all four, one line, centred in the height of the person chips; each chip as wide as its word
            // needs (Doc, 26.11.2026: "schön machen" - squeezed into equal quarters "4 Wochen" / "3 Monate" shrank,
            // then broke into two lines at his font size 1.3)
            TextView c = text(Trends.RANGE_WORDS[i], 13, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setSingleLine(true);
            c.setIncludeFontPadding(false);
            c.setPadding(dp(4), 0, dp(4), 0);
            float need = c.getPaint().measureText(Trends.RANGE_WORDS[i]) + dp(18);
            c.setOnClickListener(v -> {
                histRange = r;
                prefs.edit().putInt("histRange", r).apply();
                refreshHist();
            });
            histRangeChips[i] = c;
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), need);
            cp.leftMargin = i == 0 ? 0 : dp(5);
            cp.rightMargin = i == Trends.RANGE_WORDS.length - 1 ? 0 : dp(5);
            ranges.addView(c, cp);
        }
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(12);
        page.addView(ranges, lp);

        ScrollView scroll = new ScrollView(this);
        histCards = new LinearLayout(this);
        histCards.setOrientation(LinearLayout.VERTICAL);
        histCards.setPadding(0, 0, 0, dp(64));
        scroll.addView(histCards, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f);
        lp.topMargin = dp(4);
        page.addView(scroll, lp);
        paintPersons();
        return page;
    }

    /** The cards of the "Verlauf" tab, built anew for the shown person and the chosen stretch of time. */
    private void refreshHist() {
        if (histCards == null) return;
        for (int i = 0; i < histRangeChips.length; i++) if (histRangeChips[i] != null) paintPick(histRangeChips[i], i == histRange);
        histCards.removeAllViews();
        long from = Trends.from(histRange, System.currentTimeMillis());

        List<Weighings.Weighing> all = new ArrayList<>();
        for (int i = 0; i < weighings.size(); i++) all.add(weighings.get(i));
        Weighings.Weighing newest = all.isEmpty() ? null : all.get(0);
        for (TileInfo.Key k : new TileInfo.Key[]{TileInfo.Key.WEIGHT, TileInfo.Key.FAT, TileInfo.Key.WAIST}) {
            List<History.Point> pts = Trends.since(History.series(all, k, profile), from);
            int dec = History.decimals(k);
            String unit = History.unit(k);
            histCard(TileInfo.of(k).title, pts, null, newest == null ? null : History.scale(newest, k, profile),
                    History.goals(k, profile), dec, Trends.latest(pts, dec, unit));
        }

        List<Pressures.Reading> bp = new ArrayList<>();
        for (int i = 0; i < pressures.size(); i++) bp.add(pressures.get(i));
        List<History.Point> sys = Trends.since(Trends.pressure(bp, Trends.SYS), from);
        List<History.Point> dia = Trends.since(Trends.pressure(bp, Trends.DIA), from);
        String bpNow = sys.isEmpty() ? "–" : Math.round(sys.get(sys.size() - 1).value) + "/"
                + Math.round(dia.get(dia.size() - 1).value) + " mmHg";
        histCard("Blutdruck", sys, dia, null, new ArrayList<>(), 0, bpNow);
        List<History.Point> pulse = Trends.since(Trends.pressure(bp, Trends.PULSE), from);
        histCard("Puls", pulse, null, null, new ArrayList<>(), 0, Trends.latest(pulse, 0, "/min"));

        List<Glucoses.Reading> glu = new ArrayList<>();
        for (int i = 0; i < glucoses.size(); i++) glu.add(glucoses.get(i));
        List<History.Point> fasting = Trends.since(Trends.fastingGlucose(glu), from);
        histCard("Blutzucker nüchtern", fasting, null, null, new ArrayList<>(), 0, Trends.latest(fasting, 0, "mg/dL"));

        if (person == 0) {   // the stopwatch is Doc's
            List<Entries.Entry> runs = new ArrayList<>();
            for (int i = 0; i < entries.size(); i++) runs.add(entries.get(i));
            for (String k : Entries.KINDS) {
                List<History.Point> pts = Trends.since(Trends.runs(runs, k), from);
                histCard(k + " · Sekunden", pts, null, null, new ArrayList<>(), 0,
                        pts.isEmpty() ? "–" : Trends.clock(pts.get(pts.size() - 1).value));
            }
        }
    }

    /** One card: title and newest value on top, then the course (or a line that there is none in this stretch). */
    private void histCard(String title, List<History.Point> pts, List<History.Point> second, Ranges.Scale scale,
                          List<History.Goal> goals, int decimals, String now) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackground(round(CARD, 12));
        card.setPadding(dp(12), dp(10), dp(12), dp(10));
        LinearLayout head = new LinearLayout(this);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        TextView t = text(title.toUpperCase(java.util.Locale.GERMAN), 12, MUTED, true);
        t.setMaxLines(1);
        t.setEllipsize(TextUtils.TruncateAt.END);   // never under the value
        head.addView(t, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        TextView v = text(now, 15, TEXT, true);
        v.setPadding(dp(8), 0, 0, 0);
        head.addView(v);
        card.addView(head);
        if (pts.isEmpty()) {
            TextView none = text("Keine Werte in diesem Zeitraum.", 13, MUTED, false);
            none.setPadding(0, dp(6), 0, dp(2));
            card.addView(none);
        } else {
            HistoryChart chart = new HistoryChart(this, orbitron, LAMBDA, TEXT, MUTED, CARD,
                    pal.scoreHigh, pal.scoreMid, pal.scoreLow);
            chart.setData(pts, scale, goals, decimals);
            if (second != null) chart.setSecond(second, PHI);
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(150));
            cp.topMargin = dp(6);
            card.addView(chart, cp);
            if (second != null) {   // which line is which: under the chart, in the lines' colours
                SpannableString key = new SpannableString("●  Sys      ●  Dia");
                key.setSpan(new ForegroundColorSpan(LAMBDA), 0, 1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                int dia = key.toString().lastIndexOf('●');
                key.setSpan(new ForegroundColorSpan(PHI), dia, dia + 1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                TextView legend = text("", 12, MUTED, false);
                legend.setText(key);
                legend.setGravity(Gravity.CENTER);
                legend.setPadding(0, dp(4), 0, 0);
                card.addView(legend);
            }
        }
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(10);
        histCards.addView(card, lp);
    }

    /** The blood glucose tab: the person switch, "+ Messung eintragen" and the list. */
    private View buildGluPage() {
        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        LinearLayout persons = personSwitch(gluPersonChips);
        gluPersonRow = persons;
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(12);
        page.addView(persons, lp);

        // lambda orange like the shown tab, with the scheme's ink on it (Doc, 21.11.2026)
        Button add = button("+ Messung eintragen", pal.chipOn);
        add.setTextColor(pal.chipOnInk);
        add.setOnClickListener(v -> enterGlucose());
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        lp.topMargin = dp(16);
        page.addView(add, lp);

        View head = sectionHead("MESSUNGEN", null, null);
        gluTitle = (TextView) ((ViewGroup) head).getChildAt(0);
        lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(16);
        page.addView(head, lp);

        gluAdapter = new GluAdapter();
        gluList = listView(gluAdapter, this::deleteGlucose);
        gluEmpty = emptyText("Noch keine Messungen.");
        page.addView(listBox(gluList, gluEmpty), new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        paintPersons();
        refreshGlu();
        return page;
    }

    private void refreshGlu() {
        if (gluEmpty != null) gluEmpty.setVisibility(glucoses.size() == 0 ? View.VISIBLE : View.GONE);
        refreshFast();
    }

    /** A reading gone (swipe or long press), with "Rückgängig". */
    private void deleteGlucose(int pos) {
        if (pos < 0 || pos >= glucoses.size()) return;
        Glucoses list = glucoses;
        Glucoses.Reading gone = list.remove(pos);
        gluAdapter.notifyItemRemoved(pos);
        offerUndo("Gelöscht: " + gone.mgdl + " mg/dL", () -> {
            list.insert(pos, gone);
            if (list == glucoses) gluAdapter.notifyItemInserted(Math.min(pos, glucoses.size() - 1));
            refreshGlu();
        });
        refreshGlu();
    }

    /** Fasting / after a meal: normal green, raised orange, high red; the other contexts plain. */
    private int gluColor(Glucoses.Category c) {
        switch (c) {
            case NORMAL:
                return PHI;
            case RAISED:
                return pal.scoreMid;
            case HIGH:
                return pal.alarm;
            default:
                return TEXT;
        }
    }

    /**
     * Typing a reading in (Doc, 21.11.2026): one number on the decimal pad - its unit found by itself (below 35 mmol/L,
     * else mg/dL) and shown in both right away, a chip to override -, when it was measured, date and time (now, tap to
     * change), a note. "Speichern" checks the value (Glucoses.check) and keeps the dialog open with the reason.
     */
    private void enterGlucose() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(24), dp(4), dp(24), 0);
        if (Weighings.countOn(on) > 1) box.addView(text("Für " + names[person] + ".", 14, MUTED, false));
        box.addView(smallLabel("WERT"), topParams(16));
        EditText value = new EditText(this);
        value.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        value.setKeyListener(android.text.method.DigitsKeyListener.getInstance("0123456789.,"));
        value.setTypeface(orbitron);
        value.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        value.setTextColor(TEXT);
        value.setHint("z. B. 5,6 oder 101");
        value.setSingleLine(true);
        box.addView(value, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        // the unit: found from the number, a tap fixes it
        String[] unit = {Glucoses.MMOL};
        boolean[] fixed = {false};
        LinearLayout units = new LinearLayout(this);
        units.setOrientation(LinearLayout.HORIZONTAL);
        TextView mmol = text("mmol/L", 14, TEXT, true), mgdl = text("mg/dL", 14, TEXT, true);
        TextView both = text("", 13, MUTED, false);
        Runnable paintUnit = () -> {
            paintPick(mmol, Glucoses.MMOL.equals(unit[0]));
            paintPick(mgdl, Glucoses.MGDL.equals(unit[0]));
            double v = Glucoses.parse(value.getText());
            both.setText(Double.isNaN(v) || Glucoses.check(v, unit[0]) != null ? ""
                    : "= " + Glucoses.both(Glucoses.toMgdl(v, unit[0])));
        };
        for (TextView c : new TextView[]{mmol, mgdl}) {
            c.setGravity(Gravity.CENTER);
            c.setOnClickListener(v -> {
                unit[0] = c == mmol ? Glucoses.MMOL : Glucoses.MGDL;
                fixed[0] = true;
                paintUnit.run();
            });
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f);
            cp.setMargins(c == mmol ? 0 : dp(5), 0, c == mmol ? dp(5) : 0, 0);
            units.addView(c, cp);
        }
        value.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence t, int a, int b, int c) {
            }

            @Override
            public void onTextChanged(CharSequence t, int a, int b, int c) {
            }

            @Override
            public void afterTextChanged(android.text.Editable e) {
                double v = Glucoses.parse(e);
                if (!fixed[0] && !Double.isNaN(v)) unit[0] = Glucoses.detectUnit(v);
                paintUnit.run();
            }
        });
        paintUnit.run();
        box.addView(units, topParams(8));
        box.addView(both, topParams(6));

        // when it was measured: four chips, two by two (the labels are long); "nüchtern" first (Doc, 21.11.2026: the
        // default is always "nüchtern", no guess by the time of day)
        box.addView(smallLabel("WANN GEMESSEN"), topParams(16));
        Calendar when = Calendar.getInstance();
        when.set(Calendar.SECOND, 0);
        when.set(Calendar.MILLISECOND, 0);
        int[] context = {0};
        TextView[] ctx = new TextView[Glucoses.CONTEXTS.length];
        Runnable paintCtx = () -> {
            for (int i = 0; i < ctx.length; i++) paintPick(ctx[i], i == context[0]);
        };
        // two rows of two, each row as high as its chips (the gap between the rows is the row's margin, never a chip's -
        // "nach dem Essen (2 h)" was cut at the bottom, Doc, 21.11.2026)
        LinearLayout grid = new LinearLayout(this);
        grid.setOrientation(LinearLayout.VERTICAL);
        for (int r = 0; r < 2; r++) {
            LinearLayout row = new LinearLayout(this);
            row.setOrientation(LinearLayout.HORIZONTAL);
            for (int k = 0; k < 2; k++) {
                int i = r * 2 + k;
                TextView c = text(Glucoses.CONTEXT_WORDS[i], 13, TEXT, true);
                c.setGravity(Gravity.CENTER);
                c.setMaxLines(1);
                c.setIncludeFontPadding(false);
                c.setPadding(dp(6), 0, dp(6), 0);
                c.setAutoSizeTextTypeUniformWithConfiguration(9, 13, 1, TypedValue.COMPLEX_UNIT_SP);
                c.setOnClickListener(v -> {
                    context[0] = i;
                    paintCtx.run();
                });
                ctx[i] = c;
                LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1f);
                cp.setMargins(k == 0 ? 0 : dp(5), 0, k == 0 ? dp(5) : 0, 0);
                row.addView(c, cp);
            }
            LinearLayout.LayoutParams rp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(40));
            rp.topMargin = r == 0 ? 0 : dp(8);
            grid.addView(row, rp);
        }
        paintCtx.run();
        box.addView(grid, topParams(8));

        box.addView(smallLabel("DATUM / UHRZEIT"), topParams(16));
        TextView whenText = text("", 16, LAMBDA, true);
        whenText.setPadding(0, dp(10), 0, dp(10));
        Runnable showWhen = () -> whenText.setText(Times.day(when.getTimeInMillis()) + " · "
                + Times.clock(when.getTimeInMillis()) + " Uhr");
        showWhen.run();
        int style = pal.light ? android.R.style.Theme_DeviceDefault_Light_Dialog
                : android.R.style.Theme_DeviceDefault_Dialog;
        whenText.setOnClickListener(v -> new DatePickerDialog(this, style, (picker, y, m, day) -> {
            when.set(y, m, day);
            showWhen.run();
            new TimePickerDialog(this, style, (clock, h, min) -> {
                when.set(Calendar.HOUR_OF_DAY, h);
                when.set(Calendar.MINUTE, min);
                showWhen.run();
            }, when.get(Calendar.HOUR_OF_DAY), when.get(Calendar.MINUTE), true).show();
        }, when.get(Calendar.YEAR), when.get(Calendar.MONTH), when.get(Calendar.DAY_OF_MONTH)).show());
        box.addView(whenText);
        box.addView(smallLabel("NOTIZ (OPTIONAL)"), topParams(8));
        EditText note = new EditText(this);
        note.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        note.setFilters(new InputFilter[]{new InputFilter.LengthFilter(Glucoses.NOTE_MAX)});
        note.setTextColor(TEXT);
        note.setSingleLine(true);
        box.addView(note, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        TextView error = text("", 14, pal.alarm, false);
        error.setVisibility(View.GONE);
        box.addView(error, topParams(10));
        // room under the last field, so nothing ends right at the buttons; the sheet scrolls, and with the keyboard
        // open it shrinks instead of sliding under it (adjustResize) - everything stays reachable
        box.setPadding(box.getPaddingLeft(), box.getPaddingTop(), box.getPaddingRight(), dp(20));
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.addView(box);

        AlertDialog d = dialog("Blutzucker eintragen").setView(scroll)
                .setPositiveButton("Speichern", null)   // set below, so a wrong entry keeps the dialog open
                .setNegativeButton("Abbrechen", null)
                .create();
        if (d.getWindow() != null) d.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        show(d);
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            double typed = Glucoses.parse(value.getText());
            String why = Glucoses.check(typed, unit[0]);
            if (why != null) {
                error.setText(why);
                error.setVisibility(View.VISIBLE);
                return;
            }
            int at = glucoses.add(new Glucoses.Reading(when.getTimeInMillis(), Glucoses.toMgdl(typed, unit[0]),
                    Glucoses.CONTEXTS[context[0]], Glucoses.HAND, note.getText().toString()));
            gluAdapter.notifyItemInserted(at);
            gluList.scrollToPosition(at);
            refreshGlu();
            d.dismiss();
        });
    }

    private LinearLayout.LayoutParams topParams(int topDp) {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(topDp);
        return lp;
    }

    // ---------- the fasting mode ----------

    /** Whether the fasting view stands on its side (only the charts, nothing else on screen). */
    private boolean fastingFull() {
        return tab == TAB_FAST && getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
    }

    /** The banner, the hint card and the head of the fasting view for the shown person's fasts. */
    private void refreshFast() {
        if (fastBanner == null || fasts == null) return;
        Fasts.Fast f = fasts.active();
        long now = System.currentTimeMillis();
        boolean show = f != null && !fastingFull();
        fastBanner.setVisibility(show ? View.VISIBLE : View.GONE);
        if (f != null) fastBannerText.setText(Fasts.banner(f, now, java.util.TimeZone.getDefault()));
        // the newest systolic value and glucose inside the running fast
        int sys = 0, glu = 0;
        if (f != null) {
            for (int i = 0; i < pressures.size(); i++) {
                if (f.contains(pressures.get(i).time)) {
                    sys = pressures.get(i).sys;
                    break;
                }
            }
            for (int i = 0; i < glucoses.size(); i++) {
                if (f.contains(glucoses.get(i).time)) {
                    glu = glucoses.get(i).mgdl;
                    break;
                }
            }
        }
        Fasts.Level level = f == null ? Fasts.Level.NONE : Fasts.safety(sys, glu);
        if (level == Fasts.Level.NONE || !show) {
            fastWarn.setVisibility(View.GONE);
        } else {
            boolean red = level == Fasts.Level.RED;
            int c = red ? pal.alarm : pal.scoreMid;
            String title = red ? "Vorsicht – Werte sehr niedrig. Fasten unterbrechen und ärztlich abklären."
                    : "Werte niedrig – achte auf Schwindel oder Schwäche; bei Beschwerden Fasten unterbrechen.";
            String values = (sys > 0 ? "SYS " + sys : "") + (sys > 0 && glu > 0 ? " · " : "")
                    + (glu > 0 ? "Zucker " + Glucoses.both(glu) : "");
            SpannableString sp = new SpannableString(title + "\n" + values + " – ein Hinweis, keine Diagnose.");
            sp.setSpan(new ForegroundColorSpan(c), 0, title.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            sp.setSpan(new ForegroundColorSpan(MUTED), title.length(), sp.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            fastWarn.setText(sp);
            GradientDrawable g = round(CARD, 12);
            g.setStroke(Math.max(2, dp(2)), c);
            fastWarn.setBackground(g);
            fastWarn.setVisibility(View.VISIBLE);
        }
        refreshFastHead(f);
    }

    /** The head of the fasting view: start, or the running fast with "Bearbeiten" and "Fasten beenden". */
    private void refreshFastHead(Fasts.Fast active) {
        if (fastHead == null) return;
        fastHead.removeAllViews();
        if (active != null) {
            fastHead.addView(text("Läuft seit " + Times.day(active.start) + ", " + Times.clock(active.start) + " Uhr"
                    + (active.plannedDays > 0 ? " · geplant " + active.plannedDays + " Tage" : ""), 13, TEXT, false));
            LinearLayout row = new LinearLayout(this);
            row.setOrientation(LinearLayout.HORIZONTAL);
            TextView edit = text("Bearbeiten", 14, TEXT, true);
            edit.setGravity(Gravity.CENTER);
            paintGreen(edit, false);
            edit.setOnClickListener(v -> editFast(active));
            Button end = button("Fasten beenden", pal.chipOn);
            end.setTextColor(pal.chipOnInk);
            end.setOnClickListener(v -> endFast(active));
            LinearLayout.LayoutParams a = new LinearLayout.LayoutParams(0, dp(44), 1f);
            a.rightMargin = dp(5);
            row.addView(edit, a);
            LinearLayout.LayoutParams b = new LinearLayout.LayoutParams(0, dp(44), 1f);
            b.leftMargin = dp(5);
            row.addView(end, b);
            fastHead.addView(row, topParams(8));
            return;
        }
        Button start = button("Fasten starten", pal.chipOn);
        start.setTextColor(pal.chipOnInk);
        start.setOnClickListener(v -> startFast());
        fastHead.addView(start, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(48)));
        Fasts.Fast last = fasts.newest();
        if (last != null) {
            TextView t = text("Zuletzt: " + Times.day(last.start) + " bis " + Times.day(last.end) + " · bearbeiten",
                    13, PHI, false);
            t.setPadding(0, dp(8), 0, 0);
            t.setOnClickListener(v -> editFast(last));
            fastHead.addView(t);
        }
    }

    /** The page's live data again, and the page reloaded only when it changed. */
    private void reloadFastPage() {
        String j = buildLiveJson();
        if (j.equals(liveFastsJson)) return;
        liveFastsJson = j;
        if (fastWeb != null) fastWeb.reload();
    }

    private String buildLiveJson() {
        try {
            List<Weighings.Weighing> w = new ArrayList<>();
            for (int i = 0; i < weighings.size(); i++) w.add(weighings.get(i));
            List<Pressures.Reading> b = new ArrayList<>();
            for (int i = 0; i < pressures.size(); i++) b.add(pressures.get(i));
            List<Glucoses.Reading> g = new ArrayList<>();
            for (int i = 0; i < glucoses.size(); i++) g.add(glucoses.get(i));
            return FastLive.build(fasts.all(), w, profile, b, g, System.currentTimeMillis(),
                    java.util.TimeZone.getDefault()).toString();
        } catch (org.json.JSONException e) {
            return "{\"fasts\":[],\"days\":{}}";
        }
    }

    /** After a change of a fast: banner, head, page, reminder. */
    private void fastsChanged() {
        refreshFast();
        reloadFastPage();
        FastReminder.schedule(this);
    }

    /** Date and time chosen in Android's pickers, then {@code after}. */
    private void pickDateTime(Calendar when, Runnable after) {
        int style = pal.light ? android.R.style.Theme_DeviceDefault_Light_Dialog
                : android.R.style.Theme_DeviceDefault_Dialog;
        new DatePickerDialog(this, style, (picker, y, m, day) -> {
            when.set(y, m, day);
            after.run();
            new TimePickerDialog(this, style, (clock, h, min) -> {
                when.set(Calendar.HOUR_OF_DAY, h);
                when.set(Calendar.MINUTE, min);
                after.run();
            }, when.get(Calendar.HOUR_OF_DAY), when.get(Calendar.MINUTE), true).show();
        }, when.get(Calendar.YEAR), when.get(Calendar.MONTH), when.get(Calendar.DAY_OF_MONTH)).show();
    }

    private TextView whenField(LinearLayout box, String label, Calendar when) {
        box.addView(smallLabel(label), topParams(16));
        TextView t = text("", 16, LAMBDA, true);
        t.setPadding(0, dp(10), 0, dp(10));
        Runnable show = () -> t.setText(Times.day(when.getTimeInMillis()) + " · " + Times.clock(when.getTimeInMillis())
                + " Uhr");
        show.run();
        t.setOnClickListener(v -> pickDateTime(when, show));
        box.addView(t);
        return t;
    }

    private static Calendar nowMinute() {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c;
    }

    /** The planned length: 5 days, 7 days or own (a number field), green when chosen. Returns the getter. */
    private java.util.function.IntSupplier plannedField(LinearLayout box, int current) {
        box.addView(smallLabel("GEPLANT"), topParams(16));
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        String[] words = {"5 Tage", "7 Tage", "eigene"};
        TextView[] chips = new TextView[3];
        int[] chosen = {current == 5 ? 0 : current == 7 ? 1 : current > 0 ? 2 : 0};
        EditText own = new EditText(this);
        own.setInputType(InputType.TYPE_CLASS_NUMBER);
        own.setFilters(new InputFilter[]{new InputFilter.LengthFilter(2)});
        own.setTextColor(TEXT);
        own.setHint("Tage");
        own.setText(chosen[0] == 2 ? String.valueOf(current) : "");
        Runnable paint = () -> {
            for (int i = 0; i < 3; i++) paintPick(chips[i], i == chosen[0]);
            own.setVisibility(chosen[0] == 2 ? View.VISIBLE : View.GONE);
        };
        for (int i = 0; i < 3; i++) {
            int k = i;
            TextView c = text(words[i], 14, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setOnClickListener(v -> {
                chosen[0] = k;
                paint.run();
            });
            chips[i] = c;
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f);
            cp.setMargins(i == 0 ? 0 : dp(4), 0, i == 2 ? 0 : dp(4), 0);
            row.addView(c, cp);
        }
        paint.run();
        box.addView(row, topParams(8));
        box.addView(own, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return () -> chosen[0] == 0 ? 5 : chosen[0] == 1 ? 7 : number(own);
    }

    private EditText noteField(LinearLayout box, String value) {
        box.addView(smallLabel("NOTIZ (OPTIONAL)"), topParams(16));
        EditText note = new EditText(this);
        note.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);
        note.setFilters(new InputFilter[]{new InputFilter.LengthFilter(Fasts.NOTE_MAX)});
        note.setTextColor(TEXT);
        note.setSingleLine(true);
        note.setText(value);
        box.addView(note, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return note;
    }

    private LinearLayout formBox() {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(24), dp(4), dp(24), dp(20));
        if (Weighings.countOn(on) > 1) box.addView(text("Für " + names[person] + ".", 14, MUTED, false));
        return box;
    }

    private AlertDialog formDialog(String title, LinearLayout box, String ok) {
        ScrollView scroll = new ScrollView(this);
        scroll.addView(box);
        AlertDialog d = dialog(title).setView(scroll).setPositiveButton(ok, null).setNegativeButton("Abbrechen", null)
                .create();
        if (d.getWindow() != null) d.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        return d;
    }

    private TextView errorLine(LinearLayout box) {
        TextView e = text("", 14, pal.alarm, false);
        e.setVisibility(View.GONE);
        box.addView(e, topParams(10));
        return e;
    }

    private static void fail(TextView error, String why) {
        error.setText(why);
        error.setVisibility(View.VISIBLE);
    }

    /** "Fasten starten": planned length, start (now, or earlier), a note. */
    private void startFast() {
        if (fasts.active() != null) return;
        LinearLayout box = formBox();
        java.util.function.IntSupplier planned = plannedField(box, 5);
        Calendar start = nowMinute();
        whenField(box, "BEGINN", start);
        EditText note = noteField(box, "");
        TextView error = errorLine(box);
        AlertDialog d = formDialog("Fasten starten", box, "Starten");
        show(d);
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            int days = planned.getAsInt();
            if (days < 1 || days > 60) {
                fail(error, "Geplante Dauer zwischen 1 und 60 Tagen.");
                return;
            }
            if (start.getTimeInMillis() > System.currentTimeMillis() + 60_000) {
                fail(error, "Der Beginn liegt in der Zukunft.");
                return;
            }
            fasts.put(new Fasts.Fast(null, start.getTimeInMillis(), 0, days, note.getText().toString()));
            d.dismiss();
            // the morning reminder needs the permission to show notifications (Android 13 and later)
            if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIFY);
            }
            fastsChanged();
        });
    }

    /** "Fasten beenden": the end, now or earlier. */
    private void endFast(Fasts.Fast f) {
        LinearLayout box = formBox();
        Calendar end = nowMinute();
        whenField(box, "ENDE", end);
        TextView error = errorLine(box);
        AlertDialog d = formDialog("Fasten beenden", box, "Beenden");
        show(d);
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            long e = end.getTimeInMillis();
            if (e <= f.start) {
                fail(error, "Das Ende muss nach dem Beginn liegen.");
                return;
            }
            fasts.put(f.withEnd(Math.min(e, System.currentTimeMillis() + 60_000)));
            d.dismiss();
            fastsChanged();
        });
    }

    /** Start, end (once ended), plan and note changed afterwards - the measurements follow by their time; or deleted. */
    private void editFast(Fasts.Fast f) {
        LinearLayout box = formBox();
        java.util.function.IntSupplier planned = plannedField(box, f.plannedDays);
        Calendar start = Calendar.getInstance();
        start.setTimeInMillis(f.start);
        whenField(box, "BEGINN", start);
        Calendar end = Calendar.getInstance();
        if (!f.open()) {
            end.setTimeInMillis(f.end);
            whenField(box, "ENDE", end);
        } else {
            box.addView(text("Läuft noch – das Ende setzt „Fasten beenden“.", 13, MUTED, false), topParams(12));
        }
        EditText note = noteField(box, f.note);
        TextView error = errorLine(box);
        AlertDialog d = formDialog("Fasten bearbeiten", box, "Speichern");
        d.setButton(DialogInterface.BUTTON_NEUTRAL, "Löschen", (x, y) -> { });
        show(d);
        Button del = d.getButton(DialogInterface.BUTTON_NEUTRAL);
        if (del != null) {
            del.setTypeface(orbitron);
            del.setAllCaps(false);
            del.setTextColor(pal.alarm);
            del.setOnClickListener(v -> {
                AlertDialog sure = dialog("Fasten löschen?").setMessage("Die Messungen bleiben, nur dieses Fasten verschwindet.")
                        .setPositiveButton("Löschen", (a, b) -> {
                            fasts.remove(f.id);
                            d.dismiss();
                            fastsChanged();
                        }).setNegativeButton("Abbrechen", null).create();
                show(sure);
            });
        }
        d.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(v -> {
            int days = planned.getAsInt();
            if (days < 1 || days > 60) {
                fail(error, "Geplante Dauer zwischen 1 und 60 Tagen.");
                return;
            }
            long s0 = start.getTimeInMillis(), e0 = f.open() ? 0 : end.getTimeInMillis();
            if (!f.open() && e0 <= s0) {
                fail(error, "Das Ende muss nach dem Beginn liegen.");
                return;
            }
            fasts.put(new Fasts.Fast(f.id, s0, e0, days, note.getText().toString()));
            d.dismiss();
            fastsChanged();
        });
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

        // whose values are shown: Doc | the second person (Doc, 20.11.2026: two people use the scale)
        LinearLayout persons = new LinearLayout(this);
        persons.setOrientation(LinearLayout.HORIZONTAL);
        personRow = persons;
        for (int i = 0; i < SLOTS.length; i++) {
            int who = i;
            TextView c = text(names[i], 14, TEXT, true);
            c.setGravity(Gravity.CENTER);
            c.setMaxLines(1);
            c.setPadding(dp(8), 0, dp(8), 0);
            c.setAutoSizeTextTypeUniformWithConfiguration(10, 14, 1, TypedValue.COMPLEX_UNIT_SP);
            c.setOnClickListener(v -> showPerson(who));
            personChips[i] = c;
            LinearLayout.LayoutParams cp = new LinearLayout.LayoutParams(0, dp(TAB_HEIGHT), 1f);
            cp.leftMargin = i == 0 ? 0 : dp(5);
            cp.rightMargin = i == SLOTS.length - 1 ? 0 : dp(5);
            persons.addView(c, cp);
        }
        paintPersons();
        LinearLayout.LayoutParams pp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        pp.topMargin = dp(12);
        pp.bottomMargin = dp(4);
        head.addView(persons, pp);

        // what is happening, only while something does (connecting, measuring, done, a problem); a tap fixes
        // permission or Bluetooth
        scaleState = text("", 16, TEXT, true);
        scaleState.setGravity(Gravity.CENTER);
        scaleState.setVisibility(View.GONE);
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
        tMuscle = tile(r2, "MUSKEL · SCHÄTZUNG", TileInfo.Key.MUSCLE);
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
        listTitle = (TextView) ((ViewGroup) tail).getChildAt(0);   // "MESSUNGEN · DOC": whose list this is
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
        paintPersons();
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
     * gut oder whatsoever ist", then "natürlich der Verlauf"): the value of the weigh-in on the card (the newest, or the
     * one tapped in the list) with its word, the course over all
     * weigh-ins with the zones behind it (and the goal lines for the waist), every zone with its numbers, then what it
     * is, how it is measured, what moves it, why it matters, the source and the disclaimer (TileInfo, History).
     */
    private void openInfo(TileInfo.Key key) {
        if (weighings.size() == 0) return;
        TileInfo info = TileInfo.of(key);
        int at = shownWeighing();
        Weighings.Weighing newest = weighings.get(at);   // the one on the card
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
            b.setPositiveButton(newest.hasWaist() || newest.hasHip() ? "Ändern" : "Eintragen", (x, which) -> editGirths(at));
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
        private final java.util.function.Supplier<String> live;

        FastingBridge(String theme, java.util.function.Supplier<String> live) {
            this.theme = theme;
            this.live = live;
        }

        @JavascriptInterface
        public String theme() {
            return theme;
        }

        /** the fasts recorded in DocFit and the days of their measurements, in the page's shape (FastLive) */
        @JavascriptInterface
        public String liveFasts() {
            return live.get();
        }
    }

    private static final class Row extends RecyclerView.ViewHolder {
        final TextView day, sub, extra;
        final DigitsView value;
        /** only in a weigh-in row (newScaleRow): the fitness score behind the date and the edit pencil, else null */
        final TextView score;
        final ImageView edit;

        Row(View v, TextView day, TextView sub, TextView extra, DigitsView value) {
            this(v, day, sub, extra, value, null, null);
        }

        Row(View v, TextView day, TextView sub, TextView extra, DigitsView value, TextView score, ImageView edit) {
            super(v);
            this.day = day;
            this.sub = sub;
            this.extra = extra;
            this.value = value;
            this.score = score;
            this.edit = edit;
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
            Row r = newRow();
            r.itemView.setOnClickListener(v -> pickRun(r.getBindingAdapterPosition()));
            return r;
        }

        @Override
        public void onBindViewHolder(@NonNull Row r, int i) {
            Entries.Entry e = entries.get(i);
            GradientDrawable bg = round(CARD, 12);
            if (e.start == pickedRun) bg.setStroke(dp(2), LAMBDA);   // the selected time
            r.itemView.setBackground(bg);
            r.day.setText(Times.day(e.start));
            // the exercise in front of the start time, as plain text; times from before there were exercises as they were
            r.sub.setText((e.kind.isEmpty() ? "" : e.kind + " · ") + "Start " + Times.clock(e.start) + " Uhr");
            r.value.setText(Times.duration(e.duration));
        }

        @Override
        public int getItemCount() {
            return entries.size();
        }
    }

    private final class GluAdapter extends RecyclerView.Adapter<Row> {
        @NonNull
        @Override
        public Row onCreateViewHolder(@NonNull ViewGroup parent, int type) {
            Row r = newRow();
            r.itemView.setOnLongClickListener(v -> {   // long press deletes, with "Rückgängig"
                deleteGlucose(r.getBindingAdapterPosition());
                return true;
            });
            return r;
        }

        @Override
        public void onBindViewHolder(@NonNull Row r, int i) {
            Glucoses.Reading g = glucoses.get(i);
            Glucoses.Category c = Glucoses.category(g.mgdl, g.context);
            int k = Glucoses.contextIndex(g.context);
            r.day.setText(Times.day(g.time));
            // time, context, where it came from, and - where there are limits - the reading in its colour
            String head = Times.clock(g.time) + " Uhr · " + (k >= 0 ? Glucoses.CONTEXT_WORDS[k] : "") + " · Hand";
            String word = c == Glucoses.Category.NORMAL ? "normal" : c == Glucoses.Category.RAISED ? "erhöht"
                    : c == Glucoses.Category.HIGH ? "hoch" : "";
            SpannableString sp = new SpannableString(word.isEmpty() ? head : head + " · " + word);
            if (!word.isEmpty()) {
                sp.setSpan(new ForegroundColorSpan(gluColor(c)), sp.length() - word.length(), sp.length(),
                        Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            r.sub.setText(sp);
            // always both units (Doc: the meter says mmol/L, he thinks in mg/dL)
            r.extra.setText(Glucoses.both(g.mgdl) + (g.note.isEmpty() ? "" : " · " + g.note));
            r.extra.setVisibility(View.VISIBLE);
            r.value.setText(g.mgdl + " mg/dL");
            r.value.setTextColor(gluColor(c));
        }

        @Override
        public int getItemCount() {
            return glucoses.size();
        }
    }

    private final class BpAdapter extends RecyclerView.Adapter<Row> {
        @NonNull
        @Override
        public Row onCreateViewHolder(@NonNull ViewGroup parent, int type) {
            Row r = newRow();
            r.itemView.setOnLongClickListener(v -> {   // long press deletes too, with "Rückgängig"
                deletePressure(r.getBindingAdapterPosition());
                return true;
            });
            return r;
        }

        @Override
        public void onBindViewHolder(@NonNull Row r, int i) {
            Pressures.Reading b = pressures.get(i);
            Pressures.Category c = Pressures.category(b.sys, b.dia);
            r.day.setText(Times.day(b.time));
            // time, where it came from, and the category in its colour
            String source = Pressures.OMRON.equals(b.source) ? "Omron" : "Hand";
            String head = Times.clock(b.time) + " Uhr · " + source + " · ";
            SpannableString sp = new SpannableString(head + c.word);
            sp.setSpan(new ForegroundColorSpan(bpColor(c)), head.length(), sp.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            r.sub.setText(sp);
            String extra = (b.pulse > 0 ? "Puls " + b.pulse : "") + (b.note.isEmpty() ? "" : (b.pulse > 0 ? " · " : "") + b.note);
            r.extra.setText(extra);
            r.extra.setVisibility(extra.isEmpty() ? View.GONE : View.VISIBLE);
            r.value.setText(b.sys + "/" + b.dia);
            r.value.setTextColor(bpColor(c));
        }

        @Override
        public int getItemCount() {
            return pressures.size();
        }
    }

    /**
     * One weigh-in of MESSUNGEN (Doc, 23.11.2026: "oben rechts in der Zeile, wo der Tag und das Datum steht, rechts
     * eine Taste 'Edit' ... Und hinter das Datum die jeweilige Note, also '7 fit', in der entsprechenden Farbe"): on top
     * the day, its score and at the right end the edit pencil (24 dp in a 48 dp touch target, its right edge on the
     * weight's); below the time and the body values on the left, the weight on the right. The same card, padding and
     * texts as newRow.
     */
    private Row newScaleRow() {
        LinearLayout v = new LinearLayout(this);
        v.setOrientation(LinearLayout.VERTICAL);
        v.setBackground(round(CARD, 12));
        v.setPadding(dp(12), 0, dp(12), dp(10));   // no top padding: the 48 dp pencil row gives the air above the day
        v.setClipToPadding(false);                 // the pencil's touch target reaches into the right padding
        RecyclerView.LayoutParams lp = new RecyclerView.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        lp.topMargin = dp(8);
        v.setLayoutParams(lp);
        LinearLayout top = new LinearLayout(this);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER_VERTICAL);
        TextView day = text("", 15, TEXT, false);
        TextView score = text("", 15, TEXT, false);
        score.setTypeface(score.getTypeface(), Typeface.BOLD);
        score.setPadding(dp(10), 0, 0, 0);
        score.setMaxLines(1);
        score.setEllipsize(TextUtils.TruncateAt.END);
        top.addView(day);
        top.addView(score, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        ImageView edit = new ImageView(this);
        edit.setImageResource(R.drawable.ic_edit);
        edit.setColorFilter(pal.iconIdle);
        edit.setPadding(dp(12), dp(12), dp(12), dp(12));
        edit.setContentDescription("Bauch und Hüfte eintragen");
        top.addView(edit, new LinearLayout.LayoutParams(dp(48), dp(48)));
        LinearLayout.LayoutParams tp = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        tp.rightMargin = -dp(12);   // the 48 dp target ends at the card's edge, the 24 dp pencil above the weight's end
        v.addView(top, tp);
        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.HORIZONTAL);
        body.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout left = new LinearLayout(this);
        left.setOrientation(LinearLayout.VERTICAL);
        TextView sub = text("", 13, MUTED, false);
        TextView extra = text("", 12, MUTED, false);
        extra.setVisibility(View.GONE);
        left.addView(sub);
        left.addView(extra);
        body.addView(left, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        DigitsView value = new DigitsView(this, orbitron, 22, LAMBDA);
        value.setGravity(Gravity.END);
        value.setPadding(dp(10), 0, 0, 0);
        body.addView(value);
        v.addView(body, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        return new Row(v, day, sub, extra, value, score, edit);
    }

    private final class ScaleAdapter extends RecyclerView.Adapter<Row> {
        @NonNull
        @Override
        public Row onCreateViewHolder(@NonNull ViewGroup parent, int type) {
            Row r = newScaleRow();
            r.value.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20);
            // a tap shows this weigh-in in the card, a long press enters its waist and hip (Doc, 23.11.2026: "Das müssen
            // wir auf langes Klicken machen - wenn es nur klickt, würde ich gerne oben die Werte sehen"), and so does
            // the pencil ("Long Press identisch"); the row answers with a ripple, its background is set in
            // onBindViewHolder
            r.itemView.setOnClickListener(v -> pickWeighing(r.getBindingAdapterPosition()));
            View.OnLongClickListener girths = v -> {
                editGirths(r.getBindingAdapterPosition());
                return true;
            };
            r.itemView.setOnLongClickListener(girths);
            r.edit.setOnClickListener(girths::onLongClick);
            return r;
        }

        @Override
        public void onBindViewHolder(@NonNull Row r, int i) {
            Weighings.Weighing w = weighings.get(i);
            // the weigh-in on the card has a phi green frame like a chosen chip - only one picked, not the newest
            boolean picked = pickedWeighing != 0 && w.time == pickedWeighing;
            GradientDrawable bgRow = round(CARD, 12);
            if (picked) bgRow.setStroke(Math.max(2, dp(2)), PHI);
            int ink = (MUTED & 0x00FFFFFF) | 0x40000000;
            r.itemView.setBackground(new RippleDrawable(ColorStateList.valueOf(ink), bgRow, null));
            BodyComposition bc = BodyComposition.of(w, profile);
            r.day.setText(Times.day(w.time));
            // the score behind the date in its colour, nothing without one (no fat, implausible, profile incomplete)
            int fit = FitnessScore.of(w, profile).score;
            r.score.setText(FitnessScore.label(fit));
            r.score.setTextColor(pal.scoreInk(fit));
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
