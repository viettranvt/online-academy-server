const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const RegistrationsServices = require("./registrations.service");
const RegistrationsConstant = require("./registrations.constant");
const StudentsServices = require("../students/students.service");
const CoursesServices = require("../courses/courses.service");
const PaginationConstant = require("../../constants/pagination.constant");
const LecturersServices = require("../lecturers/lecturers.service");
const CategoriesServices = require("../categories/categories.service");
const CategoryClusterServices = require("../category-clusters/category-clusters.service");
const Services = require("../../services/services");
const UsersServices = require("../users/users.service");

const registerTheCourse = async (req, res, next) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::is called`
  );
  try {
    const { course } = req;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          RegistrationsConstant.MESSAGES.REGiSTER_THE_COURSE.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let registration = await RegistrationsServices.findRegistrationHasConditions(
      { studentId: roleInfo._id, courseId: course._id }
    );

    if (registration) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          RegistrationsConstant.MESSAGES.REGiSTER_THE_COURSE
            .THE_COURSE_HAS_BEEN_REGISTERED,
        ],
      };

      logger.info(
        `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::the course has been registered
        `
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    registration = await RegistrationsServices.createRegistration({
      studentId: roleInfo._id,
      courseId: course._id,
      price: course.tuition,
    });
    await StudentsServices.updateNumberOfCoursesRegistered({
      studentId: roleInfo._id,
      cumulativeValue: 1,
    });
    await CoursesServices.updateNumberOfRegistrations({
      courseId: course._id,
      cumulativeValue: 1,
    });
    await LecturersServices.updateNumberOfStudents({
      lecturerId: course.lecturerId,
      cumulativeValue: 1,
    });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        RegistrationsConstant.MESSAGES.REGiSTER_THE_COURSE
          .SUCCESSFUL_COURSE_REGISTRATION,
      ],
      data: { registration },
    };

    logger.info(
      `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.CONTROLLER}::registerTheCourse::error`,
      e
    );
    return next(e);
  }
};

const getCoursesListRegistered = async (req, res, next) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.CONTROLLER}::getCoursesListRegistered::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          RegistrationsConstant.MESSAGES.GET_COURSES_LIST_REGISTERED
            .STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${RegistrationsConstant.LOGGER.CONTROLLER}::getCoursesListRegistered::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const registrations = await RegistrationsServices.getRegistrationsHasPagination(
      { studentId: roleInfo._id, limit, page }
    );

    let { entries } = registrations[0];
    const meta =
      registrations[0].meta.length > 0
        ? registrations[0].meta[0]
        : {
          _id: null,
          totalItems: 0,
        };

    if (entries.length > 0) {
      const coursesId = entries.map((registration) => registration.courseId);

      let courses = await CoursesServices.findCoursesByIds(coursesId);

      const categoriesId = courses.map((course) => course.categoryId);
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const lecturersId = courses.map((course) => course.lecturerId);
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      courses = await Services.mapDataIntoCourse({
        courses,
        categories,
        categoryClusters,
        lecturers,
        users,
      });

      entries = RegistrationsServices.mapCoursesIntoRegistrations({
        registrations: entries,
        courses,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        RegistrationsConstant.MESSAGES.GET_COURSES_LIST_REGISTERED
          .GET_COURSES_LIST_REGISTERED_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${RegistrationsConstant.LOGGER.CONTROLLER}::getCoursesListRegistered::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.CONTROLLER}::getCoursesListRegistered::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  registerTheCourse,
  getCoursesListRegistered,
};
