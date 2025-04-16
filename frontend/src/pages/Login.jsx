import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
