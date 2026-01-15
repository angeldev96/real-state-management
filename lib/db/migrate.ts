import dotenv from "dotenv";
import { migrate as migrateSqlite } from "drizzle-orm/better-sqlite3/migrator";
import { migrate as migrateLibsql } from "drizzle-orm/libsql/migrator";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

// Check if we're using Turso (production) or local SQLite (development)
const isTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

async function main() {
  console.log("🔄 Running migrations...");
  
  if (isTurso) {
    // Production: Use Turso
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    console.log("📡 Using Turso database for migrations");
    const db = drizzleLibsql(client, { schema });
    await migrateLibsql(db, { migrationsFolder: "./lib/db/migrations" });
  } else {
    // Development: Use local SQLite
    const sqlite = new Database("./local.db");
    console.log("💾 Using local SQLite database for migrations");
    const db = drizzleSqlite(sqlite, { schema });
    await migrateSqlite(db, { migrationsFolder: "./lib/db/migrations" });
  }
  
  console.log("✅ Migrations completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error running migrations:", err);
  process.exit(1);
});
