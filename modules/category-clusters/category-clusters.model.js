const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categoryClusterSchema = new Schema(
  {
    name: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const CategoryClusterModel = mongoose.model(
  "CategoryCluster",
  categoryClusterSchema,
  "CategoryClusters"
);

module.exports = CategoryClusterModel;
module.exports.Model = categoryClusterSchema;
