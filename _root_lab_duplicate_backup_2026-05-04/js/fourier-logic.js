// Fourier Logic Library

function dft(x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;
        for (let n = 0; n < N; n++) {
            const phi = (Math.PI * 2 * k * n) / N;
            re += x[n].re * Math.cos(phi) + x[n].im * Math.sin(phi);
            im += -x[n].re * Math.sin(phi) + x[n].im * Math.cos(phi);
        }
        re = re / N;
        im = im / N;

        // Shift frequency to be centered around 0 (-N/2 to N/2)
        let freq = k;
        if (freq > N / 2) freq -= N;

        let amp = Math.sqrt(re * re + im * im);
        let phase = Math.atan2(im, re);
        X.push({ re, im, freq, amp, phase });
    }
    
    // Sort by frequency magnitude (0, 1, -1, 2, -2...)
    X.sort((a, b) => Math.abs(a.freq) - Math.abs(b.freq));
    return X;
}
