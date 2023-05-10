const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const logger = log4js.getLogger('Middlewares');

const LoggerConstant = require('../constants/logger.constant');
const ChapterServices = require('../modules/chapters/chapters.service');

module.exports = async (req, res, next) => {
  logger.info(`${LoggerConstant.MIDDLEWARE.CHECK_CHAPTER_ID}::is called`);
  try {
    const { courseId, chapterId } = req.params;

    const chapter = await ChapterServices.findChapterHasCondition({
      chapterId,
      courseId,
    });

    if (!chapter) {
      logger.info(
        `${LoggerConstant.MIDDLEWARE.CHECK_CHAPTER_ID}::chapter not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        messages: ['CHAPTER_NOT_FOUND'],
      });
    }

    logger.info(`${LoggerConstant.MIDDLEWARE.CHECK_CHAPTER_ID}::success`);
    return next();
  } catch (e) {
    logger.error(`${LoggerConstant.MIDDLEWARE.CHECK_CHAPTER_ID}::error`, e);
    const msg = e.message ? e.message : JSON.stringify(e);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [msg],
      data: {},
    });
  }
};
