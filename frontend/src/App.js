import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadPhoto from './pages/UploadPhoto';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile'; 
import { Navigate } from 'react-router-dom';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div style={styles.appContainer}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <h1 style={styles.navbarTitle}>Photo Upload App</h1>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
          <Route path="/register" element={<Register />} />
          
          {/* Halaman upload hanya bisa diakses jika user sudah login */}
          <Route
            path="/upload"
            element={authToken ? <UploadPhoto /> : <Navigate to="/login" />}
          />
          {/* Route untuk halaman profile */}
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard/>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
  },
  navbar: {
    backgroundColor: '#6495ED', // Biru untuk navbar
    color: '#fff',
    padding: '20px 25px',
    textAlign: 'left',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Efek bayangan
  },
  navbarTitle: {
    fontSize: '24px',
    margin: 0,
  }
};

export default App;
