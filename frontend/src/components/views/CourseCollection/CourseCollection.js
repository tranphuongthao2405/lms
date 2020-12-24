import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Card, Col, Row, Steps, Typography,
} from 'antd';
import SearchBar from '../SearchBar/SearchBar';
import './CourseCollection.css';

const { Meta } = Card;
const { Title } = Typography;
const { Step } = Steps;

const CourseCollection = () => {
  const [courses, setCourses] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [searchTerms, setSearchTerms] = useState('');
  const [courseStatus, setCourseStatus] = useState();

  const getCourses = (variables) => {
    axios.post('/api/courses/getCourses', variables).then((response) => {
      if (response.data.success) {
        if (variables.loadMore) {
          setCourses([...courses, ...response.data.courses]);
        } else {
          setCourses(response.data.courses);
        }
        setPostSize(response.data.postSize);
      } else {
        alert('Failed to fetch courses');
      }
    });
  };

  const onLoadMore = () => {
    const skipTemp = skip + limit;
    const variables = {
      skip: skipTemp,
      limit,
      loadMore: true,
      searchTerm: searchTerms,
    };
    getCourses(variables);
    setSkip(skipTemp);
  };

  useEffect(() => {
    const variables = {
      skip,
      limit,
    };
    getCourses(variables);
  }, []);

  useEffect(() => {
    const variables = {
      userId: localStorage.userId,
    };

    axios.post('/api/paths/getAllPaths', variables).then((response) => {
      setCourseStatus(response.data.data);
    });
  }, []);

  const handleDuration = (duration) => {
    let hours; let minutes;

    minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - minutes * 60);
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

  const handleCheckStatus = (course, video) => {
    let videoStatus;
    courseStatus.forEach((coursePath) => {
      if (coursePath.course === course._id) {
        coursePath.status.forEach((videoStt) => {
          if (video._id === videoStt.videoId) {
            videoStatus = videoStt.videoStatus;
          }
        });
      }
    });
    return videoStatus;
  };

  const renderCards = courses.map((course) => (
    <Col lg={15} md={8} xs={24} key={course._id} style={{ width: '60%' }}>
      <Card
        hoverable
        style={{ display: 'flex', flexDirection: 'row' }}
        cover={(
          <a href={`/course/${course._id}`}>
            <img
              src={course.thumbnail[0]}
              alt="course thumbnail"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </a>
        )}
        bodyStyle={{ width: '100%' }}
      >
        <div style={{ marginLeft: '2rem' }}>
          <Meta
            style={{ marginBottom: '1rem' }}
            title={<Title level={3}>{course.title}</Title>}
            description={(
              <>
                <p style={{ fontSize: 14 }}>
                  Category:
                  {' '}
                  {course.category}
                </p>
                <p style={{ fontSize: 14 }}>
                  Description:
                  {' '}
                  {course.description}
                </p>
              </>
            )}
          />

          <Steps direction="vertical" size="small" current={1}>
            {course
              && course.videos
              && course.videos.map((video) => (
                <Step
                  key={video._id}
                  title={handleCheckStatus(course, video) === 'Done' ? 'Finished' : 'In progress'}
                  description={handleDuration(video.duration)}
                  status={handleCheckStatus(course, video) === 'Done' ? 'finish' : 'process'}
                />
              ))}
          </Steps>

        </div>
      </Card>
    </Col>
  ));

  const updateSearchTerms = (newSearchTerms) => {
    const variables = {
      skip: 0,
      limit,
      searchTerm: newSearchTerms,
    };

    setSkip(0);
    setSearchTerms(newSearchTerms);

    getCourses(variables);
  };

  return (
    <div
      style={{
        width: '75%',
        margin: '3rem auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '1rem auto',
        }}
      >
        <SearchBar refreshFunction={updateSearchTerms} />
      </div>
      <br />
      <br />
      <div>
        {courses.length === 0 ? (
          <div
            style={{
              display: 'flex',
              height: '300px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h2>Loading...</h2>
          </div>
        ) : (
          <div>
            <Row
              gutter={[16, 16]}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              }}
            >
              {renderCards}
            </Row>
          </div>
        )}
        <br />
        <br />
        {postSize >= limit && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onLoadMore}>Load more</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCollection;
