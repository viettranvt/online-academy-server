const HttpStatus = require('http-status-codes');
const log4js = require('log4js');
const logger = log4js.getLogger('Middlewares');

const LoggerConstant = require('../constants/logger.constant');

module.exports = (roles) => async (req, res, next) => {
  logger.info(
    `${LoggerConstant.MIDDLEWARE.CHECK_ROLE}::checkAdminRole::is called`
  );
  try {
    const { role } = req.user;
    const acceptedRole = roles.find((r) => r === role);

    if (!acceptedRole) {
      logger.info(
        `${LoggerConstant.MIDDLEWARE.CHECK_ROLE}::checkAdminRole::success`
      );

      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        messages: ['ACCESS_IS_NOT_ALLOWED'],
      });
    }

    logger.info(
      `${LoggerConstant.MIDDLEWARE.CHECK_ROLE}::checkAdminRole::success`
    );
    return next();
  } catch (e) {
    logger.error(
      `${LoggerConstant.MIDDLEWARE.CHECK_ROLE}::checkAdminRole::error`,
      e
    );
    const msg = e.message ? e.message : JSON.stringify(e);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [msg],
      data: {},
    });
  }
};
