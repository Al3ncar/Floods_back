import pool from "../config/db.js";

const executeQuery =  async (queryString) => {
  const result = await pool.query(queryString);
  return result.rows;
};

export {executeQuery}