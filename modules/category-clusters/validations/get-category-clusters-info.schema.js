const Joi = require('@hapi/joi');

const GetCategoryClustersValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
});

module.exports = {
  GetCategoryClustersValidationSchema,
};
