import Database from "better-sqlite3";
import path from "path";

// Reports live in a local SQLite file. Override the path with PINPOINT_DB_PATH.
const dbPath = process.env.PINPOINT_DB_PATH || path.resolve(process.cwd(), "data.db");
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        author_name TEXT NOT NULL,
        selector TEXT,
        element_info TEXT,
        page_url TEXT,
        image_url TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Bring databases created by older versions up to date.
const addColumn = (sql: string) => {
    try {
        db.exec(sql);
    } catch {
        // Column already exists.
    }
};
addColumn("ALTER TABLE comments ADD COLUMN author_name TEXT DEFAULT 'Anonymous'");
addColumn("ALTER TABLE comments ADD COLUMN selector TEXT");
addColumn("ALTER TABLE comments ADD COLUMN element_info TEXT");
addColumn("ALTER TABLE comments ADD COLUMN page_url TEXT");
addColumn("ALTER TABLE comments ADD COLUMN image_url TEXT");

export default db;
