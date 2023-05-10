const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const CourseConstant = require("../courses.constant");

const GetCoursesListByCriteriaValidationSchema = Joi.object().keys({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  keyword: Joi.string(),
  isSortUpAscending: Joi.bool(),
  sortBy: Joi.string().valid([CourseConstant.SORT_BY]),
  categoryId: Joi.objectId(),
});

module.exports = {
  GetCoursesListByCriteriaValidationSchema,
};
