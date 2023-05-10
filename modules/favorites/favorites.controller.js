const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const FavoritesConstant = require("./favorites.constant");
const FavoritesServices = require("./favorites.service");
const PaginationConstant = require("../../constants/pagination.constant");
const StudentServices = require("../students/students.service");
const CoursesServices = require("../courses/courses.service");
const CategoriesServices = require("../categories/categories.service");
const CategoryClusterServices = require("../category-clusters/category-clusters.service");
const Services = require("../../services/services");
const LecturersServices = require("../lecturers/lecturers.service");
const UsersServices = require("../users/users.service");

const getFavoritesList = async (req, res, next) => {
  logger.info(
    `${FavoritesConstant.LOGGER.CONTROLLER}::getFavoritesList::is called`
  );
  try {
    const page = Number(req.query.page) || PaginationConstant.PAGE;
    const limit = Number(req.query.limit) || PaginationConstant.LIMIT;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          FavoritesConstant.MESSAGES.GET_FAVORITES_LIST.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${FavoritesConstant.LOGGER.CONTROLLER}::getFavoritesList::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const favorites = await FavoritesServices.getFavoritesByConditionsHasPagination(
      { studentId: roleInfo._id, limit, page }
    );

    let { entries } = favorites[0];
    const meta =
      favorites[0].meta.length > 0
        ? favorites[0].meta[0]
        : {
          _id: null,
          totalItems: 0,
        };

    if (entries.length > 0) {
      const coursesId = entries.map((favorite) => favorite.courseId);

      let courses = await CoursesServices.findCoursesByIds(coursesId);

      const categoriesId = courses.map((course) => course.categoryId);
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const lecturersId = courses.map((course) => course.lecturerId);
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      courses = await Services.mapDataIntoCourse({
        courses,
        categories,
        categoryClusters,
        lecturers,
        users,
      });

      entries = FavoritesServices.mapCourseIntoFavoritesCourse({
        courses,
        favoritesCourse: entries,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        FavoritesConstant.MESSAGES.GET_FAVORITES_LIST
          .GET_FAVORITES_LIST_SUCCESSFULLY,
      ],
      data: { entries, meta },
    };

    logger.info(
      `${FavoritesConstant.LOGGER.CONTROLLER}::getFavoritesList::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.CONTROLLER}::getFavoritesList::error`,
      e
    );
    return next(e);
  }
};

const createFavoriteCourse = async (req, res, next) => {
  logger.info(
    `${FavoritesConstant.LOGGER.CONTROLLER}::createFavoriteCourse::is called`
  );
  try {
    const { courseId } = req.body;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          FavoritesConstant.MESSAGES.CREATE_FAVORITE_COURSE.STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${FavoritesConstant.LOGGER.CONTROLLER}::createFavoriteCourse::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const course = await CoursesServices.findCourseHasConditions({
      lecturerId: null,
      courseId,
    });

    if (!course) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          FavoritesConstant.MESSAGES.CREATE_FAVORITE_COURSE.COURSE_NOT_FOUND,
        ],
      };

      logger.info(
        `${FavoritesConstant.LOGGER.CONTROLLER}::getFavoritesList::course not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let favorite = await FavoritesServices.findFavoriteHasConditions({
      studentId: roleInfo._id,
      courseId,
    });

    if (favorite) {
      if (favorite["isDeleted"]) {
        favorite["isDeleted"] = false;
        await favorite.save();
        await StudentServices.updateNumberOfFavoriteCourses({
          studentId: roleInfo._id,
          cumulativeValue: 1,
        });
      }
    } else {
      favorite = await FavoritesServices.createFavoriteCourse({
        studentId: roleInfo._id,
        courseId,
      });
      await StudentServices.updateNumberOfFavoriteCourses({
        studentId: roleInfo._id,
        cumulativeValue: 1,
      });
    }

    responseData = {
      status: HttpStatus.CREATED,
      messages: [
        FavoritesConstant.MESSAGES.CREATE_FAVORITE_COURSE
          .CREATED_FAVORITE_COURSE_SUCCESSFULLY,
      ],
      data: { favorite },
    };

    logger.info(
      `${FavoritesConstant.LOGGER.CONTROLLER}::createFavoriteCourse::success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.CONTROLLER}::createFavoriteCourse::error`,
      e
    );
    return next(e);
  }
};

const removeTheCourseFromFavorites = async (req, res, next) => {
  logger.info(
    `${FavoritesConstant.LOGGER.CONTROLLER}::removeTheCourseFromFavorites::is called`
  );
  try {
    const { courseId } = req.params;
    const roleInfo = req.user.roleInfo || null;
    let responseData = null;

    if (!roleInfo || !roleInfo._id) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          FavoritesConstant.MESSAGES.REMOVE_THE_COURSE_FROM_FAVORITES
            .STUDENT_NOT_FOUND,
        ],
      };

      logger.info(
        `${FavoritesConstant.LOGGER.CONTROLLER}::removeTheCourseFromFavorites::student not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    let favorite = await FavoritesServices.findFavoriteHasConditions({
      studentId: roleInfo._id,
      courseId,
    });

    if (!favorite) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          FavoritesConstant.MESSAGES.REMOVE_THE_COURSE_FROM_FAVORITES
            .THE_COURSE_IS_NOT_EXISTS_IN_FAVORITES_LIST,
        ],
      };

      logger.info(
        `${FavoritesConstant.LOGGER.CONTROLLER}::removeTheCourseFromFavorites::the course is not exists in favorites list.`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    if (!favorite["isDeleted"]) {
      favorite["isDeleted"] = true;
      await favorite.save();
      await StudentServices.updateNumberOfFavoriteCourses({
        studentId: roleInfo._id,
        cumulativeValue: -1,
      });
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        FavoritesConstant.MESSAGES.REMOVE_THE_COURSE_FROM_FAVORITES
          .REMOVE_THE_COURSE_FROM_FAVORITES_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${FavoritesConstant.LOGGER.CONTROLLER}::removeTheCourseFromFavorites::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${FavoritesConstant.LOGGER.CONTROLLER}::removeTheCourseFromFavorites::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getFavoritesList,
  createFavoriteCourse,
  removeTheCourseFromFavorites,
};
