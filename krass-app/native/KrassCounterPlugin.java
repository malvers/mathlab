package de.docalvers.krass;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * Web ↔ native bridge for the KRASS counter. The web UI only ever calls start()/stop()/getStats();
 * all listening + counting happens in KrassListenerService. getStats() reads the persisted per-day
 * counts so the UI can simply poll.
 */
@CapacitorPlugin(
        name = "KrassCounter",
        permissions = { @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = "mic") }
)
public class KrassCounterPlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
        if (getPermissionState("mic") != PermissionState.GRANTED) {
            requestPermissionForAlias("mic", call, "micCallback");
            return;
        }
        launchService();
        call.resolve();
    }

    @PermissionCallback
    private void micCallback(PluginCall call) {
        if (getPermissionState("mic") == PermissionState.GRANTED) {
            launchService();
            call.resolve();
        } else {
            call.reject("Mikrofon-Berechtigung verweigert");
        }
    }

    private void launchService() {
        Intent i = new Intent(getContext(), KrassListenerService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) getContext().startForegroundService(i);
        else getContext().startService(i);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().stopService(new Intent(getContext(), KrassListenerService.class));
        call.resolve();
    }

    @PluginMethod
    public void getStats(PluginCall call) {
        SharedPreferences p = getContext().getSharedPreferences(KrassListenerService.PREFS, Context.MODE_PRIVATE);
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        String today = fmt.format(new Date());

        // Last 7 days, newest first.
        JSONArray days = new JSONArray();
        Calendar cal = Calendar.getInstance();
        for (int k = 0; k < 7; k++) {
            String d = fmt.format(cal.getTime());
            JSObject o = new JSObject();
            o.put("date", d);
            o.put("count", p.getInt(d, 0));
            days.put(o);
            cal.add(Calendar.DAY_OF_YEAR, -1);
        }

        JSObject ret = new JSObject();
        ret.put("today", p.getInt(today, 0));
        ret.put("running", KrassListenerService.running);
        ret.put("days", days);
        call.resolve(ret);
    }
}
