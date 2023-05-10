const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const VideosModel = require("./videos.model");
const VideosConstant = require("./videos.constant");

const createVideo = async (videoInfo) => {
  logger.info(`${VideosConstant.LOGGER.SERVICE}::createVideo::is called`);
  try {
    const newVideo = new VideosModel(videoInfo);

    logger.info(`${VideosConstant.LOGGER.SERVICE}::createVideo::success`);
    return await newVideo.save();
  } catch (e) {
    logger.error(`${VideosConstant.LOGGER.SERVICE}::createVideo::error`, e);
    throw new Error(e);
  }
};

const getVideoByChapterHasPagination = async ({ page, limit, chapterId }) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::is called`
  );
  try {
    const matchStage = {
      $match: {
        chapterId: mongoose.Types.ObjectId(chapterId),
      },
    };
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
      `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await VideosModel.aggregate(query);

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::getVideoByChapterHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const findVideoByVideosId = async (videosId) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::findVideoByVideosId::is called`
  );
  try {
    const videosIdMapObjectId = videosId.map((video) =>
      mongoose.Types.ObjectId(video)
    );

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::findVideoByVideosId::success`
    );
    return await VideosModel.find({ _id: { $in: videosIdMapObjectId } });
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::findVideoByVideosId::error`,
      e
    );
    throw new Error(e);
  }
};

const getVideosByChapterHasConditions = async ({
  limit,
  sortBy,
  isSortUpAscending,
  chapterId,
}) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::getVideosByChapterHasConditions::is called`
  );
  try {
    let conditions = {};
    let sortStage = {};

    if (chapterId) {
      logger.info(
        `${VideosConstant.LOGGER.SERVICE}::getVideosByChapterHasConditions::find by chapter`
      );
      conditions["chapterId"] = mongoose.Types.ObjectId(chapterId);
    }

    if (sortBy) {
      logger.info(
        `${VideosConstant.LOGGER.SERVICE}::getVideosByChapterHasConditions::sort`
      );
      sortStage[sortBy] =
        isSortUpAscending === true || isSortUpAscending === "true" ? 1 : -1;
    }

    if (limit) {
      logger.info(
        `${VideosConstant.LOGGER.SERVICE}::getVideosByChapterHasConditions::find by limit`,
        JSON.stringify(conditions),
        JSON.stringify(sortStage)
      );
      return await VideosModel.find(conditions).sort(sortStage).limit(limit);
    }

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::getVideosByChapterHasConditions::find by not limit`,
      JSON.stringify(conditions),
      JSON.stringify(sortStage)
    );
    return await VideosModel.find(conditions).sort(sortStage);
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::getVideosByChapterHasConditions::error`,
      e
    );
    throw new Error(e);
  }
};

const getVideoById = async (id) => {
  logger.info(`${VideosConstant.LOGGER.SERVICE}::getVideoById::is called`);
  try {
    const video = await VideosModel.findOne({
      _id: mongoose.Types.ObjectId(id),
    });

    logger.info(`${VideosConstant.LOGGER.SERVICE}::getVideoById::success`);
    return video;
  } catch (e) {
    logger.error(`${VideosConstant.LOGGER.SERVICE}::getVideoById::error`, e);
    throw new Error(e);
  }
};

const updateNumberOfViews = async ({ videoId, cumulativeValue }) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::updateNumberOfViews::is called`
  );
  try {
    const condition = { $inc: { numberOfViews: cumulativeValue } };

    await VideosModel.updateOne(
      { _id: mongoose.Types.ObjectId(videoId) },
      condition
    );

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::updateNumberOfViews::success`
    );
    return;
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::updateNumberOfViews::error`,
      e
    );
    throw new Error(e);
  }
};

const removePublicIdFieldInVideosData = ({ videos, index }) => {
  logger.info(
    `${VideosConstant.LOGGER.SERVICE}::removePublicIdFieldInVideosData::is called`
  );
  try {
    const result = videos.map((video, i) => {
      const videoJsonParse = JSON.parse(JSON.stringify(video));

      if (index === 0) {
        if (i !== 0) {
          delete videoJsonParse["publicIdOfVideo"];
        }

        return videoJsonParse;
      } else {
        delete videoJsonParse["publicIdOfVideo"];

        return videoJsonParse;
      }
    });

    logger.info(
      `${VideosConstant.LOGGER.SERVICE}::removePublicIdFieldInVideosData::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${VideosConstant.LOGGER.SERVICE}::removePublicIdFieldInVideosData::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  createVideo,
  getVideoByChapterHasPagination,
  findVideoByVideosId,
  getVideosByChapterHasConditions,
  getVideoById,
  updateNumberOfViews,
  removePublicIdFieldInVideosData,
};
