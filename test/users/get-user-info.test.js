const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const UserConstant = require('../../modules/users/users.constant');

chai.use(chaiHttp);

let accessToken = null;

const getUserInfo = async () =>
    describe("Users::get user info test", () => {
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
                            accessToken = res.body.data.meta.accessToken;
                        }

                        done();
                    });
            } catch (e) {
                done(e);
            }
        });

        it("get user info test :: get user info test successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/users`)
                    .set({
                        accessToken: accessToken,
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
                                    UserConstant.MESSAGES.GET_USER_INFO.GET_USER_INFO_SUCCESSFULLY
                                );
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("get user info test :: token is not exists", (done) => {
            try {
                chai
                    .request(server)
                    .get(`/api/users`)
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
    });

module.exports = getUserInfo;
