-- UP
CREATE TABLE devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mac TEXT NOT NULL UNIQUE,
  name TEXT,
  first_seen TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%fZ', 'now')),
  ip TEXT,
  device_type TEXT
);

-- DOWN
DROP TABLE devices;
