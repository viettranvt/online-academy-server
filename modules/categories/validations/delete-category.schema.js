const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const DeleteCategoryValidationSchema = Joi.object().keys({
  categoryId: Joi.objectId().required(),
});

module.exports = {
  DeleteCategoryValidationSchema,
};
