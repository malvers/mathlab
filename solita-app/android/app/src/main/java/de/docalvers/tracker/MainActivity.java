package de.docalvers.tracker;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GnssInfoPlugin.class);            // expose native GnssStatus to the web layer
        registerPlugin(BaroPlugin.class);                // expose the barometer (pressure → altitude)
        registerPlugin(ActivityRecognitionPlugin.class); // travel mode: walk / run / bike / vehicle
        registerPlugin(AppUpdatePlugin.class);           // in-app APK self-update (sideload, no Play Store)
        super.onCreate(savedInstanceState);

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
