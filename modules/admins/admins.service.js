const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const AdminsModel = require('./admins.model');
const AdminsConstant = require('./admins.constant');

const findAdminByUserId = async (userId) => {
  logger.info(`${AdminsConstant.LOGGER.SERVICE}::findAdminByUserId::is called`);
  try {
    logger.info(`${AdminsConstant.LOGGER.SERVICE}::findAdminByUserId::success`);

    return await AdminsModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });
  } catch (e) {
    logger.error(
      `${AdminsConstant.LOGGER.SERVICE}::findAdminByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

const createdAdmin = async (userId) => {
  logger.info(`${AdminsConstant.LOGGER.SERVICE}::createdAdmin::is called`);
  try {
    const newAdmin = new AdminsModel({
      userId,
    });

    logger.info(`${AdminsConstant.LOGGER.SERVICE}::createdAdmin::success`);
    return newAdmin.save();
  } catch (e) {
    logger.error(`${AdminsConstant.LOGGER.SERVICE}::createdAdmin::Error`, e);
    throw new Error(e);
  }
};

const updateNumberOfStudents = async (cumulativeValue) => {
  logger.info(
    `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfStudents::is called`
  );
  try {
    const condition = { $inc: { numberOfStudents: cumulativeValue } };

    await AdminsModel.updateMany({}, condition);

    logger.info(
      `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfStudents::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfStudents::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfLecturers = async (cumulativeValue) => {
  logger.info(
    `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfLecturers::is called`
  );
  try {
    const condition = { $inc: { numberOfLecturers: cumulativeValue } };

    await AdminsModel.updateMany({}, condition);

    logger.info(
      `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfLecturers::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfLecturers::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfCourses = async (cumulativeValue) => {
  logger.info(
    `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfCourses::is called`
  );
  try {
    const condition = { $inc: { numberOfCourses: cumulativeValue } };

    await AdminsModel.updateMany({}, condition);

    logger.info(
      `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfCourses::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${AdminsConstant.LOGGER.SERVICE}::updateNumberOfCourses::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findAdminByUserId,
  createdAdmin,
  updateNumberOfStudents,
  updateNumberOfLecturers,
  updateNumberOfCourses,
};
