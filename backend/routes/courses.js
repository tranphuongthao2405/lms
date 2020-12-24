const express = require('express');

const router = express.Router();
const multer = require('multer');
const { Course } = require('../models/Course');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/CourseThumbnail/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' || ext !== '.png' || ext !== '.jpeg') {
      return cb(res.status(400).end('only images are allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage }).single('file');

router.post('/uploadImage', auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/uploadCourse', auth, (req, res) => {
  const course = new Course(req.body);
  course.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

// create index for using text search on all fields in schema
Course.createIndexes();

router.post('/getCourses', auth, (req, res) => {
  const order = req.body.order ? req.body.order : 'desc';
  const sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  const limit = req.body.limit ? parseInt(req.body.limit, 10) : 100;
  const skip = parseInt(req.body.skip, 10);
  const term = req.body.searchTerm;
  const category = req.body.category;

  // filter course by search feature
  if (term && category) {
    Course.find({ $text: { $search: term, $caseSensitive: false } })
      .find({ category: category })
      .populate('uploader')
      .populate('videos')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, courses) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res
          .status(200)
          .json({ success: true, courses, postSize: courses.length });
      });
  } else if(!term && category) {
    Course.find({ category: category })
      .populate('uploader')
      .populate('videos')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, courses) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res
          .status(200)
          .json({ success: true, courses, postSize: courses.length });
      });
  } else if(term && !category) {
    Course.find({ $text: { $search: term, $caseSensitive: false } })
      .populate('uploader')
      .populate('videos')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, courses) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res
          .status(200)
          .json({ success: true, courses, postSize: courses.length });
      });
  } else {
    Course.find()
      .populate('uploader')
      .populate('videos')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, courses) => {
        if (err) {
          return res.status(400).json({ success: false, err });
        }
        return res
          .status(200)
          .json({ success: true, courses, postSize: courses.length });
      });
  }
});

router.get('/course_by_id', auth, (req, res) => {
  const { type } = req.query;
  let courseId = req.query.id;

  if (type === 'array') {
    const ids = req.query.id.split(',');
    courseId = [];
    courseId = ids.map((item) => item);
  }

  Course.find({ _id: { $in: courseId } })
    .populate('videos')
    .populate('uploader')
    .exec((err, course) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(course);
    });
});

router.get('/getCategories', auth, (req, res) => {
  const categories = [];

  Course.find({})
  .exec((err, courses) => {
    if(err) {
      return res.status(400).json({ success: false, err });
    }
    
    courses.forEach((course) => {
      const index = categories.findIndex((category) => category === course.category);
      if(index === -1) {
        categories.push(course.category);
      }
    })

    return res.status(200).json({ success: true, categories })
  })
})

module.exports = router;
