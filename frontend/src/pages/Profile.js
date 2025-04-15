import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile/1', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPhotos(response.data);
      } catch (error) {
        console.error('Failed to fetch photos');
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {photos.length > 0 ? (
        photos.map((photo) => (
          <img key={photo.id} src={`http://localhost:5000${photo.image_url}`} alt="Profile" />
        ))
      ) : (
        <p>No photos uploaded</p>
      )}
    </div>
  );
};

export default Profile;
