const mongoose = require('mongoose');

const schema = mongoose.Schema;

const quizSchema = mongoose.Schema({
  courseId: {
    type: schema.Types.ObjectId,
    ref: 'Course',
  },
  uploader: {
    type: schema.Types.ObjectId,
    ref: 'User',
  },
  videoId: {
    type: schema.Types.ObjectId,
    ref: 'Video',
  },
  quizzes: {
    type: Array,
    default: [],
  },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Quiz };
