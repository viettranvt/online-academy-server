const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const authConstant = require('../../modules/auth/auth.constant');
const constant = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const addLecturer = async () =>
  describe("Lecturers :: Add lecturer", () => {
    beforeEach((done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({
            email: "admin2020@gmail.com",
            password: "123456789",
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              accessToken = res.body.data.meta.accessToken;
            }

            done();
          });
      } catch (e) {
        done(e);
      }
    });

    it("Email is duplicated", (done) => {
      try {
        chai
          .request(server)
          .post(`${constant.BASE_URL}`)
          .set('accessToken', accessToken)
          .send({
            fullName: 'Putin',
            email: 'tuevo001@gmail.com'
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
                  authConstant.MESSAGES.REGISTER.EMAIL_ALREADY_EXISTS
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

module.exports = addLecturer;