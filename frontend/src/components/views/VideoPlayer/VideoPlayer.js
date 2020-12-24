/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Icon } from 'antd';
import { useHistory } from 'react-router-dom';
import SideVideo from './SideVideo/SideVideo';

const VideoPlayer = (props) => {
  const { videoId } = props.match.params;
  const { courseId } = props.match.params;
  const [video, setVideo] = useState('');
  const [courseStatus, setCourseStatus] = useState();
  const [course, setCourse] = useState();
  const [videos, setVideos] = useState();
  const history = useHistory();

  useEffect(() => {
    const videoVariables = {
      videoId,
    };
    axios.post('/api/videos/getVideo', videoVariables).then((response) => {
      if (response.data.success) {
        setVideo(response.data.video);
      } else {
        alert('Fail to get video');
      }
    });
  }, []);

  useEffect(() => {
    axios
      .get(`/api/courses/course_by_id?id=${courseId}&type=single`)
      .then((response) => {
        setCourse(response.data[0]);
      });
  }, []);

  useEffect(() => {
    const videoVariables = {
      courseId,
    };

    axios.post('/api/videos/getVideos', videoVariables).then((response) => {
      if (response.data.success) {
        setVideos(response.data.videos);
      } else {
        console.log('Failed to get videos');
      }
    });
  }, []);

  // track whether video plays till the end
  const onEnded = () => {
    const variables = {
      userId: localStorage.userId,
      videoId,
    };

    axios.post('/api/paths/updateCourseCollection', variables).then((response) => {
      if (response.data.success) {
        setCourseStatus(response.data.doc.status);
      }
    });

    // find next videos to change

    const currentIndex = videos.findIndex((item) => item._id === videoId);
    let nextIndex = 0;
    nextIndex = nextIndex < videos.length ? currentIndex + 1 : currentIndex;

    history.push(`/video/${videos[nextIndex]._id}/${courseId}`);

    console.log('Video ended');
  };

  return (
    <div>

      {video && course && (
      <Row style={{ display: 'flex', marginLeft: '4rem', marginBottom: '1rem' }}>
        <a href={`/${course.category}`}>
          {' '}
          <p style={{ fontWeight: 400 }}>{`${course.category}`}</p>
        </a>
        <Icon
          type="right"
          style={{
            fontSize: '12px', marginTop: 5, marginLeft: 5, marginRight: 5,
          }}
        />
        <p>{`${video.title}`}</p>
      </Row>
      )}

      {video && course ? (
        <Row>
          <Col lg={5} xs={20} style={{ marginRight: '4rem', marginLeft: '4rem' }}>
            <SideVideo videoId={videoId} courseId={courseId} />
          </Col>
          <Col lg={15} xs={20}>
            <div style={{ width: '100%', padding: '3rem 4em' }}>
              <video
                className="video-player"
                style={{
                  width: '100%',
                  borderRight: '1px solid rgba(0, 0, 0, 0.8)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.8)',
                }}
                src={`http://localhost:5000/${video.filePath}`}
                controls
                onEnded={onEnded}
              />
            </div>
          </Col>
        </Row>
      ) : (
        <h1
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '4rem',
          }}
        >
          Loading...
        </h1>
      )}
    </div>
  );
};

export default VideoPlayer;
