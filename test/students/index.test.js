const getStudentList = require("./get-students-list.test");
const deleteStudent = require('./delete-student.test');
const getCoursesListRegistered = require("./get-courses-list-registered.test");
const getStudentDetail = require("./get-student-detail.test");

module.exports = () => {
  getStudentList();
  deleteStudent();
  getCoursesListRegistered();
  getStudentDetail();
};
