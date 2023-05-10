const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const UpdateUserInfoByAdminRoleIdValidationSchema = Joi.object().keys({
  userId: Joi.objectId().required(),
  isBlocked: Joi.boolean()
});

module.exports = {
  UpdateUserInfoByAdminRoleIdValidationSchema,
};
