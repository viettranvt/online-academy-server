const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const FeedbacksConstant = require("../../modules/feedbacks/feedbacks.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

const getFeedbacksTest = () =>
    describe("Courses::Get feedbacks", async () => {
        it("Feedbacks test :: Get feedbacks successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec/feedbacks`)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(FeedbacksConstant.MESSAGES.GET_FEEDBACKS.GET_FEEDBACKS_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("Feedbacks test :: Get feedbacks successfully with page", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec/feedbacks`)
                    .query({ page: 1 })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(FeedbacksConstant.MESSAGES.GET_FEEDBACKS.GET_FEEDBACKS_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("Feedbacks test :: Get feedbacks successfully with limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec/feedbacks`)
                    .query({ limit: 4 })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(FeedbacksConstant.MESSAGES.GET_FEEDBACKS.GET_FEEDBACKS_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("Feedbacks test :: Get feedbacks successfully with page, limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec/feedbacks`)
                    .query({ page: 1, limit: 4 })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(FeedbacksConstant.MESSAGES.GET_FEEDBACKS.GET_FEEDBACKS_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("Feedbacks test :: Course not found", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eee2/feedbacks`)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.NOT_FOUND);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.include('COURSE_NOT_FOUND');;
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getFeedbacksTest;