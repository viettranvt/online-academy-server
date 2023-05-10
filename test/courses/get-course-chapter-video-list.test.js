const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const constant = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const getCourseChapterVideoList = async () =>
  describe("Courses :: Get course chapter video list", () => {
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

    it("Course chapter not found", (done) => {
      try {
        chai
          .request(server)
          .get(`${constant.BASE_URL}/60224f46f7e4d94848a4eef9/chapters/602a0c06e99eaa14a41df641/videos`)
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
                  'CHAPTER_NOT_FOUND'
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

module.exports = getCourseChapterVideoList;