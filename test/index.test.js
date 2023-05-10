const authTest = require("./auth/index.test");
const coursesTest = require("./courses/index.test");
const studentsTest = require("./students/index.test");
const homeTest = require("./home/index.test");
const categoriesTest = require('./categories/index.test');
const lecturerTest = require('./lecturers/index.test');
const favoritesTest = require('./favorites/index.test');
const categoryClustersTest = require('./category-clusters/index.test');
const getUserInfo = require('./users/index.test');

authTest();
coursesTest();
studentsTest();
homeTest();
categoriesTest();
lecturerTest();
favoritesTest();
categoryClustersTest();
getUserInfo();