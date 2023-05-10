const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const constant = require('./constants.test');
const registrationConstant = require('../../modules/registrations/registrations.constant');

chai.use(chaiHttp);

let accessToken = null;

const registerCourse = async () =>
  describe("Courses :: Register course", () => {
    beforeEach((done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({
            email: "student1@gmail.com",
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

    it("Course not found", (done) => {
      try {
        chai
          .request(server)
          .post(`${constant.BASE_URL}/602a0c06e99eaa14a41df641/registrations`)
          .set('accessToken', accessToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.NOT_FOUND);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  'COURSE_NOT_FOUND'
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Course is registered by this student", (done) => {
      try {
        chai
          .request(server)
          .post(`${constant.BASE_URL}/60224f46f7e4d94848a4eef9/registrations`)
          .set('accessToken', accessToken)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }

            if (res) {
              expect(res).to.have.status(HttpStatus.BAD_REQUEST);
              expect(res.body.messages)
                .to.be.an("array")
                .that.includes(
                  registrationConstant.MESSAGES.REGiSTER_THE_COURSE.THE_COURSE_HAS_BEEN_REGISTERED
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

module.exports = registerCourse;