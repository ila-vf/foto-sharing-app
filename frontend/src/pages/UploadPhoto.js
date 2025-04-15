import React, { useState } from 'react';
import axios from 'axios';

const UploadPhoto = () => {
    // State untuk menyimpan file yang dipilih dan pesan status
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    

   // Menangani perubahan input file
    const handleFileChange = (e) => {
         // Mengambil file pertama dari input dan simpan ke state
        setFile(e.target.files[0]);
    };

      // Fungsi untuk meng-handle proses upload ke server
    const handleUpload = async () => {
        if (!file) {
        alert('Please select a file to upload');
        return;
        }

        /// Buat FormData untuk mengirim file dalam format multipart/form-data
        const formData = new FormData();
        formData.append('image', file);

    try {
        // Kirim POST request ke endpoint upload di server backend
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Photo uploaded successfully');
      console.log(response.data);
    } catch (err) {
      setMessage('Upload failed');
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadPhoto;
