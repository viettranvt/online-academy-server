const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");
const slug = require("slug");

const CoursesModel = require("./courses.model");
const CoursesConstant = require("./courses.constant");
const cloudinary = require("../../utils/cloudinary");
const FileTypesCloudDinaryConstant = require("../../constants/file-types-cloudinary.constant");
const RegistrationsServices = require("../registrations/registrations.service");

const findCourseHasConditions = async ({ lecturerId, courseId }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCourseHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };

    if (lecturerId) {
      conditions["lecturerId"] = mongoose.Types.ObjectId(lecturerId);
    }

    if (courseId) {
      conditions["_id"] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCourseHasConditions::success`
    );
    return await CoursesModel.findOne(conditions);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCourseHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const createCourse = async (courseInfo) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::createCourse::is called`);
  try {
    const newCourse = new CoursesModel(courseInfo);

    logger.info(`${CoursesConstant.LOGGER.SERVICE}::createCourse::success`);
    return newCourse.save();
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.SERVICE}::createCourse::error`, e);
    throw new Error(e);
  }
};

const updateCourse = async ({ course, updateInfo }) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::updateCourse::is called`);
  try {
    let isChange = false;

    if (updateInfo.categoryId) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update categoryId`
      );
      course["categoryId"] = updateInfo.categoryId;
      isChange = true;
    }

    if (updateInfo.title) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update title`
      );
      course["title"] = updateInfo.title;
      isChange = true;
    }

    if (updateInfo.description) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update description`
      );
      course["description"] = updateInfo.description;
      isChange = true;
    }

    if (updateInfo.content) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update content`
      );
      course["content"] = updateInfo.content;
      isChange = true;
    }

    if (updateInfo.tuition) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update tuition`
      );
      course["content"] = updateInfo.content;
      course["tuition"] = updateInfo.tuition;
      isChange = true;
    }

    if (updateInfo.discountPercent) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update discountPercent`
      );
      course["discountPercent"] = updateInfo.discountPercent;
      isChange = true;
    }

    if (updateInfo.thumbnail) {
      if (course["publicId"]) {
        logger.info(
          `${CoursesConstant.LOGGER.SERVICE}::updateCourse::remove image`
        );
        await cloudinary.deleteFile(course["publicId"]);
      }

      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update image`
      );
      const thumbnailInfo = await cloudinary.uploadByBuffer(
        updateInfo.thumbnail,
        FileTypesCloudDinaryConstant.image
      );
      course["thumbnailUrl"] = thumbnailInfo.url;
      course["publicId"] = thumbnailInfo.public_id;
      isChange = true;
    }

    if (updateInfo.tuitionAfterDiscount) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update tuitionAfterDiscount`
      );
      course["tuitionAfterDiscount"] = updateInfo.tuitionAfterDiscount;
      isChange = true;
    }

    if (
      updateInfo.isFinished === "true" ||
      updateInfo.isFinished === true ||
      updateInfo.isFinished === "false" ||
      updateInfo.isFinished === false
    ) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update isFinished`
      );
      course["isFinished"] = updateInfo.isFinished;
      isChange = true;
    }

    if (updateInfo.slug) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update slug`
      );
      course["slug"] = updateInfo.slug;
      isChange = true;
    }

    if (isChange) {
      course["updatedAtByLecturer"] = new Date();

      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::updateCourse::update course`
      );
      return await course.save();
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateCourse:: course not change`
    );
    return course;
  } catch (e) {
    logger.error(`${CoursesConstant.LOGGER.SERVICE}::updateCourse::error`, e);
    throw new Error(e);
  }
};

const findCoursesByIds = (coursesId) => {
  logger.info(`${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::is called`);
  try {
    const courses = CoursesModel.find({ _id: { $in: coursesId } });

    logger.info(`${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::success`);
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByIds::error`,
      e
    );
    throw new Error(e);
  }
};

const getCoursesByConditionsHasPagination = async ({
  limit,
  page,
  keyword,
  categoryId,
  isSortUpAscending,
  sortBy,
  lecturerId,
}) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::getCoursesByConditionsHasPagination::is called`
  );
  try {
    let matchStage = {
      $match: {
        isDeleted: false,
      },
    };

    if (lecturerId) {
      matchStage.$match["lecturerId"] = mongoose.Types.ObjectId(lecturerId);
    }

    if (categoryId) {
      matchStage.$match["categoryId"] = mongoose.Types.ObjectId(categoryId);
    }

    if (keyword) {
      matchStage.$match["$or"] = [
        {
          $text: { $search: slug(keyword) },
        },
        // {
        //   description: {
        //     $regex: keyword,
        //     $options: 'i',
        //   },
        // },
        // {
        //   content: {
        //     $regex: keyword,
        //     $options: 'i',
        //   },
        // },
      ];
    }

    let sortStage = {
      $sort: {},
    };

    if (sortBy) {
      if (sortBy === "tuition") {
        sortStage.$sort["tuitionAfterDiscount"] =
          isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
      } else {
        sortStage.$sort[sortBy] =
          isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
      }
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
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesByConditionsHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await CoursesModel.aggregate(query);

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesByConditionsHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesByConditionsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfRegistrations = async ({ courseId, cumulativeValue }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfRegistrations::is called`
  );
  try {
    const condition = { $inc: { numberOfRegistrations: cumulativeValue } };

    await CoursesModel.updateOne(
      { _id: mongoose.Types.ObjectId(courseId) },
      condition
    );

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfRegistrations::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfRegistrations::error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfViews = async ({ courseId, cumulativeValue }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfViews::is called`
  );
  try {
    const condition = { $inc: { numberOfViews: cumulativeValue } };

    await CoursesModel.updateOne(
      { _id: mongoose.Types.ObjectId(courseId) },
      condition
    );

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfViews::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::updateNumberOfViews::error`,
      e
    );
    throw new Error(e);
  }
};

const getCoursesListForHomePage = async ({
  startDate,
  endDate,
  limit,
  findBy,
  isSortUpAscending,
  isSortCreatedAt,
  isCreatedAtSortUpAscending,
  coursesId,
}) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::is called`
  );
  try {
    let sortStage = {};
    let conditions = {
      isDeleted: false,
    };

    if (findBy) {
      if (findBy === "averageRating") {
        sortStage["numberOfRatings"] =
          isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
      }

      sortStage[findBy] =
        isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
    }

    if (isSortCreatedAt) {
      sortStage["createdAt"] =
        isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
    }

    if (startDate && endDate) {
      conditions["createdAt"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (coursesId && coursesId.length > 0) {
      conditions["_id"] = {
        $in: coursesId,
      };
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::query`,
      JSON.stringify(conditions),
      JSON.stringify(sortStage)
    );

    const courses = await CoursesModel.find(conditions)
      .sort(sortStage)
      .limit(limit);

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::success`
    );
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::getCoursesListForHomePage::error`,
      e
    );
    throw new Error(e);
  }
};

const getCategoryWithTheMostEnrollmentCourses = async (limit) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::is called`
  );
  try {
    const matchStage = {
      $match: {
        isDeleted: false,
      },
    };

    const projectStage = {
      $project: {
        categoryId: 1,
        numberOfRegistrations: 1,
      },
    };

    const sortStage = {
      $sort: {
        categoryId: -1,
      },
    };

    const groupStage = {
      $group: {
        _id: "$categoryId",
        totalRegistration: {
          $sum: "$numberOfRegistrations",
        },
      },
    };

    const sortStage1 = {
      $sort: {
        totalRegistration: -1,
      },
    };

    const limitStage = {
      $limit: limit,
    };

    const query = [
      matchStage,
      projectStage,
      sortStage,
      groupStage,
      sortStage1,
      limitStage,
    ];
    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::query`,
      JSON.stringify(query)
    );
    const result = await CoursesModel.aggregate(query);

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::getCategoryWithTheMostEnrollmentCourses::error`,
      e
    );
    throw new Error(e);
  }
};

const findCoursesHasConditions = async ({
  lecturerId,
  courseId,
  categoryId,
  sortBy,
  isSortUpAscending,
  limit,
  coursesIsExcluded,
}) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::is called`
  );
  try {
    let conditions = {
      isDeleted: false,
    };
    let sortStage = {};

    if (lecturerId) {
      conditions["lecturerId"] = mongoose.Types.ObjectId(lecturerId);
    }

    if (courseId) {
      conditions["_id"] = mongoose.Types.ObjectId(courseId);
    }

    if (categoryId) {
      console.log("dsd");
      conditions["categoryId"] = mongoose.Types.ObjectId(categoryId);
    }

    if (coursesIsExcluded) {
      conditions["_id"] = {
        $nin: coursesIsExcluded,
      };
    }

    if (sortBy) {
      sortStage[sortBy] =
        isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::conditions`,
      JSON.stringify(conditions)
    );
    if (sortBy && limit) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::find by sort and limit success`
      );
      return await CoursesModel.find(conditions).sort(sortStage).limit(limit);
    }

    if (sortBy) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::find by sort success`
      );
      return await CoursesModel.find(conditions).sort(sortStage);
    }

    if (limit) {
      logger.info(
        `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::find by limit success`
      );
      return await CoursesModel.find(conditions).limit(limit);
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::success`
    );
    return await CoursesModel.find(conditions);
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const mapIsRegisteredFieldIntoCourses = async ({ roleId, courses }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::mapIsRegisteredFieldIntoCourses::is called`
  );
  try {
    let result = [];

    for (const course of courses) {
      const courseJsonParse = JSON.parse(JSON.stringify(course));

      if (roleId) {
        const registration = await RegistrationsServices.findRegistrationHasConditions(
          { studentId: roleId, courseId: course._id }
        );

        if (registration) {
          result.push({ ...courseJsonParse, isRegistered: true });
        } else {
          result.push({ ...courseJsonParse, isRegistered: false });
        }
      } else {
        result.push({ ...courseJsonParse, isRegistered: false });
      }
    }

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::mapIsRegisteredFieldIntoCourses::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::mapIsRegisteredFieldIntoCourses::error`,
      e
    );
    throw new Error(e);
  }
};

const findRegisteredCoursesByCategoryId = async (categoryId) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findRegisteredCoursesByCategoryId::is called`
  );
  try {
    const course = await CoursesModel.findOne({
      categoryId: mongoose.Types.ObjectId(categoryId),
      numberOfRegistrations: { $gt: 0 },
      isDeleted: false,
    });

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findRegisteredCoursesByCategoryId::is called`
    );
    return course;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findRegisteredCoursesByCategoryId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeCoursesByCategoryId = async ({ categoryId }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::removeCoursesByCategoryId::is called`
  );
  try {
    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::removeCoursesByCategoryId::success`
    );
    return await CoursesModel.updateMany(
      { categoryId: mongoose.Types.ObjectId(categoryId) },
      { $set: { isDeleted: true } }
    );
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::removeCoursesByCategoryId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeCoursesByCoursesId = async ({ coursesId }) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::removeCoursesByCoursesId::is called`
  );
  try {
    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::removeCoursesByCoursesId::success`
    );
    return await CoursesModel.updateMany(
      { _id: { $in: coursesId } },
      { $set: { isDeleted: true } }
    );
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::removeCoursesByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const findCoursesByCoursesId = async (coursesId) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCoursesByCoursesId::is called`
  );
  try {
    const courses = await CoursesModel.find({
      isDeleted: false,
      _id: { $in: coursesId },
    });

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByCoursesId::success`
    );
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const findCoursesByCategoriesId = async (categoriesId) => {
  logger.info(
    `${CoursesConstant.LOGGER.SERVICE}::findCoursesByCategoriesId::is called`
  );
  try {
    const courses = await CoursesModel.find({
      categoryId: { $in: categoriesId },
    });

    logger.info(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByCategoriesId::success`
    );
    return courses;
  } catch (e) {
    logger.error(
      `${CoursesConstant.LOGGER.SERVICE}::findCoursesByCategoriesId::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findCourseHasConditions,
  createCourse,
  updateCourse,
  findCoursesByIds,
  getCoursesByConditionsHasPagination,
  updateNumberOfRegistrations,
  getCoursesListForHomePage,
  updateNumberOfViews,
  getCategoryWithTheMostEnrollmentCourses,
  findCoursesHasConditions,
  mapIsRegisteredFieldIntoCourses,
  findRegisteredCoursesByCategoryId,
  removeCoursesByCategoryId,
  removeCoursesByCoursesId,
  findCoursesByCoursesId,
  findCoursesByCategoriesId,
};
