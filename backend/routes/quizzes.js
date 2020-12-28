const express = require('express');

const router = express.Router();
const { Quiz } = require('../models/Quiz');
const { auth } = require('../middleware/auth');

router.post('/saveQuiz', auth, (req, res) => {
  const questionSelected = req.body.questionSelected;

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
        [`quizzes.${questionSelected - 1}.question`]: req.body.quizzes[questionSelected - 1].question, 
        [`quizzes.${questionSelected - 1}.choices`]: req.body.quizzes[questionSelected - 1].choices,
        [`quizzes.${questionSelected - 1}.answer`]: req.body.quizzes[questionSelected - 1].answer,
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

      if(!doc || doc[0] === undefined) {
        return res.json({success: false, isExisted: false})
      }
      
      return res.status(200).json({success: true, quiz: doc[0].quizzes});
    })
});

router.post("/updateQuiz", auth, (req, res) => {
  const questionSelected = req.body.questionSelected;
  Quiz.findOneAndUpdate(
    {
      courseId: req.body.courseId, 
      videoId: req.body.videoId,
      uploader: req.body.uploader,
    },
    {
      $set: { 
        [`quizzes.${questionSelected - 1}.question`]: req.body.question, 
        [`quizzes.${questionSelected - 1}.choices`]: req.body.choices,
        [`quizzes.${questionSelected - 1}.answer`]: req.body.answer,
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