const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");
const randomString = require("randomstring");

const LecturersConstant = require("./lecturers.constant");
const LecturersServices = require("./lecturers.service");
const UsersConstant = require("../users/users.constant");
const UsersServices = require("../users/users.service");
const PaginationConstant = require("../../constants/pagination.constant");
const Services = require("../../services/services");
const SendGrid = require("../../utils/send-grid");
const AdminsServices = require("../admins/admins.service");
const CoursesServices = require("../courses/courses.service");
const RegistrationsServices = require("../registrations/registrations.service");
const StudentsServices = require("../students/students.service");
const FavoritesServices = require("../favorites/favorites.service");

const getLecturersList = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::getLecturersList::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    let responseData = null;

    const users = await UsersServices.findUsersByRoleHasPagination({
      role: UsersConstant.ROLE.LECTURER,
      page,
      limit,
    });

    let { entries } = users[0];
    const meta =
      users[0].meta.length > 0
        ? users[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length > 0) {
      const usersId = entries.map((user) => user._id);
      const lecturers = await LecturersServices.getLecturersByUsersId(usersId);

      entries = LecturersServices.mapLecturersIntoUsers({
        users: entries,
        lecturers,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.GET_LECTURERS_LIST
          .GET_LECTURERS_LIST_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturersList::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturersList::error`,
      e
    );
    return next(e);
  }
};

const getLecturerDetail = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::is called`
  );
  try {
    const { lecturerId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(lecturerId);
    const role = await LecturersServices.findLecturerByUserId(lecturerId);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          LecturersConstant.MESSAGES.GET_LECTURER_DETAIL.LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.GET_LECTURER_DETAIL
          .GET_LECTURER_DETAIL_SUCCESSFULLY,
      ],
      data: {
        student: {
          ...Services.deleteFieldsUser(user),
          roleInfo: role,
        },
      },
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerDetail::error`,
      e
    );
    return next(e);
  }
};

const deleteLecturer = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::is called`
  );
  try {
    const { lecturerId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(lecturerId);
    const role = await LecturersServices.findLecturerByUserId(lecturerId);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          LecturersConstant.MESSAGES.DELETE_LECTURER.LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const courses = await CoursesServices.findCoursesHasConditions({
      lecturerId: role._id,
    });

    if (courses.length > 0) {
      const coursesId = courses.map((course) => course._id);
      const registrations = await RegistrationsServices.findRegistrationsByCoursesId(
        coursesId
      );
      const favorites = await FavoritesServices.findFavoritesByCoursesId(
        coursesId
      );
      const studentsIdOfFavorites = favorites.map(
        (favorite) => favorite.studentId
      );
      const studentsIdOfRegistration = registrations.map(
        (registration) => registration.studentId
      );

      await CoursesServices.removeCoursesByCoursesId(coursesId);
      await AdminsServices.updateNumberOfCourses(0 - courses.length);

      if (studentsIdOfRegistration.length > 0) {
        await RegistrationsServices.removeRegistrationsByCoursesId(coursesId);

        for (const studentId of studentsIdOfRegistration) {
          await StudentsServices.updateNumberOfCoursesRegistered({
            studentId,
            cumulativeValue: -1,
          });
        }
      }

      if (studentsIdOfFavorites.length > 0) {
        await FavoritesServices.removeFavoritesByCoursesId(coursesId);

        for (const studentId of studentsIdOfFavorites) {
          await StudentsServices.updateNumberOfFavoriteCourses({
            studentId,
            cumulativeValue: -1,
          });
        }
      }
    }

    user["isDeleted"] = true;
    role["isDeleted"] = true;
    await user.save();
    await role.save();
    await AdminsServices.updateNumberOfLecturers(-1);

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.DELETE_LECTURER
          .DELETED_LECTURER_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::deleteLecturer::error`,
      e
    );
    return next(e);
  }
};

const createdLecturer = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::createdLecturer::is called`
  );
  try {
    const { email, fullName } = req.body;
    let responseData = null;

    let user = await UsersServices.findUserByNameOrEmail(email);

    if (user) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          LecturersConstant.MESSAGES.CREATE_LECTURER.EMAIL_ALREADY_EXISTS,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::createdLecturer::email already exists`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    const password = randomString.generate({
      length: 8,
      charset: "alphanumeric",
    });
    user = await UsersServices.createUserHasLecturerRole({
      email,
      password,
      fullName,
    });

    await SendGrid.sendAuthorizationMail({ email, password, fullName });
    await AdminsServices.updateNumberOfLecturers(1);

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        LecturersConstant.MESSAGES.CREATE_LECTURER
          .CREATED_LECTURER_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::createdLecturer::email already exists`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::createdLecturer::error`,
      e
    );
    return next(e);
  }
};

const getLecturerInfoForCoursePage = async (req, res, next) => {
  logger.info(
    `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerInfoForCoursePage::is called`
  );
  try {
    const { course } = req;
    let responseData = null;

    const lecturer = await LecturersServices.findLecturerById(
      course.lecturerId
    );

    if (!lecturer) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          LecturersConstant.MESSAGES.GET_LECTURER_INFO_FOR_COURSE_PAGE
            .LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerInfoForCoursePage::lecturer not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const user = await UsersServices.findUserById(lecturer.userId);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          LecturersConstant.MESSAGES.GET_LECTURER_INFO_FOR_COURSE_PAGE
            .LECTURER_NOT_FOUND,
        ],
      };

      logger.info(
        `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerInfoForCoursePage::user not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        LecturersConstant.MESSAGES.GET_LECTURER_INFO_FOR_COURSE_PAGE
          .GET_LECTURER_INFO_FOR_COURSE_PAGE_SUCCESSFULLY,
      ],
      data: {
        lecturer: {
          ...Services.deleteFieldsUser(user),
          roleInfo: lecturer,
        },
      },
    };

    logger.info(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerInfoForCoursePage::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.CONTROLLER}::getLecturerInfoForCoursePage::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getLecturersList,
  getLecturerDetail,
  deleteLecturer,
  createdLecturer,
  getLecturerInfoForCoursePage,
};
