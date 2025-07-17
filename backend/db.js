import dotenv from 'dotenv';
dotenv.config();

import { ConnectionPool } from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

export async function getConnection() {
  try {
    if (!pool || !pool.connected) {
      if (pool) {
        console.log("⚠️ Pool exists but was disconnected. Reconnecting...");
        await pool.close();
      }

      pool = new ConnectionPool(config);
      await pool.connect();
      console.log("✅ Database connected successfully");
    } else {
      console.log("ℹ️ Reusing existing DB connection");
    }

    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw new Error("Failed to connect to the database");
  }
}
