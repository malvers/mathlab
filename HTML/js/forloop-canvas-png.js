/**
 * Canvas → PNG: download or File System Access API (folder).
 * Usage: labs with preserveDrawingBuffer or after an explicit redraw.
 */
(function (global) {
    'use strict';

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {string} filename e.g. mandelbrot-zoom-step-0001.png
     * @param {FileSystemDirectoryHandle|null} dirHandle
     * @returns {Promise<boolean>}
     */
    async function saveCanvasAsPng(canvas, filename, dirHandle) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) return false;

        if (dirHandle && typeof dirHandle.getFileHandle === 'function') {
            try {
                const fh = await dirHandle.getFileHandle(filename, { create: true });
                const writable = await fh.createWritable();
                await writable.write(blob);
                await writable.close();
                return true;
            } catch (e) {
                console.warn('Canvas PNG (Ordner):', e);
            }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return true;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {{ stem?: string, initialSeq?: number }} [options]
     */
    function createSequentialCanvasPngSaver(canvas, options) {
        const opts = options || {};
        const stem = opts.stem || 'capture';
        let seq = opts.initialSeq != null ? opts.initialSeq : 0;
        /** @type {FileSystemDirectoryHandle|null} */
        let dirHandle = null;

        return {
            get directoryHandle() {
                return dirHandle;
            },
            set directoryHandle(h) {
                dirHandle = h;
            },
            get sequence() {
                return seq;
            },
            /**
             * @param {Pick<FilePickerOptions, 'startIn'|'id'>} [pickerOpts] Chromium: optional overrides e.g. for startIn
             */
            async pickWritableFolder(pickerOpts) {
                if (typeof global.showDirectoryPicker !== 'function') return null;
                const extra = pickerOpts || {};
                try {
                    dirHandle = await global.showDirectoryPicker(
                        Object.assign({ mode: 'write', startIn: 'desktop' }, extra)
                    );
                } catch (e) {
                    if (e && e.name === 'AbortError') throw e;
                    dirHandle = await global.showDirectoryPicker(Object.assign({ mode: 'write' }, extra));
                }
                return dirHandle;
            },
            /**
             * @param {string} [customStem] overrides stem for this capture only
             */
            async captureNext(customStem) {
                seq += 1;
                const base = customStem || stem;
                const fname = `${base}-${String(seq).padStart(4, '0')}.png`;
                return saveCanvasAsPng(canvas, fname, dirHandle);
            },
        };
    }

    global.ForloopCanvasPng = {
        saveCanvasAsPng,
        createSequentialCanvasPngSaver,
    };
})(typeof window !== 'undefined' ? window : globalThis);
