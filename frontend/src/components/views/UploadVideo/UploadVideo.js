/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import {
  Typography, Button, Form, Input, Icon, Select,
} from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function UploadVideo(props) {
  const user = useSelector((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filePath, setFilePath] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const onCourseChange = (value) => {
    setCourse(value);
  };

  const onDrop = (files) => {
    const formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    axios.post('/api/videos/uploadFiles', formData, config).then((response) => {
      if (response.data.success) {
        const variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName,
        };
        setFilePath(response.data.filePath);

        // generate thumbnail with this filepath
        axios.post('/api/videos/thumbnail', variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnail(response.data.thumbsFilePath);
          } else {
            alert('Failed to make the thumbnails');
          }
        });
      } else {
        alert('Failed to save the video in server');
      }
    });
  };

  useEffect(() => {
    const courseVariables = {
      skip,
      limit,
    };
    // get course from course schema
    axios.post('/api/courses/getCourses', courseVariables).then((response) => {
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        console.log('Failed to get courses');
      }
    });
  }, []);

  // eslint-disable-next-line consistent-return
  const onSubmit = (event) => {
    event.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      return alert('Please sign in first');
    }

    if (courses !== []) {
      if (
        title === ''
        || course === ''
        || description === ''
        || filePath === ''
        || duration === ''
        || thumbnail === ''
      ) {
        return alert('Please fill out all the fields');
      }

      const variables = {
        uploader: user.userData._id,
        course,
        title,
        description,
        filePath,
        duration,
        thumbnail,
      };

      axios.post('/api/videos/uploadVideo', variables).then((response) => {
        if (response.data.success) {
          alert('Upload course successfully');
          props.history.push('/');
        } else {
          alert('Failed to upload video');
        }
      });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '280px',
                  border: '1px solid lightgray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>

          <div
            style={{
              display: 'flex',
              width: '400px',
              height: '280px',
              border: '1px solid lightgray',
              overflowX: 'hidden',
              overflowY: 'hidden',
            }}
          >
            {thumbnail !== '' ? (
              <img
                style={{ minWidth: '400px', width: '400px', height: '280px' }}
                src={`http://localhost:5000/${thumbnail}`}
                alt="thumbnail"
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        <br />
        <br />
        <label>Title:</label>
        <Input onChange={handleChangeTitle} value={title} required />
        <br />
        <br />
        <label>Description:</label>
        <TextArea onChange={handleChangeDescription} value={description} required />
        <br />
        <br />
        <label>Course:</label>
        <Select onChange={onCourseChange}>
          {courses !== []
            && courses.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.title}
              </Option>
            ))}
        </Select>
        <br />
        <br />

        <Button size="default" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadVideo;
