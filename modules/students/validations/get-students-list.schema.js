const Joi = require('@hapi/joi');

const GetStudentsListValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

module.exports = {
  GetStudentsListValidationSchema,
};
