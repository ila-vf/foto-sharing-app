import React, { useState } from 'react';
import axios from 'axios';

const UploadPhoto = () => {
  // State untuk menyimpan file yang dipilih dan pesan notifikasi
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Menangani perubahan pada input file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Simpan file yang dipilih ke state
  };

  // Fungsi untuk mengunggah file ke server
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // Tambahkan file ke FormData

    // Ambil token yang disimpan saat login
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Kirim token di header
        }
      });

      setMessage('Photo uploaded successfully!');
      console.log(response.data); // Tampilkan respon dari server di console
    } catch (err) {
      setMessage('Upload failed. Please try again.');
      console.error('Upload failed:', err); // Tampilkan detail error
    }
  };

  return (
    <div>
      <h1>Upload Photo</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPhoto;
