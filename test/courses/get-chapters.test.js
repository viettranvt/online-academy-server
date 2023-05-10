const chai = require("chai");
const chaiHttp = require("chai-http");
const HttpStatus = require("http-status-codes");
const { expect } = require("chai");

const server = require("../../app");
const ChaptersConstant = require('../../modules/chapters/chapters.constant');
const constants = require('./constants.test');

chai.use(chaiHttp);

let accessToken = null;

const getChaptersTest = () =>
    describe("Courses::Get chapters", async () => {
        beforeEach((done) => {
            try {
                chai
                    .request(server)
                    .post("/api/auth/login")
                    .send({
                        email: "vothaiminhtue0312@gmail.com",
                        password: "asdasd",
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

        it("Chapters test :: Get chapters successfully", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eeec/chapters`)
                    .set('accessToken', accessToken)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                        }

                        if (res) {
                            expect(res).to.have.status(HttpStatus.OK);
                            expect(res.body.messages)
                                .to.be.an("array")
                                .that.includes(ChaptersConstant.MESSAGES.GET_CHAPTERS.GET_CHAPTERS_SUCCESSFULLY);
                        }

                        done();
                    });
            } catch (e) {
                console.error(e);
                done(e);
            }
        });

        it("Chapters test :: Course not found", (done) => {
            try {
                chai
                    .request(server)
                    .get(`${constants.BASE_URL}/60223b77f7e4d94848a4eee2/chapters`)
                    .set('accessToken', accessToken)
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

module.exports = getChaptersTest;