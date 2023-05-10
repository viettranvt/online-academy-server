const express = require("express");
const router = express.Router({});
const multer = require("multer");
const upload = multer();

const RoleConstant = require("../users/users.constant");
const FileTypesConstant = require("../../constants/file-types.constant");
const ParametersConstant = require("../../constants/parameters.constant");
const CoursesController = require("./courses.controller");
const VideosController = require("../videos/videos.controller");
const ChaptersController = require("../chapters/chapters.controller");
const RegistrationsController = require("../registrations/registrations.controller");
const VideoWatchingsController = require("../video-watchings/video-watchings.controller");
const LecturersController = require("../lecturers/lecturers.controller");
const FeedbacksController = require("../feedbacks/feedbacks.controller");

const ValidateMiddleware = require("../../middleware/validate.middleware");
const ValidateFileTypesMiddleware = require("../../middleware/validate-file-types.middleware");
const CheckAccessTokenMiddleware = require("../../middleware/check-access-token.middleware");
const CheckCourseIdMiddleware = require("../../middleware/check-course-id.middleware");
const CheckRoleMiddleware = require("../../middleware/check-role.middleware");
const CheckChapterIdMiddleware = require("../../middleware/check-chapter-id.middleware");

const {
  AddVideoValidationSchema,
} = require("../videos/validations/add-video.schema");
const {
  GetVideosByChapterValidationSchema,
} = require("../videos/validations/get-videos-by-chapter.schema");
const {
  AddCourseValidationSchema,
} = require("./validations/add-course.schema");
const {
  GetCourseDetailValidationSchema,
} = require("./validations/get-course-detail.schema");
const {
  DeleteCourseDetailValidationSchema,
} = require("./validations/delete-course.schema");
const {
  UpdateCourseValidationSchema,
} = require("./validations/update-course.schema");
const {
  GetChaptersValidationSchema,
} = require("../chapters/validations/get-chapters.schema");
const {
  AddChapterValidationSchema,
} = require("../chapters/validations/add-chapter.schema");
const {
  RegisterTheCourseValidationSchema,
} = require("../registrations/validations/register-the-course.schema");
const {
  GetVideosWatchingsValidationSchema,
} = require("../video-watchings/validations/get-video-watching.schema");
const {
  GetCoursesListByCriteriaValidationSchema,
} = require("./validations/get-courses-list-by-criteria.schema");
const {
  AddFeedbackValidationSchema,
} = require("../feedbacks/validations/add-feedback.schema");
const {
  GetFeedbacksValidationSchema,
} = require("../feedbacks/validations/get-feedbacks.schema");
const {
  AddVideosWatchingValidationSchema,
} = require("../video-watchings/validations/add-video-watching.schema");

router.get(
  "/",
  ValidateMiddleware(GetCoursesListByCriteriaValidationSchema, [
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: false }),
  CoursesController.getCoursesListByCriteria
);
router.post(
  "/",
  upload.fields([{ name: "thumbnail" }]),
  ValidateMiddleware(AddCourseValidationSchema, [ParametersConstant.BODY]),
  ValidateFileTypesMiddleware([
    {
      name: "thumbnail",
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: true,
    },
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CoursesController.addCourse
);
router.get(
  "/:courseId/",
  ValidateMiddleware(GetCourseDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: false }),
  CheckCourseIdMiddleware({ isLecturer: false }),
  CoursesController.getCourseDetail
);
router.delete(
  "/:courseId",
  ValidateMiddleware(DeleteCourseDetailValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.ADMIN]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  CoursesController.deleteCourse
);
router.put(
  "/:courseId/",
  upload.fields([{ name: "thumbnail" }]),
  ValidateMiddleware(UpdateCourseValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  ValidateFileTypesMiddleware([
    {
      name: "thumbnail",
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: false,
    },
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CheckCourseIdMiddleware({ isLecturer: true }),
  CoursesController.updateCourse
);
router.post(
  "/:courseId/feedbacks/",
  ValidateMiddleware(AddFeedbackValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.BODY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  FeedbacksController.addFeedback
);
router.get(
  "/:courseId/feedbacks/",
  ValidateMiddleware(GetFeedbacksValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.QUERY,
  ]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  FeedbacksController.getFeedbacks
);
router.post(
  "/:courseId/chapters/:chapterId/videos",
  upload.fields([{ name: "video" }, { name: "thumbnail" }]),
  ValidateMiddleware(AddVideoValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  ValidateFileTypesMiddleware([
    { name: "video", fileTypes: [FileTypesConstant.VIDEO], isRequired: true },
    {
      name: "thumbnail",
      fileTypes: [FileTypesConstant.IMAGE],
      isRequired: false,
    },
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CheckCourseIdMiddleware({ isLecturer: true }),
  CheckChapterIdMiddleware,
  VideosController.addVideo
);
router.get(
  "/:courseId/chapters/:chapterId/videos",
  ValidateMiddleware(GetVideosByChapterValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: false }),
  CheckChapterIdMiddleware,
  CheckCourseIdMiddleware({ isLecturer: false }),
  VideosController.getVideosByChapter
);
router.get(
  "/:courseId/chapters/",
  ValidateMiddleware(GetChaptersValidationSchema, [ParametersConstant.PARAMS]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  ChaptersController.getChapters
);
router.post(
  "/:courseId/chapters/",
  ValidateMiddleware(AddChapterValidationSchema, [
    ParametersConstant.BODY,
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.LECTURER]),
  CheckCourseIdMiddleware({ isLecturer: true }),
  ChaptersController.addChapter
);
router.post(
  "/:courseId/registrations/",
  ValidateMiddleware(RegisterTheCourseValidationSchema, [
    ParametersConstant.PARAMS,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  RegistrationsController.registerTheCourse
);
router.get(
  "/:courseId/video-watchings",
  ValidateMiddleware(GetVideosWatchingsValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.QUERY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  VideoWatchingsController.getVideoWatchings
);
router.post(
  "/:courseId/video-watchings",
  ValidateMiddleware(AddVideosWatchingValidationSchema, [
    ParametersConstant.PARAMS,
    ParametersConstant.BODY,
  ]),
  CheckAccessTokenMiddleware({ isRequired: true }),
  CheckRoleMiddleware([RoleConstant.ROLE.STUDENT]),
  CheckCourseIdMiddleware({ isLecturer: false }),
  VideoWatchingsController.addVideoWatching
);
router.get(
  "/:courseId/lecturers",
  CheckCourseIdMiddleware({ isLecturer: false }),
  LecturersController.getLecturerInfoForCoursePage
);

module.exports = router;
