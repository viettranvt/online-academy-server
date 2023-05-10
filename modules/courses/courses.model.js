const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    categoryId: { type: ObjectId, default: null },
    lecturerId: { type: ObjectId, default: null },
    thumbnailUrl: { type: String, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    content: { type: String, default: null },
    numberOfRatings: { type: Number, default: 0 },
    numberOfRegistrations: { type: Number, default: 0 },
    numberOfViews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    isFinished: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    tuition: { type: Number, default: 0 },
    tuitionAfterDiscount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    publicId: { type: String, default: null },
    slug: { type: String, default: "" },
    updatedAtByLecturer: { type: Date, default: new Date() },
  },
  { timestamps: true, paranoid: true }
);

const CourseModel = mongoose.model("Course", courseSchema, "Courses");

module.exports = CourseModel;
module.exports.Model = courseSchema;
