const log4js = require('log4js');
const logger = log4js.getLogger('Services');
const mongoose = require('mongoose');

const HomeConstant = require('./home.constant');

const mapCategoriesIntoMostRegisteredCategory = ({
  categories,
  mostRegisteredCategory,
}) => {
  logger.info(
    `${HomeConstant.LOGGER.SERVICE}::mapCategoriesIntoMostRegisteredCategory::is called`
  );
  try {
    const result = mostRegisteredCategory.map((category) => {
      const categoryInfo = categories.find(
        (c) => c._id.toString() === category._id.toString()
      );

      if (categoryInfo) {
        const dataJsonParse = JSON.parse(JSON.stringify(categoryInfo));
        return {
          totalRegistration: category.totalRegistration,
          ...dataJsonParse,
        };
      }

      return {
        _id: category._id,
        totalRegistration: category.totalRegistration,
      };
    });

    logger.info(
      `${HomeConstant.LOGGER.SERVICE}::mapCategoriesIntoMostRegisteredCategory::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${HomeConstant.LOGGER.SERVICE}::mapCategoriesIntoMostRegisteredCategory::error`,
      e
    );
    throw new Error(e);
  }
};

module.exports = {
  mapCategoriesIntoMostRegisteredCategory,
};
