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
        self.root.title("BRIEFING MANAGER v5 (CENTERED)")
        
        # Fenstergröße
        width = 900
        height = 950
        
        # Zentrieren
        try:
            screen_width = self.root.winfo_screenwidth()
            screen_height = self.root.winfo_screenheight()
            x = (screen_width // 2) - (width // 2)
            y = (screen_height // 2) - (height // 2)
            self.root.geometry(f"{width}x{height}+{x}+{y}")
        except:
            self.root.geometry(f"{width}x{height}+100+100")

        self.root.configure(bg="#222")
        
        # Nach vorne holen (Mac-spezifisch)
        self.root.attributes("-topmost", True)
        self.root.after(10, lambda: self.root.attributes("-topmost", False))
        self.root.lift()
        self.root.focus_force()
        
        # Main Container
        self.main_frame = tk.Frame(self.root, bg="#222")
        self.main_frame.pack(fill="both", expand=True)
        
        # Canvas + Scrollbar
        self.canvas = tk.Canvas(self.main_frame, bg="#222", highlightthickness=0)
        self.scrollbar = tk.Scrollbar(self.main_frame, orient="vertical", command=self.canvas.yview)
        self.scroll_frame = tk.Frame(self.canvas, bg="#222")
        
        self.scroll_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )
        
        self.canvas_window = self.canvas.create_window((0, 0), window=self.scroll_frame, anchor="nw")
        
        # Make scroll_frame as wide as canvas
        self.canvas.bind("<Configure>", self._on_canvas_configure)
        
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        
        self.scrollbar.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True)
        
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)

        self.is_editing = False
        self.load_keys()

    def _on_canvas_configure(self, event):
        # Resize the inner frame to match the canvas width
        self.canvas.itemconfig(self.canvas_window, width=event.width)

    def _on_mousewheel(self, event):
        self.canvas.yview_scroll(int(-1*(event.delta/120)), "units")

    def load_keys(self):
        try:
            if not os.path.exists(READ_PATH):
                print(f"Error: {READ_PATH} not found")
                return

            with open(READ_PATH, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # More robust regex
            keys = sorted(list(set(re.findall(r'["\'](\w+)["\']\s*:\s*`', content))))
            
            if not keys:
                # Fallback regex if backtick is on next line or something
                keys = sorted(list(set(re.findall(r'["\'](\w+)["\']\s*:', content))))
                # Filter out common JS keys that aren't labs
                keys = [k for k in keys if k not in ["de", "en", "es", "fr", "it", "pt", "sw", "tr", "nl"]]

            for i in range(0, len(keys), 3):
                row_keys = keys[i:i+3]
                row_frame = tk.Frame(self.scroll_frame, bg="#222")
                row_frame.pack(side="top", pady=0) 
                
                for key in row_keys:
                    btn = tk.Button(row_frame, text=key.upper(), 
                                   font=("Arial", 12, "bold"), width=22, height=4,
                                   bg="#444", fg="black", highlightbackground="#222")
                    btn.configure(command=lambda k=key: self.trigger_edit(k))
                    btn.pack(side="left", padx=1, pady=0)
                
        except Exception as e:
            with open(os.path.join(BASE_DIR, 'scratch', 'editor_log.txt'), 'a') as log:
                log.write(f"Load Error: {e}\n")

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
        self.root.attributes("-topmost", False)
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
