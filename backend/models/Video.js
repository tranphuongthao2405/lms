const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema(
  {
    uploader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    filePath: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: "text" });

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
