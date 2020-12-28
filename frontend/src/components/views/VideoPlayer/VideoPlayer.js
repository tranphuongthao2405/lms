/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Col, Row, Icon, Modal,
} from 'antd';
import SideVideo from './SideVideo/SideVideo';
import Quiz from '../Quiz/Quiz';

const VideoPlayer = (props) => {
  const { videoId } = props.match.params;
  const { courseId } = props.match.params;
  const [video, setVideo] = useState('');
  const [course, setCourse] = useState();
  const [videos, setVideos] = useState();
  const [quizzes, setQuizzes] = useState([]);
  const [isOk, setOk] = useState(false);
  const [nextIndex, setNextIndex] = useState(0);

  // modal state
  const [visible, setVisible] = useState(false);
  const [modalText, setModalText] = useState('');

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
    const quizVariables = {
      courseId,
      videoId,
    };

    axios.post('/api/quizzes/getQuizzes', quizVariables).then((response) => {
      if (response.data.success) {
        if (response.data.quiz !== undefined) {
          setQuizzes(response.data.quiz);
        }
      }
    });

    const currentIndex = videos.findIndex((item) => item._id === videoId);
    setNextIndex(nextIndex < videos.length ? currentIndex + 1 : currentIndex);

    setVisible(true);
    setModalText('Complete quizzes before turning to new section in this course.');
    console.log('Video ended');
  };

  const handleOk = () => {
    setOk(true);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
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
        <>
          {isOk && quizzes
            ? (
              <Quiz
                quizzes={quizzes}
                nextVideo={videos[nextIndex] !== undefined ? videos[nextIndex]._id : false}
                courseId={courseId}
              />
            ) : (
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

                    <Modal
                      title="Title"
                      visible={visible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                    >
                      <p>{modalText}</p>
                    </Modal>

                  </div>
                </Col>
              </Row>
            )}
        </>

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
