const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const GetLecturerDetailValidationSchema = Joi.object().keys({
  lecturerId: Joi.objectId().required(),
});

module.exports = {
  GetLecturerDetailValidationSchema,
};
