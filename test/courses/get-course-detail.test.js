const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const CoursesConstant = require("../../modules/courses/courses.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

const getCourseDetail = () =>
    describe("Courses::Get course detail", async () => {
        it("CourseDetail test :: Get course detail successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec`)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(CoursesConstant.MESSAGES.GET_COURSE_DETAIL.GET_COURSE_DETAIL_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
        it("CourseDetail test :: Course detail not found", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eee2`)
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
        it('Most registered course list has at most 5 courses and each course should belong to the same category of this course',
            (done) => {
                try {
                    chai
                        .request(server)
                        .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec`)
                        .end((err, res) => {
                            if (err) {
                                console.log(err);
                                done();
                            }

                            const { course, mostRegisteredCourses } = res.body.data;

                            expect(mostRegisteredCourses.length).lte(5);

                            for (const c of mostRegisteredCourses)
                                expect(c.categoryId).equal(course.categoryId);

                            done();
                        })
                } catch (e) {
                    console.error(e);
                    done(e);
                }
            })
    });

module.exports = getCourseDetail;