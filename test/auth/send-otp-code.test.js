const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const AuthConstant = require("../../modules/auth/auth.constant");

chai.use(chaiHttp);

const sendOtpCode = async () =>
  describe("Auth :: Send OTP code", () => {
    it("Should be success", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/otp-code")
          .send({
            email: "tuevo.it@gmail.com"
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.OK);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  AuthConstant.MESSAGES.RESEND_OTP_CODE.SEND_OTP_CODE_SUCCESSFULLY
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });
    it("Email should be not found", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/otp-code")
          .send({
            email: "abcxyz@gmail.com"
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.NOT_FOUND);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  AuthConstant.MESSAGES.RESEND_OTP_CODE.EMAIL_NOT_FOUND
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });
  });

module.exports = sendOtpCode;
