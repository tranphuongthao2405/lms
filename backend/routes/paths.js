const express = require('express');

const router = express.Router();
const { CoursePath } = require('../models/CoursePath');
const { auth } = require('../middleware/auth');

// learning path of course

router.post('/enrollCourse', auth, (req, res) => {
  const info = new CoursePath({
    course: req.body.courseId,
    user: req.body.userId,
    status: req.body.status
  });

  info.save((err, path) => {
    if (err) {
      return res.status(500).json({ success: false, err });
    }

    return res.status(200).json({ success: true, path });
  });
});

router.post('/checkEnrollInfo', auth, (req, res) => {
  CoursePath.findOne(
    { course: req.body.courseId, user: req.body.userId },
    (err, doc) => {
      if (err || !doc) {
        return res.status(400).json({ enrolled: false });
      }

      return res.status(200).json({ enrolled: true });
    }
  );
});

router.post('/updateCourseCollection', auth, (req, res) => {
  CoursePath.findOneAndUpdate(
    {
      user: req.body.userId,
      status: { $elemMatch: { videoId: req.body.videoId } }
    },
    {
      $set: { 'status.$.videoStatus': 'Done' }
    },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({ success: false, err });
      }

      return res.status(200).json({ success: true, doc });
    }
  );
});

router.post('/getCourseCollection', auth, (req, res) => {
  CoursePath.findOne(
    {
      user: req.body.userId,
      status: { $elemMatch: { videoId: req.body.videoId } }
    },
    (err, doc) => {
      if (err) {
        return res.status(400).json({ success: false, err });
      }

      return res.status(200).json({ success: true, status: doc.status });
    }
  );
});

router.post('/getAllPaths', auth, (req, res) => {
  CoursePath.find({ user: req.body.userId }, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    }

    return res.status(200).json({ success: true, data });
  });
});

module.exports = router;
