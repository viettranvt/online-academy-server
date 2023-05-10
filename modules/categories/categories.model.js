const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    categoryClusterId: { type: ObjectId, default: null },
    name: { type: String, default: null },
    numberOfCourses: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const CategoryModel = mongoose.model('Category', categorySchema, 'Categories');

module.exports = CategoryModel;
module.exports.Model = categorySchema;
