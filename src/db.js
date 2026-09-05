import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve("data");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "netview.db"));

db.pragma("journal_mode = WAL");

export default db;
