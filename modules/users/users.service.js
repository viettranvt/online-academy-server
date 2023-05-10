const log4js = require("log4js");
const logger = log4js.getLogger("Services");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");

const UserModel = require("./users.model");
const UserConstant = require("./users.constant");
const AuthConstant = require("../auth/auth.constant");
const AdminsServices = require("../admins/admins.service");
const LecturersServices = require("../lecturers/lecturers.service");
const StudentsServices = require("../students/students.service");
const cloudinary = require("../../utils/cloudinary");
const FileTypesCloudDinaryConstant = require("../../constants/file-types-cloudinary.constant");

const findUserByNameOrEmail = async (nameOrEmail) => {
  logger.info(
    `${UserConstant.LOGGER.SERVICE}::findUserByNameOrEmail::is called`
  );
  try {
    const query = {
      $and: [
        {
          $or: [
            {
              email: nameOrEmail,
            },
            {
              fullName: nameOrEmail,
            },
          ],
        },
        {
          isDeleted: false,
        },
      ],
    };

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::findUserByNameOrEmail::Success`
    );

    return await UserModel.findOne(query);
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::findUserByNameOrEmail::Error`,
      e
    );
    throw new Error(e);
  }
};

const mapUserInfo = (userInfo) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::is called`);
  try {
    let userJsonParse = JSON.parse(JSON.stringify(userInfo));

    delete userJsonParse.passwordHash;
    delete userJsonParse.passwordSalt;
    delete userJsonParse.createdAt;
    delete userJsonParse.updatedAt;
    delete userJsonParse.__v;
    delete userJsonParse.isConfirmed;
    delete userJsonParse.otpCode;

    logger.info(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::Success`);

    return userJsonParse;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::mapUserInfo::Error`, e);
    throw new Error(e);
  }
};

const isValidRefreshToken = async (id, refreshToken) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::isValidRefreshToken::is called`);
  try {
    const query = {
      _id: mongoose.Types.ObjectId(id),
      refreshToken,
    };

    const user = await UserModel.findOne(query);
    //console.log(user)

    if (user) {
      logger.info(
        `${UserConstant.LOGGER.SERVICE}::isValidRefreshToken::Success`
      );
      return true;
    }

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::isValidRefreshToken::user not found`
    );
    return false;
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::isValidRefreshToken::Error`,
      e
    );
    throw new Error(e);
  }
};

const createUser = async ({ password, fullName, email, otpCode }) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::createUser::is called`);
  try {
    const salt = bcrypt.genSaltSync(AuthConstant.SALT_LENGTH);

    const newUser = new UserModel({
      fullName: fullName || null,
      email,
      otpCode: otpCode || null,
      passwordSalt: salt,
      passwordHash: bcrypt.hashSync(password, salt),
    });

    await newUser.save();
    await createRole(newUser);

    logger.info(`${UserConstant.LOGGER.SERVICE}::createUser::Success`);
    return newUser;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::createUser::Error`, e);
    throw new Error(e);
  }
};

const createRole = async (newUser) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::createRole::is called`);
  try {
    switch (newUser.role) {
      case UserConstant.ROLE.ADMIN:
        await AdminsServices.createdAdmin(newUser._id);
        logger.info(`${UserConstant.LOGGER.SERVICE}::createRole::create admin`);

        break;
      case UserConstant.ROLE.LECTURER:
        await LecturersServices.createLecturer(newUser._id);
        logger.info(
          `${UserConstant.LOGGER.SERVICE}::createRole::create lecturer`
        );

        break;
      case UserConstant.ROLE.STUDENT:
        await StudentsServices.createStudent(newUser._id);
        logger.info(
          `${UserConstant.LOGGER.SERVICE}::createRole::create student`
        );

        break;
      default:
        break;
    }

    logger.info(`${UserConstant.LOGGER.SERVICE}::createRole::Success`);
    return;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::createRole::Error`, e);
    throw new Error(e);
  }
};

const findUserByOtpCode = async (otpCode) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::findUserByOtpCode::is called`);
  try {
    logger.info(`${UserConstant.LOGGER.SERVICE}::findUserByOtpCode::Success`);
    return UserModel.findOne({ otpCode, isDeleted: false });
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::findUserByOtpCode::Error`, e);
    throw new Error(e);
  }
};

const findUserById = async (_id) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::findUserById::is called`);
  try {
    logger.info(`${UserConstant.LOGGER.SERVICE}::findUserById::Success`);
    return UserModel.findOne({
      _id: mongoose.Types.ObjectId(_id),
      isDeleted: false,
    });
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::findUserById::Error`, e);
    throw new Error(e);
  }
};

const updatePass = async ({ user, password }) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::updatePass::is called`);
  try {
    const salt = bcrypt.genSaltSync(AuthConstant.SALT_LENGTH);

    user.passwordSalt = salt;
    user.passwordHash = bcrypt.hashSync(password, salt);

    await user.save();

    logger.info(`${UserConstant.LOGGER.SERVICE}::updatePass::Success`);
    return;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::updatePass::Error`, e);
    throw new Error(e);
  }
};

const findUsersByRoleHasPagination = async ({ role, page, limit }) => {
  logger.info(
    `${UserConstant.LOGGER.SERVICE}::findUsersByRoleHasPagination::is called`
  );
  try {
    const matchStage = {
      $match: {
        role,
        isDeleted: false,
      },
    };

    const sortStage = {
      $sort: {
        createdAt: -1,
      },
    };

    const facetStage = {
      $facet: {
        entries: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        meta: [{ $group: { _id: null, totalItems: { $sum: 1 } } }],
      },
    };

    const query = [matchStage, sortStage, facetStage];

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::findUsersByRoleHasPagination::query`,
      JSON.stringify(query)
    );
    const result = await UserModel.aggregate(query);

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::findUsersByRoleHasPagination::success`
    );
    return result;
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::findUsersByRoleHasPagination::Error`,
      e
    );
    throw new Error(e);
  }
};

const createUserHasLecturerRole = async ({ email, password, fullName }) => {
  logger.info(
    `${UserConstant.LOGGER.SERVICE}::createUserHasLecturerRole::is called`
  );
  try {
    const salt = bcrypt.genSaltSync(AuthConstant.SALT_LENGTH);

    const newUser = new UserModel({
      fullName: fullName
        ? fullName
        : randomString.generate({ length: 5, charset: "alphabetic" }),
      email,
      passwordSalt: salt,
      passwordHash: bcrypt.hashSync(password, salt),
      isConfirmed: true,
      role: UserConstant.ROLE.LECTURER,
    });

    await newUser.save();
    await createRole(newUser);

    logger.info(
      `${UserConstant.LOGGER.SERVICE}::createUserHasLecturerRole::Success`
    );
    return newUser;
  } catch (e) {
    logger.error(
      `${UserConstant.LOGGER.SERVICE}::createUserHasLecturerRole::Error`,
      e
    );
    throw new Error(e);
  }
};

const updateUserInfo = async ({ fullName, avatar, user, isBlocked }) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::updateUserInfo::is called`);
  try {
    let isChange = false;

    if (fullName) {
      logger.info(
        `${UserConstant.LOGGER.SERVICE}::updateUserInfo::update full name`
      );
      user["fullName"] = fullName;
      isChange = true;
    }

    if (isBlocked !== undefined) {
      logger.info(
        `${UserConstant.LOGGER.SERVICE}::updateUserInfo::update isBlocked`
      );
      user["isBlocked"] = isBlocked;
      isChange = true;
    }

    if (avatar) {
      if (user["publicId"]) {
        logger.info(
          `${UserConstant.LOGGER.SERVICE}::updateUserInfo::remove image`
        );
        await cloudinary.deleteFile(user["publicId"]);
      }

      logger.info(
        `${UserConstant.LOGGER.SERVICE}::updateUserInfo::update image`
      );
      const avatarInfo = await cloudinary.uploadByBuffer(
        avatar,
        FileTypesCloudDinaryConstant.image
      );
      user["avatarUrl"] = avatarInfo.url;
      user["publicId"] = avatarInfo.public_id;
      isChange = true;
    }

    if (isChange) {
      logger.info(
        `${UserConstant.LOGGER.SERVICE}::updateUserInfo::updating...`
      );
      await user.save();
    }

    logger.info(`${UserConstant.LOGGER.SERVICE}::updateUserInfo::success`);
    return user;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::updateUserInfo::Error`, e);
    throw new Error(e);
  }
};

const getUsersByIds = async (usersId) => {
  logger.info(`${UserConstant.LOGGER.SERVICE}::getUsersByIds::is called`);
  try {
    const users = await UserModel.find({ _id: { $in: usersId } });

    logger.info(`${UserConstant.LOGGER.SERVICE}::getUsersByIds::success`);
    return users;
  } catch (e) {
    logger.error(`${UserConstant.LOGGER.SERVICE}::getUsersByIds::Error`, e);
    throw new Error(e);
  }
};

module.exports = {
  findUserByNameOrEmail,
  mapUserInfo,
  isValidRefreshToken,
  createUser,
  findUserByOtpCode,
  findUserById,
  updatePass,
  findUsersByRoleHasPagination,
  createUserHasLecturerRole,
  updateUserInfo,
  getUsersByIds,
};
