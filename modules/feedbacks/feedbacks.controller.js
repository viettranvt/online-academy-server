const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");
const mongoose = require("mongoose");

const FeedbacksConstant = require("./feedbacks.constant");
const FeedbacksServices = require("./feedbacks.service");
const LecturersServices = require("../lecturers/lecturers.service");
const RatingsServices = require("../ratings/ratings.services");
const RegistrationsServices = require("../registrations/registrations.service");
const PaginationConstant = require("../../constants/pagination.constant");
const Services = require("../../services/services");
const StudentServices = require("../students/students.service");
const UsersServices = require("../users/users.service");

const addFeedback = async (req, res, next) => {
  logger.info(`${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::is called`);
  try {
    const { course } = req;
    const { content } = req.body;
    const rating = Number(req.body.rating) || null;
    const { roleInfo } = req.user || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [FeedbacksConstant.MESSAGES.ADD_FEEDBACKS.STUDENT_NOT_FOUND],
      };

      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const registration = await RegistrationsServices.findRegistrationHasConditions(
      { studentId: roleInfo._id, courseId: course._id }
    );

    if (!registration) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          FeedbacksConstant.MESSAGES.ADD_FEEDBACKS
            .STUDENT_HAVE_NOT_REGISTERED_FOR_THIS_COURSE,
        ],
      };

      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::student have not registered for this course`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    const lecturer = await LecturersServices.findLecturerById(
      course.lecturerId
    );

    if (content) {
      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::create feedback`
      );
      await FeedbacksServices.createFeedback({
        courseId: course._id,
        content,
        studentId: roleInfo._id,
      });
    }

    if (rating) {
      logger.info(
        `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::create rating`
      );
      await FeedbacksServices.createRating({
        lecturer,
        course,
        studentId: roleInfo._id,
        rating,
      });
    }

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        FeedbacksConstant.MESSAGES.ADD_FEEDBACKS.ADDED_FEEDBACKS_SUCCESSFULLY,
      ],
    };

    logger.info(`${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::success`);
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::error`,
      e
    );
    return next(e);
  }
};

const getFeedbacks = async (req, res, next) => {
  logger.info(`${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::is called`);
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const { course } = req;
    let responseData = null;

    const feedbacks = await FeedbacksServices.getFeedbacksByConditionsHasPagination(
      { courseId: course._id, limit, page }
    );

    let { entries } = feedbacks[0];
    const meta =
      feedbacks[0].meta.length > 0
        ? feedbacks[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length !== 0) {
      let coursesId = entries.map((feedback) => feedback.courseId.toString());
      coursesId = coursesId
        .filter(Services.onlyUnique)
        .map((feedback) => mongoose.Types.ObjectId(feedback));

      const ratings = await RatingsServices.getRatingsByCoursesId(coursesId);
      entries = FeedbacksServices.mapRatingsIntoFeedbacks({
        ratings,
        feedbacks: entries,
      });

      const studentsId = entries.map((feedback) => feedback.studentId);
      const students = await StudentServices.getStudentsByIds(studentsId);

      const usersId = students.map((student) => student.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      entries = FeedbacksServices.mapUsersIntoFeedbacks({
        users,
        students,
        feedbacks: entries,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        FeedbacksConstant.MESSAGES.GET_FEEDBACKS.GET_FEEDBACKS_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(`${FeedbacksConstant.LOGGER.CONTROLLER}::addFeedback::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.CONTROLLER}::getFeedbacks::error`,
      e
    );
    return next(e);
  }
};
module.exports = {
  addFeedback,
  getFeedbacks,
};
