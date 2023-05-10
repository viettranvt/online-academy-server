const log4js = require("log4js");
const logger = log4js.getLogger("Middleware");
const HttpStatus = require("http-status-codes");

const Services = require("../services/services");
const LoggerConstant = require("../constants/logger.constant");
const FileTypes = require("../constants/file-types.constant");

module.exports = (filesInfo) => (req, res, next) => {
  logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::is called`);
  try {
    const files = req.files;
    let isError = false;
    let responseData = null;

    filesInfo.forEach((info) => {
      if (
        (!files && !info.isRequired) ||
        (Object.keys(files).length == 0 && !info.isRequired)
      ) {
        logger.info(
          `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::${info.name} is not required`
        );

        return;
      }

      if (
        !files ||
        !files[info.name] ||
        !files[info.name][0] ||
        !files[info.name][0]["mimetype"]
      ) {
        logger.info(
          `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::${info.name} is required`
        );
        isError = true;
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [`${info.name} is required`],
          data: {},
        };

        return;
      }

      const file = files[info.name][0];
      const isValid = info.fileTypes.find((type) =>
        file["mimetype"].includes(type)
      );

      if (!isValid) {
        logger.info(
          `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::${info.name} is an invalid file type`
        );
        isError = true;
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [`${info.name} is an invalid file type`],
          data: {},
        };

        return;
      }

      if (file) {
        const size = Services.rounding(file.size / (1024 * 1024));

        if (info.fileTypes[0] === FileTypes.IMAGE && size > 10 && !isError) {
          logger.info(
            `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::${info.name} file are larger than 10mb`
          );
          isError = true;
          responseData = {
            status: HttpStatus.BAD_REQUEST,
            messages: [`IMAGE_FILE_ARE_LARGER_THAN_10MB`],
            data: {},
          };

          return;
        }

        if (info.fileTypes[0] === FileTypes.VIDEO && size > 100 && !isError) {
          logger.info(
            `${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::${info.name} file are larger than 100mb`
          );
          isError = true;
          responseData = {
            status: HttpStatus.BAD_REQUEST,
            messages: [`VIDEO_FILE_ARE_LARGER_THAN_100MB`],
            data: {},
          };

          return;
        }
      }
    });

    if (isError) {
      return res.status(responseData.status).json(responseData);
    }

    logger.info(`${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::success`);
    return next();
  } catch (e) {
    logger.error(`${LoggerConstant.MIDDLEWARE.VALIDATE_FILE_TYPES}::error`, e);
    const msg = e.message ? e.message : JSON.stringify(e);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: [msg],
      data: {},
    });
  }
};
