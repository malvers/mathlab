package de.docalvers.tracker;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

// Reads the barometric pressure sensor (TYPE_PRESSURE) and streams a pressure-derived
// altitude to JS. The barometer gives a precise *relative* profile; the web layer fuses
// it with GPS for the absolute reference. Not every phone has one → start() reports
// { available } so the web side can fall back to GPS-only altitude.
@CapacitorPlugin(name = "Baro")
public class BaroPlugin extends Plugin implements SensorEventListener {

    private SensorManager sm;
    private Sensor pressure;
    private boolean registered = false;
    private long lastEmit = 0;

    @PluginMethod
    public void start(PluginCall call) {
        sm = (SensorManager) getContext().getSystemService(Context.SENSOR_SERVICE);
        pressure = (sm != null) ? sm.getDefaultSensor(Sensor.TYPE_PRESSURE) : null;
        JSObject ret = new JSObject();
        if (pressure == null) {
            ret.put("available", false);
            call.resolve(ret);
            return;
        }
        if (!registered) {
            sm.registerListener(this, pressure, SensorManager.SENSOR_DELAY_NORMAL);
            registered = true;
        }
        ret.put("available", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (registered && sm != null) {
            sm.unregisterListener(this);
            registered = false;
        }
        call.resolve();
    }

    @Override
    public void onSensorChanged(SensorEvent e) {
        long now = System.currentTimeMillis();
        if (now - lastEmit < 500) return; // ~2 Hz is plenty for a height readout
        lastEmit = now;
        float hpa = e.values[0];
        float altitude = SensorManager.getAltitude(SensorManager.PRESSURE_STANDARD_ATMOSPHERE, hpa);
        JSObject d = new JSObject();
        d.put("pressure", hpa);
        d.put("altitude", altitude);
        notifyListeners("baro", d);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) { }
}
