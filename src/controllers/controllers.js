import useModels from "../models/models.js";

const getAll = async (req, res) => {
  try {
    const user = await useModels.getAll();
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};
const addUsers = async (req, res) => {
  try {
    console.log(req.body);
    const user = await useModels.createUser(req.body);
    
    return res.status(201).json({
      message: "Usuario criado com sucesso!",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export default { getAll, addUsers };
