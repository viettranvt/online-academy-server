const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");

const CategoryClusterModel = require("./category-clusters.model");
const CategoryClusterConstant = require("./category-clusters.constant");
const CategoriesService = require("../categories/categories.service");

const getCategoryClustersInfoHasPagination = async ({ page, limit }) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::is called`
  );
  try {
    const mathStage = {
      $match: {
        isDeleted: false,
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

    const query = [mathStage, sortStage, facetStage];

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await CategoryClusterModel.aggregate(query);

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::getCategoryClustersInfoHasPagination::error`,
      e
    );
    throw new Error(e);
  }
};

const mapCategoryClusterDataWithCategoriesData = async (entries) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::mapCategoryClusterDataWithCategoriesData::is called`
  );
  try {
    let mapData = [];

    for (const categoryCluster of entries) {
      const categories = await CategoriesService.getCategoriesByCategoryClusterId(
        categoryCluster._id
      );

      mapData.push({ ...categoryCluster, categories });
    }

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::mapCategoryClusterDataWithCategoriesData::success`
    );
    return mapData;
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::mapCategoryClusterDataWithCategoriesData::error`,
      e
    );
    throw new Error(e);
  }
};

const findCategoryClustersByName = async (name) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClustersByName::is called`
  );
  try {
    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClustersByName::success`
    );
    return await CategoryClusterModel.find({
      name: {
        $regex: name,
        $options: "i",
      },
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClustersByName::error`,
      e
    );
    throw new Error(e);
  }
};

const createCategoryCluster = async (name) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::createCategoryCluster::is called`
  );
  try {
    const newCategoryCluster = new CategoryClusterModel({
      name,
    });

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::createCategoryCluster::success`
    );
    return await newCategoryCluster.save();
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::createCategoryCluster::error`,
      e
    );
    throw new Error(e);
  }
};

const findCategoryClusterById = async (categoryClusterId) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClusterById::is called`
  );
  try {
    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClusterById::success`
    );
    return await CategoryClusterModel.findOne({
      _id: mongoose.Types.ObjectId(categoryClusterId),
      isDeleted: false,
    });
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClusterById::error`,
      e
    );
    throw new Error(e);
  }
};

const findCategoryClustersByIds = async (categoryClustersId) => {
  logger.info(
    `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClustersByIds::is called`
  );
  try {
    const categoryClusters = await CategoryClusterModel.find({
      _id: { $in: categoryClustersId },
      isDeleted: false,
    });

    logger.info(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClustersByIds::success`
    );
    return categoryClusters;
  } catch (e) {
    logger.error(
      `${CategoryClusterConstant.LOGGER.SERVICE}::findCategoryClustersByIds::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  getCategoryClustersInfoHasPagination,
  mapCategoryClusterDataWithCategoriesData,
  findCategoryClustersByName,
  createCategoryCluster,
  findCategoryClusterById,
  findCategoryClustersByIds,
};
