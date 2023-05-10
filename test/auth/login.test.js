const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const AuthConstant = require("../../modules/auth/auth.constant");

chai.use(chaiHttp);

const loginTest = () =>
  describe("Auth::Login", async () => {
    it("Login test :: Email not exists", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({ email: "test2021@gmail.com", password: "123456789" })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.BAD_REQUEST);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  AuthConstant.MESSAGES.LOGIN
                    .MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Login test :: Email exists and password not match", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({ email: "admin2020@gmail.com", password: "12345678" })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.BAD_REQUEST);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  AuthConstant.MESSAGES.LOGIN
                    .MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Login test :: Email and password is empty", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.BAD_REQUEST);
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Login test :: Account has not been confirmed", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({
            email: "enzoferrari0408.vt@gmail.com",
            password: "123456789",
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  AuthConstant.MESSAGES.LOGIN.ACCOUNT_HAS_NOT_BEEN_CONFIRMED
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Login test :: Email and password are correct", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({ email: "admin2020@gmail.com", password: "123456789" })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.OK);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(AuthConstant.MESSAGES.LOGIN.LOGIN_SUCCESSFULLY);
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });
  });

module.exports = loginTest;
