module.exports = {
  LOGGER: {
    CONTROLLER: "USER_CONTROLLERS",
    SERVICE: "USER_SERVICES",
  },
  ROLE: {
    ADMIN: 4,
    LECTURER: 3,
    STUDENT: 2,
    GUEST: 1,
  },
  MESSAGES: {
    GET_USER_INFO: {
      USER_NOT_FOUND: "USER_NOT_FOUND",
      GET_USER_INFO_SUCCESSFULLY: "GET_USER_INFO_SUCCESSFULLY",
    },
    UPDATE_USER_INFO: {
      USER_NOT_FOUND: "USER_NOT_FOUND",
      UPDATE_USER_INFO_SUCCESSFULLY: "UPDATE_USER_INFO_SUCCESSFULLY",
    },
    UPDATE_USER_INFO_BY_ADMIN_ROLE: {
      USER_NOT_FOUND: "USER_NOT_FOUND",
      UPDATE_USER_INFO_SUCCESSFULLY: "UPDATE_USER_INFO_SUCCESSFULLY",
    },
  },
};