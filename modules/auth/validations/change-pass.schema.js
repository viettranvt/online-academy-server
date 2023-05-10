const Joi = require('@hapi/joi');
const pattern = /^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/;

const ChangePassValidationSchema = Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmNewPassword: Joi.string().required(),
});

module.exports = {
    ChangePassValidationSchema,
};