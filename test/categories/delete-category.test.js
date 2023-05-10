const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const CategoriesConstant = require("../../modules/categories/categories.constant");

chai.use(chaiHttp);

let accessToken = null;

const deleteCategory = async () =>
  describe("Categories :: Delete category", () => {
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

    it("Category not found", (done) => {
      try {
        chai
          .request(server)
          .delete("/api/categories/60530d92f711ac2e0c4847d4")
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
                  CategoriesConstant.MESSAGES.DELETE_CATEGORY.CATEGORY_NOT_FOUND
                );
            }

            done();
          });
      } catch (e) {
        console.error(e);
        done(e);
      }
    });

    it("Cannot delete category having course", (done) => {
      try {
        chai
          .request(server)
          .delete("/api/categories/60223325f7e4d94848a4eee5")
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
                  CategoriesConstant.MESSAGES.DELETE_CATEGORY.CATEGORY_ALREADY_EXISTS_REGISTERED_COURSE
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

module.exports = deleteCategory;