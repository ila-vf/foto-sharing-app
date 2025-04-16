import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import useNavigate
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // initialize navigate

  const fetchUsers = async () => {
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('token');
  
      // Jika token tidak ada, arahkan ke login
      if (!token) {
        navigate('/login');
        return;
      }
  
      // Lakukan request dengan menambahkan token di header
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
      });
  
      // Set data pengguna jika request berhasil
      setUsers(response.data);
    } catch (error) {
      console.error('Gagal memuat data user:', error);
    }
  };
  
  const handleDelete = async (userId) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;

    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      fetchUsers(); // Reload users after deletion
    } catch (error) {
      console.error('Gagal menghapus user:', error);
    }
  };

  const handleEdit = (user) => {
    navigate('/register', { state: { user } }); // Redirect to register page with user data
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen min-h-screen lg:flex">
  <Sidebar />

  {/* Konten utama dashboard */}
  <div className="flex-1 p-6 h-full">
    {/* Tombol tambah user */}
    <div className="flex justify-end mb-4">
      <button
        onClick={() => navigate('/register', { state: null })}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Tambah User
      </button>
    </div>

    {/* Tabel User */}
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2">Username</th>
          <th className="border border-gray-300 px-4 py-2">Role</th>
          <th className="border border-gray-300 px-4 py-2">Password</th>
          <th className="border border-gray-300 px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
            <td className="border border-gray-300 px-4 py-2 truncate max-w-xs">****</td>
            <td className="border border-gray-300 px-4 py-2 space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
        {users.length === 0 && (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              Tidak ada data user.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


  );
};

export default AdminDashboard;
