const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const DeleteCourseDetailValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
});

module.exports = {
  DeleteCourseDetailValidationSchema,
};
