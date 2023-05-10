const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");
const moment = require("moment-timezone");

const HomeConstant = require("./home.constant");
const CoursesServices = require("../courses/courses.service");
const HomeServices = require("./home.service");
const CategoriesServices = require("../categories/categories.service");
const CategoryClusterServices = require("../category-clusters/category-clusters.service");
const LecturersServices = require("../lecturers/lecturers.service");
const Services = require("../../services/services");
const UsersServices = require("../users/users.service");
const Ratings = require("../ratings/ratings.services");

const getCoursesListForHomePage = async (req, res, next) => {
  logger.info(
    `${HomeConstant.LOGGER.CONTROLLER}::getCoursesListForHomePage::is called`
  );
  try {
    const startDate = moment()
      .tz("Asia/Ho_Chi_Minh")
      .subtract(7, "d")
      .startOf("day");
    const endDate = moment().tz("Asia/Ho_Chi_Minh").endOf("day");
    const { user } = req;
    const roleInfo = !user ? null : user.roleInfo;
    let roleId = null;
    let responseData = null;

    if (roleInfo && roleInfo._id) {
      roleId = roleInfo._id;
    }

    let coursesListWithTheMostViews = await CoursesServices.getCoursesListForHomePage(
      {
        startDate: null,
        endDate: null,
        limit: 10,
        findBy: "numberOfViews",
        isSortUpAscending: false,
        isSortCreatedAt: true,
        isCreatedAtSortUpAscending: false,
      }
    );
    let ListOfLatestCourses = await CoursesServices.getCoursesListForHomePage({
      startDate: null,
      endDate: null,
      limit: 10,
      findBy: null,
      isSortUpAscending: null,
      isSortCreatedAt: true,
      isCreatedAtSortUpAscending: false,
    });
    const ratingsInWeek = await Ratings.getRatingsByDate({
      startDate,
      endDate,
    });
    const coursesId = ratingsInWeek.map((rating) => rating.courseId);
    let outstandingCourseList = await CoursesServices.getCoursesListForHomePage(
      {
        startDate: null,
        endDate: null,
        limit: 3,
        findBy: "averageRating",
        isSortUpAscending: false,
        isSortCreatedAt: true,
        isCreatedAtSortUpAscending: false,
        coursesId,
      }
    );
    let mostRegisteredCategory = await CoursesServices.getCategoryWithTheMostEnrollmentCourses(
      10
    );

    if (coursesListWithTheMostViews.length > 0) {
      const categoriesId = coursesListWithTheMostViews.map(
        (course) => course.categoryId
      );
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const lecturersId = coursesListWithTheMostViews.map(
        (course) => course.lecturerId
      );
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      coursesListWithTheMostViews = await Services.mapDataIntoCourse({
        courses: coursesListWithTheMostViews,
        categories,
        categoryClusters,
        lecturers,
        users,
      });

      // coursesListWithTheMostViews = await CoursesServices.mapIsRegisteredFieldIntoCourses(
      //   {
      //     roleId,
      //     courses: coursesListWithTheMostViews,
      //   }
      // );
    }

    if (ListOfLatestCourses.length > 0) {
      const categoriesId = ListOfLatestCourses.map(
        (course) => course.categoryId
      );
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const lecturersId = ListOfLatestCourses.map(
        (course) => course.lecturerId
      );
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      ListOfLatestCourses = await Services.mapDataIntoCourse({
        courses: ListOfLatestCourses,
        categories,
        categoryClusters,
        lecturers,
        users,
      });

      // ListOfLatestCourses = await CoursesServices.mapIsRegisteredFieldIntoCourses(
      //   {
      //     roleId,
      //     courses: ListOfLatestCourses,
      //   }
      // );
    }

    if (outstandingCourseList.length > 0) {
      const categoriesId = outstandingCourseList.map(
        (course) => course.categoryId
      );
      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );

      const categoryClustersId = categories.map(
        (category) => category.categoryClusterId
      );
      const categoryClusters = await CategoryClusterServices.findCategoryClustersByIds(
        categoryClustersId
      );

      const lecturersId = outstandingCourseList.map(
        (course) => course.lecturerId
      );
      const lecturers = await LecturersServices.getLecturersByIds(lecturersId);

      const usersId = lecturers.map((lecturer) => lecturer.userId);
      const users = await UsersServices.getUsersByIds(usersId);

      outstandingCourseList = await Services.mapDataIntoCourse({
        courses: outstandingCourseList,
        categories,
        categoryClusters,
        lecturers,
        users,
      });

      // outstandingCourseList = await CoursesServices.mapIsRegisteredFieldIntoCourses(
      //   {
      //     roleId,
      //     courses: outstandingCourseList,
      //   }
      // );
    }

    if (mostRegisteredCategory.length > 0) {
      const categoriesId = mostRegisteredCategory.map(
        (category) => category._id
      );

      const categories = await CategoriesServices.getCategoriesByIds(
        categoriesId
      );
      mostRegisteredCategory = HomeServices.mapCategoriesIntoMostRegisteredCategory(
        { categories, mostRegisteredCategory }
      );
    }

    responseData = {
      status: HttpStatus.OK,
      messages: [
        HomeConstant.MESSAGE.GET_COURSER_FOR_HOME_PAGE
          .GET_COURSER_FOR_HOME_PAGE_SUCCESSFULLY,
      ],
      data: {
        coursesListWithTheMostViews,
        ListOfLatestCourses,
        outstandingCourseList,
        mostRegisteredCategory,
      },
    };

    logger.info(
      `${HomeConstant.LOGGER.CONTROLLER}::getCoursesListForHomePage::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${HomeConstant.LOGGER.CONTROLLER}::getCoursesListForHomePage::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getCoursesListForHomePage,
};
