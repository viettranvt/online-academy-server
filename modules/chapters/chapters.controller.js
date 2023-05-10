const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require('http-status-codes');

const ChaptersConstant = require('./chapters.constant');
const ChaptersServices = require('./chapters.service');

const getChapters = async (req, res, next) => {
  logger.info(`${ChaptersConstant.LOGGER.CONTROLLER}::getChapters::is called`);
  try {
    const { course } = req;
    let responseData = null;

    const chapters = await ChaptersServices.getChapters(course._id);

    responseData = {
      status: HttpStatus.OK,
      messages: [
        ChaptersConstant.MESSAGES.GET_CHAPTERS.GET_CHAPTERS_SUCCESSFULLY,
      ],
      data: {
        chapters,
      },
    };

    logger.info(`${ChaptersConstant.LOGGER.CONTROLLER}::getChapters::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${ChaptersConstant.LOGGER.CONTROLLER}::getChapters::error`,
      e
    );
    return next(e);
  }
};

const addChapter = async (req, res, next) => {
  logger.info(`${ChaptersConstant.LOGGER.CONTROLLER}::addChapter::is called`);
  try {
    const { course } = req;
    const { title } = req.body;
    let responseData = null;

    const chapter = await ChaptersServices.createChapter({
      courseId: course._id,
      title,
    });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        ChaptersConstant.MESSAGES.ADD_CHAPTER
          .CHAPTER_HAS_BEEN_ADDED_SUCCESSFULLY,
      ],
      data: {
        chapter,
      },
    };

    logger.info(`${ChaptersConstant.LOGGER.CONTROLLER}::addChapter::success`);
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(`${ChaptersConstant.LOGGER.CONTROLLER}::addChapter::error`, e);
    return next(e);
  }
};

module.exports = {
  getChapters,
  addChapter,
};
