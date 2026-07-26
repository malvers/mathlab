// Runs the VSB pipeline off the UI thread.
// preview: stick viewer data + tree mask + wood height preview
// full: additionally the deliverable files (DST, both STLs, print PNG)
'use strict';
importScripts('vsb-pipeline.js');

onmessage = async e => {
    const { id, svg, full } = e.data;
    try {
        const M = VSB.parseMaster(svg);
        const tm0 = VSB.treeMask592(M);
        const stick = VSB.makeStick(svg, M, tm0);
        const h16 = VSB.makeHeightfield(M);
        // 1040px preview field, same sampling as the old viewer data
        const NW = 2000, NV = 1040;
        const hv = new Uint8Array(NV * NV);
        for (let i = 0; i < NV; i++) {
            const si = Math.trunc(i * (NW - 1) / (NV - 1));
            for (let j = 0; j < NV; j++) {
                const sj = Math.trunc(j * (NW - 1) / (NV - 1));
                hv[i * NV + j] = Math.trunc(h16[si * NW + sj] / 65535 * 255);
            }
        }
        const out = { id, ok: true, viewer: stick.viewer, stitches: stick.stitches, tm: stick.tm, hv };
        const transfer = [stick.tm.buffer, hv.buffer];
        if (full) {
            const stls = VSB.buildSTLs(h16);
            const png = await VSB.makePrintPNG(M);
            out.files = { dst: stick.dst, stlRaised: stls.raised.bytes, stlEngraved: stls.engraved.bytes, png };
            transfer.push(stick.dst.buffer, stls.raised.bytes.buffer, stls.engraved.bytes.buffer, png.buffer);
        }
        postMessage(out, transfer);
    } catch (err) {
        postMessage({ id, ok: false, error: String((err && err.message) || err) });
    }
};
