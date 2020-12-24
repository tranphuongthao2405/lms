const mongoose = require('mongoose');

const schema = mongoose.Schema;

const coursePath = mongoose.Schema({
  course: {
    type: schema.Types.ObjectId,
    ref: 'Course',
  },
  user: {
    type: schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: Array,
    default: [],
  },
});

const CoursePath = mongoose.model('CoursePath', coursePath);

module.exports = { CoursePath };
