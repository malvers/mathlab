import tkinter as tk
import re
import os
import subprocess
import tempfile

# Pfade absolut
BASE_DIR = "/Users/malvers/IdeaProjects/forloop/HTML"
READ_PATH = os.path.join(BASE_DIR, 'js', 'branding', 'i18n-descriptions.js')
WRITE_PATH = READ_PATH
SYNC_SCRIPT = os.path.join(BASE_DIR, 'scratch', 'fix_briefings.py')

class BriefingsEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("BRIEFING MANAGER (FINAL STABILITY)")
        
        # Fenstergröße und Zentrierung
        width = 1100
        height = 950
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x = (screen_width // 2) - (width // 2)
        y = (screen_height // 2) - (height // 2)
        self.root.geometry(f"{width}x{height}+{x}+{y}")
        
        self.root.attributes("-topmost", True)
        self.root.configure(bg="#f0f0f0")
        
        # DER TRICK: Ein Text-Widget als Container (extrem stabil am Mac)
        self.container = tk.Text(self.root, bg="#f0f0f0", borderwidth=0, highlightthickness=0, cursor="arrow")
        self.scrollbar = tk.Scrollbar(self.root, orient="vertical", command=self.container.yview)
        self.container.configure(yscrollcommand=self.scrollbar.set)
        
        self.scrollbar.pack(side="right", fill="y")
        self.container.pack(side="left", fill="both", expand=True)

        self.is_editing = False
        self.load_keys()
        
        self.root.lift()
        self.root.focus_force()

    def load_keys(self):
        try:
            with open(READ_PATH, 'r', encoding='utf-8') as f:
                content = f.read()
            keys = sorted(list(set(re.findall(r'["\'](\w+)["\']\s*:\s*`', content))))
            
            # Wir packen 3 Buttons in eine Reihe (Frame) und diesen Frame in das Text-Widget
            for i in range(0, len(keys), 3):
                row_keys = keys[i:i+3]
                row_frame = tk.Frame(self.container, bg="#f0f0f0")
                
                for key in row_keys:
                    # Breite fest auf 30 Zeichen | pady=10 für angenehme Höhe
                    btn = tk.Button(row_frame, text=key.upper(), 
                                   command=lambda k=key: self.trigger_edit(k),
                                   font=("Arial", 10, "bold"), width=30, height=3,
                                   bg="#eee", relief="raised", borderwidth=1)
                    btn.pack(side="left", padx=2, pady=2)
                
                # Frame in das Text-Widget einfügen
                self.container.window_create(tk.END, window=row_frame)
                self.container.insert(tk.END, "\n") # Zeilenumbruch im Text-Widget
            
            self.container.config(state="disabled") # Text-Eingabe verhindern
                
        except Exception as e:
            print(f"Fehler: {e}")

    def trigger_edit(self, key):
        if self.is_editing: return
        self.is_editing = True
        self.root.withdraw()
        self.root.after(100, lambda: self.open_in_textedit(key))

    def open_in_textedit(self, key):
        try:
            with open(READ_PATH, 'r', encoding='utf-8') as f:
                content = f.read()
            pattern = r'["\']' + key + r'["\']\s*:\s*`(.*?)`,'
            match = re.search(pattern, content, re.DOTALL)
            if not match: 
                self._restore_ui()
                return
            
            original_text = match.group(1).strip().replace('\\`', '`').replace('\\$', '$')
            with tempfile.NamedTemporaryFile(suffix=".txt", delete=False, mode='w', encoding='utf-8') as tf:
                tf.write(original_text)
                temp_path = tf.name

            subprocess.run(["open", "-n", "-W", "-t", temp_path])
            
            with open(temp_path, 'r', encoding='utf-8') as f:
                updated_text = f.read().strip()
            
            if updated_text != original_text:
                self._save_to_disk(key, updated_text, content)
            
            os.remove(temp_path)
        except Exception as e:
            print(f"Fehler: {e}")
        
        self._restore_ui()

    def _restore_ui(self):
        self.is_editing = False
        self.root.deiconify()
        self.root.attributes("-topmost", True)
        self.root.lift()
        self.root.focus_force()

    def _save_to_disk(self, key, text, original_content):
        clean_text = text.replace('`', '\\`').replace('$', '\\$')
        pattern = r'["\']' + key + r'["\']\s*:\s*`(.*?)`,'
        match = re.search(pattern, original_content, re.DOTALL)
        if match:
            start, end = match.span(1)
            new_content = original_content[:start] + clean_text + original_content[end:]
            with open(WRITE_PATH, 'w', encoding='utf-8') as f:
                f.write(new_content)
            subprocess.run(["python3", SYNC_SCRIPT], check=True)

if __name__ == "__main__":
    root = tk.Tk()
    app = BriefingsEditor(root)
    root.mainloop()
