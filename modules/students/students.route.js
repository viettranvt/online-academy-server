const express = require('express');
const router = express.Router({});

const RoleConstant = require('../users/users.constant');
const ParametersConstant = require('../../constants/parameters.constant');
const StudentsControllers = require('./students.controller');
const RegistrationsController = require('../registrations/registrations.controller');

const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');

const {
  GetStudentsListValidationSchema,
} = require('./validations/get-students-list.schema');
const {
  GetStudentDetailValidationSchema,
} = require('./validations/get-student-detail.schema');
const {
  DeleteStudentValidationSchema,
} = require('./validations/delete-student.schema');
const {
  GetCoursesListRegisteredValidationSchema,
} = require('../registrations/validations/get-courses-list-registered.schema');

router.get(
  '/',
  ValidateMiddleware(GetStudentsListValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.getStudentsList
);
router.get(
  '/:studentId/',
  ValidateMiddleware(GetStudentDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.getStudentDetail
);
router.delete(
  '/:studentId/',
  ValidateMiddleware(DeleteStudentValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  StudentsControllers.deleteStudent
);
router.get(
  '/courses/registrations/',
  ValidateMiddleware(GetCoursesListRegisteredValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  RegistrationsController.getCoursesListRegistered
);

module.exports = router;
