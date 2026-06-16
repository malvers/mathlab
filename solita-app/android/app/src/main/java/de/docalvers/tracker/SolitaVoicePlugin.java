package de.docalvers.tracker;

import android.Manifest;
import android.content.Intent;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/**
 * Web ↔ native bridge for Solita's wake-word. start() launches the Vosk foreground service and
 * registers this plugin as the result sink; the service calls emitWake() on a hit, which pushes a
 * "result" event to the WebView. solita-wake.js (native mode) listens and feeds the text into its
 * existing extractQuery/fire logic. The web/browser path (Web SpeechRecognition) is untouched.
 */
@CapacitorPlugin(
        name = "SolitaVoice",
        permissions = { @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = "mic") }
)
public class SolitaVoicePlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
        if (getPermissionState("mic") != PermissionState.GRANTED) {
            requestPermissionForAlias("mic", call, "micCallback");
            return;
        }
        launch();
        call.resolve();
    }

    @PermissionCallback
    private void micCallback(PluginCall call) {
        if (getPermissionState("mic") == PermissionState.GRANTED) {
            launch();
            call.resolve();
        } else {
            call.reject("Mikrofon-Berechtigung verweigert");
        }
    }

    private void launch() {
        SolitaVoiceService.bridge = this;
        Intent i = new Intent(getContext(), SolitaVoiceService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) getContext().startForegroundService(i);
        else getContext().startService(i);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().stopService(new Intent(getContext(), SolitaVoiceService.class));
        SolitaVoiceService.bridge = null;
        call.resolve();
    }

    @PluginMethod
    public void isRunning(PluginCall call) {
        JSObject r = new JSObject();
        r.put("running", SolitaVoiceService.running);
        call.resolve(r);
    }

    // Mute/unmute the always-on recognizer (the FGS keeps the mic, but Vosk stops decoding). The web layer
    // calls pause(true) while Solita speaks (no self-trigger) and during a Web-SR turn (mic handoff), then
    // pause(false) to resume always-on wake detection.
    @PluginMethod
    public void pause(PluginCall call) {
        SolitaVoiceService.setPaused(call.getBoolean("pause", Boolean.TRUE));
        call.resolve();
    }

    // Called by the service (background thread) on a wake hit → push to the WebView.
    void emitWake(final String text) {
        JSObject d = new JSObject();
        d.put("text", text);
        d.put("wake", true);
        notifyListeners("result", d);
    }
}
