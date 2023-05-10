const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    studentId: { type: ObjectId, default: null },
    courseId: { type: ObjectId, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, paranoid: true }
);

const FavoriteModel = mongoose.model('Favorite', favoriteSchema, 'Favorites');

module.exports = FavoriteModel;
module.exports.Model = favoriteSchema;
