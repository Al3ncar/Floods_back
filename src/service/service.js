const validateVolunteer = async (volunteer_id) => {
  const validVolunteerRoles = ["VOLUNTEER", "BOTH"];

  const result = await pool.query("SELECT id, role FROM users WHERE id = $1", [
    volunteer_id,
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (!validVolunteerRoles.includes(user.role)) {
    throw new Error("Apenas usuários voluntários podem se candidatar");
  }

  return user;
};

export { validateVolunteer };
