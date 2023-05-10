const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const GetCoursesListRegisteredValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

module.exports = {
  GetCoursesListRegisteredValidationSchema,
};
