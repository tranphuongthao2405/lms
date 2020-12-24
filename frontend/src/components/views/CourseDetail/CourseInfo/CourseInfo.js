import React, { useEffect, useState } from 'react';
import {
  Button, Card, Steps, Typography,
} from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;
const { Step } = Steps;

const CourseInfo = ({ course }) => {
  const history = useHistory();
  const [enrolled, setEnrolled] = useState(false);
  const [status, setStatus] = useState([]);
  const [courseLength, setCourseLength] = useState(0);

  useEffect(() => {
    const variables = {
      courseId: course._id,
      userId: localStorage.userId,
    };

    axios.post('/api/paths/checkEnrollInfo', variables).then((response) => {
      setEnrolled(response.data.enrolled);
    });

    let totalDuration = 0;
    if (course) {
      course.videos.forEach((video) => {
        totalDuration += parseFloat(video.duration);
      });
    }
    setCourseLength(totalDuration);
  }, [enrolled]);

  const handleEnroll = () => {
    setStatus([]);
    course.videos.forEach((video) => {
      const index = status.find((item) => item.id === video._id);
      if (index === undefined) {
        status.push({ videoId: video._id, videoStatus: 'Not done' });
      }
    });

    const variables = {
      courseId: course._id,
      userId: localStorage.userId,
      status,
    };

    // update user information to learning path
    axios.post('/api/paths/enrollCourse', variables).then((response) => {
      if (response.data.success) {
        alert('Enroll course successfully');
        history.push(
          `/video/${course.videos[0]._id}/${course.videos[0].course}`,
        );
      } else {
        alert('Fail to enroll course');
      }
    });
  };

  const handleRedirect = () => {
    history.push(`/video/${course.videos[0]._id}/${course.videos[0].course}`);
  };

  const handleDuration = (duration) => {
    let hours; let minutes; let seconds;

    minutes = Math.floor(duration / 60);
    // eslint-disable-next-line prefer-const
    seconds = Math.floor(duration - minutes * 60);
    if (minutes > 60) {
      hours = Math.floor(minutes / 60);
      minutes -= 60 * hours;
    }

    let res;
    if (hours) {
      res = `${hours}h:${minutes}m:${seconds}s`;
    } else {
      res = `${minutes}m:${seconds}s`;
    }
    return res;
  };

  return (
    <div>
      <Card
        size="small"
        title={<Title level={3}>Course detail information:</Title>}
        style={{ width: '80%', fontSize: 15, border: 'none' }}
      >
        <p>
          Category:
          {' '}
          {course.category}
        </p>
        <p>
          Description:
          {' '}
          {course.description}
        </p>
        <p>
          Course length:
          {' '}
          {' '}
          {handleDuration(courseLength)}
        </p>
        <p>This course includes: </p>
        <Steps direction="vertical" size="small" current={1}>
          {course
              && course.videos
              && course.videos.map((video) => (
                <Step
                  key={video._id}
                  title={video.title}
                  description={handleDuration(video.duration)}
                  status="process"
                />
              ))}
        </Steps>
        {enrolled ? (
          <Button onClick={handleRedirect}>Go to course</Button>
        ) : (
          <Button onClick={handleEnroll}>Enroll Course</Button>
        )}
      </Card>
    </div>
  );
};

export default CourseInfo;
