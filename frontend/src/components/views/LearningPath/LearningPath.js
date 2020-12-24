import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Steps } from 'antd';

const { Title } = Typography;
const { Step } = Steps;

function LearningPath() {
  const [categories, setCategories] = useState();
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [courses, setCourses] = useState();

  useEffect(() => {
    axios.get('/api/courses/getCategories').then((response) => {
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.log('Failed to get categories of courses.');
      }
    });
  }, []);

  useEffect(() => {
    const variables = {
      skip,
      limit,
    };

    axios.post('/api/courses/getCourses', variables).then((response) => {
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        console.log('Failed to fetch courses');
      }
    });
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}
    >
      {categories && courses && categories.map((category) => (
        <>
          <Title level={3}>{category}</Title>
          <Steps
            direction="horizontal"
            size="small"
            current={1}
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem 0rem', width: '80%',
            }}
          >
            {courses.map((course) => (
              category === course.category ? (
                <Step
                  key={course._id}
                  title="In progress"
                  description={course.title}
                />
              ) : <></>
            ))}
          </Steps>
        </>
      ))}
    </div>
  );
}

export default LearningPath;
