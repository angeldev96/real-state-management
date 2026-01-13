import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Create database connection
const sqlite = new Database("./local.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
