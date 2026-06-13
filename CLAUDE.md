# Forloop Projekt — Farben

## General rules
A few ground rules:

1. I, Doc Alvers, always hard-reloads with Cmd–Shift–R

@Agent:

2. IMPORTANT: please never “clean up” without my explicit OK!
3. When I say “make a new tool”, please always take an existing one, copy it, strip out its content, and name the file exactly as I say.
4. Please do not modify files without my explicit go-ahead.
5. When I say “all gone” it means nothing should remain visible
6. When I say no change, your bugfix did not help.
7. Please always (!!!) use central layouts.
8. Always use Orbitron unless I ask for something else; LaTeX if applicable.
9. All filenames are lowercase (e.g. mandelbrot.html)
10. Never open Chrome without asking me first!
11. NEVER TRANSLATE: "Doc Alvers Mathe-Labor"
12. NA = nur antworten, SS = screen shot, KÄ = keine Änderung nach bugfix durch den Agnten
13. @Agent: Diese Datei bei größeren Aufgaben oder wenn der Kontext lang wird noch einmal lesen — damit die Regeln nicht „aus dem Fenster“ fallen.
14. Comments always in English!
15. Programming always in English!
16. We work always responsive!
17. Never say or write "ULTRA"!
18. **NIEMALS ein Passwort, API-Key, Token oder sonstiges Secret im Quellcode** — auch nicht in Kommentaren, Default-Werten, Beispielen oder als „DEV-Bake-in". Dieses Repo ist public; git-history vergisst nichts. Verschlüsselte Blobs ohne das zugehörige Passwort/Key sind OK; Passwort + Ciphertext zusammen NICHT. Bei Verstoß: SOFORT laut warnen und Rotation vorschlagen, nicht nur Kommentar entfernen.
19. **Branch-Hygiene (gegen lautlos verlorene Arbeit):** Jede Agenten-Aufgabe startet auf einem **frischen** Branch von aktuellem `origin/main` (`git fetch` → `git switch -c task origin/main`) — **kein** langlebiger Sammel-Branch. Nach **vollem** Merge den Branch löschen (geparkte Branches ausgenommen). Datei-Umzüge als **`git mv` in einem eigenen Commit** (Inhalt erst im nächsten ändern), sonst frisst ein späterer Merge fremde Edits stumm (`modify/delete`). Beim Mergen auf `modify/delete`-Konflikte achten — nie blind die Löschung nehmen.

## Bevorzugte Farbpalette

- **λ (Orange)**: `rgb(245, 194, 66)`
- **Υ (Rot)**: `rgb(176, 36, 24)`
- **φ (Grün)**: `rgb(121, 158, 49)`
