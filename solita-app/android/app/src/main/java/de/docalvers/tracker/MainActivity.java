package de.docalvers.tracker;

import android.os.Build;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // FIX 3 (activityResumed gate): true between onResume and onPause. The Vosk service reads this to NEVER
    // grab the mic while the activity is foreground (Web-SR owns it then) — e.g. a post-login start command or
    // an OS START_STICKY restart must not steal the foreground mic. volatile: read from the service thread.
    public static volatile boolean activityResumed = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GnssInfoPlugin.class);            // expose native GnssStatus to the web layer
        registerPlugin(BaroPlugin.class);                // expose the barometer (pressure → altitude)
        registerPlugin(ActivityRecognitionPlugin.class); // travel mode: walk / run / bike / vehicle
        registerPlugin(AppUpdatePlugin.class);           // in-app APK self-update (sideload, no Play Store)
        registerPlugin(SolitaVoicePlugin.class);         // Stufe B: native Vosk wake-word → WebView bridge
        super.onCreate(savedInstanceState);

        // FIX 5 (lock-screen wake): show this activity over the keyguard and turn the screen on when launched
        // by the wake full-screen Intent. The manifest already declares showWhenLocked/turnScreenOn; setting it
        // here too covers API 27+ programmatically (e.g. when the flags need to apply to an existing instance).
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }

        // Plan A serves the app LIVE from docalvers.de (GitHub Pages → fixed Cache-Control: max-age=600).
        // That 10-min cache is what made fresh deploys take up to 10 min to reach the device.
        //   ONLINE : LOAD_NO_CACHE → the WebView ignores its HTTP cache and fetches the live files,
        //            so a fresh deploy shows up immediately on a (cold) start. GitHub purges its
        //            Fastly edge on deploy, so "live" really is the new build within seconds.
        //   OFFLINE: LOAD_CACHE_ELSE_NETWORK → use the cache, so the tracker still launches in a
        //            dead zone (forest / no signal).
        // Set right after super.onCreate (the WebView exists) and before its queued load runs on the
        // WebView thread, so it applies to the very first load — no reload / no flash.
        try {
            android.webkit.WebView wv = getBridge().getWebView();
            wv.getSettings().setCacheMode(isOnline()
                ? android.webkit.WebSettings.LOAD_NO_CACHE
                : android.webkit.WebSettings.LOAD_CACHE_ELSE_NETWORK);
        } catch (Exception e) {
            // any surprise → leave Capacitor's default cache mode (status quo, never worse)
        }

        // Voice-Spur: let the WebView's getUserMedia() microphone request through. Capacitor's
        // default chrome client does NOT auto-grant AUDIO_CAPTURE, so getUserMedia is denied even
        // though RECORD_AUDIO is already held → "perm denied". Subclass BridgeWebChromeClient (keeps
        // every Capacitor chrome feature: file chooser, etc.) and grant the requested resources —
        // our page only ever asks for the mic.
        try {
            final com.getcapacitor.Bridge bridge = getBridge();
            bridge.getWebView().setWebChromeClient(new com.getcapacitor.BridgeWebChromeClient(bridge) {
                @Override
                public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() { request.grant(request.getResources()); }
                    });
                }
            });
        } catch (Exception e) {
            // leave Capacitor's default chrome client on any surprise
        }
    }

    // NATIVE-LIFECYCLE-DRIVEN mic ownership for Solita's wake-word (Stufe B):
    //   FOREGROUND (onResume) → STOP the Vosk recognizer, freeing the AudioRecord so the foreground
    //                           Web-SR can own the mic and run the proven conversation flow.
    //   BACKGROUND / LOCKED (onPause) → START the Vosk recognizer (within the already-alive FGS — allowed
    //                           on Android 14) so Vosk listens for "Solita" with the screen off.
    // Guarded on the service running so we never touch Vosk before login starts it (and never try to
    // (re)start the SERVICE from here — only the recognizer toggles).
    @Override
    public void onResume() {
        super.onResume();
        activityResumed = true;                                                   // FIX 3: gate BEFORE we stop Vosk, so any concurrent service (re)start sees foreground
        android.util.Log.i("SolitaVosk", "MainActivity.onResume → foreground (Vosk off, Web-SR owns mic)");
        if (SolitaVoiceService.running) SolitaVoiceService.setListening(false);   // foreground → Web-SR owns the mic
    }

    @Override
    public void onPause() {
        super.onPause();
        activityResumed = false;                                                  // FIX 3: clear the gate BEFORE starting Vosk, so the start is allowed
        android.util.Log.i("SolitaVosk", "MainActivity.onPause → background/locked (Vosk on, owns mic)");
        if (SolitaVoiceService.running) SolitaVoiceService.setListening(true);    // background/locked → Vosk owns the mic
    }

    private boolean isOnline() {
        try {
            android.net.ConnectivityManager cm =
                (android.net.ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            android.net.NetworkInfo ni = (cm != null) ? cm.getActiveNetworkInfo() : null;
            return ni != null && ni.isConnected();
        } catch (Exception e) {
            return false;
        }
    }
}
