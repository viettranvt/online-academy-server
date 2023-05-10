const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const GetVideosByChapterValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  courseId: Joi.objectId().required(),
  chapterId: Joi.objectId().required(),
});

module.exports = {
  GetVideosByChapterValidationSchema,
};
