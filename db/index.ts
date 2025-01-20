import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Initializing database connection with Neon...");

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  connectionTimeoutMillis: 5000,
  max: 1,
  wsProxy: true,
  WebSocket: ws,
});

// Test the connection and keep it warm
async function validateConnection() {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to Neon database");
    const result = await client.query('SELECT version()');
    console.log("Database version:", result.rows[0].version);
    client.release();
    return true;
  } catch (error) {
    console.error("Failed to connect to Neon database:", error);
    throw error;
  }
}

// Initial connection validation
validateConnection().catch((error) => {
  console.error("Initial database connection failed:", error);
  process.exit(1);
});

export const db = drizzle(pool, { schema });