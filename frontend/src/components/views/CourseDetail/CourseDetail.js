/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import axios from 'axios';
import CourseInfo from './CourseInfo/CourseInfo';

const CourseDetail = (props) => {
  const [course, setCourse] = useState('');
  const courseId = props.match.params.id;

  useEffect(() => {
    axios
      .get(`/api/courses/course_by_id?id=${courseId}&type=single`)
      .then((response) => {
        setCourse(response.data[0]);
      });
  }, []);

  return (
    <div>
      <div
        className="detailPage"
        style={{ width: '100%', padding: '3rem 4rem' }}
      >
        {course && course.videos.length >= 1 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h1>
                Course:
                {' '}
                {course.title}
              </h1>
            </div>
            <br />
            <Row
              gutter={[16, 16]}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Col lg={7} xs={20} style={{ padding: '2rem' }}>
                <img
                  src={`http://localhost:5000/${course.thumbnail[0]}`}
                  alt="course thumbnail"
                  height="280"
                  width="450"
                />
              </Col>
              <Col lg={13} xs={20} style={{ padding: '2rem' }}>
                <CourseInfo course={course} />
              </Col>
            </Row>
          </>
        ) : (
          <h2 style={{ display: 'flex', justifyContent: 'center' }}>
            Loading images and information of course...
          </h2>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
