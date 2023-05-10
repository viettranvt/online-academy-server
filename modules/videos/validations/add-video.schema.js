const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const AddVideoValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
  chapterId: Joi.objectId().required(),
  title: Joi.string().required(),
});

module.exports = {
  AddVideoValidationSchema,
};
