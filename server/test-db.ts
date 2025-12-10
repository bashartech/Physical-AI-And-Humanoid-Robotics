import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("✅ Database connection is valid for Better-Auth");
  } catch (err) {
    console.error("❌ DB connection failed", err);
  } finally {
    await client.end();
  }
})();
