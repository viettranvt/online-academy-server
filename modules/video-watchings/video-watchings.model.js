const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const videoWatchingSchema = new Schema(
  {
    studentId: { type: ObjectId, default: null },
    videoId: { type: ObjectId, default: null },
    courseId: { type: ObjectId, default: null },
  },
  { timestamps: true, paranoid: true }
);

const VideoWatchingModel = mongoose.model(
  'VideoWatching',
  videoWatchingSchema,
  'VideoWatchings'
);

module.exports = VideoWatchingModel;
module.exports.Model = videoWatchingSchema;
