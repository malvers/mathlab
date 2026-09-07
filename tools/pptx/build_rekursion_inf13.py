#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 8 / KW 41: Rekursion (LB 3, Ustd. 17-18/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("rekursion-inf13.pptx")
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Rekursion",
        "Eine Funktion, die sich selbst aufruft — und wo das an Grenzen stößt")

d.chapter(1, "Die Idee", "Zwei Teile, mehr braucht es nicht")

d.bullets("Jede Rekursion besteht aus zwei Teilen", [
    ("**Basisfall**: der Fall, der ohne weiteren Aufruf beantwortet wird", 0),
    ("**Rekursionsschritt**: das Problem wird auf ein **kleineres** zurückgeführt", 0),
    ("Fehlt der Basisfall, läuft es bis zum Absturz", 0),
    ("Wird das Problem nicht kleiner, ebenso", 0),
    ("Die Prüffrage lautet immer: **Kommt jeder Aufruf beim Basisfall an?**", 0),
])

code("Fakultät rekursiv und iterativ", [
    "def fak_rek(n):",
    "    if n <= 1:               # Basisfall",
    "        return 1",
    "    return n * fak_rek(n - 1)   # Rekursionsschritt",
    "",
    "def fak_it(n):",
    "    e = 1",
    "    for i in range(2, n + 1):",
    "        e = e * i",
    "    return e",
], size=13)

d.table_top("fak_rek(4) Schritt für Schritt", [
    ["Aufruf", "wird zu", "wartet auf"],
    ["fak_rek(4)", "4 * fak_rek(3)", "fak_rek(3)"],
    ["fak_rek(3)", "3 * fak_rek(2)", "fak_rek(2)"],
    ["fak_rek(2)", "2 * fak_rek(1)", "fak_rek(1)"],
    ["fak_rek(1)", "1", "nichts — Basisfall"],
], [200, 300, 316], [
    ("Jetzt wird **rückwärts** gerechnet: 1, dann 2, dann 6, dann **24**", 0),
    ("Jeder wartende Aufruf liegt so lange auf dem **Stack**", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 2): TINT_GREEN})

d.chapter(2, "Fibonacci", "Wo Rekursion teuer wird")

code("Fibonacci naiv rekursiv", [
    "def fib(n):",
    "    if n <= 1:",
    "        return n",
    "    return fib(n - 1) + fib(n - 2)",
    "",
    "# fib(5) ruft fib(3) zweimal auf,",
    "# fib(2) dreimal, fib(1) fuenfmal.",
], size=14)

d.table_top("Anzahl der Aufrufe", [
    ["n", "Aufrufe von fib", "Dauer"],
    ["10", "177", "unmerklich"],
    ["20", "21 891", "unmerklich"],
    ["30", "2 692 537", "spürbar"],
    ["40", "331 160 281", "Minuten"],
], [130, 350, 336], [
    ("Der Aufwand wächst **exponentiell** — jede Erhöhung um 1 kostet etwa das 1,6-fache", 0),
    ("Iterativ braucht dieselbe Rechnung **n** Schritte statt Millionen", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 1): TINT_RED, (4, 2): TINT_RED})

code("Fibonacci iterativ — und mit Zwischenspeicher", [
    "def fib_it(n):",
    "    a, b = 0, 1",
    "    for _ in range(n):",
    "        a, b = b, a + b",
    "    return a",
    "",
    "from functools import lru_cache",
    "",
    "@lru_cache(maxsize=None)      # merkt sich berechnete Werte",
    "def fib_cache(n):",
    "    return n if n <= 1 else fib_cache(n-1) + fib_cache(n-2)",
], size=12.5)

d.chapter(3, "Grenzen", "Stack, Laufzeit und die Wahl")

d.table_top("Rekursion oder Iteration?", [
    ["Kriterium", "Rekursion", "Iteration"],
    ["Lesbarkeit", "nah an der mathematischen Definition", "oft umständlicher"],
    ["Speicher", "jeder Aufruf belegt Stack", "konstant"],
    ["Gefahr", "Stapelüberlauf bei großer Tiefe", "Endlosschleife"],
    ["typisch für", "Bäume, Teile-und-herrsche", "Durchlaufen von Listen"],
], [180, 350, 286], [
    ("Python bricht standardmäßig bei etwa **1000** Aufrufen Tiefe ab — **RecursionError**", 0),
    ("Faustregel: **rekursiv, wenn das Problem selbst rekursiv ist** — sonst iterativ", 0),
], font_size=11, bold_cols=(0,), marks={(3, 1): TINT_ORANGE})

d.merksatz("Jede Rekursion braucht einen Basisfall und ein kleiner werdendes "
           "Problem. Fehlt eines von beiden, endet sie im Stapelüberlauf.")

d.bullets("Fun Facts: Rekursion", [
    ("**Türme von Hanoi** mit n Scheiben brauchen **2ⁿ − 1** Züge — bei 64 Scheiben länger als das Universum alt ist", 0),
    ("Der **Stack** heißt so, weil die wartenden Aufrufe wie ein Stapel liegen: zuletzt hinein, zuerst heraus", 0),
    ("Manche Sprachen optimieren **endständige Rekursion** zu einer Schleife — Python nicht", 0),
    ("**Quicksort** und **Mergesort** sind rekursiv und trotzdem schnell: sie halbieren", 0),
    ("Das Wörterbuch scherzt: **„Rekursion: siehe Rekursion“**", 0),
])

d.bullets("Eure Aufgabe", [
    ("Schreibt **Fakultät** und **Fibonacci** rekursiv und iterativ", 0),
    ("Baut einen **Aufrufzähler** in fib ein und messt für n = 10, 20, 25", 0),
    ("Vergleicht die Zahlen mit der Tabelle aus Kapitel 2", 0),
    ("Findet heraus, ab welchem n Python mit **RecursionError** abbricht", 0),
    ("Löst die **Türme von Hanoi** rekursiv für drei und vier Scheiben", 0),
])

d.save()
