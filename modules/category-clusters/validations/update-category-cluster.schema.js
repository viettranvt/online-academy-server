const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const UpdateCategoryClustersValidationSchema = Joi.object().keys({
  name: Joi.string(),
  categoryClusterId: Joi.string().required(),
});

module.exports = {
  UpdateCategoryClustersValidationSchema,
};
