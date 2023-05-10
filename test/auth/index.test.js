const loginTest = require("./login.test");
const registerTest = require("./register.test");
const changePassTest = require("./change-password.test");
const sendOtpCode = require('./send-otp-code.test');
const confirm = require('./confirm.test');
const refresh = require('./refresh.test');

module.exports = () => {
  loginTest();
  sendOtpCode();
  confirm();
  refresh();
  //registerTest();
  changePassTest();
};
