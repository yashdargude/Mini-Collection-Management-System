//// filepath: /Users/yashdargude/Desktop/project/mini_manage/backend/testConnection.js
require("dotenv").config();
const db = require("../config/db");

(async () => {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("Database connected successfully at:", res.rows[0].now);
    process.exit(0);
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();
