import os
import json
import re
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 5005
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READ_PATH = os.path.join(BASE_DIR, 'js', 'branding', 'i18n-descriptions.js')
WRITE_PATH = os.path.join(BASE_DIR, 'js', 'branding', 'i18n-descriptions_debug.js')

class PosterBridgeHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/save':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            lab_id = data.get('id')
            text = data.get('text', '')

            if not lab_id:
                self._send_error("No ID provided")
                return

            try:
                # Update Debug Registry based on Original
                self._update_debug_registry(lab_id, text)

                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "message": f"Saved {lab_id} to DEBUG file."}).encode('utf-8'))

            except Exception as e:
                print(f"❌ Error during save: {e}")
                self._send_error(str(e))

    def _update_debug_registry(self, lab_id, text):
        # We always read from ORIGINAL to ensure we are editing the master state
        with open(READ_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        clean_text = text.replace('`', '\\`').replace('$', '\\$')
        pattern = r'"' + lab_id + r'":\s*`(.*?)`,'
        
        if re.search(pattern, content, re.DOTALL):
            new_content = re.sub(pattern, f'"{lab_id}": `{clean_text}`,', content, flags=re.DOTALL)
            
            # WRITE TO DEBUG FILE ONLY
            with open(WRITE_PATH, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated i18n-descriptions_debug.js for lab: {lab_id}")
        else:
            raise ValueError(f"Lab ID '{lab_id}' not found in original registry.")

    def _send_error(self, msg):
        self.send_response(500)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"error": msg}).encode('utf-8'))

def run():
    print(f"🚀 Poster Bridge (SANDBOX MODE) listening on http://localhost:{PORT}")
    print(f"   READ: {os.path.basename(READ_PATH)}")
    print(f"   WRITE: {os.path.basename(WRITE_PATH)}")
    httpd = HTTPServer(('localhost', PORT), PosterBridgeHandler)
    httpd.serve_forever()

if __name__ == '__main__':
    run()
