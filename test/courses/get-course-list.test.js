const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
chai.use(chaiHttp);

const constants = require('./constants.test');

const getCourseList = async () => {
  describe('Courses :: Get course list with criteria', () => {
    it('Descending averageRating', (done) => {
      try {
        chai
          .request(server)
          .get(constants.BASE_URL)
          .query({ page: 1, limit: 10, keyword: 'lap trinh', isSortUpAscending: false, sortBy: 'averageRating' })
          .end((err, res) => {
            if (err) {
              console.log(err);
              done();
            }

            expect(res).to.have.status(HttpStatus.OK);
            const { entries } = res.body.data;
            let preIndex = 0;
            for (const index in entries) {
              if (index > 0) {
                expect(entries[preIndex].averageRating).gte(entries[index].averageRating);
                preIndex = index;
              }
            }

            done();
          })
      } catch (error) {
        console.error(error);
        done(error);
      }
    });
    it('Ascending averageRating', (done) => {
      try {
        chai
          .request(server)
          .get(constants.BASE_URL)
          .query({ page: 1, limit: 10, keyword: 'lap trinh', isSortUpAscending: true, sortBy: 'averageRating' })
          .end((err, res) => {
            if (err) {
              console.log(err);
              done();
            }

            expect(res).to.have.status(HttpStatus.OK);
            const { entries } = res.body.data;
            let preIndex = 0;
            for (const index in entries) {
              if (index > 0) {
                expect(entries[preIndex].averageRating).lte(entries[index].averageRating);
                preIndex = index;
              }
            }

            done();
          })
      } catch (error) {
        console.error(error);
        done(error);
      }
    });
    it('Ascending tuition', (done) => {
      try {
        chai
          .request(server)
          .get(constants.BASE_URL)
          .query({ page: 1, limit: 10, keyword: 'lap trinh', isSortUpAscending: true, sortBy: 'tuition' })
          .end((err, res) => {
            if (err) {
              console.log(err);
              done();
            }

            expect(res).to.have.status(HttpStatus.OK);
            const { entries } = res.body.data;
            let preIndex = 0;
            for (const index in entries) {
              if (index > 0) {
                expect(entries[preIndex].tuitionAfterDiscount).lte(entries[index].tuitionAfterDiscount);
                preIndex = index;
              }
            }

            done();
          })
      } catch (error) {
        console.error(error);
        done(error);
      }
    });
    it('Ascending tuition', (done) => {
      try {
        chai
          .request(server)
          .get(constants.BASE_URL)
          .query({ page: 1, limit: 10, keyword: 'lap trinh', isSortUpAscending: false, sortBy: 'tuition' })
          .end((err, res) => {
            if (err) {
              console.log(err);
              done();
            }

            expect(res).to.have.status(HttpStatus.OK);
            const { entries } = res.body.data;
            let preIndex = 0;
            for (const index in entries) {
              if (index > 0) {
                expect(entries[preIndex].tuitionAfterDiscount).gte(entries[index].tuitionAfterDiscount);
                preIndex = index;
              }
            }

            done();
          })
      } catch (error) {
        console.error(error);
        done(error);
      }
    });
  });
}

module.exports = getCourseList;
