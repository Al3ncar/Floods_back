import pool from "../config/db.js";
import { executeQuery } from "../utils/modelsQueryRun.js";
import { validateVolunteer } from "../service/service.js";

const requests = () => executeQuery("SELECT * FROM requests");
const allUsers = () => executeQuery("SELECT * FROM users");

const allVolunteerUsers = () =>
  executeQuery(`SELECT * FROM users WHERE role IN ('VOLUNTARIO', 'AMBOS')`);

const allHelpMeUsers = () =>
  executeQuery(
    `SELECT * FROM users WHERE role IN ('PRECISO-DE-AJUDA', 'AMBOS')`,
  );

const createUser = async (user) => {
  const passwordHash = await bcrypt.hash(password, 10);
  await validateCreateUser(user);
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
      role
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11
    )
    RETURNING *;
  `;

  const values = [
    user.name,
    user.phone,
    user.email,
    passwordHash || null,
    user.is_ghost ?? false,
    user.address,
    user.city,
    user.state,
    user.latitude || null,
    user.longitude || null,
    user.role,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
const changeRoleUser = async (user, id) => {
  console.log(user, id);
  const query = `
    UPDATE users SET role=$1
    WHERE id=$2 RETURNING *;
  `;
  const result = await pool.query(query, [user.role, id]);
  return result.rows[0];
};

const createRequest = async (request) => {
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
    request.description || null,
    request.urgency,
    request.status || "OPEN",
    request.occurrence_lat || null,
    request.occurrence_lng || null,
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

export default {
  changeRoleUser,
  createUser,
  allUsers,
  allVolunteerUsers,
  allHelpMeUsers,
  requests,
  createRequest,
  deleteRequest,
  updateRequest,
  createApplication,
};
