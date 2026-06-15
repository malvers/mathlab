package de.docalvers.tracker;

import android.Manifest;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import com.google.android.gms.location.ActivityRecognition;
import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.DetectedActivity;

// Wraps Google Play Services Activity Recognition → streams the current travel mode
// (still / walking / running / on_bicycle / in_vehicle) + confidence to the web layer.
// Needs the ACTIVITY_RECOGNITION runtime permission (API 29+). Web has no equivalent,
// so the JS side falls back to a speed heuristic when this plugin is absent.
@CapacitorPlugin(
        name = "ActivityRecognition",
        permissions = {
                @Permission(alias = "activity", strings = { Manifest.permission.ACTIVITY_RECOGNITION })
        }
)
public class ActivityRecognitionPlugin extends Plugin {

    private static final String ACTION = "de.docalvers.tracker.ACTIVITY_UPDATE";
    private PendingIntent pendingIntent;
    private BroadcastReceiver receiver;
    private boolean running = false;

    private static String name(int type) {
        switch (type) {
            case DetectedActivity.STILL:      return "still";
            case DetectedActivity.WALKING:    return "walking";
            case DetectedActivity.RUNNING:    return "running";
            case DetectedActivity.ON_FOOT:    return "walking";   // generic on-foot → walking
            case DetectedActivity.ON_BICYCLE: return "on_bicycle";
            case DetectedActivity.IN_VEHICLE: return "in_vehicle";
            case DetectedActivity.TILTING:    return "still";
            default:                          return "unknown";
        }
    }

    private boolean hasPerm() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q
                || ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED;
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (hasPerm()) { JSObject r = new JSObject(); r.put("granted", true); call.resolve(r); return; }
        requestPermissionForAlias("activity", call, "permCallback");
    }

    @PermissionCallback
    private void permCallback(PluginCall call) {
        JSObject r = new JSObject();
        r.put("granted", getPermissionState("activity") == PermissionState.GRANTED);
        call.resolve(r);
    }

    @PluginMethod
    public void start(PluginCall call) {
        Context ctx = getContext();
        if (!hasPerm()) { call.reject("no activity-recognition permission yet"); return; }
        if (running) { call.resolve(); return; }

        Intent intent = new Intent(ACTION).setPackage(ctx.getPackageName());
        int flags = PendingIntent.FLAG_UPDATE_CURRENT
                | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ? PendingIntent.FLAG_MUTABLE : 0);
        pendingIntent = PendingIntent.getBroadcast(ctx, 0, intent, flags);

        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent i) {
                if (ActivityRecognitionResult.hasResult(i)) {
                    ActivityRecognitionResult res = ActivityRecognitionResult.extractResult(i);
                    DetectedActivity a = res.getMostProbableActivity();
                    JSObject data = new JSObject();
                    data.put("type", name(a.getType()));
                    data.put("confidence", a.getConfidence());
                    notifyListeners("activity", data);
                }
            }
        };
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ctx.registerReceiver(receiver, new IntentFilter(ACTION), Context.RECEIVER_NOT_EXPORTED);
        } else {
            ctx.registerReceiver(receiver, new IntentFilter(ACTION));
        }

        try {
            ActivityRecognition.getClient(ctx)
                    .requestActivityUpdates(4000, pendingIntent)
                    .addOnSuccessListener(v -> { running = true; call.resolve(); })
                    .addOnFailureListener(e -> call.reject("requestActivityUpdates failed: " + e.getMessage()));
        } catch (SecurityException e) {
            call.reject("permission: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Context ctx = getContext();
        try {
            if (pendingIntent != null) ActivityRecognition.getClient(ctx).removeActivityUpdates(pendingIntent);
        } catch (Exception ignored) {}
        if (receiver != null) {
            try { ctx.unregisterReceiver(receiver); } catch (Exception ignored) {}
            receiver = null;
        }
        running = false;
        call.resolve();
    }
}
