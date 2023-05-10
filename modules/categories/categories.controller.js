const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const CategoriesConstant = require("./categories.constant");
const CategoriesServices = require("./categories.service");
const CategoryClusterServices = require("../category-clusters/category-clusters.service");
const CoursesServices = require("../courses/courses.service");
const FavoritesServices = require("../favorites/favorites.service");
const StudentsServices = require("../students/students.service");
const LecturersServices = require("../lecturers/lecturers.service");

const addCategory = async (req, res, next) => {
  logger.info(
    `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::is called`
  );
  try {
    const { categoryClusterId, name } = req.body;
    let responseData = null;
    let category = null;

    const categoryCluster = await CategoryClusterServices.findCategoryClusterById(
      categoryClusterId
    );

    if (!categoryCluster) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_CLUSTER_NOT_FOUND,
        ],
      };

      logger.info(
        `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::category cluster not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const categories = await CategoriesServices.findCategoriesByName(name);

    if (categories.length > 0) {
      category = categories.find(
        (category) =>
          category.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      );

      if (category) {
        responseData = {
          status: HttpStatus.BAD_REQUEST,
          messages: [
            CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_ALREADY_EXISTS,
          ],
        };

        logger.info(
          `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::category already exists`
        );
        return res.status(HttpStatus.BAD_REQUEST).json(responseData);
      }
    }

    category = await CategoriesServices.createCategory({
      name,
      categoryClusterId,
    });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_ADDED_SUCCESSFULLY,
      ],
      data: {
        category,
      },
    };

    logger.info(
      `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoriesConstant.LOGGER.CONTROLLER}::addCategory::error`,
      e
    );
    return next(e);
  }
};

const getCategoryDetails = async (req, res, next) => {
  logger.info(
    `${CategoriesConstant.LOGGER.CONTROLLER}::getCategoryDetails::is called`
  );
  try {
    const { categoryId } = req.params;
    let responseData = null;

    const category = await CategoriesServices.getCategoryById(categoryId);

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoriesConstant.MESSAGES.GET_CATEGORY_DETAILS
          .GET_CATEGORY_DETAILS_SUCCESSFULLY,
      ],
      data: {
        category,
      },
    };

    logger.info(
      `${CategoriesConstant.LOGGER.CONTROLLER}::getCategoryDetails::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoriesConstant.LOGGER.CONTROLLER}::getCategoryDetails::error`,
      e
    );
    return next(e);
  }
};

const updateCategory = async (req, res, next) => {
  logger.info(
    `${CategoriesConstant.LOGGER.CONTROLLER}::updateCategory::is called`
  );
  try {
    const { categoryId } = req.params;
    const { name, categoryClusterId } = req.body;
    let responseData = null;

    let category = await CategoriesServices.getCategoryById(categoryId);

    if (!category) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoriesConstant.MESSAGES.UPDATE_CATEGORY.CATEGORY_NOT_FOUND,
        ],
      };

      logger.info(
        `${CategoriesConstant.LOGGER.CONTROLLER}::updateCategory::category not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    if (categoryClusterId) {
      const categoryCluster = await CategoryClusterServices.findCategoryClusterById(
        categoryClusterId
      );

      if (!categoryCluster) {
        responseData = {
          status: HttpStatus.NOT_FOUND,
          messages: [
            CategoriesConstant.MESSAGES.UPDATE_CATEGORY
              .CATEGORY_CLUSTER_NOT_FOUND,
          ],
        };

        logger.info(
          `${CategoriesConstant.LOGGER.CONTROLLER}::updateCategory::category cluster not found`
        );
        return res.status(HttpStatus.NOT_FOUND).json(responseData);
      }
    }

    if (name) {
      const categories = await CategoriesServices.findCategoriesByName(name);

      if (categories.length > 0) {
        const categoryResult = categories.find(
          (category) =>
            category.name.toLocaleLowerCase() === name.toLocaleLowerCase()
        );

        if (categoryResult) {
          responseData = {
            status: HttpStatus.BAD_REQUEST,
            messages: [
              CategoriesConstant.MESSAGES.ADD_CATEGORY.CATEGORY_ALREADY_EXISTS,
            ],
          };

          logger.info(
            `${CategoriesConstant.LOGGER.CONTROLLER}::updateCategory::category already exists`
          );
          return res.status(HttpStatus.BAD_REQUEST).json(responseData);
        }
      }
    }

    category = await CategoriesServices.updateCategory({
      name,
      categoryClusterId,
      category,
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoriesConstant.MESSAGES.UPDATE_CATEGORY
          .UPDATE_CATEGORY_SUCCESSFULLY,
      ],
      data: {
        category,
      },
    };

    logger.info(
      `${CategoriesConstant.LOGGER.CONTROLLER}::updateCategory::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoriesConstant.LOGGER.CONTROLLER}::updateCategory::error`,
      e
    );
    return next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  logger.info(
    `${CategoriesConstant.LOGGER.CONTROLLER}::deleteCategory::is called`
  );
  try {
    const { categoryId } = req.params;
    let responseData = null;

    let category = await CategoriesServices.getCategoryById(categoryId);

    if (!category) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          CategoriesConstant.MESSAGES.DELETE_CATEGORY.CATEGORY_NOT_FOUND,
        ],
      };

      logger.info(
        `${CategoriesConstant.LOGGER.CONTROLLER}::deleteCategory::category not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    // const course = await CoursesServices.findRegisteredCoursesByCategoryId(
    //   categoryId
    // );

    const courses = await CoursesServices.findCoursesHasConditions({
      categoryId,
    });

    if (courses.length > 0) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          CategoriesConstant.MESSAGES.DELETE_CATEGORY
            .CATEGORY_ALREADY_EXISTS_REGISTERED_COURSE,
        ],
      };

      logger.info(
        `${CategoriesConstant.LOGGER.CONTROLLER}::deleteCategory::The category contains the course`
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
      //       CategoriesConstant.MESSAGES.DELETE_CATEGORY
      //         .CATEGORY_ALREADY_EXISTS_REGISTERED_COURSE,
      //     ],
      //   };

      //   logger.info(
      //     `${CategoriesConstant.LOGGER.CONTROLLER}::deleteCategory::The category contains the course`
      //   );
      //   return res.status(HttpStatus.BAD_REQUEST).json(responseData);
      // }

      // const favorites = await FavoritesServices.findFavoritesByCoursesIdGroupByStudentId(
      //   coursesId
      // );
      // await CoursesServices.removeCoursesByCoursesId(coursesId);
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

    category["isDeleted"] = true;
    await category.save();

    // const courses = await CoursesServices.findCoursesHasConditions({
    //   categoryId,
    // });

    // if (courses.length > 0) {
    //   const coursesId = courses.map((course) => course._id);
    //   const lecturersId = courses.map((course) => course.lecturerId);

    //   const favorites = await FavoritesServices.findFavoritesByCoursesId(
    //     coursesId
    //   );
    //   const studentsId = favorites.map((favorite) => favorite.studentId);

    //   studentsId.length > 0 &&
    //     (await StudentsServices.updateNumberOfFavoriteCoursesByStudentsId({
    //       studentsId,
    //       cumulativeValue: -1,
    //     }));

    //   await CoursesServices.removeCoursesByCategoryId({ categoryId });

    //   for (lecturerId of lecturersId) {
    //     await LecturersServices.updateNumberOfCoursesPosted({
    //       lecturerId,
    //       cumulativeValue: -1,
    //     });
    //   }
    // }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        CategoriesConstant.MESSAGES.DELETE_CATEGORY
          .DELETE_CATEGORY_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${CategoriesConstant.LOGGER.CONTROLLER}::deleteCategory::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${CategoriesConstant.LOGGER.CONTROLLER}::deleteCategory::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  addCategory,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
};
