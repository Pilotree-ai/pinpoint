// Print every saved report and reviewer to the terminal: node view-db.js
const Database = require("better-sqlite3");
const db = new Database(process.env.PINPOINT_DB_PATH || "data.db");

console.log("--- REPORTS ---");
console.table(db.prepare("SELECT * FROM comments ORDER BY timestamp DESC").all());

console.log("\n--- REVIEWERS ---");
console.table(db.prepare("SELECT * FROM visitors ORDER BY timestamp DESC").all());
