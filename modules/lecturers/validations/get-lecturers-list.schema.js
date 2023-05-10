const Joi = require('@hapi/joi');

const GetLecturersListValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

module.exports = {
  GetLecturersListValidationSchema,
};
