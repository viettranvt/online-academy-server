const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const UpdateCourseValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
  categoryId: Joi.objectId(),
  title: Joi.string(),
  description: Joi.string(),
  content: Joi.string(),
  tuition: Joi.number().min(0),
  discountPercent: Joi.number().min(0).max(1),
  isFinished: Joi.boolean(),
});

module.exports = {
  UpdateCourseValidationSchema,
};
