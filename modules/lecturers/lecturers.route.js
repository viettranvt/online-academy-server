const express = require('express');
const router = express.Router({});

const RoleConstant = require('../users/users.constant');
const ParametersConstant = require('../../constants/parameters.constant');
const LecturersControllers = require('./lecturers.controller');
const CoursesControllers = require('../courses/courses.controller');

const ValidateMiddleware = require('../../middleware/validate.middleware');
const CheckAccessTokenMiddleware = require('../../middleware/check-access-token.middleware');
const CheckRoleMiddleware = require('../../middleware/check-role.middleware');

const {
  GetLecturersListValidationSchema,
} = require('./validations/get-lecturers-list.schema');
const {
  GetLecturerDetailValidationSchema,
} = require('./validations/get-lecturer-detail.schema');
const {
  DeleteLecturerValidationSchema,
} = require('./validations/delete-lecturer.schema');
const {
  CreateLecturerValidationSchema,
} = require('./validations/create-lecturer.schema');
const {
  GetCoursesListByLecturerValidationSchema,
} = require('../courses/validations/get-courses-by-lecturers.schema');

router.get(
  '/courses/',
  ValidateMiddleware(GetCoursesListByLecturerValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CoursesControllers.getCoursesListByLecturer
);
router.get(
  '/',
  ValidateMiddleware(GetLecturersListValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.getLecturersList
);
router.get(
  '/:lecturerId/',
  ValidateMiddleware(GetLecturerDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.getLecturerDetail
);
router.delete(
  '/:lecturerId/',
  ValidateMiddleware(DeleteLecturerValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.deleteLecturer
);
router.post(
  '/',
  ValidateMiddleware(CreateLecturerValidationSchema, [ParametersConstant.BODY]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  LecturersControllers.createdLecturer
);

module.exports = router;
