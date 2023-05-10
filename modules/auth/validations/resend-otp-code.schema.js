const Joi = require("@hapi/joi");
const pattern = /^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/;

const ResendOtpCodeValidationSchema = Joi.object().keys({
  email: Joi.string().regex(pattern).required(),
});

module.exports = {
  ResendOtpCodeValidationSchema,
};
