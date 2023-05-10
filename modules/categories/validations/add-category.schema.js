const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const AddCategoryValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  categoryClusterId: Joi.objectId().required(),
});

module.exports = {
  AddCategoryValidationSchema,
};
