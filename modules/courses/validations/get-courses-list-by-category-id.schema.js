const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const GetCoursesListByCategoryIdValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  categoryId: Joi.objectId().required(),
});

module.exports = {
  GetCoursesListByCategoryIdValidationSchema,
};
