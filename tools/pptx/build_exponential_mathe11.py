#!/usr/bin/env python3
"""Wachstum und Zerfall II: Exponentialfunktionen - Mathe 11 (BGY), KW 44, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-exponential.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 44",
        "Exponentielles Wachstum",
        "Zinseszins, Halbwertszeit und die Frage, warum das so schnell aus dem Ruder läuft")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **11 bis 15 von 75**", 0),
    ("Neu ist der Sprung: nicht mehr **plus derselbe Betrag**, sondern **mal derselbe Faktor**", 0),
    ("Drei Blöcke: **Wachstumsfaktor**, **Zerfall und Halbwertszeit**, **Modelle einordnen**", 0),
    ("Am Ende **20 Aufgaben** — Sparmodelle, Kernzerfall, Größenvergleiche", 0),
])

d.chapter(1, "Der Wachstumsfaktor", "Eine Zahl, die alles steuert")

d.bullets("Vom Prozentsatz zum Faktor", [
    ("Zunahme um $3\\,\\%$ heißt **mal $1{,}03$**", 0),
    ("Abnahme um $12\\,\\%$ heißt **mal $0{,}88$**, nicht mal $-0{,}12$", 0),
    ("Rückwärts: Faktor $1{,}25$ bedeutet **plus $25\\,\\%$**", 0),
    ("Regel: $q = 1 + \\dfrac{p}{100}$ — beim Zerfall wird $p$ negativ", 0),
])

d.bullets("Die Funktionsgleichung", [
    ("$f(x) = a \\cdot q^x$ — $a$ ist der **Startwert**, $q$ der **Faktor je Schritt**", 0),
    ("Bei $f(x) = 5 \\cdot 3^x$ ist $f(0) = 5$: der Graph schneidet die $y$-Achse bei $5$", 0),
    ("Denn $q^0 = 1$ — der Startwert steht immer an der $y$-Achse", 0),
    ("$f(x) = 100 \\cdot 2^x$ gibt $f(3) = 100 \\cdot 8 = 800$", 0),
])

d.bullets("Zinseszins ist genau das", [
    ("$1000$ € zu $3\\,\\%$: nach einem Jahr $1030$ €", 0),
    ("Nach zwei Jahren $1000 \\cdot 1{,}03^2 = 1060{,}90$ €", 0),
    ("Die $0{,}90$ € sind die **Zinsen auf die Zinsen** — daher der Name", 0),
    ("Nach $t$ Jahren also $K(t) = 1000 \\cdot 1{,}03^t$", 0),
])

d.bullets("Zinseszins gegen feste Zinsen", [
    ("$1000$ € mit $7\\,\\%$ Zinseszins oder $1000$ € mit festen $70$ € pro Jahr?", 0),
    ("Nach einem Jahr **gleich** — danach zieht der Zinseszins davon", 0),
    ("Nach $10$ Jahren: $1000 \\cdot 1{,}07^{10} \\approx 1967$ € gegen $1700$ €", 0),
    ("Faustregel: bei $q = 1{,}07$ verdoppelt sich das Guthaben in rund **$10$ Jahren**", 0),
])

d.merksatz("Linear heißt immer derselbe Betrag dazu. Exponentiell heißt immer derselbe Faktor mal.")

d.chapter(2, "Zerfall und Halbwertszeit", "Dasselbe Gesetz mit einem Faktor unter eins")

d.bullets("Wenn der Faktor kleiner als eins ist", [
    ("Ein Auto verliert jährlich $5\\,\\%$: $W(t) = W_0 \\cdot 0{,}95^t$", 0),
    ("Der Graph fällt, erreicht aber **nie** die Null", 0),
    ("$f(x) = \\left(\\dfrac{1}{2}\\right)^x$ fällt und nähert sich der $x$-Achse an", 0),
    ("Deshalb hat $f(x) = 2^x$ **keine** Nullstelle — eine Potenz wird nie null", 0),
])

d.bullets("Halbwertszeit: der Faktor ein Halb", [
    ("Nach **einer** Halbwertszeit ist die Hälfte da, nach zwei ein Viertel", 0),
    ("Nach **drei** Halbwertszeiten also $\\dfrac{1}{8}$ — nicht null", 0),
    ("$400$ mg mit Halbwertszeit $5$ Tage: nach $15$ Tagen sind es drei Halbierungen", 0),
    ("Also $400 : 8 = 50$ mg", 0),
])

d.bullets("Verdopplungszeit rückwärts gelesen", [
    ("Bakterien verdoppeln sich alle $20$ Minuten", 0),
    ("In $2$ Stunden sind das **sechs** Verdopplungen", 0),
    ("Faktor also $2^6 = 64$ — nicht $6 \\cdot 2$", 0),
    ("Ein Bestand, der sich alle $4$ Stunden verdreifacht: "
     "$N(t) = N_0 \\cdot 3^{t/4}$", 0),
])

d.merksatz("Ein exponentieller Zerfall erreicht die Null nie. Er kommt ihr nur beliebig nahe.")

d.chapter(3, "Einordnen", "Warum uns exponentielles Wachstum so oft überrascht")

d.bullets("Am Verhalten erkennen", [
    ("In der Wertetabelle bei **gleichen Schritten**: immer derselbe **Quotient**", 0),
    ("$2, 6, 18, 54$ — jedes Mal mal $3$, also exponentiell", 0),
    ("Gegenprobe linear: dort wäre immer dieselbe **Differenz**", 0),
    ("Aus $f(0) = 200$ und $f(1) = 240$ folgt $q = 1{,}2$, also $f(2) = 288$", 0),
])

d.two_cols("Auf lange Sicht", [
    ("Wächst schnell", 0),
    ("linear: $f(x) = 100x$", 1),
    ("quadratisch: $f(x) = x^2$", 1),
    ("beide bleiben zurück", 1),
], [
    ("Wächst schneller als alles", 0),
    ("exponentiell: $f(x) = 2^x$", 1),
    ("überholt jede Potenz", 1),
    ("nur eine Frage der Zeit", 1),
])

d.bullets("Die Sage vom Schachbrett", [
    ("Auf jedes Feld doppelt so viele Reiskörner wie auf das vorige", 0),
    ("Feld $11$ trägt schon $2^{10} = 1024$ Körner", 0),
    ("Auf dem letzten Feld wären es $2^{63}$ — mehr als alle Welternten", 0),
    ("Die Lehre: exponentielles Wachstum **wirkt lange harmlos** und ist es nie", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Faktoren, Zinseszins, Halbwertszeit", 0),
    ("Bei jeder Sachaufgabe zuerst fragen: **Startwert** und **Faktor je Schritt**", 0),
    ("Diese Denkweise brauchen wir bei Pandemien, Zinsen und Klimamodellen wieder", 0),
    ("**docalvers.de/mathetest11-exponential.html**", 0),
])

d.save()
