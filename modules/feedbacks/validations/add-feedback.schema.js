const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const AddFeedbackValidationSchema = Joi.object().keys({
  content: Joi.string(),
  rating: Joi.number().min(1).max(5),
  courseId: Joi.objectId().required(),
});

module.exports = {
  AddFeedbackValidationSchema,
};
