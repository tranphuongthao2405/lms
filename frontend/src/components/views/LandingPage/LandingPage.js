import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Card, Icon, Col, Row,
} from 'antd';
import SearchBar from '../SearchBar/SearchBar';

const { Meta } = Card;

function LandingPage(props) {
  const [courses, setCourses] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [searchTerms, setSearchTerms] = useState('');
  // eslint-disable-next-line react/destructuring-assignment
  const { category } = props.match.params;

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
        console.log('Failed to fetch courses');
      }
    });
  };

  useEffect(() => {
    const variables = {
      skip,
      limit,
      category,
    };

    getCourses(variables);
  }, []);

  const onLoadMore = () => {
    const skipTemp = skip + limit;
    const variables = {
      skip: skipTemp,
      limit,
      loadMore: true,
      category,
      searchTerm: searchTerms,
    };
    getCourses(variables);
    setSkip(skipTemp);
  };

  const renderCards = courses.map((course) => (
    <Col lg={6} md={8} xs={24} key={`${course._id}`}>
      <Card
        hoverable
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
      >
        <Meta title={course.title} description={`Category: ${course.category}`} />
      </Card>
    </Col>
  ));

  // still fixing: cannot return res for search text
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
    <>
      <div style={{ width: '75%', margin: '3rem auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>
            Explore all the course
            {' '}
            <Icon type="search" />
          </h2>

          <br />

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
              <Row gutter={[16, 16]}>{renderCards}</Row>
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
    </>
  );
}

export default LandingPage;
