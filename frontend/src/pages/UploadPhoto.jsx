import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar"

const UploadPhoto = () => {
  // State untuk menyimpan file yang dipilih dan pesan notifikasi
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  // Menangani perubahan pada input file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fungsi untuk mengunggah file ke server
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage('Photo uploaded successfully!');
      console.log(response.data); // Menampilkan respon dari server di console
      // Mengambil userId dari localStorage
      const userId = localStorage.getItem("userId");
      // Redirect ke halaman profile
      navigate(`/profile/${userId}`);
    } catch (err) {
      setMessage('Upload failed. Please try again.');
      console.error('Upload failed:', err);
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.profileContent}>
        <h1 style={styles.title}>Upload Photo</h1>

        <input type="file" onChange={handleFileChange} style={styles.input} />

        <button onClick={handleUpload} style={styles.button}>Upload</button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  profileContent: {
    marginLeft: '200px', // Pastikan ini sesuai lebar sidebar
    padding: '40px',
    paddingLeft: '80px',
    flex: 1,
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heading: {
    marginBottom: '20px',
  },
  input: {
    marginBottom: '15px',
    display: 'block',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#0095F6',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '15px', // Jarak dengan message
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'green',
  },
};


export default UploadPhoto;
