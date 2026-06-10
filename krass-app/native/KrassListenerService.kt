package de.docalvers.krass

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import org.json.JSONObject
import org.vosk.Model
import org.vosk.Recognizer
import org.vosk.android.RecognitionListener
import org.vosk.android.SpeechService
import org.vosk.android.StorageService
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Always-on foreground service: feeds the microphone into Vosk (offline German model) and counts
 * every spoken "krass". Keyless, on-device, no cloud. Counts are persisted per day in SharedPreferences
 * (key = yyyy-MM-dd); the day rolls over automatically because each result is written under today's key.
 * START_STICKY + foreground keep it alive; the persistent notification is mandatory on modern Android.
 */
class KrassListenerService : Service(), RecognitionListener {

    companion object {
        const val CHANNEL = "krass_counter"
        const val NOTIF_ID = 1
        const val PREFS = "krass_counts"          // SharedPreferences: "yyyy-MM-dd" -> Int
        @Volatile var running = false             // read by the plugin for getStats().running
    }

    private var model: Model? = null
    private var speech: SpeechService? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createChannel()
        startInForeground(todayCount())
        running = true
        initVosk()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    // Unpack the bundled assets/model into internal storage once, then listen continuously.
    private fun initVosk() {
        StorageService.unpack(this, "model", "model",
            { m: Model ->
                model = m
                val recognizer = Recognizer(m, 16000.0f)
                val s = SpeechService(recognizer, 16000.0f)
                s.startListening(this)
                speech = s
            },
            { _ -> stopSelf() }   // model missing/corrupt → give up cleanly
        )
    }

    // ---- RecognitionListener: count on FINAL results only (partials would double-count) ----
    override fun onPartialResult(hypothesis: String?) {}
    override fun onResult(hypothesis: String?) = countKrass(hypothesis)
    override fun onFinalResult(hypothesis: String?) = countKrass(hypothesis)
    override fun onError(e: Exception?) {}       // transient mic/recognizer hiccup → keep running
    override fun onTimeout() {}

    private fun countKrass(hypothesis: String?) {
        if (hypothesis == null) return
        val text = try { JSONObject(hypothesis).optString("text", "") } catch (e: Exception) { "" }
        if (text.isBlank()) return
        var hits = 0
        for (w in text.split(Regex("\\s+"))) if (w.equals("krass", ignoreCase = true)) hits++
        if (hits == 0) return
        val day = today()
        val p = prefs()
        val total = p.getInt(day, 0) + hits
        p.edit().putInt(day, total).apply()
        notifyCount(total)
    }

    // ---- notification / foreground ----
    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val ch = NotificationChannel(CHANNEL, "KRASS Zähler", NotificationManager.IMPORTANCE_LOW)
            ch.setShowBadge(false)
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(ch)
        }
    }

    private fun startInForeground(count: Int) {
        val n = buildNotification(count)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE)
        } else {
            startForeground(NOTIF_ID, n)
        }
    }

    private fun notifyCount(count: Int) {
        (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
            .notify(NOTIF_ID, buildNotification(count))
    }

    private fun buildNotification(count: Int): Notification {
        val tap = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        return NotificationCompat.Builder(this, CHANNEL)
            .setContentTitle("KRASS heute: $count")
            .setContentText("Zählt im Hintergrund mit …")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setOngoing(true)
            .setContentIntent(tap)
            .build()
    }

    // ---- helpers ----
    private fun prefs() = getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private fun today() = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    private fun todayCount() = prefs().getInt(today(), 0)

    override fun onDestroy() {
        speech?.stop()
        speech?.shutdown()
        model?.close()
        running = false
        super.onDestroy()
    }
}
