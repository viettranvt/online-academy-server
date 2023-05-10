const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const RatingsConstant = require("./rating.constant");
const RatingsModel = require("./ratings.model");

const createRating = async (info) => {
  logger.info(`${RatingsConstant.LOGGER.SERVICE}::createRating::is called`);
  try {
    const newRating = new RatingsModel(info);

    logger.info(`${RatingsConstant.LOGGER.SERVICE}::createRating::creating...`);
    await newRating.save();

    logger.info(`${RatingsConstant.LOGGER.SERVICE}::createRating::success`);
    return newRating;
  } catch (e) {
    logger.error(`${RatingsConstant.LOGGER.SERVICE}::createRating::error`, e);
    throw new Error(e);
  }
};

const getRatingHasConditions = async ({ courseId, studentId }) => {
  logger.info(
    `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };

    if (courseId) {
      conditions["courseId"] = courseId;
    }

    if (studentId) {
      conditions["studentId"] = studentId;
    }

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::query`,
      JSON.stringify(conditions)
    );
    const rating = await RatingsModel.findOne(conditions);

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::success`
    );
    return rating;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const getRatingsHasConditions = async ({ courseId, studentId }) => {
  logger.info(
    `${RatingsConstant.LOGGER.SERVICE}::getRatingsHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };

    if (courseId) {
      conditions["courseId"] = courseId;
    }

    if (studentId) {
      conditions["studentId"] = studentId;
    }

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsHasConditions::query`,
      JSON.stringify(conditions)
    );
    const rating = await RatingsModel.find(conditions);

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsHasConditions::success`
    );
    return rating;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const getRatingsByCoursesId = async (coursesId) => {
  logger.info(
    `${RatingsConstant.LOGGER.SERVICE}::getRatingsByCoursesId::is called`
  );
  try {
    const ratings = await RatingsModel.find({
      courseId: { $in: coursesId },
      isDeleted: false,
    });

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsByCoursesId::success`
    );
    return ratings;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeRatingByCourse = async (courseId) => {
  logger.info(
    `${RatingsConstant.LOGGER.SERVICE}::removeRatingByCourse::is called`
  );
  try {
    await RatingsModel.updateMany(
      {
        courseId: mongoose.Types.ObjectId(courseId),
      },
      { $set: { isDeleted: true } }
    );

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::removeRatingByCourse::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::removeRatingByCourse::error`,
      e
    );
    throw new Error(e);
  }
};

const removeRatingByStudentId = async (studentId) => {
  logger.info(
    `${RatingsConstant.LOGGER.SERVICE}::removeRatingByStudentId::is called`
  );
  try {
    await RatingsModel.updateMany(
      {
        studentId: mongoose.Types.ObjectId(studentId),
      },
      { $set: { isDeleted: true } }
    );

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::removeRatingByStudentId::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::removeRatingByStudentId::error`,
      e
    );
    throw new Error(e);
  }
};

const getRatingsByDate = async ({ startDate, endDate }) => {
  logger.info(`${RatingsConstant.LOGGER.SERVICE}::getRatingsByDate::is called`);
  try {
    let conditions = {
      isDeleted: false,
    };

    if (startDate && endDate) {
      conditions["createdAt"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    logger.info(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsByDate::query`,
      JSON.stringify(conditions)
    );

    const ratings = await RatingsModel.find(conditions);

    logger.info(`${RatingsConstant.LOGGER.SERVICE}::getRatingsByDate::success`);
    return ratings;
  } catch (e) {
    logger.error(
      `${RatingsConstant.LOGGER.SERVICE}::getRatingsByDate::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createRating,
  getRatingHasConditions,
  getRatingsByCoursesId,
  removeRatingByCourse,
  getRatingsHasConditions,
  removeRatingByStudentId,
  getRatingsByDate,
};
