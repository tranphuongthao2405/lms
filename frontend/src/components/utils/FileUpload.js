import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Icon } from 'antd';
import axios from 'axios';

function FileUpload({ refreshFunction }) {
  const [images, setImages] = useState([]);
  const [imagePath, setImagePath] = useState('');

  const onDrop = (files) => {
    const formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    axios
      .post('/api/courses/uploadImage', formData, config)
      .then((response) => {
        if (response.data.success) {
          setImages([...images, response.data.image]);
          refreshFunction([...images, response.data.image]);
        } else {
          alert('Failed to save image');
        }
      });
  };

  const onDelete = (image) => {
    const currentIndex = images.indexOf(image);

    const newImages = [...images];
    newImages.splice(currentIndex, 1);
    setImagePath(image);

    setImages(newImages);
    refreshFunction(newImages);
  };

  return (
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
        {images.map((image, index) => (
          <div onClick={() => onDelete(image)}>
            <img
              style={{ minWidth: '400px', width: '400px', height: '280px' }}
              src={`http://localhost:5000/${image}`}
              alt={`courseImg-${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
