// TS.js — TensorFlow.js-Modul für gz-Vorhersage (Gravitation Lab)
// Input:  12 floats  [ax,ay,az, bx,by,bz, cx,cy,cz, mx,my,mz]
// Output:  1 float   gz in mGal (de-normalisiert)

window.GravTF = (function () {
    const STRIDE     = 13;
    const INPUT_SIZE = 12;

    let _model   = null;
    let _opt     = null;
    let _stats   = null;
    let _rafId   = null;
    let _running = false;
    let _epoch   = 0;
    let _hist    = [];   // log10(loss) per step-group

    // ── Modell ────────────────────────────────────────────────────────────
    function build(units) {
        units = units || [128, 128, 64];
        if (_model) { try { _model.dispose(); } catch (_) {} _model = null; }
        _opt   = tf.train.adam(0.001);
        _model = tf.sequential();
        units.forEach(function (n, i) {
            _model.add(tf.layers.dense({
                units: n,
                activation: 'tanh',
                kernelInitializer: 'glorotNormal',
                biasInitializer: 'zeros',
                inputShape: i === 0 ? [INPUT_SIZE] : undefined,
            }));
        });
        _model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
    }

    // ── Z-Score-Normalisierung ────────────────────────────────────────────
    function computeStats(data) {
        var N = data.length / STRIDE | 0;
        var inSum   = new Float64Array(INPUT_SIZE);
        var inSumSq = new Float64Array(INPUT_SIZE);
        var outSum = 0, outSumSq = 0;

        for (var i = 0; i < N; i++) {
            var o = i * STRIDE;
            for (var j = 0; j < INPUT_SIZE; j++) {
                inSum[j]   += data[o + j];
                inSumSq[j] += data[o + j] * data[o + j];
            }
            outSum   += data[o + 12];
            outSumSq += data[o + 12] * data[o + 12];
        }

        var inMean = Array.from(inSum).map(function (s) { return s / N; });
        var inStd  = Array.from(inSumSq).map(function (sq, j) {
            var v = sq / N - inMean[j] * inMean[j];
            return v > 1e-12 ? Math.sqrt(v) : 1.0;
        });
        var outMean = outSum / N;
        var outStd  = Math.sqrt(Math.max(outSumSq / N - outMean * outMean, 1e-12));

        return { inMean: inMean, inStd: inStd, outMean: outMean, outStd: outStd };
    }

    // ── Trainingsschritt ──────────────────────────────────────────────────
    function trainStep(data, batchSize) {
        var N  = (data.length / STRIDE) | 0;
        var xs = new Float32Array(batchSize * INPUT_SIZE);
        var ys = new Float32Array(batchSize);

        for (var i = 0; i < batchSize; i++) {
            var idx = (Math.random() * N) | 0;
            var o   = idx * STRIDE;
            for (var j = 0; j < INPUT_SIZE; j++) {
                xs[i * INPUT_SIZE + j] = (data[o + j] - _stats.inMean[j]) / _stats.inStd[j];
            }
            ys[i] = (data[o + 12] - _stats.outMean) / _stats.outStd;
        }

        var lossVal = 0;
        var xT = tf.tensor2d(xs, [batchSize, INPUT_SIZE]);
        var yT = tf.tensor2d(ys, [batchSize, 1]);
        _opt.minimize(function () {
            var pred = _model.predict(xT);
            var l    = tf.losses.meanSquaredError(yT, pred);
            lossVal  = l.dataSync()[0];
            return l;
        });
        xT.dispose();
        yT.dispose();
        return lossVal;
    }

    // ── Öffentliche API ───────────────────────────────────────────────────
    return {
        build: build,

        startTraining: function (data, opts) {
            opts = opts || {};
            var spf       = opts.stepsPerFrame || 8;
            var batchSize = opts.batchSize     || 128;
            var onStep    = opts.onStep;

            if (!data || data.length < STRIDE) return;
            if (!_model) build();
            _stats   = computeStats(data);
            _running = true;

            function loop() {
                if (!_running) return;
                var loss = 0;
                for (var s = 0; s < spf; s++) loss = trainStep(data, batchSize);
                _epoch += spf;
                _hist.push(Math.log10(Math.max(loss, 1e-12)));
                if (_hist.length > 300) _hist.shift();
                if (onStep) onStep({ loss: loss, epoch: _epoch, lossHistory: _hist });
                _rafId = requestAnimationFrame(loop);
            }
            loop();
        },

        stopTraining: function () {
            _running = false;
            if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
        },

        predict: function (inputs12) {
            if (!_model || !_stats) return null;
            return tf.tidy(function () {
                var norm = inputs12.map(function (v, j) {
                    return (v - _stats.inMean[j]) / _stats.inStd[j];
                });
                var raw = _model.predict(tf.tensor2d([norm])).dataSync()[0];
                return raw * _stats.outStd + _stats.outMean;
            });
        },

        reset: function () {
            this.stopTraining();
            _epoch = 0; _hist = []; _stats = null;
            if (_model) { try { _model.dispose(); } catch (_) {} _model = null; }
        },

        get isRunning()   { return _running; },
        get epoch()       { return _epoch;   },
        get lossHistory() { return _hist;    },
        get ready()       { return !!_model && !!_stats; },
    };
})();
