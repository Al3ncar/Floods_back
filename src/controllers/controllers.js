import useModels from "../models/models.js";
import { getAllControl, createdData } from "../utils/useControllers.js";

const getAll = (req, res) => () =>
  getAllControl(req, res, useModels.allUsers(req.query.type));

const requestsAll = (req, res) => () =>
  getAllControl(req, res, useModels.requests());

const login = async (req, res) =>
  createdData(
    req,
    res,
    200,
    "Ação realizada com sucesso!",
    useModels.findUserByEmail(req.body),
  );
const createUser = async (req, res) =>
  createdData(
    req,
    res,
    201,
    "Usuario criado com sucesso!",
    useModels.createUser(req.body),
  );
const createRequest = async (req, res) =>
  createdData(
    req,
    res,
    201,
    "Solicitação criada com sucesso!",
    useModels.createRequest(req.body),
  );

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (req.user.id !== userId) {
      return res.status(403).json({
        message: "Você não tem permissão para deletar este usuário",
      });
    }

    const user = await useModels.deleteUser(userId);

    return res.status(200).json({
      message: "Ação realizada com sucesso!",
      user,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

const createApplication = async (req, res) => {
  try {
    const request_id = Number(req.params.id);
    const volunteer_id = req.user.id;

    const application = await applicationService.createApplication({
      request_id,
      volunteer_id,
    });

    return res.status(201).json(application);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const editUserData = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (req.user.id !== userId) {
      return res.status(403).json({
        message: "Você não tem permissão para editar este usuário",
      });
    }

    const user = await useModels.changeUserData(req.body, userId);

    return res.status(200).json({
      message: "Usuário alterado com sucesso!",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const editRequest = async (req, res) => {
  try {
    const user = await useModels.updateRequest(req.body, req.params.id);
    return res.status(200).json({
      message: "Solicitação ALTERADA com sucesso!",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const removeRequest = async (req, res) => {
  try {
    const user = await useModels.deleteRequest(req.params.id);

    return res.status(200).json({
      message: "Solicitação CANCELADA com sucesso!",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export default {
  getAll,
  createUser,
  editUserData,
  requestsAll,
  createRequest,
  removeRequest,
  editRequest,
  createApplication,
  login,
  deleteUser,
};
