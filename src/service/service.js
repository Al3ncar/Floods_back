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

const validateCreateUser = async (user) => {
  const validRoles = ["PRECISO-DE-AJUDA", "VOLUNTARIO", "AMBOS"];

  if (!validRoles.includes(user.role)) {
    throw new Error('Tipo de usuário inválido');
  }

  const emailExists = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [user.email]
  );

  if (emailExists.rowCount > 0) {
    throw new Error('Email já está em uso');
  }

  if (!user.state || user.state.length !== 2) {
    throw new Error('Estado deve ter 2 caracteres (ex: SP)');
  }


  if (user.latitude && (user.latitude < -90 || user.latitude > 90)) {
    throw new Error('Latitude inválida');
  }

  if (user.longitude && (user.longitude < -180 || user.longitude > 180)) {
    throw new Error('Longitude inválida');
  }

  return true;
};


export { validateVolunteer, validateCreateUser };
