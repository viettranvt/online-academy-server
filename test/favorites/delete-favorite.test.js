const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const favoriteConstant = require('../../modules/favorites/favorites.constant');

chai.use(chaiHttp);

let accessToken = null;

const deleteFavorite = async () =>
  describe("Favorites :: Delete favorite", () => {
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

    it("Course is not in favorite list of this student", (done) => {
      try {
        chai
          .request(server)
          .delete(`/api/favorites/60380d5ea4668e4136a09cc9`)
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
                  favoriteConstant.MESSAGES.REMOVE_THE_COURSE_FROM_FAVORITES.THE_COURSE_IS_NOT_EXISTS_IN_FAVORITES_LIST
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

module.exports = deleteFavorite;