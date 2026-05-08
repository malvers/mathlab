import re
import json

def sync_briefings():
    # 1. Read i18n-descriptions.js
    with open('js/branding/i18n-descriptions.js', 'r') as f:
        content = f.read()
    
    # 2. Extract the German object part
    # Look for "de": { ... }
    # Using a more robust regex to capture the content inside the braces
    match = re.search(r'"de":\s*\{(.*?)\n\s*\},', content, re.DOTALL)
    if not match:
        print("Error: Could not find German section in i18n-descriptions.js")
        return
    
    de_content = match.group(1)
    
    # 3. Prepare the new briefings.js content
    header = """/**
 * ULTRA v6.7.0 - Briefing Data Registry
 * 
 * Diese Datei dient als Fallback für Umgebungen ohne Webserver (file://).
 * Sie spiegelt den Inhalt der .txt-Dateien aus resources/explanations/ wider.
 */
window.CyberBriefings = {"""

    footer = "\n};"
    
    # 4. Write to briefings.js
    # We just wrap the extracted content with the header and footer
    with open('js/branding/briefings.js', 'w') as f:
        f.write(header)
        f.write(de_content)
        f.write(footer)
    
    print("Successfully synchronized briefings.js from i18n-descriptions.js (DE).")

if __name__ == "__main__":
    sync_briefings()
