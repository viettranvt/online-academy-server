const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const GetVideosWatchingsValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

module.exports = {
  GetVideosWatchingsValidationSchema,
};
