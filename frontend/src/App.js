import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadPhoto from './pages/UploadPhoto';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile'; 
import EditProfile from './pages/EditProfile';
import { Navigate } from 'react-router-dom';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div style={styles.appContainer}>

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
          <Route path="/edit-profile/:userId" element={<EditProfile />} />
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
};

export default App;
