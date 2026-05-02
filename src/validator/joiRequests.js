import Joi from "joi";
import { validUserAndRequest } from "../utils/joiValidator.js";

const requestSchema = Joi.object({
  city: Joi.string().max(100).required().messages({
    "string.empty": "A cidade é obrigatória",
    "string.max": "A cidade deve ter no máximo 100 caracteres",
    "any.required": "A cidade é obrigatória",
  }),
  state: Joi.string().length(2).required().messages({
    "string.length": "O estado deve ter 2 caracteres (ex: SP)",
    "string.empty": "O estado é obrigatório",
    "any.required": "O estado é obrigatório",
  }),
  neighborhood: Joi.string().max(100).required().messages({
    "string.empty": "O bairro é obrigatório",
    "string.max": "O bairro deve ter no máximo 100 caracteres",
    "any.required": "O bairro é obrigatório",
  }),
  street: Joi.string().max(255).required().messages({
    "string.empty": "A rua é obrigatória",
    "string.max": "A rua deve ter no máximo 255 caracteres",
    "any.required": "A rua é obrigatória",
  }),
  need_type: Joi.string().max(50).required().messages({
    "string.empty": "O tipo de necessidade é obrigatório",
    "string.max": "O tipo de necessidade deve ter no máximo 50 caracteres",
    "any.required": "O tipo de necessidade é obrigatório",
  }),
  description: Joi.string().max(500).allow(null, "").messages({
    "string.max": "A descrição deve ter no máximo 500 caracteres",
  }),
  urgency: Joi.string()
    .valid("BAIXO", "MEDIO", "ALTO", "CRITICO")
    .required()
    .messages({
      "any.only": "Urgência deve ser BAIXO, MEDIO, ALTO ou CRITICO",
      "string.empty": "A urgência é obrigatória",
      "any.required": "A urgência é obrigatória",
    }),
  status: Joi.string()
    .valid("ABERTO", "EM_PROCESSO", "COMPLETO", "CANCELADO")
    .default("ABERTO")
    .messages({
      "any.only": "Status deve ser ABERTO, EM_PROCESSO, COMPLETO ou CANCELADO",
    }),
  occurrence_lat: Joi.number().min(-90).max(90).allow(null).messages({
    "number.base": "Latitude deve ser um número",
    "number.min": "Latitude inválida",
    "number.max": "Latitude inválida",
  }),
  occurrence_lng: Joi.number().min(-180).max(180).allow(null).messages({
    "number.base": "Longitude deve ser um número",
    "number.min": "Longitude inválida",
    "number.max": "Longitude inválida",
  }),
});

export default (req, res, next) =>
  validUserAndRequest(req, res, next, requestSchema);
