#!/usr/bin/env python3
"""
macOS-Screenshots: Bereich einmal wählen, dann wiederholt (Hotkey) denselben Ausschnitt.

Befehle (kurz)
  calibrate         — Vollbild-Overlay, Rechteck ziehen (Tk)
  calibrate-corners — Zwei Ecken, Enter: zuverlässig ohne Ziehen (nur macOS, empfohlen)
  shoot      — ein PNG mit gespeichertem Rechteck
  listen     — Hintergrund: globales Tastenkürzel → immer wieder shoot (pynput nötig)
  run        — wie früher: config.json (Fenster nach Delay o. fester region_mode)

Bordmittel: /usr/sbin/screencapture. ggf. Terminal: Datenschutz → Bildschirmaufnahme.

calibrate braucht Tk. Homebrew-Python hat oft kein tkinter – dann z. B.:
  /usr/bin/python3 capture.py calibrate
Auf dem Mac: Vollbild-Overlay per Geometrie+Alpha (nicht -fullscreen), sonst oft opak/unsichtbar.
Oder: capture.py set-region <x> <y> <w> <h>  (Punkte, wie screencapture -R)
Wenn Ziehen nicht geht:  capture.py calibrate-corners
"""
from __future__ import annotations

import argparse
import ctypes
import json
import subprocess
import sys
import time
from ctypes import c_void_p
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REGION_FILE = ROOT / "region.json"
CONFIG_FILE = ROOT / "config.json"


# ---------------------------------------------------------------------------
# Kleine Hilfs-APIs
# ---------------------------------------------------------------------------


def load_config_optional() -> dict:
    if not CONFIG_FILE.is_file():
        return {
            "output_dir": str(ROOT),
            "filename_prefix": "cyber-lab",
            "inset_points": {},
        }
    with CONFIG_FILE.open(encoding="utf-8") as f:
        return json.load(f)


def load_region() -> dict:
    if not REGION_FILE.is_file():
        print(
            f"Fehlend: {REGION_FILE} — zuerst: calibrate, calibrate-corners oder set-region.",
            file=sys.stderr,
        )
        sys.exit(1)
    with REGION_FILE.open(encoding="utf-8") as f:
        return json.load(f)


def apply_inset(
    x: int, y: int, w: int, h: int, ins: dict
) -> tuple[int, int, int, int]:
    t = int(ins.get("top", 0) or 0)
    l = int(ins.get("left", 0) or 0)
    b = int(ins.get("bottom", 0) or 0)
    r_ = int(ins.get("right", 0) or 0)
    x2, y2 = x + l, y + t
    w2, h2 = w - l - r_, h - t - b
    return x2, y2, max(1, w2), max(1, h2)


def screencapture_region(x: int, y: int, w: int, h: int, out: Path) -> None:
    if w < 1 or h < 1:
        raise ValueError("Breite/Höhe ungültig")
    cmd = ["/usr/sbin/screencapture", "-x", "-R", f"{x},{y},{w},{h}", str(out)]
    subprocess.run(cmd, check=True)


# CoreGraphics: Mausposition in Bildschirmkoordinaten (gleiches Koordinatensystem wie -R bei screencapture)
class _CGPoint(ctypes.Structure):
    _fields_ = [("x", ctypes.c_double), ("y", ctypes.c_double)]


_CG: ctypes.CDLL | None = None


def _coregraphics() -> ctypes.CDLL:
    global _CG
    if _CG is None:
        _CG = ctypes.CDLL(
            "/System/Library/Frameworks/CoreGraphics.framework/Versions/Current/CoreGraphics"
        )
        _CG.CGEventCreate.argtypes = [c_void_p]
        _CG.CGEventCreate.restype = c_void_p
        _CG.CFRelease.argtypes = [c_void_p]
        _CG.CGEventGetLocation.argtypes = [c_void_p]
        _CG.CGEventGetLocation.restype = _CGPoint
    return _CG


def get_mouse_screen_xy() -> tuple[int, int]:
    if sys.platform != "darwin":
        raise RuntimeError("nur macOS")
    lib = _coregraphics()
    e = lib.CGEventCreate(None)
    if not e:
        raise RuntimeError("CGEventCreate fehlgeschlagen")
    try:
        p = lib.CGEventGetLocation(e)
    finally:
        lib.CFRelease(e)
    return (int(round(p.x)), int(round(p.y)))


def frontmost_window_rect() -> tuple[int, int, int, int]:
    script = r"""
    tell application "System Events"
      set f to name of first process whose frontmost is true
      tell process f
        set P to position of front window
        set S to size of front window
      end tell
      return (item 1 of P as text) & " " & (item 2 of P as text) & " " & (item 1 of S as text) & " " & (item 2 of S as text)
    end tell
    """
    r = subprocess.run(
        ["/usr/bin/osascript", "-e", script],
        check=True,
        capture_output=True,
        text=True,
    )
    parts = r.stdout.strip().split()
    if len(parts) != 4:
        raise RuntimeError("Fenster-Geometrie unleserlich")
    return tuple(int(float(p)) for p in parts)  # type: ignore[return-value]


def do_shoot() -> Path:
    """Eine Datei, Pfad zurück — für Hotkey-Callback."""
    data = load_region()
    x = int(data["x"])
    y = int(data["y"])
    w = int(data["width"])
    h = int(data["height"])
    cfg = load_config_optional()
    ins = cfg.get("inset_points", {}) or {}
    out_dir = Path(str(cfg.get("output_dir", str(ROOT)))).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    prefix = str(cfg.get("filename_prefix", "cyber-lab"))
    x, y, w, h = apply_inset(x, y, w, h, ins)
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    out = out_dir / f"{prefix}-{ts}.png"
    screencapture_region(x, y, w, h, out)
    return out


# ---------------------------------------------------------------------------
# calibrate
# ---------------------------------------------------------------------------


def run_calibrate() -> None:
    try:
        import tkinter as tk
    except ImportError as e:
        print(
            "tkinter fehlt: Homebrew-Python hat oft kein _tkinter — "
            "z.B.  brew install python-tk@…  passend zur Python-Version, oder:\n  "
            f"/usr/bin/python3 {Path(__file__).name} calibrate",
            file=sys.stderr,
        )
        raise e

    # Vollbild: Unter macOS ignoriert Tk oft -alpha bei -fullscreen → stattdessen Geometrie + randlos.
    root = tk.Tk()
    root.title("Ausschnitt wählen — Escape = Abbruch")
    root.update_idletasks()
    sw, sh = (root.winfo_screenwidth(), root.winfo_screenheight())
    root.geometry(f"{sw}x{sh}+0+0")
    try:
        root.attributes("-topmost", True)
        # 0.35..0.55: sichtbar abgeblendet; bei 1.0 kein Durchblick
        root.attributes("-alpha", 0.48)
    except tk.TclError:
        pass
    try:
        root.overrideredirect(True)
    except tk.TclError:
        pass
    root.configure(bg="#010014")
    try:
        root.config(cursor="crosshair")
    except tk.TclError:
        pass

    state: dict = {"x0": None, "y0": None, "rect": None, "cur": None}

    hint = tk.Frame(root, bg="#0a0c18", height=44)
    hint.pack(side=tk.TOP, fill=tk.X)
    hint.pack_propagate(False)
    tk.Label(
        hint,
        text="Ausschnitt mit der Maus aufziehen  ·  Loslassen = bestätigen  ·  Esc = Abbruch",
        bg="#0a0c18",
        fg="#6ae0ff",
        font=("Helvetica", 15),
    ).pack(expand=True)

    canvas = tk.Canvas(root, highlightthickness=0, bg="#0a0d22", cursor="crosshair")
    canvas.pack(fill=tk.BOTH, expand=True)

    def to_canvas(sx: int, sy: int) -> tuple[int, int]:
        return sx - int(canvas.winfo_rootx()), sy - int(canvas.winfo_rooty())

    def cancel(_e=None):
        try:
            root.grab_release()
        except tk.TclError:
            pass
        root.destroy()
        print("Abgebrochen.", file=sys.stderr)
        sys.exit(1)

    def on_press(e):
        sx, sy = int(e.x_root), int(e.y_root)
        state["x0"] = sx
        state["y0"] = sy
        if state.get("cur"):
            canvas.delete(state["cur"])
        cx, cy = to_canvas(sx, sy)
        state["cur"] = canvas.create_rectangle(
            cx, cy, cx, cy, outline="#00d2ff", width=2
        )

    def on_move(e):
        if state["x0"] is None or state.get("cur") is None:
            return
        sx, sy = int(e.x_root), int(e.y_root)
        x0, y0 = to_canvas(state["x0"], state["y0"])
        x1, y1 = to_canvas(sx, sy)
        canvas.coords(state["cur"], x0, y0, x1, y1)

    def on_release(e):
        if state["x0"] is None:
            return
        x0, y0 = state["x0"], state["y0"]
        x1, y1 = int(e.x_root), int(e.y_root)
        l = min(x0, x1)
        t_ = min(y0, y1)
        w = abs(x1 - x0)
        h_ = abs(y1 - y0)
        if w < 4 or h_ < 4:
            print("Bereich zu klein, nochmal ziehen.", file=sys.stderr)
            if state.get("cur"):
                canvas.delete(state["cur"])
            state["cur"] = None
            state["x0"] = state["y0"] = None
            return
        state["rect"] = (l, t_, w, h_)
        try:
            root.grab_release()
        except tk.TclError:
            pass
        root.destroy()

    # bind_all: unter macOS/Vollbild gehen reine Canvas-Binds oft verloren; ein Bind pro Geste reicht.
    root.bind_all("<Button-1>", on_press)
    root.bind_all("<B1-Motion>", on_move)
    root.bind_all("<ButtonRelease-1>", on_release)
    root.bind_all("<Escape>", cancel)
    root.protocol("WM_DELETE_WINDOW", cancel)
    root.update_idletasks()
    try:
        root.grab_set()
    except tk.TclError:
        pass
    root.lift()
    root.focus_force()
    try:
        canvas.focus_set()
    except tk.TclError:
        pass
    root.mainloop()

    if not state.get("rect"):
        print("Kein Rechteck — abgebrochen.", file=sys.stderr)
        sys.exit(1)
    l, t_, w, h_ = state["rect"]
    # pynput: F-Tasten sind auf dem Mac parsing-anfällig; Standard = seltene Mod-Kombi.
    payload = {
        "x": l,
        "y": t_,
        "width": w,
        "height": h_,
        "version": 1,
        "hotkey_pynput": "<ctrl>+<alt>+c",
    }
    with REGION_FILE.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"Gespeichert: {REGION_FILE}")
    print("Weiter:  python3 capture.py shoot   oder   python3 capture.py listen")
    print(f'Hotkey-Default (pynput): {payload["hotkey_pynput"]} — in region.json ändern, dann listen neu starten')


def run_set_region(x: int, y: int, w: int, h: int) -> None:
    if w < 1 or h < 1:
        print("Breite und Höhe müssen ≥ 1 sein.", file=sys.stderr)
        sys.exit(1)
    payload = {
        "x": x,
        "y": y,
        "width": w,
        "height": h,
        "version": 1,
        "hotkey_pynput": "<ctrl>+<alt>+c",
    }
    with REGION_FILE.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    print(f"Gespeichert: {REGION_FILE}")


def run_calibrate_corners() -> None:
    """
    Zwei Ecken, jeweils Enter: Mausposition per CoreGraphics (kein Tk, kein Ziehen).
    """
    if sys.platform != "darwin":
        print("calibrate-corners: nur macOS.", file=sys.stderr)
        sys.exit(1)
    print(
        "Ausschnitt ohne Ziehen: leg die Maus nacheinander auf zwei Ecken (diagonal) und drücke Enter.\n"
    )
    try:
        print("  1) Eine Ecke Ihres Rechtecks, dann [Enter] …", end=" ", flush=True)
        input()
        x1, y1 = get_mouse_screen_xy()
        print(f"     → {x1}, {y1}")
        print("  2) Die andere Ecke, dann [Enter] …", end=" ", flush=True)
        input()
        x2, y2 = get_mouse_screen_xy()
        print(f"     → {x2}, {y2}\n")
    except (KeyboardInterrupt, EOFError):
        print("Abgebrochen.", file=sys.stderr)
        sys.exit(1)
    l = int(round(min(x1, x2)))
    t_ = int(round(min(y1, y2)))
    w = int(round(abs(x2 - x1)))
    h_ = int(round(abs(y2 - y1)))
    if w < 4 or h_ < 4:
        print("Bereich zu klein, bitte erneut: capture.py calibrate-corners", file=sys.stderr)
        sys.exit(1)
    run_set_region(l, t_, w, h_)
    print("Weiter:  python3 capture.py shoot   oder   python3 capture.py listen")
    print('Hotkey-Default: <ctrl>+<alt>+c  (in region.json: "hotkey_pynput")')


# ---------------------------------------------------------------------------
# listen (globaler Hotkey)
# ---------------------------------------------------------------------------


def run_listen() -> None:
    try:
        from pynput import keyboard
    except ImportError:
        print(
            "Optional: pip install -r requirements.txt  (Hintergrund-Hotkey)\n"
            "Alternativ: macOS-Kurzbefehle + Shell → capture.py shoot — siehe shortcuts-hinweis.txt",
            file=sys.stderr,
        )
        sys.exit(1)
    if not REGION_FILE.is_file():
        print(
            f"Fehlend: {REGION_FILE} — zuerst: calibrate, calibrate-corners oder set-region.",
            file=sys.stderr,
        )
        sys.exit(1)
    with REGION_FILE.open(encoding="utf-8") as f:
        rj = json.load(f)
    combo = rj.get("hotkey_pynput", "<ctrl>+<alt>+c")
    print(f"Hotkey: {combo}  → ein Shot (Ausschnitt aus region.json)")
    print("Beenden: Ctrl+C\n")

    def fire():
        try:
            p = do_shoot()
            print(f"  {p.resolve()}", flush=True)
        except Exception as ex:
            print(f"  Fehler: {ex}", file=sys.stderr, flush=True)

    hmap = {combo: fire}
    # pynput: dict mit exakt einer Taste oder Kombi
    with keyboard.GlobalHotKeys(hmap) as hk:  # type: ignore[operator]
        hk.join()


# ---------------------------------------------------------------------------
# run (altes Verhalten, config.json)
# ---------------------------------------------------------------------------


def run_configured() -> None:
    if not CONFIG_FILE.is_file():
        print(f"Fehlend: {CONFIG_FILE} — config.example.json kopieren.", file=sys.stderr)
        sys.exit(1)
    with CONFIG_FILE.open(encoding="utf-8") as f:
        cfg = json.load(f)
    mode = str(cfg.get("mode", "front_window_after_delay"))
    out_dir = Path(str(cfg.get("output_dir", "."))).expanduser()
    out_dir.mkdir(parents=True, exist_ok=True)
    prefix = str(cfg.get("filename_prefix", "cyber-lab"))
    ins = cfg.get("inset_points", {}) or {}
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    out = out_dir / f"{prefix}-{ts}.png"
    if mode == "fixed_region":
        r = cfg.get("region_mode", {})
        x, y = int(r.get("x", 0)), int(r.get("y", 0))
        w, h = int(r.get("width", 0)), int(r.get("height", 0))
        x, y, w, h = apply_inset(x, y, w, h, ins)
        screencapture_region(x, y, w, h, out)
    elif mode == "front_window_after_delay":
        d = float(cfg.get("delay_seconds", 2))
        print(
            f"Warte {d}s — Ziel: Lab-Browser-Fenster in den Vordergrund stellen…",
            flush=True,
        )
        time.sleep(d)
        x, y, w, h = frontmost_window_rect()
        x, y, w, h = apply_inset(x, y, w, h, ins)
        screencapture_region(x, y, w, h, out)
    else:
        print("Unbekannter mode in config.json.", file=sys.stderr)
        sys.exit(1)
    print(f"Gespeichert: {out.resolve()}")


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Cyber-Capture: Bereich, dann wiederholte Shots (macOS)."
    )
    sp = ap.add_subparsers(dest="command", required=True)
    sp.add_parser(
        "calibrate",
        help="Ausschnitt per Overlay (Tk) — ziehen; oft zickig auf dem Mac",
    )
    sp.add_parser(
        "calibrate-corners",
        help="Ausschnitt per zwei Ecken + Enter (ohne Ziehen, empfohlen)",
    )
    p_set = sp.add_parser(
        "set-region",
        help="region.json per Zahlen (Punkte), ohne Tk — z. B. aus Digital Color Meter",
    )
    p_set.add_argument("x", type=int, help="x (Pixel)")
    p_set.add_argument("y", type=int, help="y (Pixel)")
    p_set.add_argument("w", type=int, help="Breite")
    p_set.add_argument("h", type=int, help="Höhe")
    sp.add_parser("shoot", help="Einen Screenshot (region.json)")
    sp.add_parser("listen", help="Hintergrund-Hotkey (pynput) → viele Shots")
    sp.add_parser("run", help="Vorheriges Verhalten: config.json (Fenster/Region)")

    args = ap.parse_args()
    if args.command == "calibrate":
        run_calibrate()
    elif args.command == "calibrate-corners":
        run_calibrate_corners()
    elif args.command == "set-region":
        run_set_region(args.x, args.y, args.w, args.h)
    elif args.command == "shoot":
        p = do_shoot()
        print(f"Gespeichert: {p.resolve()}")
    elif args.command == "listen":
        run_listen()
    else:
        run_configured()


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as e:
        print(
            "screencapture/osascript fehlgeschlagen — Berechtigungen / Retina-Prüfung.",
            file=sys.stderr,
        )
        sys.exit(e.returncode or 1)
