const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
chai.use(chaiHttp);

const constants = require('./constants.test');

const getCategoryCourseList = async () => {
  describe('Categories :: Get category course list', () => {
    it('All courses in list should belong to this category', (done) => {
      const categoryId = '60223325f7e4d94848a4eee5';

      try {
        chai
          .request(server)
          .get(`${constants.BASE_URL}/${categoryId}/courses`)
          .query({ page: 1, limit: 10 })
          .end((err, res) => {
            if (err) {
              console.log(err);
              done();
            }

            const { entries } = res.body.data;
            for (const course of entries)
              expect(course.categoryId).equal(categoryId);

            done();
          })
      } catch (error) {
        console.error(error);
        done(error);
      }
    });
  });
}

module.exports = getCategoryCourseList;
