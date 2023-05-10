const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const RemoveTheCourseFromFavotitesValidationSchema = Joi.object().keys({
  courseId: Joi.objectId().required(),
});

module.exports = {
  RemoveTheCourseFromFavotitesValidationSchema,
};
