const log4js = require("log4js");
const logger = log4js.getLogger("App");
const bcrypt = require("bcrypt");

const DumpDataConstant = require("../constants/dump-data.constant");
const LoggerConstant = require("../constants/logger.constant");
const UserModel = require("../modules/users/users.model");
const UserConstant = require("../modules/users/users.constant");
const AdminsModel = require("../modules/admins/admins.model");
const AdminsService = require("../modules/admins/admins.service");
const LecturerService = require("../modules/lecturers/lecturers.service");
const LecturerModel = require("../modules/lecturers/lecturers.model");
const AuthConstant = require("../modules/auth/auth.constant");

const createUsers = () => {
  const dumpData = async () => {
    logger.info(
      `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::is called`
    );
    try {
      const users = DumpDataConstant.USER.usersInfo;
      const config = DumpDataConstant.USER.userDetail;

      for (email of users) {
        let user = await UserModel.findOne({ email }).lean();

        if (!user) {
          logger.info(
            `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUser::creating ${fullName}`
          );

          let userInfo = config[fullName];
          const salt = bcrypt.genSaltSync(AuthConstant.SALT_LENGTH);
          userInfo.passwordSalt = salt;
          userInfo.passwordHash = bcrypt.hashSync("123456789", salt);

          user = new UserModel(userInfo);
          await user.save();
        }

        if (user.role === UserConstant.ROLE.ADMIN) {
          const admin = await AdminsService.findAdminByUserId(user._id);

          if (!admin) {
            const newAdmin = new AdminsModel({
              userId: user._id,
            });

            logger.info(
              `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createAdmin::creating admin by id ${user._id}`
            );

            await newAdmin.save();
          }
        }

        if (user.role === UserConstant.ROLE.LECTURER) {
          const lecturer = await LecturerService.findLecturerByUserId(user._id);

          if (!lecturer) {
            const newLecturer = new LecturerModel({
              userId: user._id,
            });

            logger.info(
              `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createAdmin::creating lecturer by id ${user._id}`
            );

            await newLecturer.save();
            await AdminsService.updateNumberOfLecturers(1);
          }
        }
      }

      logger.info(
        `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::Done`
      );
      return;
    } catch (e) {
      logger.error(
        `${LoggerConstant.DUMP_DATA.USER_DUMP_DATA}::createUsers::error`,
        e
      );
      throw new Error(e);
    }
  };

  dumpData();
};

module.exports = () => {
  createUsers();
};
