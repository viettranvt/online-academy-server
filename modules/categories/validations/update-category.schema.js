const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const UpdateCategoryValidationSchema = Joi.object().keys({
  categoryId: Joi.string().required(),
  name: Joi.string(),
  categoryClusterId: Joi.objectId(),
});

module.exports = {
  UpdateCategoryValidationSchema,
};
