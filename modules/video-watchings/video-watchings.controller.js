const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const VideoWatchingsServices = require("./video-watchings.service");
const VideoWatchingsConstant = require("./video-watchings.constant");
const VideosServices = require("../videos/videos.service");
const PaginationConstant = require("../../constants/pagination.constant");
const ChaptersServices = require("../chapters/chapters.service");

const getVideoWatchings = async (req, res, next) => {
  logger.info(
    `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::is called`
  );
  try {
    const { course } = req;
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          VideoWatchingsConstant.MESSAGES.GET_VIDEO_WATCHINGS.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let videoWatchings = await VideoWatchingsServices.getVideoWatchingsHasPagination(
      { courseId: course._id, studentId: roleInfo._id, page, limit }
    );

    let { entries } = videoWatchings[0];
    const meta =
      videoWatchings[0].meta.length > 0
        ? videoWatchings[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length > 0) {
      const videosId = entries.map((info) => info.videoId);
      const videos = await VideosServices.findVideoByVideosId(videosId);

      const chaptersId = videos.map((video) => video.chapterId);
      const chapters = await ChaptersServices.findChaptersByIds(chaptersId);

      entries = VideoWatchingsServices.mapVideosIntoVideoWatchings({
        videoWatchings: entries,
        videos,
        chapters,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        VideoWatchingsConstant.MESSAGES.GET_VIDEO_WATCHINGS
          .GET_VIDEO_WATCHINGS_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${VideoWatchingsConstant.LOGGER.CONTROLLER}::getVideoWatchings::error`,
      e
    );
    return next(e);
  }
};

const addVideoWatching = async (req, res, next) => {
  logger.info(
    `${VideoWatchingsConstant.LOGGER.CONTROLLER}::addVideoWatching::is called`
  );
  try {
    const { course } = req;
    const { videoId } = req.body;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          VideoWatchingsConstant.MESSAGES.ADD_VIDEO_WATCHING.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${VideoWatchingsConstant.LOGGER.CONTROLLER}::addVideoWatching::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const video = await VideosServices.getVideoById(videoId);

    if (!video) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          VideoWatchingsConstant.MESSAGES.ADD_VIDEO_WATCHING.VIDEO_NOT_FOUND,
        ],
      };

      logger.info(
        `${VideoWatchingsConstant.LOGGER.CONTROLLER}::addVideoWatching::video not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    await VideoWatchingsServices.createVideoWatching({
      studentId: roleInfo._id,
      videoId,
      courseId: course._id,
    });
    await VideosServices.updateNumberOfViews({ videoId, cumulativeValue: 1 });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        VideoWatchingsConstant.MESSAGES.ADD_VIDEO_WATCHING
          .ADDED_VIDEO_WATCHING_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${VideoWatchingsConstant.LOGGER.CONTROLLER}::addVideoWatching::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${VideoWatchingsConstant.LOGGER.CONTROLLER}::addVideoWatching::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getVideoWatchings,
  addVideoWatching,
};
