package de.docalvers.krass

import android.Manifest
import android.content.Context
import android.content.Intent
import android.os.Build
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

/**
 * Web ↔ native bridge for the KRASS counter. The web UI only ever calls start()/stop()/getStats();
 * all listening + counting happens in KrassListenerService. getStats() reads the persisted per-day
 * counts so the UI can simply poll.
 */
@CapacitorPlugin(
    name = "KrassCounter",
    permissions = [Permission(strings = [Manifest.permission.RECORD_AUDIO], alias = "mic")]
)
class KrassCounterPlugin : Plugin() {

    @PluginMethod
    fun start(call: PluginCall) {
        if (getPermissionState("mic") != PermissionState.GRANTED) {
            requestPermissionForAlias("mic", call, "micCallback")
            return
        }
        launchService()
        call.resolve()
    }

    @PermissionCallback
    private fun micCallback(call: PluginCall) {
        if (getPermissionState("mic") == PermissionState.GRANTED) {
            launchService()
            call.resolve()
        } else {
            call.reject("Mikrofon-Berechtigung verweigert")
        }
    }

    private fun launchService() {
        val i = Intent(context, KrassListenerService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(i)
        else context.startService(i)
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        context.stopService(Intent(context, KrassListenerService::class.java))
        call.resolve()
    }

    @PluginMethod
    fun getStats(call: PluginCall) {
        val p = context.getSharedPreferences(KrassListenerService.PREFS, Context.MODE_PRIVATE)
        val fmt = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val today = fmt.format(Date())

        // Last 7 days, newest first.
        val days = JSONArray()
        val cal = Calendar.getInstance()
        for (k in 0 until 7) {
            val d = fmt.format(cal.time)
            val o = JSObject().put("date", d).put("count", p.getInt(d, 0))
            days.put(o)
            cal.add(Calendar.DAY_OF_YEAR, -1)
        }

        val ret = JSObject()
        ret.put("today", p.getInt(today, 0))
        ret.put("running", KrassListenerService.running)
        ret.put("days", days)
        call.resolve(ret)
    }
}
