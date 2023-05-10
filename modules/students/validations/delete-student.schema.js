const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const DeleteStudentValidationSchema = Joi.object().keys({
  studentId: Joi.objectId().required(),
});

module.exports = {
  DeleteStudentValidationSchema,
};
