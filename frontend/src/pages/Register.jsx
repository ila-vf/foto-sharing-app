import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user;
  const isUpdate = !!userData;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const currentUser = JSON.parse(localStorage.getItem('user'));

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
        const payload = { username, role };
        if (password) payload.password = password;

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

      navigate('/login');
    } catch (error) {
      setMessage('Proses gagal: ' + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-pink-400">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">
            {isUpdate ? 'Edit User' : 'Register'}
          </h2>

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
              placeholder={
                isUpdate
                  ? 'Masukkan password lama jika tidak ingin diganti'
                  : 'Masukkan password'
              }
              className="input input-bordered"
              required={!isUpdate}
            />
          </div>

          {(currentUser?.role === 'admin' || isUpdate) && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="select select-bordered"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button type="submit" className="btn btn-primary w-1/2 md:w-1/3">
              {isUpdate ? 'Update' : 'Register'}
            </button>
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-red-500">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
