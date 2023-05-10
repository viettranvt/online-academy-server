const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const CategoryClustersConstant = require("./category-clusters.constant");
const CategoryClustersServices = require("./category-clusters.service");
const PaginationConstant = require("../../constants/pagination.constant");
const CategoriesServices = require("../categories/categories.service");
const CoursesServices = require("../courses/courses.service");
const AdminServices = require("../admins/admins.service");
const LecturersServices = require("../lecturers/lecturers.service");
const FavoritesServices = require("../favorites/favorites.service");
const StudentsServices = require("../students/students.service");

const getCategoryClustersInfo = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    let responseData = null;

    const categoryData = await CategoryClustersServices.getCategoryClustersInfoHasPagination(
      { page, limit }
    );

    let { entries } = categoryData[0];
    const meta =
      categoryData[0].meta.length > 0
        ? categoryData[0].meta[0]
        : {
            _id: null,
            totalItems: 0,
          };

    if (entries.length !== 0) {
      entries = await CategoryClustersServices.mapCategoryClusterDataWithCategoriesData(
        entries
      );
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO
          .GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY,
      ],
      data: {
        entries,
        meta,
      },
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::getCategoryClustersInfo::error`,
      e
    );
    return next(e);
  }
};

const addCategoryCLuster = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::is called`
  );
  try {
    const { name } = req.body;
    let responseData = null;
    let categoryCluster = null;

    let categoryClusters = await CategoryClustersServices.findCategoryClustersByName(
      name
    );

    if (categoryClusters.length > 0) {
      categoryCluster = categoryClusters.find(
        (categoryCluster) =>
          categoryCluster.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      );

      if (categoryCluster) {
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [
            CategoryClustersConstant.MESSAGES.ADD_CATEGORY_CLUSTER
              .CATEGORY_CLUSTER_ALREADY_EXISTS,
          ],
        };

        logger.info(
          `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::name already exists`
        );
        return res.status(HttpStatus.BAD_REQUEST).json(responseData);
      }
    }

    categoryCluster = await CategoryClustersServices.createCategoryCluster(
      name
    );

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        CategoryClustersConstant.MESSAGES.ADD_CATEGORY_CLUSTER
          .ADD_CATEGORY_CLUSTER_SUCCESSFULLY,
      ],
      data: {
        categoryCluster,
      },
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::addCategoryCLuster::error`,
      e
    );
    return next(e);
  }
};

const updateCategoryCluster = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::is called`
  );
  try {
    const { categoryClusterId } = req.params;
    const { name } = req.body;
    let responseData = null;

    let categoryCluster = await CategoryClustersServices.findCategoryClusterById(
      categoryClusterId
    );

    if (!categoryCluster) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoryClustersConstant.MESSAGES.UPDATE_CATEGORY_CLUSTER
            .CATEGORY_CLUSTER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::category cluster not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    if (name) {
      const categoryClusters = await CategoryClustersServices.findCategoryClustersByName(
        name
      );

      if (categoryClusters.length > 0) {
        const categoryClusterInfo = categoryClusters.find(
          (categoryCluster) =>
            categoryCluster.name.toLocaleLowerCase() ===
            name.toLocaleLowerCase()
        );

        if (categoryClusterInfo) {
          responseData = {
            status: HttpStatus.BAD_REQUEST,
            messages: [
              CategoryClustersConstant.MESSAGES.UPDATE_CATEGORY_CLUSTER
                .CATEGORY_CLUSTER_ALREADY_EXISTS,
            ],
          };

          logger.info(
            `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::name already exists`
          );
          return res.status(HttpStatus.BAD_REQUEST).json(responseData);
        }
      }

      categoryCluster.name = name;
      await categoryCluster.save();
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoryClustersConstant.MESSAGES.UPDATE_CATEGORY_CLUSTER
          .UPDATE_CATEGORY_CLUSTER_SUCCESSFULLY,
      ],
      data: {
        categoryCluster,
      },
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::error`,
      e
    );
    return next(e);
  }
};

const deleteCategoryCluster = async (req, res, next) => {
  logger.info(
    `${CategoryClustersConstant.LOGGER.CONTROLLER}::deleteCategoryCluster::success`
  );
  try {
    const { categoryClusterId } = req.params;
    let responseData = null;

    let categoryCluster = await CategoryClustersServices.findCategoryClusterById(
      categoryClusterId
    );

    if (!categoryCluster) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoryClustersConstant.MESSAGES.DELETE_CATEGORY_CLUSTER
            .CATEGORY_CLUSTER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::category cluster not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const categories = await CategoriesServices.getCategoriesByCategoryClusterId(
      categoryClusterId
    );

    if (categories.length > 0) {
      const categoriesId = categories.map((category) => category._id);
      const courses = await CoursesServices.findCoursesByCategoriesId(
        categoriesId
      );

      if (courses.length > 0) {
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [
            CategoryClustersConstant.MESSAGES.DELETE_CATEGORY_CLUSTER
              .CATEGORY_CLUSTER_ALREADY_EXISTS_REGISTERED_COURSE,
          ],
        };

        logger.info(
          `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::category cluster already exists registered course`
        );
        return res.status(HttpStatus.BAD_REQUEST).json(responseData);

        // const coursesId = courses.map((course) => course._id);
        // const registeredCourse = courses.find(
        //   (course) => course.numberOfRegistrations > 0
        // );

        // if (registeredCourse) {
        //   responseData = {
        //     status: HttpStatus.BAD_REQUEST,
        //     messages: [
        //       CategoryClustersConstant.MESSAGES.DELETE_CATEGORY_CLUSTER
        //         .CATEGORY_CLUSTER_ALREADY_EXISTS_REGISTERED_COURSE,
        //     ],
        //   };

        //   logger.info(
        //     `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::category cluster already exists registered course`
        //   );
        //   return res.status(HttpStatus.BAD_REQUEST).json(responseData);
        // }

        // const favorites = await FavoritesServices.findFavoritesByCoursesIdGroupByStudentId(
        //   coursesId
        // );
        // await CoursesServices.removeCoursesByCoursesId(coursesId);
        // await AdminServices.updateNumberOfCourses(0 - courses.length);
        // await FavoritesServices.removeFavoritesByCoursesId(coursesId);

        // for (const course of courses) {
        //   await LecturersServices.updateNumberOfCoursesPosted({
        //     lecturerId: course.lecturerId,
        //     cumulativeValue: -1,
        //   });
        // }

        // for (const favorite of favorites) {
        //   await StudentsServices.updateNumberOfFavoriteCourses({
        //     studentId: favorite._id,
        //     cumulativeValue: 0 - favorite.totalCourses,
        //   });
        // }
      }

      await CategoriesServices.removeCategoriesByIds(categoriesId);
    }

    categoryCluster["isDeleted"] = true;
    await categoryCluster.save();

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoryClustersConstant.MESSAGES.DELETE_CATEGORY_CLUSTER
          .DELETE_CATEGORY_CLUSTER_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::updateCategoryCluster::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoryClustersConstant.LOGGER.CONTROLLER}::deleteCategoryCluster::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getCategoryClustersInfo,
  addCategoryCLuster,
  updateCategoryCluster,
  deleteCategoryCluster,
};
