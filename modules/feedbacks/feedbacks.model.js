const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    studentId: { type: ObjectId, default: null },
    courseId: { type: ObjectId, default: null },
    content: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const FeedBackModel = mongoose.model("feedback", feedbackSchema, "feedbacks");

module.exports = FeedBackModel;
module.exports.Model = feedbackSchema;
