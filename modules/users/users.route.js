const express = require("express");
const router = express.Router({});
const multer = require("multer");
const upload = multer();

const UserController = require("./users.controller");
const ParametersConstant = require("../../constants/parameters.constant");
const FileTypesConstant = require("../../constants/file-types.constant");
const RoleConstant = require("../users/users.constant");

const ValidateMiddleware = require("../../middleware/validate.middleware");
const CheckAccessTokenMiddleware = require("../../middleware/check-access-token.middleware");
const ValidateFileTypesMiddleware = require("../../middleware/validate-file-types.middleware");
const CheckRoleMiddleware = require("../../middleware/check-role.middleware");

const {
  UpdateUserInfoValidationSchema,
} = require("./validations/update-user-info.schema");
const {
  UpdateUserInfoByAdminRoleIdValidationSchema,
} = require("./validations/update-user-info-by-admin-role.schema");

router.get(
  "/",
  CheckAccessTokenMiddleware({ isRequired: true }),
  UserController.getUserInfo
);
router.put(
  "/",
  upload.fields([{ name: "avatar" }]),
  ValidateMiddleware(UpdateUserInfoValidationSchema, [ParametersConstant.BODY]),
  ValidateFileTypesMiddleware([
    {
      name: "avatar",
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: false,
    },
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  UserController.updateUserInfo
);
router.put(
  "/:userId",
  ValidateMiddleware(UpdateUserInfoByAdminRoleIdValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  UserController.updateUserInfoByAdminRole
);

module.exports = router;
