const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const AddChapterValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
  title: Joi.string().required(),
});

module.exports = {
  AddChapterValidationSchema,
};
