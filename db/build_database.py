import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "game.db"
CATALOG = ROOT / "catalog.js"


def main():
    with sqlite3.connect(DATABASE) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.executescript((ROOT / "schema.sql").read_text(encoding="utf-8"))
        connection.executescript((ROOT / "seed.sql").read_text(encoding="utf-8"))
        microbes = [
            dict(zip(
                ("sprite_id", "game_key", "category", "display_order", "name_th",
                 "scientific_name", "rarity", "gram", "shape", "trait"),
                row,
            ))
            for row in connection.execute(
                "SELECT sprite_id, game_key, category, display_order, name_th, "
                "scientific_name, rarity, gram, shape, trait "
                "FROM microbes ORDER BY display_order"
            )
        ]
        moods = [
            dict(zip(("game_mood", "sprite_expression", "display_order"), row))
            for row in connection.execute(
                "SELECT game_mood, sprite_expression, display_order "
                "FROM moods ORDER BY display_order"
            )
        ]

    catalog = {
        "version": 1,
        "microbes": microbes,
        "spriteByGameKey": {item["game_key"]: item["sprite_id"] for item in microbes},
        "expressionByMood": {
            item["game_mood"]: item["sprite_expression"] for item in moods
        },
    }
    payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
    CATALOG.write_text(
        "// Generated from schema.sql and seed.sql; run py db/build_database.py to refresh.\n"
        f"window.MICROBE_DB={payload};\n",
        encoding="utf-8",
    )
    print(f"Built {DATABASE.name}: {len(microbes)} microbes, {len(moods)} moods")
    print(f"Exported browser catalog: {CATALOG.name}")


if __name__ == "__main__":
    main()
