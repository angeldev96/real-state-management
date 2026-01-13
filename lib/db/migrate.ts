import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("./local.db");
const db = drizzle(sqlite, { schema });

async function main() {
  console.log("🔄 Running migrations...");
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  console.log("✅ Migrations completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error running migrations:", err);
  process.exit(1);
});
