import useModels from "../models/models.js";
import { getAllControl, createdData } from "../utils/useControllers.js";

const getAll = (req, res) => getAllControl(req, res, useModels.allUsers());
const getAllVolunteer = (req, res) =>
  getAllControl(req, res, useModels.allVolunteerUsers());
const getAllHelpMe = (req, res) =>
  getAllControl(req, res, useModels.allHelpMeUsers());
const requestsAll = (req, res) => getAllControl(req, res, useModels.requests());

const createUser = async (req, res) =>
  createdData(
    req,
    res,
    useModels.createUser(req.body),
    "Usuario criado com sucesso!",
  );
const createRequest = async (req, res) =>
  createdData(
    req,
    res,
    useModels.createRequest(req.body),
    "Solicitação criada com sucesso!",
  );
const createApplication = async (req, res) =>
  createdData(
    req,
    res,
    useModels.createApplication(req.body),
    "Solicitação Enviada com sucesso!",
  );

const roleEditUser = async (req, res) => {
  try {
    const user = await useModels.changeRoleUser(req.body, req.params.id);

    return res.status(201).json({
      message: "Usuario alterado com sucesso!",
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
  getAllVolunteer,
  getAllHelpMe,
  createUser,
  roleEditUser,
  requestsAll,
  createRequest,
  removeRequest,
  editRequest,
  createApplication,
};
