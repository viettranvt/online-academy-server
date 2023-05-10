const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const StudentsConstant = require("./students.constant");
const StudentsServices = require("./students.service");
const UsersConstant = require("../users/users.constant");
const UsersServices = require("../users/users.service");
const PaginationConstant = require("../../constants/pagination.constant");
const Services = require("../../services/services");
const AdminsService = require("../admins/admins.service");
const RegistrationsServices = require("../registrations/registrations.service");
const CoursesServices = require("../courses/courses.service");
const Lecturers = require("../lecturers/lecturers.service");
const FavoritesServices = require("../favorites/favorites.service");
const FeedbacksServices = require("../feedbacks/feedbacks.service");
const RatingsServices = require("../ratings/ratings.services");

const getStudentsList = async (req, res, next) => {
  logger.info(
    `${StudentsConstant.LOGGER.CONTROLLER}::getStudentsList::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    let responseData = null;

    const users = await UsersServices.findUsersByRoleHasPagination({
      role: UsersConstant.ROLE.STUDENT,
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
      const students = await StudentsServices.getStudentsByUsersId(usersId);

      entries = StudentsServices.mapStudentsIntoUsers({
        users: entries,
        students,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        StudentsConstant.MESSAGES.GET_STUDENTS_LIST
          .GET_STUDENTS_LIST_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentsList::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentsList::error`,
      e
    );
    return next(e);
  }
};

const getStudentDetail = async (req, res, next) => {
  logger.info(
    `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::is called`
  );
  try {
    const { studentId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(studentId);
    const role = await StudentsServices.findStudentByUserId(studentId);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          StudentsConstant.MESSAGES.GET_STUDENT_DETAIL.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        StudentsConstant.MESSAGES.GET_STUDENT_DETAIL
          .GET_STUDENT_DETAIL_SUCCESSFULLY,
      ],
      data: {
        student: {
          ...Services.deleteFieldsUser(user),
          roleInfo: role,
        },
      },
    };

    logger.info(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.CONTROLLER}::getStudentDetail::error`,
      e
    );
    return next(e);
  }
};

const deleteStudent = async (req, res, next) => {
  logger.info(
    `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::is called`
  );
  try {
    const { studentId } = req.params;
    let responseData = null;

    const user = await UsersServices.findUserById(studentId);
    const role = await StudentsServices.findStudentByUserId(studentId);

    if (!user || !role) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [StudentsConstant.MESSAGES.DELETE_STUDENT.STUDENT_NOT_FOUND],
      };

      logger.info(
        `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const registrations = await RegistrationsServices.findRegistrationsHasConditions(
      { studentId: role._id }
    );
    const ratings = await RatingsServices.getRatingsHasConditions({
      studentId: role._id,
    });

    user["isDeleted"] = true;
    role["numberOfFavoriteCourses"] = 0;
    role["numberOfCoursesRegistered"] = 0;
    await user.save();
    await role.save();
    await AdminsService.updateNumberOfStudents(-1);
    await FavoritesServices.removeFavoritesByStudentId(role._id);
    await FeedbacksServices.removeFeedbacksByStudentId(role._id);
    await RatingsServices.removeRatingByStudentId(role._id);

    if (registrations.length > 0) {
      await RegistrationsServices.removeRegistrationsByStudentId(role._id);

      for (const registration of registrations) {
        let course = await CoursesServices.findCourseHasConditions({
          courseId: registration.courseId,
        });

        if (course) {
          const rating = ratings.find(
            (rating) => rating.courseId.toString() === course._id.toString()
          );
          course["numberOfRegistrations"] = course["numberOfRegistrations"] - 1;

          if (rating) {
            if (
              course["numberOfRatings"] < 2 ||
              course["averageRating"] === 0
            ) {
              course["numberOfRatings"] = 0;
              course["averageRating"] = 0;
            } else {
              course["numberOfRatings"] = course["numberOfRatings"] - 1;
              course["averageRating"] = Services.rounding(
                course["averageRating"] * 2 - rating.rating
              );
            }
          }

          let lecturer = await Lecturers.findLecturerById(course.lecturerId);

          if (lecturer) {
            lecturer["numberOfStudents"] = lecturer["numberOfStudents"] - 1;

            if (rating) {
              if (
                lecturer["numberOfRatings"] < 2 ||
                lecturer["averageRating"] === 0
              ) {
                lecturer["numberOfRatings"] = 0;
                lecturer["averageRating"] = 0;
              } else {
                lecturer["numberOfRatings"] = lecturer["numberOfRatings"] - 1;
                lecturer["averageRating"] = Services.rounding(
                  lecturer["averageRating"] * 2 - rating.rating
                );
              }
            }

            await lecturer.save();
          }

          await course.save();
        }
      }
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        StudentsConstant.MESSAGES.DELETE_STUDENT.DELETED_STUDENT_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.CONTROLLER}::deleteStudent::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getStudentsList,
  getStudentDetail,
  deleteStudent,
};
