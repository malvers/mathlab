package de.docalvers.tracker;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.GnssStatus;
import android.location.LocationManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.HashMap;
import java.util.Map;

// Reads Android's real GnssStatus (which satellite systems actually feed the fix) and
// streams a per-constellation summary to JS — the honest answer to "wer füttert uns?".
// The web Geolocation API can't do this; only the native app sees GnssStatus.
@CapacitorPlugin(name = "GnssInfo")
public class GnssInfoPlugin extends Plugin {

    private LocationManager lm;
    private GnssStatus.Callback cb;
    private boolean registered = false;
    private long lastEmit = 0;

    // Short codes for the constellation types (API 24+ constants).
    private static String code(int type) {
        switch (type) {
            case GnssStatus.CONSTELLATION_GPS:     return "GPS";
            case GnssStatus.CONSTELLATION_GALILEO: return "GAL";
            case GnssStatus.CONSTELLATION_GLONASS: return "GLO";
            case GnssStatus.CONSTELLATION_BEIDOU:  return "BDS";
            case GnssStatus.CONSTELLATION_QZSS:    return "QZS";
            case GnssStatus.CONSTELLATION_IRNSS:   return "NAV";
            case GnssStatus.CONSTELLATION_SBAS:    return "SBAS";
            default:                                return "?";
        }
    }

    @PluginMethod
    public void start(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) { call.resolve(); return; } // GnssStatus = API 24+
        Context ctx = getContext();
        if (ContextCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            call.reject("no location permission yet");
            return;
        }
        if (registered) { call.resolve(); return; }
        lm = (LocationManager) ctx.getSystemService(Context.LOCATION_SERVICE);
        cb = new GnssStatus.Callback() {
            @Override
            public void onSatelliteStatusChanged(GnssStatus status) { emit(status); }
        };
        try {
            lm.registerGnssStatusCallback(cb, new Handler(Looper.getMainLooper()));
            registered = true;
            call.resolve();
        } catch (SecurityException e) {
            call.reject("permission: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (registered && lm != null && cb != null) {
            try { lm.unregisterGnssStatusCallback(cb); } catch (Exception ignored) {}
            registered = false;
        }
        call.resolve();
    }

    private static void bump(Map<String, Integer> m, String k) {
        Integer cur = m.get(k);
        m.put(k, cur == null ? 1 : cur + 1);
    }

    // Throttle to ~1/s, count satellites used-in-fix and in-view per constellation, emit to JS.
    private void emit(GnssStatus status) {
        long now = System.currentTimeMillis();
        if (now - lastEmit < 1000) return;
        lastEmit = now;

        int n = status.getSatelliteCount();
        int used = 0;
        Map<String, Integer> usedMap = new HashMap<>();
        Map<String, Integer> viewMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String c = code(status.getConstellationType(i));
            bump(viewMap, c);
            if (status.usedInFix(i)) { used++; bump(usedMap, c); }
        }

        JSObject u = new JSObject();
        for (Map.Entry<String, Integer> e : usedMap.entrySet()) u.put(e.getKey(), e.getValue());
        JSObject v = new JSObject();
        for (Map.Entry<String, Integer> e : viewMap.entrySet()) v.put(e.getKey(), e.getValue());

        JSObject data = new JSObject();
        data.put("used", used);
        data.put("inView", n);
        data.put("usedByConstellation", u);
        data.put("viewByConstellation", v);
        notifyListeners("gnss", data);
    }
}
