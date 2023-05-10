const log4js = require("log4js");
const logger = log4js.getLogger("Controllers");
const HttpStatus = require("http-status-codes");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");

const AuthConstant = require("./auth.constant");
const FileTypesCloudinaryConstant = require("../../constants/file-types-cloudinary.constant");
const AuthServices = require("./auth.service");
const UserServices = require("../users/users.service");
const jwtConstant = require("../../constants/jwt.constant");
const AdminsServices = require("../admins/admins.service");
const SendGrid = require("../../utils/send-grid");
const cloudinary = require("../../utils/cloudinary");

const login = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::Login::is called`);
  try {
    const { email, password } = req.body;

    let responseData = null;
    let user = await UserServices.findUserByNameOrEmail(email);

    responseData = AuthServices.checkAccountValidity({
      userAccount: user,
      password,
    });

    if (responseData) {
      return res.status(responseData.status).json(responseData);
    }

    // const refreshToken = uuid.v4();
    // user.refreshToken = refreshToken;

    // await user.save();

    const roleInfo = await AuthServices.checkAndGetRoleInfo({
      userId: user._id,
      role: user.role,
    });

    //success
    responseData = {
      status: HttpStatus.OK,
      messages: [AuthConstant.MESSAGES.LOGIN.LOGIN_SUCCESSFULLY],
      data: {
        user: { roleInfo, ...UserServices.mapUserInfo(user) },
        meta: {
          accessToken: AuthServices.generateToken(user),
        },
      },
    };

    logger.info(`${AuthConstant.LOGGER.CONTROLLER}::Login::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::Login::error`, e);
    return next(e);
  }
};

const refreshToken = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::refreshToken::is called`);
  try {
    const { accessToken, refreshToken } = req.body;
    let responseData = null;

    const { user } = jwt.verify(accessToken, jwtConstant.secret, {
      ignoreExpiration: true,
    });
    const ret = await UserServices.isValidRefreshToken(user._id, refreshToken);

    if (!ret) {
      responseData = {
        status: HttpStatus.UNAUTHORIZED,
        messages: [AuthConstant.MESSAGES.REFRESH_TOKEN.INVALID_REFRESH_TOKEN],
      };

      logger.info(
        `${AuthConstant.LOGGER.CONTROLLER}::refreshToken::UNAUTHORIZED`
      );
      return res.status(HttpStatus.UNAUTHORIZED).json(responseData);
    }

    const newAccessToken = AuthServices.generateToken(user);

    responseData = {
      status: HttpStatus.OK,
      messages: [
        AuthConstant.MESSAGES.REFRESH_TOKEN.REFRESH_TOKEN_SUCCESSFULLY,
      ],
      data: {
        accessToken: newAccessToken,
      },
    };

    logger.info(`${AuthConstant.LOGGER.CONTROLLER}::refreshToken::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::refreshToken::Error`, e);
    return next(e);
  }
};

const register = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::register::is called`);
  try {
    const { password, confirmPassword, fullName, email } = req.body;
    let responseData = null;

    let user = await UserServices.findUserByNameOrEmail(email);

    if (user) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [AuthConstant.MESSAGES.REGISTER.EMAIL_ALREADY_EXISTS],
      };

      logger.info(
        `${AuthConstant.LOGGER.CONTROLLER}::register::email already exists`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    if (password !== confirmPassword) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          AuthConstant.MESSAGES.REGISTER
            .PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
        ],
      };

      logger.info(
        `${AuthConstant.LOGGER.CONTROLLER}::register::password and confirm password not match`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    const otpCode = randomString.generate({
      length: 8,
      charset: "alphanumeric",
    });
    user = await UserServices.createUser({
      password,
      fullName,
      email,
      otpCode,
    });
    await SendGrid.sendConfirmMail({ email, otpCode, fullName });

    responseData = {
      status: HttpStatus.CREATED,
      messages: [AuthConstant.MESSAGES.REGISTER.REGISTER_SUCCESS],
    };

    logger.info(
      `${AuthConstant.LOGGER.CONTROLLER}::register::register success`
    );
    return res.status(HttpStatus.CREATED).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::register::Error`, e);
    return next(e);
  }
};

const confirmOtpCode = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::confirmOtp::is called`);
  try {
    const { otpCode } = req.body;
    let responseData = null;

    const user = await UserServices.findUserByOtpCode(otpCode);

    if (!user) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [AuthConstant.MESSAGES.CONFIRM_OTP_CODE.INVALID_OTP_CODE],
      };

      logger.info(
        `${AuthConstant.LOGGER.CONTROLLER}::confirmOtpCode::invalid otp code`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    user.isConfirmed = true;
    await user.save();
    await AdminsServices.updateNumberOfStudents(1);

    const roleInfo = await AuthServices.checkAndGetRoleInfo({
      userId: user._id,
      role: user.role,
    });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        AuthConstant.MESSAGES.CONFIRM_OTP_CODE
          .SUCCESSFUL_AUTHENTICATION_OF_THE_OTP_CODE,
      ],
      data: {
        user: { roleInfo, ...UserServices.mapUserInfo(user) },
        meta: {
          accessToken: AuthServices.generateToken(user),
        },
      },
    };

    logger.info(`${AuthConstant.LOGGER.CONTROLLER}::confirmOtpCode::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::confirmOtp::Error`, e);
    return next(e);
  }
};

const changePass = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::changePass::is called`);
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    let responseData = null;

    let user = await UserServices.findUserById(req.user._id);

    //password not match
    if (
      !AuthServices.isValidPasswordHash({
        passwordHash: user.passwordHash,
        password: currentPassword,
      })
    ) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [AuthConstant.MESSAGES.CHANGE_PASS.OLD_PASSWORD_INCORRECT],
      };

      logger.info(
        `${AuthConstant.LOGGER.SERVICE}::changePass::old password incorrect`
      );

      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    if (newPassword !== confirmNewPassword) {
      responseData = {
        status: HttpStatus.BAD_REQUEST,
        messages: [
          AuthConstant.MESSAGES.CHANGE_PASS
            .PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH,
        ],
      };

      logger.info(
        `${AuthConstant.LOGGER.CONTROLLER}::changePass::password and confirm password not match`
      );
      return res.status(HttpStatus.BAD_REQUEST).json(responseData);
    }

    await UserServices.updatePass({ user, password: newPassword });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        AuthConstant.MESSAGES.CHANGE_PASS.CHANGE_PASSWORD_SUCCESSFULLY,
      ],
    };

    logger.info(
      `${AuthConstant.LOGGER.CONTROLLER}::changePass::change password success`
    );
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::changePass::Error`, e);
    return next(e);
  }
};

const resendOtpCode = async (req, res, next) => {
  logger.info(`${AuthConstant.LOGGER.CONTROLLER}::resendOtpCode::is called`);
  try {
    const { email } = req.body;
    let responseData = null;

    const user = await UserServices.findUserByNameOrEmail(email);

    if (!user) {
      responseData = {
        status: HttpStatus.NOT_FOUND,
        messages: [AuthConstant.MESSAGES.RESEND_OTP_CODE.EMAIL_NOT_FOUND],
      };

      logger.info(
        `${AuthConstant.LOGGER.CONTROLLER}::resendOtpCode::email not found`
      );
      return res.status(HttpStatus.NOT_FOUND).json(responseData);
    }

    const otpCode = randomString.generate({
      length: 8,
      charset: "alphanumeric",
    });

    user["otpCode"] = otpCode;
    await user.save();
    await SendGrid.sendConfirmMail({ email, fullName: user.fullName, otpCode });

    responseData = {
      status: HttpStatus.OK,
      messages: [
        AuthConstant.MESSAGES.RESEND_OTP_CODE.SEND_OTP_CODE_SUCCESSFULLY,
      ],
    };

    logger.info(`${AuthConstant.LOGGER.CONTROLLER}::resendOtpCode::success`);
    return res.status(HttpStatus.OK).json(responseData);
  } catch (e) {
    logger.error(`${AuthConstant.LOGGER.CONTROLLER}::resendOtpCode::Error`, e);
    return next(e);
  }
};

module.exports = {
  login,
  refreshToken,
  register,
  confirmOtpCode,
  changePass,
  resendOtpCode,
};
