const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const AuthConstant = require("../../modules/auth/auth.constant");

chai.use(chaiHttp);

let accessToken = null;

const refresh = async () =>
  describe("Auth :: Refresh token", () => {
    beforeEach((done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({
            email: "vothaiminhtue0312@gmail.com",
            password: "asdasd",
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

    it("Refresh token should be invalid", (done) => {
      try {
        chai
          .request(server)
          .post("/api/auth/refresh")
          .send({
            accessToken,
            refreshToken: 'xyz'
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
                  AuthConstant.MESSAGES.REFRESH_TOKEN.INVALID_REFRESH_TOKEN
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

module.exports = refresh;