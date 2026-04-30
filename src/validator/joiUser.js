import Joi from "joi";
import { validUserAndRequest } from "../utils/joiValidator.js";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(150).required().messages({
    "string.empty": "O nome é obrigatório",
    "string.min": "O nome deve ter pelo menos 3 caracteres",
    "string.max": "O nome deve ter no máximo 150 caracteres",
    "any.required": "O nome é obrigatório",
  }),

  phone: Joi.string().max(20).required().messages({
    "string.empty": "O telefone é obrigatório",
    "string.max": "O telefone deve ter no máximo 20 caracteres",
    "any.required": "O telefone é obrigatório",
  }),

  email: Joi.string().email().max(150).required().messages({
    "string.email": "Email inválido",
    "string.empty": "O email é obrigatório",
    "string.max": "O email deve ter no máximo 150 caracteres",
    "any.required": "O email é obrigatório",
  }),

  password: Joi.string().min(6).max(255).allow(null, "").messages({
    "string.min": "A senha deve ter pelo menos 6 caracteres",
    "string.max": "A senha deve ter no máximo 255 caracteres",
  }),

  is_ghost: Joi.boolean().messages({
    "boolean.base": "is_ghost deve ser verdadeiro ou falso",
  }),

  address: Joi.string().max(255).required().messages({
    "string.empty": "O endereço é obrigatório",
    "string.max": "O endereço deve ter no máximo 255 caracteres",
    "any.required": "O endereço é obrigatório",
  }),

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

  latitude: Joi.number().min(-90).max(90).allow(null).messages({
    "number.base": "Latitude deve ser um número",
    "number.min": "Latitude inválida",
    "number.max": "Latitude inválida",
  }),

  longitude: Joi.number().min(-180).max(180).allow(null).messages({
    "number.base": "Longitude deve ser um número",
    "number.min": "Longitude inválida",
    "number.max": "Longitude inválida",
  }),

  role: Joi.string()
    .valid("PRECISO-DE-AJUDA", "VOLUNTARIO", "AMBOS")
    .required()
    .messages({
      "any.only": "Role deve ser PRECISO-DE-AJUDA, VOLUNTARIO ou AMBOS",
      "string.empty": "O tipo de usuário é obrigatório",
      "any.required": "O tipo de usuário é obrigatório",
    }),
});

export default (req, res, next) =>
  validUserAndRequest(req, res, next, userSchema);
