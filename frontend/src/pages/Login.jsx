import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      console.log('Login response:', response.data);
      const { token, role, userId } = response.data;

      localStorage.setItem('token', response.data.token); // Simpan token di localStorage
      setAuthToken(token); // Set token di App.js
      localStorage.setItem('role', response.data.role);
      localStorage.setItem("userId", response.data.userId);
      setMessage('Login successful!');
      navigate('/upload'); // Redirect ke halaman upload setelah login
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };
  

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={'Masukkan Username'}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Masukkan Password'}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
