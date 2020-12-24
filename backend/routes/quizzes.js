const express = require('express');

const router = express.Router();
const { Quiz } = require('../models/Quiz');
const { auth } = require('../middleware/auth');

// 1. save quiz
// 2. get quiz to fill value in form

router.post('/saveQuiz', auth, (req, res) => {
  const quizzes = new Quiz({
    courseId: req.body.courseId,
    uploader: req.body.uploader,
    videoId: req.body.videoId,
    quizzes: req.body.quizzes,
  });

  Quiz.findOneAndUpdate(
    {
      courseId: req.body.courseId, 
      videoId: req.body.videoId,
      uploader: req.body.uploader,
    },
    {
      $set: { 
        quizzes: req.body.quizzes,
      }
    },
    { new: true },
    (err, doc) => {
      if(err) {
        return res.status(400).json({success: false, err});
      }

      if(!doc) {
        quizzes.save((err, data) => {
          if (err) return res.json({ success: false, err });
          return res.json({
            success: true,
            data
          });
        });
      }

      return res.status(200).json({success: true, doc});
    })
});

router.post('/getQuizzes', auth, (req, res) => {
  const courseId = req.body.courseId;
  const videoId = req.body.videoId;

  Quiz.find({courseId: courseId, videoId: videoId})
    .populate('videoId')
    .populate('courseId')
    .exec((err, doc) => {
      if(err) {
        return res.status(400).json({success: false, err});
      }
      
      return res.status(200).json({success: true, quiz: doc.quizzes});
    })
});

router.post("/updateQuiz", auth, (req, res) => {
  const courseId = req.body.courseId;
  const videoId = req.body.videoId;

  Quiz.findOneAndUpdate(
    {
      courseId: courseId, 
      videoId: videoId,
      quizzes: { $elemMatch: {number: req.body.questionSelected} }
    },
    {
      $set: { 
        'quizzes.$.question': req.body.question, 
        'quizzes.$.choices': req.body.choices,
        'quizzes.$.answer': req.body.answer,
      }
    },
    { new: true },
    (err, doc) => {
      if(err) {
        return res.status(400).json({success: false, err});
      }
      return res.status(200).json({success: true, doc});
    })
});

module.exports = router;
