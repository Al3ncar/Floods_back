import pool from "../config/db.js";

const validateVolunteer = async (volunteer_id) => {
  const result = await pool.query(
    "SELECT id, can_help FROM users WHERE id = $1",
    [volunteer_id],
  );

  const user = result.rows[0];
  if (!user) throw new Error("Usuário não encontrado");
  if (!user.can_help)
    throw new Error("Apenas usuários que podem ajudar podem se candidatar");

  return user;
};

const validateCreateUser = async (user) => {
  if (!user.can_help && !user.can_request_help) {
    throw new Error("Você deve escolher ajudar ou receber ajuda");
  }

  const emailExists = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [user.email],
  );

  if (emailExists.rowCount > 0) throw new Error("Email já está em uso");
  if (!user.state || user.state.length !== 2)
    throw new Error("Estado deve ter 2 caracteres (ex: SP)");
  if (user.latitude && (user.latitude < -90 || user.latitude > 90))
    throw new Error("Latitude inválida");
  if (user.longitude && (user.longitude < -180 || user.longitude > 180))
    throw new Error("Longitude inválida");

  return true;
};

const validateRequestPermission = (request) => {
  if (!request.user.can_request_help) {
    throw new Error(
      "Apenas usuários que podem receber ajuda podem criar solicitações",
    );
  }
};

export { validateVolunteer, validateCreateUser, validateRequestPermission };
