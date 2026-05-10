(function () {
    if (window.__cyberRecorderKeyInstalled) return;
    window.__cyberRecorderKeyInstalled = true;

    function getRecorderSrc() {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            const src = scripts[i].getAttribute('src');
            if (src && src.includes('cyber-recorder-key')) {
                return new URL(src, document.baseURI).href
                    .replace(/cyber-recorder-key\.js.*$/, 'cyber-recorder.js');
            }
        }
        return 'js/cyber-recorder.js';
    }

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'R') {
            if (window.CyberRecorder) {
                CyberRecorder.toggle();
            } else {
                const s = document.createElement('script');
                s.src = getRecorderSrc();
                s.onload = () => CyberRecorder.show();
                document.head.appendChild(s);
            }
        }
    });
})();
