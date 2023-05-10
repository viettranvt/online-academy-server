const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const lecturersConstant = require('../../modules/lecturers/lecturers.constant');
const constant = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const deleteLecturer = async () =>
  describe("Lecturers :: Delete lecturer", () => {
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

    it("Lecturer not found", (done) => {
      try {
        chai
          .request(server)
          .delete(`${constant.BASE_URL}/602a0c06e99eaa14a41df641`)
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
                  lecturersConstant.MESSAGES.DELETE_LECTURER.LECTURER_NOT_FOUND
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

module.exports = deleteLecturer;