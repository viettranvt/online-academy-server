const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    userId: { type: ObjectId, unique: true },
    numberOfFavoriteCourses: { type: Number, default: 0 },
    numberOfCoursesRegistered: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const StudentModel = mongoose.model('Student', studentSchema, 'Students');

module.exports = StudentModel;
module.exports.Model = studentSchema;
