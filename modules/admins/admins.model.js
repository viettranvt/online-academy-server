const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    userId: { type: ObjectId, unique: true },
    numberOfStudents: { type: Number, default: 0 },
    numberOfLecturers: { type: Number, default: 0 },
    numberOfCourses: { type: Number, default: 0 },
  },
  { timestamps: true, paranoid: true }
);

const AdminModel = mongoose.model('Admin', adminSchema, 'Admins');

module.exports = AdminModel;
module.exports.Model = adminSchema;
