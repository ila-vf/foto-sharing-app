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
    <div className="flex">
      <Sidebar />
      <div className="ml-[250px] p-6 flex-1">
        <h1 className="text-3xl font-bold text-center mb-4">Upload Photo</h1>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
          <button
            onClick={handleUpload}
            className="btn btn-primary w-full max-w-xs"
          >
            Upload
          </button>
          {message && (
            <p
              className={`mt-4 text-lg ${
                message.includes('failed') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
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
