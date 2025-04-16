import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`http://localhost:5000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(res.data.username);
      } catch (err) {
        setMessage('Gagal mengambil data pengguna');
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const data = { username };
      if (password) data.password = password;

      await axios.put(
        `http://localhost:5000/users/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Profil berhasil diperbarui!');
      setPassword('');

      setTimeout(() => {
        navigate(`/profile/${userId}`);
      }, 1500);

    } catch (err) {
      setMessage('Gagal memperbarui profil. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-pink-400">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center">Edit Profil</h2>

          {message && (
            <div className="text-sm text-center text-green-600 font-medium">
              {message}
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password Baru</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Isi jika ingin mengubah"
              className="input input-bordered"
            />
          </div>

          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary w-full">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
