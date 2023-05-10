const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const categoryClustersConstant = require("../../modules/category-clusters/category-clusters.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const addCategoryCluster = async () =>
  describe("CategoryClusters :: Add category cluster", () => {
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

    it("Category cluster should be duplicated", (done) => {
      try {
        chai
          .request(server)
          .post(constants.BASE_URL)
          .send({
            name: 'Tôn giáo học'
          })
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
                  categoryClustersConstant.MESSAGES.ADD_CATEGORY_CLUSTER.CATEGORY_CLUSTER_ALREADY_EXISTS
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

module.exports = addCategoryCluster;