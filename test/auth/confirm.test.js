const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const AuthConstant = require("../../modules/auth/auth.constant");

chai.use(chaiHttp);

const confirm = async () =>
  describe("Auth :: Confirm", () => {
    it("OTP code should be invalid", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/confirm")
          .send({
            otpCode: 'abcxyz'
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.BAD_REQUEST);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  AuthConstant.MESSAGES.CONFIRM_OTP_CODE.INVALID_OTP_CODE
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

module.exports = confirm;