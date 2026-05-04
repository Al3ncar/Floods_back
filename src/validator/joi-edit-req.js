const Joi = require("joi");
import { validUserAndRequest } from "../utils/joi-valid.js";

const updateRequestSchema = Joi.object({
  city: Joi.string().max(100).messages({
    "string.max": "A cidade deve ter no máximo 100 caracteres",
  }),

  state: Joi.string().length(2).messages({
    "string.length": "O estado deve ter 2 caracteres (ex: SP)",
  }),

  neighborhood: Joi.string().max(100).messages({
    "string.max": "O bairro deve ter no máximo 100 caracteres",
  }),

  street: Joi.string().max(255).messages({
    "string.max": "A rua deve ter no máximo 255 caracteres",
  }),

  need_type: Joi.string().max(50).messages({
    "string.max": "O tipo deve ter no máximo 50 caracteres",
  }),

  description: Joi.string().max(500).allow(null, "").messages({
    "string.max": "A descrição deve ter no máximo 500 caracteres",
  }),

  urgency: Joi.string().valid("BAIXO", "MEDIO", "ALTO", "CRITICO").messages({
    "any.only": "Urgência inválida",
  }),

  status: Joi.string()
    .valid("ABERTO", "EM_PROCESSO", "COMPLETO", "CANCELADO")
    .messages({
      "any.only": "Status inválido",
    }),

  occurrence_lat: Joi.number().min(-90).max(90).messages({
    "number.base": "Latitude deve ser número",
  }),

  occurrence_lng: Joi.number().min(-180).max(180).messages({
    "number.base": "Longitude deve ser número",
  }),
})
  .min(1) // 🔥 obriga pelo menos 1 campo
  .messages({
    "object.min": "Envie pelo menos um campo para atualizar",
  });

export default (req, res, next) =>
  validUserAndRequest(req, res, next, updateRequestSchema);
