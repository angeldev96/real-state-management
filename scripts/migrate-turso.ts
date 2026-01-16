import dotenv from "dotenv";
import path from "path";
import { createClient } from "@libsql/client";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ Turso environment variables missing in .env.local");
    process.exit(1);
  }

  console.log("🚀 Starting Turso migration (Direct Client)...");
  console.log(`📡 Connecting to: ${url}`);

  const client = createClient({ url, authToken });

  const tables = ["property_types", "conditions", "zonings", "features"];

  for (const table of tables) {
    try {
      console.log(`⏳ Adding is_active to ${table}...`);
      await client.execute(`ALTER TABLE ${table} ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`);
      console.log(`✅ Table ${table} updated.`);
    } catch (e: any) {
      if (e.message.includes("already exists") || e.message.includes("duplicate column")) {
        console.log(`ℹ️ Column is_active already exists in ${table}.`);
      } else {
        console.error(`❌ Error updating ${table}:`, e.message);
      }
    }
  }

  console.log("🎉 Migration finished.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
