import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { executeQuery } from "../utils/models-query-run.js";
import {
  validateVolunteer,
  validateCreateUser,
  validCreatedApplications,
} from "../service/service.js";

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
      type_help,
      can_help,
      can_request_help,
      observation
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14
    )
    RETURNING
      id,
      name,
      email,
      phone,
      city,
      state,
      type_help,
      can_help,
      can_request_help,
      observation,
      created_at;
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
    user.type_help,
    user.can_help ?? false,
    user.can_request_help ?? false,
    user.observation ?? null,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const editUserData = async (data, id) => {
  const allowed = [
    "name",
    "phone",
    "email",
    "password",
    "address",
    "city",
    "state",
    "observation",
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
    RETURNING id, name, email, role, city, state, observation;
  `;

  const result = await pool.query(query, [...values, id]);

  if (result.rowCount === 0) {
    throw new Error("Usuário não encontrado");
  }

  return result.rows[0];
};

const deleteUser = async (req) => {
  const userId = Number(req.params.id);

  if (req.user.id !== userId) {
    return res.status(403).json({
      message: "Você não tem permissão para deletar este usuário",
    });
  }

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

const createRequest = async (request, user) => {
  if (!user.can_request_help) {
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
    user.id,
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

const updateRequest = async (req, id) => {
  const request = req.body;
  if (req.user.id !== userId) {
    return res.status(403).json({
      message: "Você não tem permissão para deletar este usuário",
    });
  }

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

const createApplication = async ({ request_id, volunteer_id }) => {
  await validCreatedApplications(request_id, volunteer_id);

  const query = `
    INSERT INTO applications (
      request_id,
      volunteer_id
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await pool.query(query, [request_id, volunteer_id]);

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

const getApplicationsByRequest = async (requestId, userId) => {
  const requestQuery = `
    SELECT requester_id
    FROM requests
    WHERE id = $1
  `;

  const requestResult = await pool.query(requestQuery, [requestId]);
  const request = requestResult.rows[0];

  if (!request) {
    throw new Error("Solicitação não encontrada");
  }

  if (request.requester_id !== userId) {
    throw new Error("Você não tem permissão para visualizar candidatos");
  }

  const query = `
    SELECT
      applications.id AS application_id,
      applications.created_at,
      users.id,
      users.name,
      users.phone,
      users.city,
      users.state,
      users.type_help,
      users.observation
    FROM applications
    INNER JOIN users
      ON users.id = applications.volunteer_id
    WHERE applications.request_id = $1
    ORDER BY applications.created_at DESC;
  `;

  const result = await pool.query(query, [requestId]);

  return result.rows;
};

export default {
  findUserByEmail,
  createUser,
  deleteUser,
  updateUserPreferences,
  editUserData,
  allUsers,
  requests,
  createRequest,
  deleteRequest,
  updateRequest,
  createApplication,
  getApplicationsByRequest,
};
