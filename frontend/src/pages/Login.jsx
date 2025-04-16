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

      const { token, role, userId } = response.data;

      localStorage.setItem('token', token);
      setAuthToken(token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      setMessage('Login successful!');
      navigate('/upload');
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-pink-400">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan Username"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              className="input input-bordered"
              required
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button type="submit" className="btn btn-primary w-1/2 md:w-1/3">Login</button>
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-red-500">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
