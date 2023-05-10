const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const RegistrationsConstant = require("../../modules/registrations/registrations.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let tokenOfAdmin = null;
let tokenOfLecturer = null;
let tokenOfStudent = null;

const getCoursesListRegistered = async () =>
    describe("Students::get courses list registered test", () => {
        //before running api must get token
        beforeEach((done) => {
            try {
                //get token of admin
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
                            tokenOfAdmin = res.body.data.meta.accessToken;
                        }

                        //get token of lecturer
                        chai
                            .request(server)
                            .post("/api/auth/login")
                            .send({
                                email: "lecturer1@gmail.com",
                                password: "123456789",
                            })
                            .end((err, res) => {
                                if (err) {
                                    console.log(err);
                                }

                                if (res) {
                                    tokenOfLecturer = res.body.data.meta.accessToken;
                                }
                            });

                        //get token of student
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
                                    tokenOfStudent = res.body.data.meta.accessToken;
                                }
                            });

                        done();
                    });
            } catch (e) {
                done(e);
            }
        });

        it("get courses list registered test :: token is not exists", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .set({
                        accessToken: "",
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes("INVALID_TOKEN");
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get courses list registered test :: admin account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .set({
                        accessToken: tokenOfAdmin,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes("ACCESS_IS_NOT_ALLOWED");
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get courses list registered test :: lecturer account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .set({
                        accessToken: tokenOfLecturer,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.UNAUTHORIZED);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes("ACCESS_IS_NOT_ALLOWED");
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get courses list registered test :: successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .set({
                        accessToken: tokenOfStudent,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    RegistrationsConstant.MESSAGES.GET_COURSES_LIST_REGISTERED
                                        .GET_COURSES_LIST_REGISTERED_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get courses list registered test :: get courses list registered successfully with limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .query({ limit: 4 })
                    .set({
                        accessToken: tokenOfStudent,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    RegistrationsConstant.MESSAGES.GET_COURSES_LIST_REGISTERED
                                        .GET_COURSES_LIST_REGISTERED_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get courses list registered test :: get courses list registered successfully with page", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .query({ page: 2 })
                    .set({
                        accessToken: tokenOfStudent,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    RegistrationsConstant.MESSAGES.GET_COURSES_LIST_REGISTERED
                                        .GET_COURSES_LIST_REGISTERED_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get courses list registered test :: get courses list registered successfully page, limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/courses/registrations`)
                    .query({ page: 1, limit: 8 })
                    .set({
                        accessToken: tokenOfStudent,
                    })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    RegistrationsConstant.MESSAGES.GET_COURSES_LIST_REGISTERED
                                        .GET_COURSES_LIST_REGISTERED_SUCCESSFULLY
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

module.exports = getCoursesListRegistered;