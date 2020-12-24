/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import {
  Form, Input, Button, Typography,
} from 'antd';
import axios from 'axios';
import FileUpload from '../../utils/FileUpload';

const { Title } = Typography;
const { TextArea } = Input;

const UploadCourse = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState([]);

  const onTitleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const onDescriptionChange = (evt) => {
    setDescription(evt.target.value);
  };

  const onCategoryChange = (evt) => {
    setCategory(evt.target.value);
  };

  const updateImages = (newImage) => {
    setThumbnail(newImage);
  };

  // eslint-disable-next-line consistent-return
  const onSubmit = (evt) => {
    evt.preventDefault();

    if (!title || !description || !category) {
      return alert('Please fill out all the fields.');
    }
    const values = {
      uploader: props.user.userData._id,
      title,
      category,
      description,
      thumbnail,
    };

    axios.post('/api/courses/uploadCourse', values).then((response) => {
      if (response.data.success) {
        alert('Upload course successfully');
        props.history.push('/');
      } else {
        alert('Failed to upload course');
      }
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Course</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>Title:</label>
        <Input onChange={onTitleChange} value={title} required />
        <br />
        <br />
        <label>Category:</label>
        <Input onChange={onCategoryChange} value={category} required />
        <br />
        <br />
        <label>Description:</label>
        <TextArea onChange={onDescriptionChange} value={description} required />
        <br />
        <br />
        <Button onClick={onSubmit}>Submit</Button>
      </Form>
    </div>
  );
};

export default UploadCourse;
