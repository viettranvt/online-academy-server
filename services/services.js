const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const moment = require("moment-timezone");
const CourseModel = require("../modules/courses/courses.model");

const deleteFieldsUser = (user) => {
  logger.info(`SERVICE::deleteFieldsUser::is called`);
  try {
    let userJsonParse = JSON.parse(JSON.stringify(user));

    delete userJsonParse.passwordHash;
    delete userJsonParse.passwordSalt;
    delete userJsonParse.updatedAt;
    delete userJsonParse.refreshToken;
    delete userJsonParse.__v;
    delete userJsonParse.otpCode;

    logger.info(`SERVICE::deleteFieldsUser::Success`);

    return userJsonParse;
  } catch (e) {
    logger.error(`SERVICE::deleteFieldsUser::Error`, e);
    throw new Error(e);
  }
};

const rounding = (number) => {
  logger.info(`SERVICE::rounding::is called`);
  try {
    logger.info(`SERVICE::rounding::Success`);

    return Math.round(number * 100) / 100;
  } catch (e) {
    logger.error(`SERVICE::rounding::Error`, e);
    throw new Error(e);
  }
};

const onlyUnique = (value, index, self) => {
  logger.info(`SERVICE::onlyUnique::is called`);
  try {
    logger.info(`SERVICE::onlyUnique::success`);
    return self.indexOf(value) === index;
  } catch (e) {
    logger.error(`SERVICE::onlyUnique::Error`, e);
    throw new Error(e);
  }
};

const mapDataIntoCourse = async ({
  courses,
  categories,
  categoryClusters,
  lecturers,
  users,
}) => {
  logger.info(`SERVICE::mapDataIntoCourse::is called`);
  try {
    const query = await CourseModel.aggregate([{ $group: { _id: null, maxNumberOfRegistrations: { $max: '$numberOfRegistrations' } } }]);
    const { maxNumberOfRegistrations } = query[0];

    const result = courses.map((course) => {
      let courseJsonParse = JSON.parse(JSON.stringify(course));
      const { createdAt } = courseJsonParse;
      const startDate = moment(createdAt);
      const endDate = moment(createdAt).add(1, "day");
      courseJsonParse.isNew = moment(new Date()).isBetween(startDate, endDate);
      courseJsonParse.isBestSeller = courseJsonParse.numberOfRegistrations === maxNumberOfRegistrations;

      const category = categories.find(
        (category) =>
          category._id.toString() === courseJsonParse.categoryId.toString()
      );

      let categoryCluster = category
        ? categoryClusters.find(
          (categoryCluster) =>
            categoryCluster._id.toString() ===
            category.categoryClusterId.toString()
        )
        : null;
      categoryCluster = JSON.parse(JSON.stringify(categoryCluster));

      const lecturer = lecturers.find(
        (lecturer) => lecturer._id.toString() === course.lecturerId.toString()
      );

      let user = lecturer
        ? users.find(
          (user) => user._id.toString() === lecturer.userId.toString()
        )
        : null;

      user = user && deleteFieldsUser(user);

      if (users.length > 0) {
        return {
          ...courseJsonParse,
          lecturer: user ? { ...user, roleInfo: lecturer } : user,
          categoryCluster: categoryCluster
            ? { ...categoryCluster, categories: [category] }
            : categoryCluster,
        };
      } else {
        return {
          ...courseJsonParse,
          categoryCluster: categoryCluster
            ? { ...categoryCluster, categories: [category] }
            : categoryCluster,
        };
      }
    });
    logger.info(`SERVICE::mapDataIntoCourse::success`);
    return result;
  } catch (e) {
    logger.error(`SERVICE::mapDataIntoCourse::Error`, e);
    throw new Error(e);
  }
};

module.exports = {
  deleteFieldsUser,
  rounding,
  onlyUnique,
  mapDataIntoCourse,
};
