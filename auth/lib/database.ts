// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql);

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }

    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql);
  }

  return _db;
}
