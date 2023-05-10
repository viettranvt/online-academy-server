const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const constant = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const addVideoWatching = async () =>
  describe("Courses :: Add video watching", () => {
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
          .post(`${constant.BASE_URL}/602a0c06e99eaa14a41df641/video-watchings`)
          .set('accessToken', accessToken)
          .send({
            videoId: '602a0c06e99eaa14a41df641'
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
  });

module.exports = addVideoWatching;