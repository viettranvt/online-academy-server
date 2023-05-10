const streamifier = require('streamifier');
const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const { getVideoDurationInSeconds } = require('get-video-duration');

module.exports = (file) => {
  logger.info(`SERVICE::getDuration::is called`);
  return new Promise(async (res, rej) => {
    try {
      const stream = streamifier.createReadStream(file.buffer);
      const duration = await getVideoDurationInSeconds(stream);

      logger.info(`SERVICE::getDuration::success`);
      return res(duration);
    } catch (e) {
      logger.error(`SERVICE::getDuration::error`, e);
      return rej(e);
    }
  });
};
