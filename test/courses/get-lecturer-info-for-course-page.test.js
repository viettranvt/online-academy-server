const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const LecturersConstant = require("../../modules/lecturers/lecturers.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

const getLecturerInfoForCoursePage = () =>
    describe("Courses::Get lecturer info for course page", async () => {
        it("LecturerInfoForCoursePage test :: Successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec/lecturers`)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(LecturersConstant.MESSAGES.GET_LECTURER_INFO_FOR_COURSE_PAGE
                                    .GET_LECTURER_INFO_FOR_COURSE_PAGE_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("LecturerInfoForCoursePage test :: Course not found", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eee2/lecturers`)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.NOT_FOUND);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes('COURSE_NOT_FOUND');
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getLecturerInfoForCoursePage;