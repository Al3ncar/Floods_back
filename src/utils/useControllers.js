const getAllControl = async (req, res, useModels) => {
  try {
    const user = await useModels;
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

const createdData = async (req, res, actionModels = () => {}, msg) => {
  try {
    const data = await actionModels;
    return res.status(201).json({ message: msg, data: data });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export { getAllControl, createdData };
