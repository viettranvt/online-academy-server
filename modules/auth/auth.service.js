const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");

const JwtConfig = require("../../constants/jwt.constant");
const AuthConstant = require("./auth.constant");
const AdminsServices = require("../admins/admins.service");
const LecturersServices = require("../lecturers/lecturers.service");
const StudentsServices = require("../students/students.service");
const UsersConstant = require("../users/users.constant");

const isValidPasswordHash = ({ passwordHash, password }) => {
  logger.info(`${AuthConstant.LOGGER.SERVICE}::isValidHashPassword::Is called`);
  try {
    logger.info(`${AuthConstant.LOGGER.SERVICE}::isValidHashPassword::success`);

    return bcrypt.compareSync(password, passwordHash);
  } catch (e) {
    logger.error(
      `${AuthConstant.LOGGER.SERVICE}::isValidHashPassword::Error`,
      e
    );

    throw new Error(e);
  }
};

const generateToken = (data) => {
  logger.info(`${AuthConstant.LOGGER.SERVICE}::generateToken::Is called`);
  try {
    const userData = JSON.parse(JSON.stringify(data));

    delete userData.avatarUrl;
    delete userData.fullName;
    delete userData.email;
    delete userData.isBlocked;
    delete userData.passwordHash;
    delete userData.passwordSalt;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.refreshToken;
    delete userData.__v;
    delete userData.isConfirmed;
    delete userData.otpCode;

    logger.info(`${AuthConstant.LOGGER.SERVICE}::generateToken::success`);

    return jwt.sign({ user: userData }, JwtConfig.secret, {
      expiresIn: AuthConstant.TOKEN_EXPIRED_IN_MINUTE,
    });
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.SERVICE}::generateToken::Error`, e);

    throw new Error(e);
  }
};

const checkAccountValidity = ({ userAccount, password }) => {
  logger.info(
    `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::Is called`
  );
  try {
    let responseData = null;

    //user not found
    if (!userAccount) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          AuthConstant.MESSAGES.LOGIN.MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH,
        ],
      };

      logger.info(
        `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::user not found`
      );

      return responseData;
    }

    //password not match
    if (
      !isValidPasswordHash({
        passwordHash: userAccount.passwordHash,
        password,
      })
    ) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          AuthConstant.MESSAGES.LOGIN.MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH,
        ],
      };

      logger.info(
        `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::password not match`
      );

      return responseData;
    }

    // account has not been confirmed
    if (!userAccount.isConfirmed) {
      responseData = {
        status: HttpStatus.UNAUTHORIZED,
        messages: [AuthConstant.MESSAGES.LOGIN.ACCOUNT_HAS_NOT_BEEN_CONFIRMED],
      };

      logger.info(
        `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::account has not been confirmed`
      );

      return responseData;
    }

    //
    if (userAccount.isBlocked) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [AuthConstant.MESSAGES.LOGIN.THE_ACCOUNT_HAS_BEEN_BLOCKED],
      };

      logger.info(
        `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::the account has been blocked`
      );

      return responseData;
    }

    logger.info(
      `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::valid account`
    );

    return responseData;
  } catch (e) {
    logger.error(
      `${AuthConstant.LOGGER.SERVICE}::checkAccountValidity::Error`,
      e
    );

    throw new Error(e);
  }
};

const checkAndGetRoleInfo = async ({ userId, role }) => {
  logger.info(`${AuthConstant.LOGGER.SERVICE}::checkAndGetRoleInfo::Is called`);
  try {
    let roleInfo = null;

    switch (role) {
      case UsersConstant.ROLE.ADMIN:
        roleInfo = await AdminsServices.findAdminByUserId(userId);
        break;
      case UsersConstant.ROLE.LECTURER:
        roleInfo = await LecturersServices.findLecturerByUserId(userId);
        break;
      case UsersConstant.ROLE.STUDENT:
        roleInfo = await StudentsServices.findStudentByUserId(userId);
        break;
      default:
        break;
    }

    if (roleInfo) {
      roleInfo = JSON.parse(JSON.stringify(roleInfo));

      delete roleInfo.__v;
      delete roleInfo.createdAt;
      delete roleInfo.updatedAt;
      delete roleInfo.userId;
    }

    logger.info(`${AuthConstant.LOGGER.SERVICE}::checkAndGetRoleInfo::success`);
    return roleInfo;
  } catch (e) {
    logger.error(
      `${AuthConstant.LOGGER.SERVICE}::checkAndGetRoleInfo::Error`,
      e
    );

    throw new Error(e);
  }
};

module.exports = {
  isValidPasswordHash,
  generateToken,
  checkAccountValidity,
  checkAndGetRoleInfo,
};
