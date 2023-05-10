const Joi = require('@hapi/joi');

const AddCategoryClustersValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
});

module.exports = {
  AddCategoryClustersValidationSchema,
};
