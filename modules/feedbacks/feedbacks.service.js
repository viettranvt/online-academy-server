const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const FeedbacksConstant = require("./feedbacks.constant");
const FeedbacksModel = require("./feedbacks.model");
const RatingsServices = require("../ratings/ratings.services");
const Services = require("../../services/services");

const createFeedback = async (info) => {
  logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::is called`);
  try {
    const newFeedback = new FeedbacksModel(info);

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::creating...`
    );
    await newFeedback.save();

    logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::success`);
    return newFeedback;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::createFeedback::error`,
      e
    );
    throw new Error(e);
  }
};

const createRating = async ({ lecturer, course, studentId, rating }) => {
  logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createRating::is called`);
  try {
    const ratingInfo = await RatingsServices.getRatingHasConditions({
      courseId: course._id,
      studentId,
    });

    let agvRatingOfCourse = 0;
    let agvRatingOfLecturer = 0;

    if (ratingInfo) {
      const result = calculateAvgRatingWhenExistsInRatingsTable({
        lecturer,
        course,
        ratingInfo,
        rating,
      });

      agvRatingOfCourse = result.agvRatingOfCourse;
      agvRatingOfLecturer = result.agvRatingOfLecturer;

      ratingInfo["isDeleted"] = true;
    } else {
      const result = calculateAvgRatingWhenNotExistsInRatingsTable({
        lecturer,
        course,
        rating,
      });

      agvRatingOfCourse = result.agvRatingOfCourse;
      agvRatingOfLecturer = result.agvRatingOfLecturer;

      course["numberOfRatings"] = course["numberOfRatings"] + 1;
      lecturer["numberOfRatings"] = lecturer["numberOfRatings"] + 1;
    }

    const newRating = await RatingsServices.createRating({
      courseId: course._id,
      rating,
      studentId,
    });

    course["averageRating"] = agvRatingOfCourse;
    lecturer["averageRating"] = agvRatingOfLecturer;

    await course.save();
    await lecturer.save();
    ratingInfo && (await ratingInfo.save());

    logger.info(`${FeedbacksConstant.LOGGER.SERVICE}::createRating::success`);
    return newRating;
  } catch (e) {
    logger.error(`${FeedbacksConstant.LOGGER.SERVICE}::createRating::error`, e);
    throw new Error(e);
  }
};

const calculateAvgRatingWhenExistsInRatingsTable = ({
  course,
  lecturer,
  ratingInfo,
  rating,
}) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenExistsInRatingsTable::is called`
  );
  try {
    let agvRatingOfCourse = 0;
    let agvRatingOfLecturer = 0;

    if (course["numberOfRatings"] > 1) {
      let oldRatingOfCourse =
        course["averageRating"] * 2 - ratingInfo["rating"];
      oldRatingOfCourse = Services.rounding(oldRatingOfCourse);

      agvRatingOfCourse = (oldRatingOfCourse + rating) / 2;
      agvRatingOfCourse = Services.rounding(agvRatingOfCourse);
    } else {
      agvRatingOfCourse = rating;
    }

    if (lecturer["numberOfRatings"] > 1) {
      let oldRatingOfLecturer =
        lecturer["averageRating"] * 2 - ratingInfo["rating"];
      oldRatingOfLecturer = Services.rounding(oldRatingOfLecturer);

      agvRatingOfLecturer = (oldRatingOfLecturer + rating) / 2;
      agvRatingOfLecturer = Services.rounding(agvRatingOfLecturer);
    } else {
      agvRatingOfLecturer = rating;
    }

    return { agvRatingOfCourse, agvRatingOfLecturer };
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenExistsInRatingsTable::error`,
      e
    );
    throw new Error(e);
  }
};

const calculateAvgRatingWhenNotExistsInRatingsTable = ({
  course,
  lecturer,
  rating,
}) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenNotExistsInRatingsTable::is called`
  );
  try {
    let agvRatingOfCourse =
      course["averageRating"] === 0
        ? rating
        : Services.rounding((course["averageRating"] + rating) / 2);

    let agvRatingOfLecturer =
      lecturer["averageRating"] === 0
        ? rating
        : Services.rounding((lecturer["averageRating"] + rating) / 2);

    return { agvRatingOfCourse, agvRatingOfLecturer };
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::calculateAvgRatingWhenNotExistsInRatingsTable::error`,
      e
    );
    throw new Error(e);
  }
};

const getFeedbacksByConditionsHasPagination = async ({
  courseId,
  studentId,
  sortBy,
  isSortUpAscending,
  limit,
  page,
}) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksByConditionsHasPagination::is called`
  );
  try {
    let matchStage = {
      $match: {
        isDeleted: false,
      },
    };
    let sortStage = {
      $sort: {},
    };

    if (courseId) {
      matchStage.$match["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    if (studentId) {
      matchStage.$match["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    if (sortBy) {
      sortStage.$sort[sortBy] =
        isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
    } else {
      sortStage.$sort["createdAt"] =
        isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
    }

    const facetStage = {
      $facet: {
        entries: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }],
      },
    };

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksByConditionsHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await FeedbacksModel.aggregate(query);

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksByConditionsHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksByConditionsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const mapRatingsIntoFeedbacks = ({ ratings, feedbacks }) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::mapRatingsIntoFeedbacks::is called`
  );
  try {
    const result = feedbacks.map((feedback) => {
      const feedbackJsonParse = JSON.parse(JSON.stringify(feedback));
      const rating = ratings.find(
        (rating) =>
          rating.studentId.toString() === feedback.studentId.toString()
      );

      return { ...feedbackJsonParse, rating: rating || null };
    });

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::mapRatingsIntoFeedbacks::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::mapRatingsIntoFeedbacks::error`,
      e
    );
    throw new Error(e);
  }
};

const mapUsersIntoFeedbacks = ({ students, users, feedbacks }) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::mapUsersIntoFeedbacks::is called`
  );
  try {
    const result = feedbacks.map((feedback) => {
      const feedbackJsonParse = JSON.parse(JSON.stringify(feedback));
      const student = students.find(
        (student) => student._id.toString() === feedback.studentId.toString()
      );

      let user = student
        ? users.find(
            (user) => user._id.toString() === student.userId.toString()
          )
        : null;

      user = user && Services.deleteFieldsUser(user);

      return {
        ...feedbackJsonParse,
        student: user ? { ...user, roleInfo: student } : user,
      };
    });

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::mapUsersIntoFeedbacks::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::mapUsersIntoFeedbacks::error`,
      e
    );
    throw new Error(e);
  }
};

const getFeedbacksHasConditions = async ({ studentId, courseId }) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };

    if (studentId) {
      conditions["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      conditions["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    const feedbacks = await FeedbacksModel.find(conditions).sort({
      createdAt: -1,
    });

    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksHasConditions::success`
    );
    return feedbacks;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::getFeedbacksHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const removeFeedbacksByCourseId = async (courseId) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::removeFeedbacksByCourseId::is called`
  );
  try {
    await FeedbacksModel.updateMany(
      { courseId: mongoose.Types.ObjectId(courseId) },
      { $set: { isDeleted: true } }
    );
    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::removeFeedbacksByCourseId::success`
    );

    return;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::removeFeedbacksByCourseId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeFeedbacksByStudentId = async (studentId) => {
  logger.info(
    `${FeedbacksConstant.LOGGER.SERVICE}::removeFeedbacksByStudentId::is called`
  );
  try {
    await FeedbacksModel.updateMany(
      { studentId: mongoose.Types.ObjectId(studentId) },
      { $set: { isDeleted: true } }
    );
    logger.info(
      `${FeedbacksConstant.LOGGER.SERVICE}::removeFeedbacksByStudentId::success`
    );

    return;
  } catch (e) {
    logger.error(
      `${FeedbacksConstant.LOGGER.SERVICE}::removeFeedbacksByStudentId::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createFeedback,
  createRating,
  getFeedbacksByConditionsHasPagination,
  mapRatingsIntoFeedbacks,
  mapUsersIntoFeedbacks,
  getFeedbacksHasConditions,
  removeFeedbacksByCourseId,
  removeFeedbacksByStudentId,
};
