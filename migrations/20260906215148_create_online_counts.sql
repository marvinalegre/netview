-- UP
CREATE TABLE online_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  online_count INTEGER NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- DOWN
DROP TABLE online_counts;
