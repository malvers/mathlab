from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os

# Configuration: Path to your explanations folder
BASE_PATH = "HTML/resources/explanations"

class SyncHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS for the browser
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            
            lab_id = data.get('id')
            text = data.get('text')
            
            if lab_id and text:
                # Check if file exists and write
                file_path = os.path.join(BASE_PATH, f"{lab_id}.txt")
                exists = os.path.exists(file_path)
                
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                # --- SAFETY FIRST: Create Backup ---
                if exists:
                    import shutil
                    from datetime import datetime
                    backup_dir = os.path.join(BASE_PATH, "backups")
                    os.makedirs(backup_dir, exist_ok=True)
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    backup_path = os.path.join(backup_dir, f"{lab_id}_{timestamp}.txt.bak")
                    shutil.copy2(file_path, backup_path)
                    print(f"📦 Backup created: {backup_path}")
                # -----------------------------------
                
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(text)
                
                status = "Updated" if exists else "Created"
                print(f"✅ {status}: {file_path}")
                
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b"OK")
            else:
                self.send_response(400)
                self.end_headers()
        except Exception as e:
            print(f"❌ Error during sync: {e}")
            self.send_response(500)
            self.end_headers()

if __name__ == "__main__":
    if not os.path.exists(BASE_PATH):
        print(f"⚠️ Warning: {BASE_PATH} does not exist yet. It will be created on first sync.")
    
    print("--------------------------------------------------")
    print("🚀 Poster Studio Sync Server running on http://localhost:5005")
    print("   Listening for live updates from your browser...")
    print("--------------------------------------------------")
    
    server = HTTPServer(('localhost', 5005), SyncHandler)
    server.serve_forever()
