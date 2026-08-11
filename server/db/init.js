/**
 * Run once (and safe to re-run) to set up PostgreSQL:
 *   node db/init.js
 *
 * Creates the users & media tables, and seeds/updates the admin user
 * from your .env (ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL, ADMIN_PHONE) —
 * same behaviour as the old seedAdmin() function in routes/auth.js.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const client = await pool.connect();
  try {
    console.log("Creating tables...");
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await client.query(schema);

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "Pradyumna@123";
    const adminEmail = process.env.EMAIL_USER || process.env.ADMIN_EMAIL || "admin@perfectpixel.com";
    const adminPhone = process.env.ADMIN_PHONE || "917205330733";

    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [adminEmail, adminUsername]
    );

    if (rows.length === 0) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await client.query(
        `INSERT INTO users (username, password, email, phone)
         VALUES ($1, $2, $3, $4)`,
        [adminUsername, hashed, adminEmail, adminPhone]
      );
      console.log(`Admin user seeded: ${adminUsername} (${adminEmail})`);
    } else {
      const admin = rows[0];
      const updates = {};
      if (admin.email !== adminEmail) updates.email = adminEmail;
      if (admin.username !== adminUsername) updates.username = adminUsername;

      if (Object.keys(updates).length > 0) {
        await client.query(
          "UPDATE users SET email = $1, username = $2 WHERE id = $3",
          [updates.email || admin.email, updates.username || admin.username, admin.id]
        );
        console.log(`Admin user updated from .env (Email: ${adminEmail})`);
      } else {
        console.log("Admin already up to date, skipping.");
      }
    }

    console.log("Database setup complete.");
  } catch (err) {
    console.error("DB init failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
