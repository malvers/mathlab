package de.docalvers.krass;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

// Replaces the MainActivity.java that `npx cap add android` generates.
// The only change vs. the default is registerPlugin(...) so the web UI can reach KrassCounter.
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(KrassCounterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
