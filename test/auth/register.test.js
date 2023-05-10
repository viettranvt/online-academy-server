const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const StudentModel = require("../../modules/students/students.model");
const UserModel = require("../../modules/users/users.model");
const AuthConstant = require("../../modules/auth/auth.constant");

chai.use(chaiHttp);

const registerTest = async () =>
  describe("Auth::register", () => {
    it("Register test :: Email exists", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/register")
          .send({
            email: "admin2020@gmail.com",
            fullName: "test",
            password: "123456789",
            confirmPassword: "123456789",
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
                  AuthConstant.MESSAGES.REGISTER.EMAIL_ALREADY_EXISTS
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Register test :: password and confirm password not match", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/register")
          .send({
            email: "test2020@gmail.com",
            fullName: "test",
            password: "12345678",
            confirmPassword: "123456789",
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
                  AuthConstant.MESSAGES.REGISTER
                    .PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Register test :: register successfully", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/register")
          .send({
            email: "test2020@gmail.com",
            fullName: "test",
            password: "123456789",
            confirmPassword: "123456789",
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.CREATED);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(AuthConstant.MESSAGES.REGISTER.REGISTER_SUCCESS);
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    afterEach((done) => {
      try {
        UserModel.findOne({ email: "test2020@gmail.com" }).exec(
          (err, result) => {
            if (err) {
              console.log(err);
            }

            if (result) {
              UserModel.deleteOne({ _id: result._id }).exec((err) => {
                if (err) {
                  console.log(err);
                }
              });

              StudentModel.deleteOne({ userId: result._id }).exec((err) => {
                if (err) {
                  console.log(err);
                }
              });
            }

            done();
          }
        );
      } catch (e) {
        done(e);
      }
    });
  });

module.exports = registerTest;
