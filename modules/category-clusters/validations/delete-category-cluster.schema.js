const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const DeleteCategoryClustersValidationSchema = Joi.object().keys({
  categoryClusterId: Joi.string().required(),
});

module.exports = {
  DeleteCategoryClustersValidationSchema,
};
