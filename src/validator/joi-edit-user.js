import Joi from "joi";

import { validUserAndRequest } from "../utils/joi-valid.js";

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(150).required().messages({
    'string.empty': 'O nome é obrigatório',
  }),

  phone: Joi.string().max(20).required().messages({
    'string.empty': 'O telefone é obrigatório',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
  }),

  password: Joi.string().min(6).required().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
  }),

  is_ghost: Joi.boolean().default(false),

  address: Joi.string().max(255).required(),
  city: Joi.string().max(100).required(),

  state: Joi.string().length(2).required().messages({
    'string.length': 'Estado deve ter 2 letras (ex: SP)',
  }),

  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),

  can_help: Joi.boolean().required(),
  can_request_help: Joi.boolean().required(),
})
  .custom((value, helpers) => {
    if (!value.can_help && !value.can_request_help) {
      return helpers.error('any.invalid');
    }
    return value;
  })
  .messages({
    'any.invalid':
      'O usuário deve poder ajudar ou solicitar ajuda',
  });


export default (req, res, next) =>
  validUserAndRequest(req, res, next, requestSchema);