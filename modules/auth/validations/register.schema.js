const Joi = require('@hapi/joi');
const pattern = /^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/;

const RegisterValidationSchema = Joi.object().keys({
  //avatar: Joi.object().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  fullName: Joi.string().required(),
  email: Joi.string().regex(pattern).required(),
});

module.exports = {
  RegisterValidationSchema,
};
