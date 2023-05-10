const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const GetCourseDetailValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
});

module.exports = {
  GetCourseDetailValidationSchema,
};
