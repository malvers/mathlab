// js/photo-capture.js — standalone, app-agnostic photo CAPTURE mechanics, extracted from tracker-media.js
// (2026-06-22) so ANY Solita host (tracker, solita.html, future apps) can grab a photo the same way. This
// is PURE capture + downscale — it knows NOTHING about the tracker (no pins, no identify, no R2, no map).
// Native path uses the Capacitor @capacitor/camera plugin when present; otherwise a hidden <input type=file
// capture> in the browser. Returns a downscaled JPEG data URL (~1024 px), or null if the user cancelled.
//
//   PhotoCapture.isNative                                  -> bool (Capacitor native camera available)
//   PhotoCapture.capture(opts) -> Promise<dataUrl|null>
//       opts: { max=1024, quality=0.7, source='camera'|'gallery', input?:HTMLInputElement, onError?:fn }
//   PhotoCapture.downscaleSrcToJpeg(src,max,q) · .downscaleToJpeg(file,max,q) · .blobToDataUrl(blob)   (helpers)
(function (global) {
    const NativeCam = (global.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Camera) || null;
    const isNative = !!(NativeCam && global.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());

    // Scale an image source (data URL / object URL) longest-side down to `max` px → JPEG data URL.
    function downscaleSrcToJpeg(src, max, quality) {
        return new Promise((resolve, reject) => {
            const im = new Image();
            im.onerror = () => reject(new Error('Bild nicht dekodierbar'));
            im.onload = () => {
                let w = im.naturalWidth, h = im.naturalHeight;
                if (w >= h && w > max) { h = Math.round(h * max / w); w = max; }
                else if (h > w && h > max) { w = Math.round(w * max / h); h = max; }
                const cv = document.createElement('canvas');
                cv.width = w; cv.height = h;
                cv.getContext('2d').drawImage(im, 0, 0, w, h);
                resolve(cv.toDataURL('image/jpeg', quality));
            };
            im.src = src;
        });
    }
    // Same, but from a File (web file-input path).
    function downscaleToJpeg(file, max, quality) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = () => reject(new Error('Datei nicht lesbar'));
            fr.onload = () => downscaleSrcToJpeg(fr.result, max, quality).then(resolve, reject);
            fr.readAsDataURL(file);
        });
    }
    // Read a Blob into a base64 data-URL.
    function blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.onerror = () => reject(fr.error || new Error('FileReader-Fehler'));
            fr.readAsDataURL(blob);
        });
    }

    // A hidden file input the module owns, created on demand when the host doesn't supply its own.
    let ownInput = null;
    function ownFileInput(source) {
        if (!ownInput) {
            ownInput = document.createElement('input');
            ownInput.type = 'file';
            ownInput.accept = 'image/*';
            ownInput.style.display = 'none';
            document.body.appendChild(ownInput);
        }
        // 'gallery' → drop the capture hint so the OS shows the picker; else ask for the rear camera.
        if (source === 'gallery') ownInput.removeAttribute('capture');
        else ownInput.setAttribute('capture', 'environment');
        return ownInput;
    }

    // Capture a photo. Native: full-res via the camera (+ original saved to the gallery), returns a
    // downscaled copy. source:'gallery' picks from the Photos library instead. Web: a hidden file input
    // (host-supplied via opts.input, or the module's own). Resolves a JPEG data URL or null (cancelled).
    function capture(opts) {
        opts = opts || {};
        const max = opts.max || 1024;
        const quality = (typeof opts.quality === 'number') ? opts.quality : 0.7;
        const onError = opts.onError || function () { };
        if (isNative) {
            const gallery = opts.source === 'gallery';
            return NativeCam.getPhoto({
                resultType: 'dataUrl', source: gallery ? 'PHOTOS' : 'CAMERA',
                quality: 90, correctOrientation: true, saveToGallery: !gallery,
            })
                .then(p => (p && p.dataUrl) ? downscaleSrcToJpeg(p.dataUrl, max, quality) : null)
                .catch(() => null);   // user cancelled / denied → null, like the web path
        }
        const input = opts.input || ownFileInput(opts.source);
        return new Promise((resolve) => {
            const onChange = async () => {
                input.removeEventListener('change', onChange);
                const file = input.files && input.files[0];
                if (!file) return resolve(null);
                try { resolve(await downscaleToJpeg(file, max, quality)); }
                catch (e) { onError(e); resolve(null); }
            };
            input.value = '';
            input.addEventListener('change', onChange);
            input.click();
        });
    }

    global.PhotoCapture = { isNative, capture, downscaleSrcToJpeg, downscaleToJpeg, blobToDataUrl };
})(window);
