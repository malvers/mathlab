# Clockwise Flip — World Clock

## Status

The world clock currently runs **counter-clockwise (CCW)**: hour 12 is at the top, 13 goes left, 11 goes right. This matches the convention "North Pole view → longitudes increase CCW", but contradicts the standard wall-clock convention.

A toggle to make the numbers go **clockwise (CW)** would require flipping every angle source in a coordinated way.

## What needs to flip

Three coupled angle sources, all relative to `-π/2` (12 o'clock at top):

| What | File:Line | Current (CCW) | Flipped (CW) |
|---|---|---|---|
| Hour ring (1–24 labels) | [worldclock.html:1303](worldclock.html#L1303) | `(12 - i) * 2π/24 - π/2` | `(i - 12) * 2π/24 - π/2` |
| City markers (arrows) | [worldclock.html:1210](worldclock.html#L1210) | `(-city.lon) * π/180 - π/2` | `(city.lon) * π/180 - π/2` |
| City label / hover angle | [worldclock.html:856](worldclock.html#L856), [:950](worldclock.html#L950), [:1518](worldclock.html#L1518) | `-city.lon + mapRotation - 90` | `city.lon + mapRotation - 90` |

All three must flip together — if hour-ring flips but city markers don't, cities no longer stand over the correct hour.

## The map problem

The background world map [resources/worldmap_polar.png](../resources/worldmap_polar.png) is rendered for the CCW convention (continents drawn so Europe sits where it is now). For a clockwise clock, that map is wrong:

- **Option A** — replace the image with a horizontally mirrored version (clean, but a second asset).
- **Option B** — apply `ctx.scale(-1, 1)` around the map draw call. Works for the image, but any text drawn afterwards inside the same transform also flips — needs surgical save/restore.
- **Option C** — generate the polar map at runtime from the geo data and pick direction at draw time. Largest refactor, cleanest end state.

## Suggested approach

Single constant or URL flag (`?dir=cw`), gate the three angle formulas on it, and start with **Option B** (mirror the image inside a save/restore) so no new asset is needed. If text bleeds into the mirrored region, fall back to Option A.

```js
const CLOCKWISE = new URLSearchParams(location.search).get('dir') === 'cw';
const dirSign = CLOCKWISE ? 1 : -1;
// hour ring:
const angle = dirSign * (i - 12) * (Math.PI * 2 / 24) - Math.PI / 2;
// city marker:
const cityAngle = dirSign * city.lon * Math.PI / 180 - Math.PI / 2;
// city label/hover:
const cityAngle = dirSign * city.lon + mapRotation - 90;
```

## Risk

Low if all three formulas flip in lockstep — verify by checking that Dresden (lon 15) ends up under the "13" or "12" slot in CW mode, depending on DST.
