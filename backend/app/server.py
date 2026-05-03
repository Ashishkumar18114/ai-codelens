import json, os
from http.server import HTTPServer, BaseHTTPRequestHandler
from model import analyze_code
from dotenv import load_dotenv
load_dotenv()

class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"message": "AI Code Analyzer Running"}).encode())

    def do_POST(self):
        try:
            content_type = self.headers.get('Content-Type', '')
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            
            # Parse multipart form data
            import email, io
            boundary = content_type.split('boundary=')[1].encode()
            parts = body.split(b'--' + boundary)
            
            code_text = ''
            mode = 'explain'
            filename = 'code.txt'
            
            for part in parts:
                if b'Content-Disposition' not in part:
                    continue
                header, _, data = part.partition(b'\r\n\r\n')
                data = data.rstrip(b'\r\n--')
                header_str = header.decode('utf-8', errors='ignore')
                if 'name="file"' in header_str:
                    code_text = data.decode('utf-8', errors='ignore')
                    if 'filename=' in header_str:
                        filename = header_str.split('filename="')[1].split('"')[0]
                elif 'name="mode"' in header_str:
                    mode = data.decode('utf-8', errors='ignore').strip()
            
            result = analyze_code(code_text, mode=mode, filename=filename)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e), "analysis": "Error: " + str(e)}).encode())

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8000), Handler)
    print('Server running on http://localhost:8000')
    server.serve_forever()
