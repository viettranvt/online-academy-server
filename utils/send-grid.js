const sgMail = require("@sendgrid/mail");
const log4js = require("log4js");
const logger = log4js.getLogger("Services");

let from = "";

if (process.env.NODE_ENV === "test") {
  sgMail.setApiKey(
    "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"
  );
  from = "trantuanviet040898.vt@gmail.com";
} else {
  sgMail.setApiKey(
    "SG.iOfGDKHtTcyTYKUAWtvRTA.RzUYDKGqe3fzTteGPEkkBefCQUME_s3ONNUfyAupD-s"
  );
  from = "abc040898.vt@gmail.com";
}

const sendConfirmMail = ({ email, fullName, otpCode }) => {
  logger.info("Utils::sendConfirmMail::is called");
  return new Promise(async (res, rej) => {
    try {
      const msg = {
        from,
        to: email,
        subject: "Online-Academy - Xác nhận đăng kí",
        text: `Xin chào ${fullName}\n\nOnline-Academy xin gửi đến bạn mã xác nhận mail: ${otpCode}.`,
      };

      await sgMail.send(msg);

      logger.info("Utils::sendConfirmMail::success");
      return res();
    } catch (e) {
      logger.error("Utils::sendConfirmMail::error", e);
      return rej(e);
    }
  });
};

const sendAuthorizationMail = ({ email, password, fullName }) => {
  logger.info("Utils::sendAuthorizationMail::is called");
  return new Promise(async (res, rej) => {
    try {
      const msg = {
        from,
        to: email,
        subject: "Online-Academy - Cấp quyền giảng viên",
        text: `Xin chào ${fullName}\n\n
                Chúng tôi đã cấp quyền giảng viên cho bạn. Thông tin tài khoản như sau:\n
                email: ${email}\n
                password: ${password}\n
                Bạn vui lòng truy cập vào hệ thống thay đổi mật khẩu và thông tin.\n\n
                Online-Academy chân thành cảm ơn bạn.`,
      };

      await sgMail.send(msg);

      logger.info("Utils::sendAuthorizationMail::success");
      return res();
    } catch (e) {
      logger.error("Utils::sendAuthorizationMail::error", e);
      return rej(e);
    }
  });
};

module.exports = {
  sendConfirmMail,
  sendAuthorizationMail,
};
