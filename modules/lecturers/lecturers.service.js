const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const LecturersModel = require("./lecturers.model");
const LecturersConstant = require("./lecturers.constant");
const Services = require("../../services/services");

const findLecturerByUserId = async (userId) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::is called`
  );
  try {
    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::success`
    );

    return await LecturersModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

const createLecturer = async (userId) => {
  logger.info(`${LecturersConstant.LOGGER.SERVICE}::createLecturer::is called`);
  try {
    const newLecturer = new LecturersModel({
      userId,
    });

    logger.info(`${LecturersConstant.LOGGER.SERVICE}::createLecturer::success`);
    return await newLecturer.save();
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::createLecturer::Error`,
      e
    );
    throw new Error(e);
  }
};

const getLecturersByUsersId = async (usersId) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::getLecturersByUsersId::is called`
  );
  try {
    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::getLecturersByUsersId::success`
    );
    return await LecturersModel.find({ userId: { $in: usersId } });
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::getLecturersByUsersId::Error`,
      e
    );
    throw new Error(e);
  }
};

const mapLecturersIntoUsers = ({ users, lecturers }) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::mapLecturersIntoUsers::is called`
  );
  try {
    const result = users.map((user) => {
      const usersJsonParse = Services.deleteFieldsUser(user);
      const lecturer = lecturers.find(
        (lecturer) => user._id.toString() === lecturer.userId.toString()
      );
      return { ...usersJsonParse, roleInfo: lecturer };
    });

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::mapLecturersIntoUsers::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::mapLecturersIntoUsers::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfCoursesPosted = async ({ lecturerId, cumulativeValue }) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::updateNumberOfCoursesPosted::is called`
  );
  try {
    const condition = { $inc: { numberOfCoursesPosted: cumulativeValue } };

    await LecturersModel.updateOne(
      { _id: mongoose.Types.ObjectId(lecturerId) },
      condition
    );

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::updateNumberOfCoursesPosted::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::updateNumberOfCoursesPosted::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfStudents = async ({ lecturerId, cumulativeValue }) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::updateNumberOfStudents::is called`
  );
  try {
    const condition = { $inc: { numberOfStudents: cumulativeValue } };

    await LecturersModel.updateOne(
      { _id: mongoose.Types.ObjectId(lecturerId) },
      condition
    );

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::updateNumberOfStudents::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::updateNumberOfStudents::Error`,
      e
    );
    throw new Error(e);
  }
};

const findLecturerById = async (lecturerId) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::findLecturerById::is called`
  );
  try {
    const lecturer = await LecturersModel.findOne({
      _id: mongoose.Types.ObjectId(lecturerId),
    });

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerById::success`
    );
    return lecturer;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::findLecturerById::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateLecturerInfo = async ({ lecturer, introduction }) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::updateLecturerInfo::is called`
  );
  try {
    let isChange = false;
    let query = { $set: {} };

    if (introduction) {
      logger.info(
        `${LecturersConstant.LOGGER.SERVICE}::updateLecturerInfo::update introduction`
      );
      query.$set["introduction"] = introduction;
      lecturer["introduction"] = introduction;
      isChange = true;
    }

    if (isChange) {
      logger.info(
        `${LecturersConstant.LOGGER.SERVICE}::updateLecturerInfo::updating...`
      );
      await LecturersModel.updateOne(
        { _id: mongoose.Types.ObjectId(lecturer._id) },
        query
      );
    }

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::updateLecturerInfo::success`
    );
    return lecturer;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::updateLecturerInfo::Error`,
      e
    );
    throw new Error(e);
  }
};

const getLecturersByIds = async (lecturersId) => {
  logger.info(
    `${LecturersConstant.LOGGER.SERVICE}::getLecturersByIds::is called`
  );
  try {
    const lecturers = await LecturersModel.find({ _id: { $in: lecturersId } });

    logger.info(
      `${LecturersConstant.LOGGER.SERVICE}::getLecturersByIds::success`
    );
    return lecturers;
  } catch (e) {
    logger.error(
      `${LecturersConstant.LOGGER.SERVICE}::getLecturersByIds::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findLecturerByUserId,
  createLecturer,
  getLecturersByUsersId,
  mapLecturersIntoUsers,
  updateNumberOfCoursesPosted,
  findLecturerById,
  updateLecturerInfo,
  updateNumberOfStudents,
  getLecturersByIds,
};
