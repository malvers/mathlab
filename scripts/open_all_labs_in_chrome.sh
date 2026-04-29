#!/bin/bash
# ULTRA v6.7.0 - Lab Multi-Launcher
# Öffnet alle Labore in Google Chrome

BASE_DIR="/Users/malvers/IdeaProjects/forloop/HTML"

echo "Starte ULTRA v6.7.0 Suite in Google Chrome (inkl. Standalone-Labs)..."

# Findet alle HTML-Dateien rekursiv, schließt System-Dateien aus
find "$BASE_DIR" -name "*.html" ! -name "index.html" ! -name "impressum.html" ! -path "*/scripts/*" | while read f; do
    echo "Opening: $(basename "$f")"
    open -a "Google Chrome" "$f"
    sleep 0.2
done

echo "Alle Labore (inkl. Standalone) wurden in Chrome gestartet! 🚀"
