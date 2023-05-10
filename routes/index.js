const express = require('express');
const router = express.Router({});

router.use('/users', require('../modules/users/users.route'));
router.use('/auth', require('../modules/auth/auth.route'));
router.use('/courses', require('../modules/courses/courses.route'));
router.use('/categories', require('../modules/categories/categories.route'));
router.use('/students', require('../modules/students/students.route')),
  router.use('/home', require('../modules/home/home.route')),
  router.use('/favorites', require('../modules/favorites/favorites.route')),
  router.use('/lecturers', require('../modules/lecturers/lecturers.route')),
  router.use(
    '/category-clusters',
    require('../modules/category-clusters/category-clusters.route')
  );

module.exports = router;
