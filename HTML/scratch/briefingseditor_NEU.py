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
        self.root.title("BRIEFING MANAGER (STRICT CLICK)")
        
        # Fenstergröße und Zentrierung
        width = 1150
        height = 950
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x = (screen_width // 2) - (width // 2)
        y = (screen_height // 2) - (height // 2)
        self.root.geometry(f"{width}x{height}+{x}+{y}")
        
        self.root.attributes("-topmost", True)
        self.root.configure(bg="#f0f0f0")
        
        # Scrollable Area
        self.canvas = tk.Canvas(self.root, bg="#f0f0f0", borderwidth=0, highlightthickness=0)
        self.scrollbar = tk.Scrollbar(self.root, orient="vertical", command=self.canvas.yview)
        self.scroll_frame = tk.Frame(self.canvas, bg="#f0f0f0")

        self.scroll_frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas_window = self.canvas.create_window((0, 0), window=self.scroll_frame, anchor="nw")
        self.canvas.bind("<Configure>", self._on_canvas_configure)
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        self.canvas.pack(side="left", fill="both", expand=True, padx=2, pady=2)
        self.scrollbar.pack(side="right", fill="y")

        self.is_editing = False
        self.load_keys()
        
        self.root.lift()
        self.root.focus_force()

    def _on_canvas_configure(self, event):
        self.canvas.itemconfig(self.canvas_window, width=event.width)

    def load_keys(self):
        try:
            with open(READ_PATH, 'r', encoding='utf-8') as f:
                content = f.read()
            # Sehr robuster Regex
            keys = sorted(list(set(re.findall(r'["\'](\w+)["\']\s*:\s*`', content))))
            
            cols = 3
            for i, key in enumerate(keys):
                r = i // cols
                c = i % cols
                # Button OHNE command (wir binden es manuell für maximale Kontrolle)
                btn = tk.Button(self.scroll_frame, text=f"{key.upper()}", 
                               font=("Arial", 11, "bold"), height=6, bg="white", relief="groove")
                btn.grid(row=r, column=c, sticky="nsew", padx=1, pady=1)
                
                # STRICT CLICK BINDING: Löst erst beim Loslassen der Taste aus
                btn.bind("<ButtonRelease-1>", lambda e, k=key: self.trigger_edit(k))
                
            for col in range(cols):
                self.scroll_frame.columnconfigure(col, weight=1)
        except Exception as e:
            print(f"Fehler beim Laden: {e}")

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
