const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const lecturerSchema = new Schema(
  {
    userId: { type: ObjectId, unique: true },
    introduction: { type: String, default: "" },
    averageRating: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 },
    numberOfStudents: { type: Number, default: 0 },
    numberOfCoursesPosted: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const LecturerModel = mongoose.model('Lecturer', lecturerSchema, 'Lecturers');

module.exports = LecturerModel;
module.exports.Model = lecturerSchema;
