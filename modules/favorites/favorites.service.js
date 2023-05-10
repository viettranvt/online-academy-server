const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const FavoritesModel = require("./favorites.model");
const FavoritesConstant = require("./favorites.constant");

const getFavoritesByConditionsHasPagination = async ({
  studentId,
  courseId,
  limit,
  page,
}) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::is called`
  );
  try {
    let matchStage = {
      $match: {
        isDeleted: false,
      },
    };

    if (studentId) {
      matchStage.$match["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      matchStage.$match["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    const sortStage = {
      $sort: {
        createdAt: -1,
      },
    };

    const facetStage = {
      $facet: {
        entries: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }],
      },
    };

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await FavoritesModel.aggregate(query);

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const findFavoriteHasConditions = async ({
  studentId,
  courseId,
  isDeleted,
}) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::findFavoriteHasConditions::is called`
  );
  try {
    let conditions = {};

    if (isDeleted === true || isDeleted === "true") {
      conditions["isDeleted"] = true;
    }

    if (isDeleted === false || isDeleted === "false") {
      conditions["isDeleted"] = false;
    }

    if (studentId) {
      conditions["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      conditions["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    const favorite = await FavoritesModel.findOne(conditions);

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoriteHasConditions::success`
    );
    return favorite;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoriteHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const findFavoritesHasConditions = async ({ studentId, courseId }) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesHasConditions::is called`
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

    const favorite = await FavoritesModel.find(conditions);

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesHasConditions::success`
    );
    return favorite;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const createFavoriteCourse = async (info) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::createFavoriteCourse::is called`
  );
  try {
    const newFavoriteCourse = new FavoritesModel(info);

    await newFavoriteCourse.save();

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::createFavoriteCourse::success`
    );
    return newFavoriteCourse;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::createFavoriteCourse::error`,
      e
    );
    throw new Error(e);
  }
};

const mapCourseIntoFavoritesCourse = ({ courses, favoritesCourse }) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::mapCourseIntoFavoritesCourse::is called`
  );
  try {
    const result = favoritesCourse.map((favorite) => {
      const course = courses.find(
        (course) => course._id.toString() === favorite.courseId.toString()
      );

      return { ...favorite, course };
    });

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::mapCourseIntoFavoritesCourse::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::mapCourseIntoFavoritesCourse::error`,
      e
    );
    throw new Error(e);
  }
};

const updateIsDeletedByCourseId = async (courseId) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::updateIsDeletedByCourseId::is called`
  );
  try {
    await FavoritesModel.updateMany(
      { courseId: mongoose.Types.ObjectId(courseId) },
      { $set: { isDeleted: true } }
    );

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::updateIsDeletedByCourseId::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::updateIsDeletedByCourseId::error`,
      e
    );
    throw new Error(e);
  }
};

const findFavoritesByCoursesId = async (coursesId) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesByCoursesId::is called`
  );
  try {
    const favorites = await FavoritesModel.find({
      courseId: { $in: coursesId },
      isDeleted: false,
    });

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesByCoursesId::success`
    );
    return favorites;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeFavoritesByCoursesId = async (coursesId) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::removeFavoritesByCoursesId::is called`
  );
  try {
    await FavoritesModel.updateMany(
      { courseId: { $in: coursesId } },
      { $set: { isDeleted: true } }
    );

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::removeFavoritesByCoursesId::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::removeFavoritesByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeFavoritesByStudentId = async (studentId) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::removeFavoritesByStudentId::is called`
  );
  try {
    await FavoritesModel.updateMany(
      { studentId: mongoose.Types.ObjectId(studentId) },
      { $set: { isDeleted: true } }
    );

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::removeFavoritesByStudentId::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::removeFavoritesByStudentId::error`,
      e
    );
    throw new Error(e);
  }
};

const findFavoritesByCoursesIdGroupByStudentId = async (coursesId) => {
  logger.info(
    `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesByCoursesIdGroupByStudentId::is called`
  );
  try {
    const matchStage = {
      $match: {
        isDeleted: false,
        courseId: {
          $in: coursesId,
        },
      },
    };

    const projectStage = {
      $project: {
        _id: 1,
        studentId: 1,
        createdAt: 1,
      },
    };

    const sortStage = {
      $sort: {
        createdAt: -1,
      },
    };

    const groupStage = {
      $group: {
        _id: "$studentId",
        totalCourses: {
          $sum: 1,
        },
      },
    };

    const query = [matchStage, projectStage, sortStage, groupStage];

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::getFavoritesByConditionsHasPagination::query`,
      JSON.stringify(query)
    );
    const favorites = await FavoritesModel.aggregate(query);

    logger.info(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesByCoursesIdGroupByStudentId::success`
    );
    return favorites;
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.SERVICE}::findFavoritesByCoursesIdGroupByStudentId::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  getFavoritesByConditionsHasPagination,
  findFavoriteHasConditions,
  createFavoriteCourse,
  mapCourseIntoFavoritesCourse,
  findFavoritesHasConditions,
  updateIsDeletedByCourseId,
  findFavoritesByCoursesId,
  removeFavoritesByCoursesId,
  removeFavoritesByStudentId,
  findFavoritesByCoursesIdGroupByStudentId,
};
