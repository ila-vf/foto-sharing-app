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
    setFile(e.target.files[0]); // menyimpan file yang dipilih ke state
  };

  // Fungsi untuk mengunggah file ke server
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // menambahkan file ke FormData

    // Mengambil token yang disimpan saat login
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Mengirim token di header
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
      <h1>Upload Photo</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
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
  input: {
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0095F6',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'green',
  },
};

export default UploadPhoto;
