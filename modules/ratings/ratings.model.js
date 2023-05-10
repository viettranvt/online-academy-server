const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    studentId: { type: ObjectId, default: null },
    courseId: { type: ObjectId, default: null },
    rating: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const RatingModel = mongoose.model('Rating', ratingSchema, 'Ratings');

module.exports = RatingModel;
module.exports.Model = ratingSchema;
