const addCategoryCluster = require('./add-category-cluster.test');
const getCategoryClustersInfo = require('./get-category-clusters-info.test');
const updateCategoryCluster = require('./update-category-cluster.test');

module.exports = () => {
  addCategoryCluster();
  getCategoryClustersInfo();
  updateCategoryCluster();
};