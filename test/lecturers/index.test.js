const getLecturersList = require("./get-lecturers-list.test");
const getLecturerDetail = require("./get-lecturer-detail.test");
const deleteLecturer = require('./delete-lecturer.test');
const getCoursesListByLecturer = require('./get-courses-list-by-lecturer.test');
const addLecturer = require('./add-lecturer.test');

module.exports = () => {
    getLecturersList();
    getLecturerDetail();
    deleteLecturer();
    getCoursesListByLecturer();
    addLecturer();
};
