import dotenv from "dotenv";
dotenv.config();

import pgk from "pg";
const { Pool } = pgk;

const pool = new Pool({
  connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
});

export default pool;
