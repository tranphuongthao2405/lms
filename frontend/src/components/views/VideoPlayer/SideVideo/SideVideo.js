import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../SearchBar/SearchBar';

function SideVideo({ videoId, courseId }) {
  const [sideVideos, setSideVideos] = useState([]);
  const [searchTerms, setSearchTerms] = useState();

  useEffect(() => {
    axios.get(`/api/videos/getVideos?courseId=${courseId}`).then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert('Failed to get videos');
      }
    });
  }, []);

  const renderVideoItem = sideVideos.map((video) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);
    const time = `${minutes}m ${seconds}s`;

    return (
      <div key={video._id}>
        {video._id === videoId ? (
          <div style={{ display: 'flex', padding: '0 3rem', borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
            <a href={`/video/${video._id}/${courseId}`}>
              <h3 style={{ color: '#1890ff' }}>{video.title}</h3>
              <p style={{ color: '#1890ff' }}>{video.description}</p>
              <p style={{ color: '#1890ff' }}>{`Duration: ${time}`}</p>
            </a>
          </div>
        ) : (
          <div key={video._id} style={{ display: 'flex', padding: '0 3rem', borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
            <a href={`/video/${video._id}/${courseId}`}>
              <h3>{video.title}</h3>
              <p style={{ color: 'rgba(0, 0, 0, 0.5' }}>{video.description}</p>
              <p style={{ color: 'rgba(0, 0, 0, 0.5' }}>{`Duration: ${time}`}</p>
            </a>
          </div>
        ) }
      </div>
    );
  });

  const updateSearchTerm = (newSearchTerms) => {
    setSearchTerms(newSearchTerms);

    const videoVariables = {
      courseId,
      searchTerm: newSearchTerms,
    };

    axios.post('/api/videos/getVideos', videoVariables).then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        console.log('Failed to get videos');
      }
    });
  };

  return (
    <>
      <SearchBar refreshFunction={updateSearchTerm} />
      <div style={{ marginTop: '3rem', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>

        <h2 style={{ padding: '0.5rem 3rem', borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>Course content:</h2>

        {renderVideoItem}
      </div>
    </>
  );
}

export default SideVideo;
