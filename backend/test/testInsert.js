//// filepath: /Users/yashdargude/Desktop/project/mini_manage/backend/testInsert.js
require("dotenv").config();
const db = require("../config/db");

(async () => {
  try {
    // Create a test table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    outstanding_payment NUMERIC,
    payment_due_date DATE,
    payment_status VARCHAR(50)
      )
    `);
    console.log("Test table ensured.");

    // Insert a test entry into the table
    const result = await db.query(
      "INSERT INTO test_table (name) VALUES ($1) RETURNING *",
      ["Test Entry"]
    );
    console.log("Inserted entry:", result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("Insertion error:", err);
    process.exit(1);
  }
})();
