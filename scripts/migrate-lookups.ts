import { Database } from "better-sqlite3";
import * as path from "path";

const dbPath = path.resolve(process.cwd(), "local.db");
const db = new (require("better-sqlite3"))(dbPath);

console.log("🚀 Starting migration...");

try {
  db.prepare("ALTER TABLE property_types ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1").run();
  console.log("✅ Added is_active to property_types");
} catch (e: any) {
  console.log("⚠️ property_types.is_active might already exist or error:", e.message);
}

try {
  db.prepare("ALTER TABLE conditions ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1").run();
  console.log("✅ Added is_active to conditions");
} catch (e: any) {
  console.log("⚠️ conditions.is_active might already exist or error:", e.message);
}

try {
  db.prepare("ALTER TABLE zonings ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1").run();
  console.log("✅ Added is_active to zonings");
} catch (e: any) {
  console.log("⚠️ zonings.is_active might already exist or error:", e.message);
}

try {
  db.prepare("ALTER TABLE features ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1").run();
  console.log("✅ Added is_active to features");
} catch (e: any) {
  console.log("⚠️ features.is_active might already exist or error:", e.message);
}

console.log("🎉 Migration finished.");
db.close();
