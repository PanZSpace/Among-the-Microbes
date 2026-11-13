#!/usr/bin/env python3
"""Serve the game and a small in-memory trading lobby for a trusted LAN."""

from __future__ import annotations

import argparse
import json
import re
import secrets
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
GENES = {
    "blaZ", "mecA", "vanA", "pbp-mosaic", "blaTEM-1", "CTX-M-15",
    "gyrA/parC", "armA", "KPC-2", "NDM-1", "oprD+mexAB", "OXA-23",
    "adeABC", "mcr-1",
}
EMOTES = {"👋", "😀", "🦠", "❓", "🙏"}
ROOM_CODE = re.compile(r"^[A-Z0-9]{4,8}$")
rooms: dict[str, dict] = {}
rooms_lock = threading.Lock()


def valid_room(value: object) -> str:
    room = str(value or "").upper()
    if not ROOM_CODE.fullmatch(room):
        raise ValueError("รหัสห้องต้องมี 4–8 ตัว (A–Z, 0–9)")
    return room


def clean_name(value: object) -> str:
    name = re.sub(r"[^\w -]", "", str(value or ""), flags=re.UNICODE).strip()[:16]
    return name or "Microbe"


def get_room(code: str) -> dict:
    return rooms.setdefault(code, {"players": {}, "offers": {}})


def prune(now: float) -> None:
    for code, room in list(rooms.items()):
        stale = [uid for uid, player in room["players"].items() if now - player["t"] > 60]
        for uid in stale:
            del room["players"][uid]
            for offer in room["offers"].values():
                if offer["from"] == uid and offer["st"] == "open":
                    offer["st"] = "cancelled"
        for offer_id, offer in list(room["offers"].items()):
            if now * 1000 - offer["ts"] > 1800_000:
                del room["offers"][offer_id]
        if not room["players"] and not room["offers"]:
            del rooms[code]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        print(f"{self.address_string()} - {fmt % args}")

    def send_json(self, status: int, data: dict) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length < 1 or length > 8192:
            raise ValueError("ข้อมูลคำขอไม่ถูกต้อง")
        value = json.loads(self.rfile.read(length))
        if not isinstance(value, dict):
            raise ValueError("ข้อมูลคำขอไม่ถูกต้อง")
        return value

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/api/room":
            return super().do_GET()
        args = parse_qs(parsed.query)
        try:
            code = valid_room(args.get("room", [""])[0])
            uid = args.get("player", [""])[0]
            with rooms_lock:
                prune(time.time())
                room = get_room(code)
                player = room["players"].get(uid)
                if not player:
                    return self.send_json(404, {"error": "ไม่พบผู้เล่นในห้อง กรุณาเข้าห้องใหม่"})
                player["t"] = time.time()
                visible_players = {
                    player_id: {"n": entry["n"], "e": entry["e"]}
                    for player_id, entry in room["players"].items()
                }
                self.send_json(200, {"players": visible_players, "offers": room["offers"]})
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(400, {"error": str(exc)})

    def do_POST(self) -> None:
        try:
            data = self.read_json()
            path = urlparse(self.path).path
            with rooms_lock:
                now = time.time()
                prune(now)

                if path == "/api/join":
                    code = valid_room(data.get("room"))
                    name = clean_name(data.get("name"))
                    room = get_room(code)
                    uid = str(data.get("player") or "")
                    if uid not in room["players"]:
                        if len(room["players"]) >= 32:
                            return self.send_json(409, {"error": "ห้องเต็มแล้ว"})
                        uid = secrets.token_urlsafe(18)
                        room["players"][uid] = {"n": name, "t": now, "e": ""}
                    else:
                        room["players"][uid].update({"n": name, "t": now})
                    return self.send_json(200, {"player": uid})

                code = valid_room(data.get("room"))
                uid = str(data.get("player") or "")
                room = rooms.get(code)
                if not room or uid not in room["players"]:
                    return self.send_json(404, {"error": "ไม่พบผู้เล่นในห้อง กรุณาเข้าห้องใหม่"})
                room["players"][uid]["t"] = now

                if path == "/api/offer":
                    give, want = data.get("give"), data.get("want")
                    if not isinstance(give, str) or not isinstance(want, str) or give not in GENES or want not in GENES or give == want:
                        return self.send_json(400, {"error": "การ์ดที่เลือกไม่ถูกต้อง"})
                    if sum(item["st"] == "open" for item in room["offers"].values()) >= 100:
                        return self.send_json(409, {"error": "ข้อเสนอในห้องเต็มแล้ว"})
                    offer_id = secrets.token_urlsafe(12)
                    room["offers"][offer_id] = {
                        "from": uid, "fn": room["players"][uid]["n"],
                        "give": give, "want": want, "st": "open",
                        "ts": int(now * 1000),
                    }
                    return self.send_json(200, {"id": offer_id})

                if path.startswith("/api/accept/"):
                    offer = room["offers"].get(path.rsplit("/", 1)[-1])
                    if not offer or offer["st"] != "open" or offer["from"] == uid:
                        return self.send_json(409, {"error": "ข้อเสนอนี้ไม่ว่างแล้ว"})
                    offer.update({"st": "done", "by": uid})
                    return self.send_json(200, {"offer": offer})

                if path.startswith("/api/cancel/"):
                    offer = room["offers"].get(path.rsplit("/", 1)[-1])
                    if not offer or offer["from"] != uid or offer["st"] != "open":
                        return self.send_json(409, {"error": "ยกเลิกข้อเสนอนี้ไม่ได้"})
                    offer["st"] = "cancelled"
                    return self.send_json(200, {"ok": True})

                if path == "/api/emote":
                    emote = data.get("emote")
                    if not isinstance(emote, str) or emote not in EMOTES:
                        return self.send_json(400, {"error": "อีโมจิไม่ถูกต้อง"})
                    room["players"][uid]["e"] = emote
                    return self.send_json(200, {"ok": True})

                if path == "/api/leave":
                    del room["players"][uid]
                    for offer in room["offers"].values():
                        if offer["from"] == uid and offer["st"] == "open":
                            offer["st"] = "cancelled"
                    prune(now)
                    return self.send_json(200, {"ok": True})

                self.send_json(404, {"error": "ไม่พบ API"})
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(400, {"error": str(exc)})


def main() -> None:
    parser = argparse.ArgumentParser(description="Among the Microbes LAN server")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("0.0.0.0", args.port), Handler)
    print(f"เกมพร้อมแล้ว: http://localhost:{args.port}")
    print("ให้เพื่อนที่อยู่ Wi-Fi/LAN เดียวกันเปิด http://<IP-เครื่องนี้>:" + str(args.port))
    print("กด Ctrl+C เพื่อปิดเซิร์ฟเวอร์ (ห้องจะถูกล้างเมื่อปิด)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nปิดเซิร์ฟเวอร์แล้ว")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
