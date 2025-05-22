import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userRes = await axios.get(`http://localhost:5000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(userRes.data);

        const photoRes = await axios.get(`http://localhost:5000/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPhotos(photoRes.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Gagal mengambil data profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.profileContent}>
        <div style={styles.profileHeader}>
          <div className="avatar">
            <div className="w-24 rounded-full">
              {/* Gunakan avatar dari Dicebear dan seed berdasarkan username */}
              <img
                src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${userData?.username || 'default'}`}
                alt="avatar"
              />
            </div>
          </div>
          <h3 style={styles.username}>{userData?.username}</h3>

          <button
            style={styles.editButton}
            onClick={() => navigate(`/edit-profile/${userId}`)}
          >
            Edit Profil
          </button>
        </div>

        <div style={styles.photoGrid}>
          <h2 style={styles.title}>Foto-Foto Unggahan</h2>
          <div style={styles.grid}>
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${photo.image_url}`}
                  alt={`Upload ${index + 1}`}
                  style={styles.image}
                />
              ))
            ) : (
              <p>Belum ada foto yang diunggah.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  profileContent: {
    flex: 1,
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  username: {
    fontSize: '22px',
    fontWeight: '600',
    marginTop: '10px',
    marginBottom: '10px',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  photoGrid: {
    marginTop: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: '600',
    fontSize: '20px',
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
