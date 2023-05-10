const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const RegistrationsModel = require("./registrations.model");
const RegistrationsConstant = require("./registrations.constant");

const createRegistration = async (info) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::createRegistration::is called`
  );
  try {
    const newRegistration = new RegistrationsModel(info);

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::createRegistration::success`
    );
    return await newRegistration.save();
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::createRegistration::error`,
      e
    );
    throw new Error(e);
  }
};

const findRegistrationHasConditions = async ({ studentId, courseId }) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationHasConditions::is called`
  );
  try {
    const conditions = {
      isDeleted: false,
    };

    if (studentId) {
      conditions["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      conditions["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationHasConditions::success`
    );
    return await RegistrationsModel.findOne(conditions);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const getRegistrationsHasPagination = async ({ studentId, limit, page }) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::getRegistrationsHasPagination::is called`
  );
  try {
    const matchStage = {
      $match: {
        studentId: mongoose.Types.ObjectId(studentId),
        isDeleted: false,
      },
    };
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
      `${RegistrationsConstant.LOGGER.SERVICE}::getRegistrationsHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await RegistrationsModel.aggregate(query);

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::getRegistrationsHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::getRegistrationsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const mapCoursesIntoRegistrations = ({ courses, registrations }) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::mapCoursesIntoRegistrations::is called`
  );
  try {
    const result = registrations.map((registration) => {
      const course = courses.find(
        (course) => course._id.toString() === registration.courseId.toString()
      );

      return { ...registration, course };
    });

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::mapCoursesIntoRegistrations::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::mapCoursesIntoRegistrations::error`,
      e
    );
    throw new Error(e);
  }
};

const updateIsDeletedRegistrationsByCourse = async (courseId) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::updateIsDeletedRegistrationsByCourse::is called`
  );
  try {
    await RegistrationsModel.updateMany(
      { courseId: mongoose.Types.ObjectId(courseId) },
      { $set: { isDeleted: true } }
    );
    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::updateIsDeletedRegistrationsByCourse::success`
    );

    return;
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::updateIsDeletedRegistrationsByCourse::error`,
      e
    );
    throw new Error(e);
  }
};

const removeRegistrationsByCoursesId = async (coursesId) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::removeRegistrationsByCoursesId::is called`
  );
  try {
    await RegistrationsModel.updateMany(
      { courseId: { $in: coursesId } },
      { $set: { isDeleted: true } }
    );
    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::removeRegistrationsByCoursesId::success`
    );

    return;
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::removeRegistrationsByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const findRegistrationsHasConditions = async ({ studentId, courseId }) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsHasConditions::is called`
  );
  try {
    const conditions = {
      isDeleted: false,
    };

    if (studentId) {
      conditions["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    if (courseId) {
      conditions["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsHasConditions::success`
    );
    return await RegistrationsModel.find(conditions);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const findRegistrationsByCoursesId = async (coursesId) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsByCoursesId::is called`
  );
  try {
    const conditions = {
      isDeleted: false,
      courseId: {
        $in: coursesId,
      },
    };

    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsByCoursesId::success`
    );
    return await RegistrationsModel.find(conditions);
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::findRegistrationsByCoursesId::error`,
      e
    );
    throw new Error(e);
  }
};

const removeRegistrationsByStudentId = async (studentId) => {
  logger.info(
    `${RegistrationsConstant.LOGGER.SERVICE}::removeRegistrationsByStudentId::is called`
  );
  try {
    await RegistrationsModel.updateMany(
      { studentId: mongoose.Types.ObjectId(studentId) },
      { $set: { isDeleted: true } }
    );
    logger.info(
      `${RegistrationsConstant.LOGGER.SERVICE}::removeRegistrationsByStudentId::success`
    );

    return;
  } catch (e) {
    logger.error(
      `${RegistrationsConstant.LOGGER.SERVICE}::removeRegistrationsByStudentId::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createRegistration,
  findRegistrationHasConditions,
  getRegistrationsHasPagination,
  mapCoursesIntoRegistrations,
  updateIsDeletedRegistrationsByCourse,
  findRegistrationsHasConditions,
  findRegistrationsByCoursesId,
  removeRegistrationsByCoursesId,
  removeRegistrationsByStudentId,
};
