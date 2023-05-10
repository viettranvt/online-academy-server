const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const VideoWatchingsModel = require("./video-watchings.model");
const VideoWatchingsConstant = require("./video-watchings.constant");

const getVideoWatchingsHasPagination = async ({
  courseId,
  studentId,
  page,
  limit,
}) => {
  logger.info(
    `${VideoWatchingsConstant.LOGGER.SERVICE}::getVideoWatchingsHasPagination::is called`
  );
  try {
    let matchStage = {
      $match: {},
    };

    if (courseId) {
      matchStage.$match["courseId"] = mongoose.Types.ObjectId(courseId);
    }

    if (studentId) {
      matchStage.$match["studentId"] = mongoose.Types.ObjectId(studentId);
    }

    const sortStage = {
      $sort: {
        createdAt: -1,
      },
    };

    const facetStage = {
      $facet: {
        entries: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }],
      },
    };

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await VideoWatchingsModel.aggregate(query);

    logger.info(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::getVideoWatchingsHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const createVideoWatching = async (info) => {
  logger.info(
    `${VideoWatchingsConstant.LOGGER.SERVICE}::createVideoWatching::is called`
  );
  try {
    const newVideoWatching = new VideoWatchingsModel(info);

    logger.info(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::createVideoWatching::success`
    );
    return await newVideoWatching.save();
  } catch (e) {
    logger.error(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::createVideoWatching::error`,
      e
    );
    throw new Error(e);
  }
};

const mapVideosIntoVideoWatchings = ({ videoWatchings, videos, chapters }) => {
  logger.info(
    `${VideoWatchingsConstant.LOGGER.SERVICE}::mapVideosIntoVideoWatchings::is called`
  );
  try {
    const videosWatchingsJsonParse = JSON.parse(JSON.stringify(videoWatchings));

    const result = videosWatchingsJsonParse.map((videoWatching) => {
      let video = videos.find(
        (video) => video._id.toString() === videoWatching.videoId.toString()
      );

      const chapter = video
        ? chapters.find(
            (chapter) => chapter._id.toString() === video.chapterId.toString()
          )
        : null;

      return {
        ...videoWatching,
        video: video ? { ...JSON.parse(JSON.stringify(video)), chapter } : null,
      };
    });

    logger.info(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::mapVideosIntoVideoWatchings::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${VideoWatchingsConstant.LOGGER.SERVICE}::mapVideosIntoVideoWatchings::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  getVideoWatchingsHasPagination,
  createVideoWatching,
  mapVideosIntoVideoWatchings,
};
