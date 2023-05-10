const express = require("express");
const router = express.Router({});

const HomeController = require("./home.controller");

const CheckAccessTokenMiddleware = require("../../middleware/check-access-token.middleware");

router.get(
  "/",
  CheckAccessTokenMiddleware({ isRequired: false }),
  HomeController.getCoursesListForHomePage
);

module.exports = router;
