import pool from "../config/db.js";

const getAll = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const createUser = async (user) => {
  const query = `
    INSERT INTO users (
      name,
      phone,
      email,
      password,
      is_ghost,
      address,
      neighborhood,
      city,
      state,
      latitude,
      longitude,
      role,
      available
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13
    )
    RETURNING *;
  `;

  const values = [
    user.name,
    user.phone,
    user.email,
    user.password,
    user.is_ghost || false,
    user.address,
    user.neighborhood,
    user.city,
    user.state,
    user.latitude,
    user.longitude,
    user.role,
    user.available,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  //   create,
  createUser,
  getAll,
};
