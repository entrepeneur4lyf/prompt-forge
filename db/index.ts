import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@db/schema";
import pg from 'pg';
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("Initializing database connection with PostgreSQL...");

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some PostgreSQL providers
  },
  max: 3, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test the connection and keep it warm
async function validateConnection() {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to PostgreSQL database");
    const result = await client.query('SELECT version()');
    console.log("Database version:", result.rows[0].version);
    client.release();
    return true;
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database:", error);
    throw error;
  }
}

// Initial connection validation
validateConnection().catch((error) => {
  console.error("Initial database connection failed:", error);
  process.exit(1);
});

export const db = drizzle(pool, { schema });