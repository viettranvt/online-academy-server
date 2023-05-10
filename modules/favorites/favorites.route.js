const express = require("express");
const router = express.Router({});

const RoleConstant = require("../users/users.constant");
const ParametersConstant = require("../../constants/parameters.constant");
const FavoritesControllers = require("./favorites.controller");

const ValidateMiddleware = require("../../middleware/validate.middleware");
const CheckAccessTokenMiddleware = require("../../middleware/check-access-token.middleware");
const CheckRoleMiddleware = require("../../middleware/check-role.middleware");

const {
  GetFavoritesListValidationSchema,
} = require("./validations/get-favorites-list.schema");
const {
  CreateFavoritesCourseValidationSchema,
} = require("./validations/create-favorites-course.schema");
const {
  RemoveTheCourseFromFavotitesValidationSchema,
} = require("./validations/remove-the-course-from-favorites.schema");

router.get(
  "/",
  ValidateMiddleware(GetFavoritesListValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  FavoritesControllers.getFavoritesList
);
router.post(
  "/",
  ValidateMiddleware(CreateFavoritesCourseValidationSchema, [
    ParametersConstant.BODY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  FavoritesControllers.createFavoriteCourse
);
router.delete(
  "/:courseId",
  ValidateMiddleware(RemoveTheCourseFromFavotitesValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  FavoritesControllers.removeTheCourseFromFavorites
);

module.exports = router;
