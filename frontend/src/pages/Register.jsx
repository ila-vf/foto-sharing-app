import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation  } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user; // data user dari dashboard
  const isUpdate = !!userData;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default role
  const currentUser = JSON.parse(localStorage.getItem('user')); // atau pakai context kalau ada

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isUpdate) {
      console.log(userData);
      setUsername(userData.username);
      setRole(userData.role);
      // password kosong karena tidak ditampilkan
    }
  }, [isUpdate, userData]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isUpdate) {
       // Update user, hanya kirim username dan role, password hanya dikirim jika diisi
       const payload = { username, role };

       // Jika password diisi, tambahkan password ke payload
       if (password) {
         payload.password = password;
       }

       await axios.put(`http://localhost:5000/users/${userData.id}`, payload);
       setMessage('User berhasil diperbarui.');
      } else {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        role,
      });
      setMessage(response.data.message);
    }
      navigate('/admin-dashboard'); // Redirect ke halaman login setelah berhasil register
    } catch (error) {
      setMessage('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>{isUpdate ? 'Edit User' : 'Register'}</h1>
  
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
              // disabled={isUpdate} // jangan diubah kalau update
              placeholder={'Masukkan Username'}
          />
        </div>
  
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isUpdate ? 'Masukkan password lama jika tidak ingin diganti' : 'Masukkan password'}

          />
        </div>
  
        {(currentUser?.role === 'admin' || isUpdate) && (
          <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        )}
  
        <button type="submit" className="register-button">
          {isUpdate ? 'Update' : 'Register'}
        </button>
        {message && <p className="register-message">{message}</p>}
      </form>
    </div>
  ); 
};

export default Register;
