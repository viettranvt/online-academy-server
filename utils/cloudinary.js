const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const log4js = require("log4js");
const logger = log4js.getLogger("Services");

if (process.env.NODE_ENV === "test") {
  cloudinary.config({
    cloud_name: "dye8sx2yk",
    api_key: "666872169352632",
    api_secret: "QbmcqYuYX_5RddmCZx-k4CEVvHw",
  });
} else {
  cloudinary.config({
    cloud_name: "dcpiiafc6",
    api_key: "832357147372524",
    api_secret: "kAcnXN4HTp-cpr3Ac4xKNeZvi-8",
  });
}

const uploadByLink = (link) => {
  logger.info(`Utils::uploadByLink::is called`);
  return new Promise((res, rej) => {
    try {
      cloudinary.uploader.upload(link, (error, result) => {
        if (error) {
          logger.error(`Utils::uploadByLink::error`, error);
          return rej(error);
        }

        logger.info(`Utils::uploadByLink::success`);
        return res(result);
      });
    } catch (e) {
      logger.error(`Utils::uploadByLink::error`, e);
      return rej(e);
    }
  });
};

const uploadByBuffer = (file, type) => {
  return new Promise((resolve, reject) => {
    logger.info(`Utils::uploadByBuffer::is called`);
    try {
      if (!file) {
        logger.info(`Utils::uploadByBuffer::file not found`);
        return resolve({
          url: "",
        });
      }

      let stream = cloudinary.uploader.upload_stream(
        { resource_type: type },
        (error, result) => {
          if (result) {
            logger.info(`Utils::uploadByBuffer::success`);
            return resolve(result);
          } else {
            logger.error(`Utils::uploadByBuffer::error`, error);
            return reject(error);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    } catch (e) {
      logger.error(`Utils::uploadByBuffer::error`, e);
      return reject(e);
    }
  });
};

const deleteFile = (publicId) => {
  return new Promise((response, reject) => {
    logger.info(`Utils::deleteFile::is called`);
    try {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          logger.error(`Utils::deleteFile::error`, error);
          return reject(error);
        }

        logger.info(`Utils::deleteFile::success`);
        return response();
      });
    } catch (e) {
      logger.error(`Utils::deleteFile::error`, e);
      return reject(e);
    }
  });
};

module.exports = {
  uploadByBuffer,
  uploadByLink,
  deleteFile,
};
