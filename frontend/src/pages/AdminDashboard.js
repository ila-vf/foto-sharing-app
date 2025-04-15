import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Ambil daftar pengguna dari backend
    axios.get('http://localhost:5000/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }).then((response) => {
      setUsers(response.data);
    }).catch((error) => {
      console.error('Error fetching users:', error);
    });
  }, []);

  const handleDeleteUser = (userId) => {
    // Kirim permintaan DELETE ke backend untuk menghapus pengguna
    axios.delete(`http://localhost:5000/delete-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }).then((response) => {
      alert('User deleted successfully');
      setUsers(users.filter(user => user.id !== userId));  // Update UI setelah hapus
    }).catch((error) => {
      alert('Failed to delete user');
      console.error('Error deleting user:', error);
    });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Users List</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} 
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
