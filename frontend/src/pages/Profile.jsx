import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mendapatkan token dari localStorage
        const token = localStorage.getItem('token'); // Ganti dengan cara yang sesuai jika token ada di tempat lain
        
        // Jika token tidak ada, arahkan pengguna ke halaman login
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user detail dengan menambahkan Authorization header
        const userRes = await axios.get(`http://localhost:5000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Menambahkan token ke header
          },
        });
        setUserData(userRes.data);

        // Fetch photos dengan menambahkan Authorization header
        const photoRes = await axios.get(`http://localhost:5000/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Menambahkan token ke header
          },
        });
        setPhotos(photoRes.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchData();
    console.log('User ID:', userId);
  }, [userId, navigate]);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.profileContent}>
        <h2 style={styles.title}>Profile of User {userId}</h2>
        <div style={styles.grid}>
          {photos.map((photo, index) => (
            <img
              key={index}
              src={`http://localhost:5000${photo.image_url}`}
              alt={`Upload ${index + 1}`}
              style={styles.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  profileContent: {
    marginLeft: '250px',
    padding: '20px',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '10px',
  },
  image: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
};

export default Profile;
