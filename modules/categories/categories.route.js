const express = require("express");
const router = express.Router({});

const CategoriesController = require("./categories.controller");
const ParametersConstant = require("../../constants/parameters.constant");
const UsersConstant = require("../users/users.constant");
const CoursesController = require("../courses/courses.controller");

const ValidateMiddleware = require("../../middleware/validate.middleware");
const CheckAccessTokenMiddleware = require("../../middleware/check-access-token.middleware");
const CheckRoleMiddleware = require("../../middleware/check-role.middleware");

const {
  AddCategoryValidationSchema,
} = require("./validations/add-category.schema");
const {
  GetCategoryDetailsValidationSchema,
} = require("./validations/get-category-details.schema");
const {
  UpdateCategoryValidationSchema,
} = require("./validations/update-category.schema");
const {
  DeleteCategoryValidationSchema,
} = require("./validations/delete-category.schema");
const {
  GetCoursesListByCategoryIdValidationSchema,
} = require("../courses/validations/get-courses-list-by-category-id.schema");

router.post(
  "/",
  ValidateMiddleware(AddCategoryValidationSchema, [ParametersConstant.BODY]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.addCategory
);
router.get(
  "/:categoryId",
  ValidateMiddleware(GetCategoryDetailsValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.getCategoryDetails
);
router.put(
  "/:categoryId",
  ValidateMiddleware(UpdateCategoryValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.BODY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.updateCategory
);
router.delete(
  "/:categoryId",
  ValidateMiddleware(DeleteCategoryValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([UsersConstant.ROLE.ADMIN]),
  CategoriesController.deleteCategory
);
router.get(
  "/:categoryId/courses/",
  ValidateMiddleware(GetCoursesListByCategoryIdValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: false }),
  CoursesController.getCoursesListByCategory
);

module.exports = router;
