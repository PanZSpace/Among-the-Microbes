PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS microbes (
  sprite_id TEXT PRIMARY KEY,
  game_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Bacterium', 'Virus')),
  display_order INTEGER NOT NULL UNIQUE,
  name_th TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  gram TEXT NOT NULL,
  shape TEXT NOT NULL,
  trait TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS moods (
  game_mood TEXT PRIMARY KEY,
  sprite_expression TEXT NOT NULL CHECK (
    sprite_expression IN ('random', 'smile', 'cry', 'shy', 'sly', 'curious', 'angry', 'shocked')
  ),
  display_order INTEGER NOT NULL UNIQUE
);
