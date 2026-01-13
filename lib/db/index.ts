import { drizzle as drizzleSqlite, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleLibsql, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Check if we're using Turso (production) or local SQLite (development)
const isTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

function createDatabase() {
  if (isTurso) {
    // Production: Use Turso
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    console.log("📡 Connected to Turso database");
    return drizzleLibsql(client, { schema });
  } else {
    // Development: Use local SQLite
    const sqlite = new Database("./local.db");
    sqlite.pragma("journal_mode = WAL");
    console.log("💾 Connected to local SQLite database");
    return drizzleSqlite(sqlite, { schema });
  }
}

// Use 'any' as a workaround for the union type issue with Drizzle ORM
// This allows both LibSQL and BetterSQLite3 to work without type conflicts
export const db: any = createDatabase();
