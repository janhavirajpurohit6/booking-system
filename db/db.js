const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "booking.db");
const isNewDb = !fs.existsSync(DB_PATH);

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

// Only run schema.sql (which includes seed data) the first time the DB file is created
if (isNewDb) {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  db.exec(schema);
  console.log("Database initialized with schema + seed data");
}

module.exports = db;