const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const categoryClustersConstant = require("../../modules/category-clusters/category-clusters.constant");
const constants = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const getCategoryClustersInfo = async () =>
    describe("CategoryClusters :: Get category cluster info", () => {
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

        it("CategoryClusters :: Get category cluster info with access token successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(constants.BASE_URL)
                    .set('accessToken', accessToken)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    categoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO.GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("CategoryClusters :: Get category cluster info successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(constants.BASE_URL)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(
                                    categoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO.GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("CategoryClusters :: Get category cluster info successfully with page", (done) => {
            try {
                chai
                    .request(server)
                    .get(constants.BASE_URL)
                    .query({ page: 1 })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(categoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO.GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("CategoryClusters :: Get category cluster info successfully with limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(constants.BASE_URL)
                    .query({ limit: 4 })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(categoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO.GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("CategoryClusters :: Get category cluster info successfully with page, limit", (done) => {
            try {
                chai
                    .request(server)
                    .get(constants.BASE_URL)
                    .query({ page: 1, limit: 4 })
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(categoryClustersConstant.MESSAGES.GET_CATEGORY_CLUSTERS_INFO.GET_CATEGORY_CLUSTERS_INFO_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });
    });

module.exports = getCategoryClustersInfo;