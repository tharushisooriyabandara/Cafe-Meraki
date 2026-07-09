#!/usr/bin/env python3
"""Local dev server with HTTP Range support (needed for hero video)."""

import argparse
import http.server
import os
import socket
import socketserver

DEFAULT_PORT = 8080


def find_free_port(start=DEFAULT_PORT, attempts=20):
    for port in range(start, start + attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("", port))
                return port
            except OSError:
                continue
    raise OSError(f"No free port found in range {start}-{start + attempts - 1}")


class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass

    def do_GET(self):
        path = self.translate_path(self.path.split("?")[0])
        if not os.path.isfile(path):
            return super().do_GET()

        file_size = os.path.getsize(path)
        range_header = self.headers.get("Range")

        if not range_header:
            return super().do_GET()

        try:
            units, _, range_spec = range_header.partition("=")
            if units.strip() != "bytes":
                raise ValueError("unsupported range unit")

            start_text, _, end_text = range_spec.partition("-")
            start = int(start_text) if start_text else 0
            end = int(end_text) if end_text else file_size - 1
            end = min(end, file_size - 1)

            if start > end or start >= file_size:
                self.send_error(416, "Requested Range Not Satisfiable")
                return

            length = end - start + 1
            self.send_response(206)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
            self.send_header("Content-Length", str(length))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()

            with open(path, "rb") as file_handle:
                file_handle.seek(start)
                try:
                    self.wfile.write(file_handle.read(length))
                except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
                    pass
        except (ValueError, IndexError):
            super().do_GET()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Serve Cafe Meraki locally with video range support.")
    parser.add_argument("-p", "--port", type=int, default=DEFAULT_PORT, help="Preferred port (default: 8080)")
    args = parser.parse_args()

    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    try:
        port = args.port
        httpd = socketserver.ThreadingTCPServer(("", port), RangeRequestHandler)
    except OSError:
        port = find_free_port(args.port + 1)
        httpd = socketserver.ThreadingTCPServer(("", port), RangeRequestHandler)
        print(f"Port {args.port} is in use. Using http://localhost:{port} instead.", flush=True)

    httpd.daemon_threads = True
    with httpd:
        print(f"Serving at http://localhost:{port}", flush=True)
        print("Press Ctrl+C to stop.", flush=True)
        httpd.serve_forever()
