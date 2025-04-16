import pg from "pg";

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

export const pool = new pg.Pool(poolConfig);
