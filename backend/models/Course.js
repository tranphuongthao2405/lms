const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = mongoose.Schema(
  {
    uploader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnail: {
      type: Array,
      default: [],
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

courseSchema.index({ title: "text" });

const Course = mongoose.model("Course", courseSchema);

module.exports = { Course };
