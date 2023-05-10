const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const registrationSchema = new Schema(
  {
    studentId: { type: ObjectId, default: null },
    courseId: { type: ObjectId, default: null },
    price: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const RegistrationModel = mongoose.model(
  "Registration",
  registrationSchema,
  "Registrations"
);

module.exports = RegistrationModel;
module.exports.Model = registrationSchema;
