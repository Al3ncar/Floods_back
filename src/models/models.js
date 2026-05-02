import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { executeQuery } from "../utils/modelsQueryRun.js";
import { validateVolunteer, validateCreateUser } from "../service/service.js";

const requests = () => executeQuery("SELECT * FROM requests");

const allUsers = async (type) => {
  const filters = {
    helpers: "can_help = TRUE",
    requesters: "can_request_help = TRUE",
    both: "can_help = TRUE AND can_request_help = TRUE",
  };

  let query = "SELECT * FROM users";

  if (type && filters[type]) {
    query += ` WHERE ${filters[type]}`;
  }

  const result = await pool.query(query);
  return result.rows;
};

const createUser = async (user) => {
  await validateCreateUser(user);

  const passwordHash = user.password
    ? await bcrypt.hash(user.password, 12)
    : null;

  const query = `
    INSERT INTO users (
      name,
      phone,
      email,
      password,
      is_ghost,
      address,
      city,
      state,
      latitude,
      longitude,
      can_help,
      can_request_help
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12
    )
    RETURNING *;
  `;

  const values = [
    user.name,
    user.phone,
    user.email,
    passwordHash,
    user.is_ghost ?? false,
    user.address,
    user.city,
    user.state,
    user.latitude ?? null,
    user.longitude ?? null,
    user.can_help ?? false,
    user.can_request_help ?? false,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const changeUserData = async (data, id) => {
  const allowed = [
    "name",
    "phone",
    "email",
    "password",
    "address",
    "city",
    "state",
    "latitude",
    "longitude",
  ];

  const entries = await Promise.all(
    Object.entries(data)
      .filter(([key]) => allowed.includes(key))
      .map(async ([key, value]) => [
        key,
        key === "password" ? await bcrypt.hash(value, 10) : value,
      ]),
  );

  if (entries.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  const fields = entries.map(([key], i) => `${key} = $${i + 1}`);
  const values = entries.map(([, value]) => value);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${values.length + 1}
    RETURNING id, name, email, role, city, state;
  `;

  const result = await pool.query(query, [...values, id]);

  if (result.rowCount === 0) {
    throw new Error("Usuário não encontrado");
  }

  return result.rows[0];
};

const deleteUser = async (id) => {
  const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  if (result.rowCount === 0) {
    throw new Error("Usuário não encontrado");
  }

  return result.rows[0];
};

const updateUserPreferences = async (user, id) => {
  const query = `
    UPDATE users
    SET
      can_help = $1,
      can_request_help = $2
    WHERE id = $3
    RETURNING *;
  `;

  const values = [user.can_help ?? false, user.can_request_help ?? false, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const createRequest = async (request) => {
  if (!request.user.can_request_help) {
    throw new Error("Você não pode criar solicitações");
  }

  const query = `
    INSERT INTO requests (
      requester_id,
      city,
      state,
      neighborhood,
      street,
      need_type,
      description,
      urgency,
      status,
      occurrence_lat,
      occurrence_lng
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11
    )
    RETURNING *;
  `;

  const values = [
    request.user.id,
    request.city,
    request.state,
    request.neighborhood,
    request.street,
    request.need_type,
    request.description ?? null,
    request.urgency,
    request.status ?? "ABERTO",
    request.occurrence_lat ?? null,
    request.occurrence_lng ?? null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteRequest = async (id) => {
  const query = `
    DELETE FROM requests
    WHERE id = $1
    AND status = 'ABERTO'
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);

  if (result.rowCount === 0) {
    throw new Error("Request não encontrada ou não pode ser deletada");
  }

  return result.rows[0];
};

const updateRequest = async (request, id) => {
  const query = `
    UPDATE requests
    SET
      city = $1,
      state = $2,
      neighborhood = $3,
      street = $4,
      need_type = $5,
      description = $6,
      urgency = $7,
      status = $8,
      occurrence_lat = $9,
      occurrence_lng = $10
    WHERE id = $11
    RETURNING *;
  `;

  const values = [
    request.city,
    request.state,
    request.neighborhood,
    request.street,
    request.need_type,
    request.description ?? null,
    request.urgency,
    request.status,
    request.occurrence_lat ?? null,
    request.occurrence_lng ?? null,
    id,
  ];

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new Error("Request não encontrada");
  }

  return result.rows[0];
};

const createApplication = async (application) => {
  const { request_id, volunteer_id } = application;

  await validateVolunteer(volunteer_id);

  const query = `
    INSERT INTO applications (
      request_id,
      volunteer_id
    ) VALUES (
      $1, $2
    )
    RETURNING *;
  `;

  const values = [request_id, volunteer_id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (user) => {
  const query = `
    SELECT id, name, email, password, can_help, can_request_help
    FROM users WHERE email = $1
  `;

  const result = await pool.query(query, [user.email]);
  const dbUser = result.rows[0];

  if (!dbUser) throw new Error("Email ou senha inválidos");

  const isMatch = await bcrypt.compare(user.password, dbUser.password);
  if (!isMatch) throw new Error("Email ou senha inválidos");

  const token = jwt.sign(
    {
      id: dbUser.id,
      can_help: dbUser.can_help,
      can_request_help: dbUser.can_request_help,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      can_help: dbUser.can_help,
      can_request_help: dbUser.can_request_help,
    },
    token,
  };
};

export default {
  updateUserPreferences,
  createUser,
  changeUserData,
  allUsers,
  requests,
  createRequest,
  deleteRequest,
  updateRequest,
  createApplication,
  findUserByEmail,
  deleteUser,
};
