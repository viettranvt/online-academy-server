const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const StudentsConstant = require("./students.constant");
const StudentsModel = require("./students.model");
const Services = require("../../services/services");

const findStudentByUserId = async (userId) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::findStudentByUserId::is called`
  );
  try {
    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::findStudentByUserId::success`
    );

    return await StudentsModel.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::findStudentByUserId::Error`,
      e
    );
    throw new Error(e);
  }
};

const createStudent = async (userId) => {
  logger.info(`${StudentsConstant.LOGGER.SERVICE}::createStudent::is called`);
  try {
    const newUser = new StudentsModel({
      userId,
    });

    logger.info(`${StudentsConstant.LOGGER.SERVICE}::createStudent::success`);
    return newUser.save();
  } catch (e) {
    logger.error(`${StudentsConstant.LOGGER.SERVICE}::createStudent::Error`, e);
    throw new Error(e);
  }
};

const updateNumberOfCoursesRegistered = async ({
  studentId,
  cumulativeValue,
}) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegistered::is called`
  );
  try {
    const condition = { $inc: { numberOfCoursesRegistered: cumulativeValue } };

    await StudentsModel.updateOne(
      { _id: mongoose.Types.ObjectId(studentId) },
      condition
    );

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegistered::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegistered::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfFavoriteCourses = async ({
  studentId,
  cumulativeValue,
}) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCourses::is called`
  );
  try {
    const condition = { $inc: { numberOfFavoriteCourses: cumulativeValue } };

    await StudentsModel.updateOne(
      { _id: mongoose.Types.ObjectId(studentId) },
      condition
    );

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCourses::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCourses::Error`,
      e
    );
    throw new Error(e);
  }
};

const getStudentsByUsersId = async (usersId) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::getStudentsByUsersId::is called`
  );
  try {
    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::getStudentsByUsersId::success`
    );
    return await StudentsModel.find({ userId: { $in: usersId } });
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::getStudentsByUsersId::Error`,
      e
    );
    throw new Error(e);
  }
};

const mapStudentsIntoUsers = ({ users, students }) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::mapStudentsIntoUsers::is called`
  );
  try {
    const result = users.map((user) => {
      const usersJsonParse = Services.deleteFieldsUser(user);
      const student = students.find(
        (student) => user._id.toString() === student.userId.toString()
      );
      return { ...usersJsonParse, roleInfo: student };
    });

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::mapStudentsIntoUsers::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::mapStudentsIntoUsers::Error`,
      e
    );
    throw new Error(e);
  }
};

const getStudentsByIds = async (ids) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::getStudentsByIds::is called`
  );
  try {
    const students = await StudentsModel.find({ _id: { $in: ids } });

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::getStudentsByIds::success`
    );
    return students;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::getStudentsByIds::Error`,
      e
    );
    throw new Error(e);
  }
};

const getStudentById = async (id) => {
  logger.info(`${StudentsConstant.LOGGER.SERVICE}::getStudentById::is called`);
  try {
    const student = await StudentsModel.findOne({
      _id: mongoose.Types.ObjectId(id),
    });

    logger.info(`${StudentsConstant.LOGGER.SERVICE}::getStudentById::success`);
    return student;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::getStudentById::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfCoursesRegisteredByStudentsId = async ({
  studentsId,
  cumulativeValue,
}) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegisteredByStudentsId::is called`
  );
  try {
    const condition = { $inc: { numberOfCoursesRegistered: cumulativeValue } };

    await StudentsModel.updateMany({ _id: { $in: studentsId } }, condition);

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegisteredByStudentsId::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfCoursesRegisteredByStudentsId::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfFavoriteCoursesByStudentsId = async ({
  studentsId,
  cumulativeValue,
}) => {
  logger.info(
    `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCoursesByStudentsId::is called`
  );
  try {
    const condition = { $inc: { numberOfFavoriteCourses: cumulativeValue } };

    await StudentsModel.updateOne({ _id: { $in: studentsId } }, condition);

    logger.info(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCoursesByStudentsId::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${StudentsConstant.LOGGER.SERVICE}::updateNumberOfFavoriteCoursesByStudentsId::Error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findStudentByUserId,
  createStudent,
  updateNumberOfCoursesRegistered,
  updateNumberOfFavoriteCourses,
  getStudentsByUsersId,
  mapStudentsIntoUsers,
  getStudentsByIds,
  getStudentById,
  updateNumberOfCoursesRegisteredByStudentsId,
  updateNumberOfFavoriteCoursesByStudentsId,
};
