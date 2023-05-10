const Joi = require('@hapi/joi');

const ConfirmOptCodeValidationSchema = Joi.object().keys({
  otpCode: Joi.string().required(),
});

module.exports = {
  ConfirmOptCodeValidationSchema,
};
