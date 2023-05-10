const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const RegisterTheCourseValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
});

module.exports = {
  RegisterTheCourseValidationSchema,
};
