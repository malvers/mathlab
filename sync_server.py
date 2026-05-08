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
                # Ensure the path exists and write the file
                file_path = os.path.join(BASE_PATH, f"{lab_id}.txt")
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(text)
                
                print(f"✅ Successfully synced: {file_path}")
                
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
