const Joi = require('@hapi/joi');

const RefreshTokenValidationSchema = Joi.object().keys({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
});

module.exports = {
  RefreshTokenValidationSchema,
};
