const express = require('express');

const router = express.Router();
const multer = require('multer');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const { spawn } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const { Video } = require('../models/Video');
const { Course } = require('../models/Course');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/Video/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4' || ext !== '.jpg' || ext !== '.png' || ext !== '.jpeg') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage }).single('file');

router.post('/uploadFiles', auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/thumbnail', auth, (req, res) => {
  let thumbsFilePath = '';
  let fileDuration = '';

  ffmpeg.ffprobe(req.body.filePath, (err, metadata) => {
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.filePath)
    .on('filenames', (filenames) => {
      thumbsFilePath = `uploads/VideoThumbnail/${filenames[0]}`;
    })
    .on('end', () => res.json({
      success: true,
      thumbsFilePath,
      fileDuration,
    }))
    .screenshots({
      count: 3,
      folder: 'uploads/VideoThumbnail/',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnail-%b.png',
    });
});

router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);

  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err });

    const courseId = req.body.course;
    Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { videos: video._id } },
      (err) => {
        if (err) return res.status(400).json(err);
      }
    );
    return res.status(200).json({
      success: true,
    });
  });
});


router.post('/getVideo', auth, (req, res) => {
  Video.findOne({ _id: req.body.videoId })
    .populate('uploader')
    .exec((err, video) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, video });
    });
});

router.get('/getVideos', auth, (req, res) => {
  const { courseId } = req.query;

  Video.find({ course: courseId })
    .populate('uploader')
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

// create index for using text search on all fields in schema
Video.createIndexes();

router.post('/getVideos', auth, (req, res) => {
  const courseId = req.body.courseId;
  const searchTerm = req.body.searchTerm;

  if(searchTerm) {
    Video.find({ $text: { $search: searchTerm, $caseSensitive: false }})
      .find({ course: courseId })
      .populate('uploader')
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      })
    

  } else {
    Video.find({ course: courseId })
      .populate('uploader')
      .exec((err, videos) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, videos });
      });
  }
});

module.exports = router;
