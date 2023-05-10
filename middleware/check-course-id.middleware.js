const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const logger = log4js.getLogger('Middlewares');

const LoggerConstant = require('../constants/logger.constant');
const CoursesServices = require('../modules/courses/courses.service');

module.exports = ({ isLecturer }) => async (req, res, next) => {
  logger.info(`${LoggerConstant.MIDDLEWARE.CHECK_COURSE_ID}::is called`);
  try {
    const { courseId } = req.params;

    let conditions = {
      courseId,
    };

    if (isLecturer) {
      const { user } = req;
      const lecturerId = user.roleInfo._id;

      conditions['lecturerId'] = lecturerId;
    }

    const course = await CoursesServices.findCourseHasConditions(conditions);

    if (!course) {
      logger.info(
        `${LoggerConstant.MIDDLEWARE.CHECK_COURSE_ID}::course not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        messages: ['COURSE_NOT_FOUND'],
      });
    }

    req.course = course;

    logger.info(`${LoggerConstant.MIDDLEWARE.CHECK_COURSE_ID}::success`);
    return next();
  } catch (e) {
    logger.error(`${LoggerConstant.MIDDLEWARE.CHECK_COURSE_ID}::error`, e);
    const msg = e.message ? e.message : JSON.stringify(e);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [msg],
      data: {},
    });
  }
};
