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
21. **Kommunikation: kurz halten.** Antworten knapp, gesprächsnah, ein Punkt nach dem anderen. Keine langen Wände mit vielen Unterpunkten, durch die Doc sich durchlesen muss. Fragen einzeln/nacheinander stellen, nicht als Sammel-Liste — auch wenn ich die ganze Liste schon im Kopf habe.
18. **NIEMALS ein Passwort, API-Key, Token oder sonstiges Secret im Quellcode** — auch nicht in Kommentaren, Default-Werten, Beispielen oder als „DEV-Bake-in". Dieses Repo ist public; git-history vergisst nichts. Verschlüsselte Blobs ohne das zugehörige Passwort/Key sind OK; Passwort + Ciphertext zusammen NICHT. Bei Verstoß: SOFORT laut warnen und Rotation vorschlagen, nicht nur Kommentar entfernen.
19. **Branch-Hygiene (gegen lautlos verlorene Arbeit):** Jede Agenten-Aufgabe startet auf einem **frischen** Branch von aktuellem `origin/main` (`git fetch` → `git switch -c task origin/main`) — **kein** langlebiger Sammel-Branch. Nach **vollem** Merge den Branch löschen (geparkte Branches ausgenommen). Datei-Umzüge als **`git mv` in einem eigenen Commit** (Inhalt erst im nächsten ändern), sonst frisst ein späterer Merge fremde Edits stumm (`modify/delete`). Beim Mergen auf `modify/delete`-Konflikte achten — nie blind die Löschung nehmen.
20. **Commit & Push automatisch auf einen BRANCH (Remote-/Agent-Sessions):** Nach **jeder** Änderung committen **und** auf den Arbeits-Branch pushen — **nie** auf `main`, **nie** Force-Push (flüchtige Container: nur Gepushtes überlebt das Recycling). Vorher **immer** Diff auf Secrets prüfen (Regel 18). `main` wird ausschließlich per PR/Merge durch Doc oder nach **ausdrücklicher** Einzel-Zustimmung („push to main") geändert. Knappe, sinnvolle Commit-Messages.
    - **Warum „committen ohne pushen" hier nicht geht (Doc 2026-06-21):** Der Stop-Hook (`~/.claude/stop-hook-git-check.sh`) ist ein **harter Gate** und blockiert das Turn-Ende, solange ein Commit unpushed ist. Außerdem werden Commits in der CCR-Umgebung **erst beim Push signiert** — lokal sind sie unsigniert (`%G? = N`) und GitHub zeigt sie als „Unverified". Folge: In Agent-/Web-Sessions wird auf dem **Arbeits-Branch immer committet *und* gepusht** (nicht „erst sammeln, später pushen"). „Nicht gleich pushen" ließe sich nur durch Anpassen/Lockern des Hooks oder serverseitiges Signieren ohne Push erreichen — beides außerhalb des Repos. `main` bleibt davon unberührt (nur auf ausdrückliches „push to main").

## Bevorzugte Farbpalette

- **λ (Orange)**: `rgb(245, 194, 66)`
- **Υ (Rot)**: `rgb(176, 36, 24)`
- **φ (Grün)**: `rgb(121, 158, 49)`
