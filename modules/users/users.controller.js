const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");

const UserConstant = require("./users.constant");
const UserServices = require("./users.service");
const AuthServices = require("../auth/auth.service");
const LecturersService = require("../lecturers/lecturers.service");

const getUserInfo = async (req, res, next) => {
  logger.info(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::is called`);
  try {
    const { _id } = req.user;
    let responseData = null;

    let user = await UserServices.findUserById(_id);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [UserConstant.MESSAGES.GET_USER_INFO.USER_NOT_FOUND],
      };

      logger.info(
        `${UserConstant.LOGGER.CONTROLLER}::getUserInfo::user not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const roleInfo = await AuthServices.checkAndGetRoleInfo({
      userId: _id,
      role: user.role,
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        UserConstant.MESSAGES.GET_USER_INFO.GET_USER_INFO_SUCCESSFULLY,
      ],
      data: {
        user: { roleInfo, ...UserServices.mapUserInfo(user) },
      },
    };

    logger.info(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.CONTROLLER}::getUserInfo::error`, e);
    return next(e);
  }
};

const updateUserInfo = async (req, res, next) => {
  logger.info(`${UserConstant.LOGGER.CONTROLLER}::updateUserInfo::is called`);
  try {
    const { fullName, introduction } = req.body;
    const { files } = req;
    const { _id } = req.user;
    let { roleInfo } = req.user;
    let avatar = null;
    let responseData = null;

    if (files && Object.keys(files).length !== 0) {
      avatar = files["avatar"][0];
    }

    let user = await UserServices.findUserById(_id);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [UserConstant.MESSAGES.UPDATE_USER_INFO.USER_NOT_FOUND],
      };

      logger.info(
        `${UserConstant.LOGGER.CONTROLLER}::updateUserInfo::user not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    if (user.role === UserConstant.ROLE.LECTURER) {
      roleInfo = await LecturersService.updateLecturerInfo({
        lecturer: roleInfo,
        introduction,
      });
    }

    user = await UserServices.updateUserInfo({ fullName, avatar, user });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        UserConstant.MESSAGES.UPDATE_USER_INFO.UPDATE_USER_INFO_SUCCESSFULLY,
      ],
      data: {
        user: { roleInfo, ...UserServices.mapUserInfo(user) },
      },
    };

    logger.info(`${UserConstant.LOGGER.CONTROLLER}::updateUserInfo::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.CONTROLLER}::updateUserInfo::error`, e);
    return next(e);
  }
};

const updateUserInfoByAdminRole = async (req, res, next) => {
  logger.info(
    `${UserConstant.LOGGER.CONTROLLER}::updateUserInfoByAdminRole::is called`
  );
  try {
    const { isBlocked } = req.body;
    const { userId } = req.params;
    let responseData = null;

    console.log(isBlocked)
    let user = await UserServices.findUserById(userId);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [
          UserConstant.MESSAGES.UPDATE_USER_INFO_BY_ADMIN_ROLE.USER_NOT_FOUND,
        ],
      };

      logger.info(
        `${UserConstant.LOGGER.CONTROLLER}::updateUserInfoByAdminRole::user not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    user = await UserServices.updateUserInfo({ isBlocked, user });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        UserConstant.MESSAGES.UPDATE_USER_INFO_BY_ADMIN_ROLE
          .UPDATE_USER_INFO_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${UserConstant.LOGGER.CONTROLLER}::updateUserInfoByAdminRole::success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.CONTROLLER}::updateUserInfoByAdminRole::error`,
      e
    );
    return next(e);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  updateUserInfoByAdminRole,
};
