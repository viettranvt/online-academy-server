const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const FavoritesConstant = require("../../modules/favorites/favorites.constant");

chai.use(chaiHttp);

let tokenOfAdmin = null;
let tokenOfStudent = null;
let tokenOfLecturer = null;

const getFavoritesList = async () =>
    describe("Favorites::get favorites list test", () => {
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

        it("get favorites list test :: token is not exists", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
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

        it("get favorites list test :: lecturer the account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
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

        it("get favorites list test :: admin the account is not allowed to access", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
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

        it("get favorites list test :: get favorites list successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
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
                                    FavoritesConstant.MESSAGES.GET_FAVORITES_LIST
                                        .GET_FAVORITES_LIST_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get favorites list test :: get favorites list successfully with limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
                    .query({ limit: 2 })
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
                                    FavoritesConstant.MESSAGES.GET_FAVORITES_LIST
                                        .GET_FAVORITES_LIST_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get favorites list test :: get favorites list successfully with with page", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
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
                                    FavoritesConstant.MESSAGES.GET_FAVORITES_LIST
                                        .GET_FAVORITES_LIST_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get favorites list test :: get favorites list successfully with with page, limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/favorites`)
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
                                    FavoritesConstant.MESSAGES.GET_FAVORITES_LIST
                                        .GET_FAVORITES_LIST_SUCCESSFULLY
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

module.exports = getFavoritesList;
