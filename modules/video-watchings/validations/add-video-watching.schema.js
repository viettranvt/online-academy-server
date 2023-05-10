const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const AddVideosWatchingValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
  videoId: Joi.objectId().required(),
});

module.exports = {
  AddVideosWatchingValidationSchema,
};
