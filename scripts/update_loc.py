import os

def calculate_loc():
    total_lines = 0
    # Verzeichnisse, die ignoriert werden sollen
    ignore_dirs = {'.venv', '.git', 'node_modules', '__pycache__'}
    # Dateiendungen, die gezählt werden sollen
    valid_extensions = {'.html', '.js', '.css', '.py', '.ts', '.java', '.json', '.md'}

    for root, dirs, files in os.walk('.'):
        # Ignorierte Verzeichnisse überspringen
        dirs[:] = [d for d in dirs if not any(ign in os.path.join(root, d) for ign in ignore_dirs)]
        
        for file in files:
            if any(file.endswith(ext) for ext in valid_extensions):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        total_lines += sum(1 for _ in f)
                except Exception:
                    pass

    return total_lines

if __name__ == '__main__':
    loc = calculate_loc()
    # Formatierung als "34.123"
    formatted_loc = f"{loc:,}".replace(',', '.')
    
    output_path = os.path.join('HTML', 'resources', 'loc.js')
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f'window.__CURRENT_LOC = "{formatted_loc}";\n')
        print(f"LOC erfolgreich berechnet: {formatted_loc}")
        print(f"Datei aktualisiert: {output_path}")
    except Exception as e:
        print(f"Fehler beim Schreiben der Datei: {e}")
