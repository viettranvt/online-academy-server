const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const ChaptersModel = require("./chapters.model");
const ChaptersConstant = require("./chapters.constant");

const findChapterHasCondition = async ({ chapterId, courseId }) => {
  logger.info(
    `${ChaptersConstant.LOGGER.SERVICE}::findChapterHasCondition::is called`
  );
  try {
    let condition = {};

    if (chapterId) {
      condition["_id"] = mongoose.Types.ObjectId(chapterId);
    }

    if (courseId) {
      condition["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${ChaptersConstant.LOGGER.SERVICE}::findChapterHasCondition::success`
    );
    return await ChaptersModel.findOne(condition);
  } catch (e) {
    logger.error(
      `${ChaptersConstant.LOGGER.SERVICE}::findChapterHasCondition::error`,
      e
    );
    throw new Error(e);
  }
};

const updateNumberOfVideos = async (chapterId, cumulativeValue) => {
  logger.info(
    `${ChaptersConstant.LOGGER.SERVICE}::updateNumberOfVideos::is called`
  );
  try {
    const condition = { $inc: { numberOfVideos: cumulativeValue } };

    await ChaptersModel.updateOne(
      { _id: mongoose.Types.ObjectId(chapterId) },
      condition
    );

    logger.info(
      `${ChaptersConstant.LOGGER.SERVICE}::updateNumberOfVideos::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${ChaptersConstant.LOGGER.SERVICE}::updateNumberOfVideos::error`,
      e
    );
    throw new Error(e);
  }
};

const getChapters = async (courseId) => {
  logger.info(`${ChaptersConstant.LOGGER.SERVICE}::getChapters::is called`);
  try {
    logger.info(`${ChaptersConstant.LOGGER.SERVICE}::getChapters::success`);

    return await ChaptersModel.find({
      courseId: mongoose.Types.ObjectId(courseId),
    }).sort({ createdAt: 1 });
  } catch (e) {
    logger.error(`${ChaptersConstant.LOGGER.SERVICE}::getChapters::error`, e);
    throw new Error(e);
  }
};

const createChapter = async (chapterInfo) => {
  logger.info(`${ChaptersConstant.LOGGER.SERVICE}::createChapter::is called`);
  try {
    const newChapter = new ChaptersModel(chapterInfo);

    logger.info(`${ChaptersConstant.LOGGER.SERVICE}::createChapter::success`);
    return newChapter.save();
  } catch (e) {
    logger.error(`${ChaptersConstant.LOGGER.SERVICE}::createChapter::error`, e);
    throw new Error(e);
  }
};

const findChaptersByIds = async (chaptersId) => {
  logger.info(
    `${ChaptersConstant.LOGGER.SERVICE}::findChaptersByIds::is called`
  );
  try {
    const chapters = await ChaptersModel.find({ _id: { $in: chaptersId } });

    logger.info(
      `${ChaptersConstant.LOGGER.SERVICE}::findChaptersByIds::success`
    );
    return chapters;
  } catch (e) {
    logger.error(
      `${ChaptersConstant.LOGGER.SERVICE}::findChaptersByIds::error`,
      e
    );
    throw new Error(e);
  }
};

const findChaptersHasConditions = async ({ chapterId, courseId }) => {
  logger.info(
    `${ChaptersConstant.LOGGER.SERVICE}::findChaptersHasConditions::is called`
  );
  try {
    let conditions = {};

    if (chapterId) {
      conditions["_id"] = mongoose.Types.ObjectId(chapterId);
    }

    if (courseId) {
      conditions["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    logger.info(
      `${ChaptersConstant.LOGGER.SERVICE}::findChaptersHasConditions::success`
    );
    return await ChaptersModel.find(conditions).sort({ createdAt: 1 });
  } catch (e) {
    logger.error(
      `${ChaptersConstant.LOGGER.SERVICE}::findChaptersHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  findChapterHasCondition,
  updateNumberOfVideos,
  getChapters,
  createChapter,
  findChaptersByIds,
  findChaptersHasConditions,
};
