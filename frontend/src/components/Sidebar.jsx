import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  console.log('Role from localStorage:', role);
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');  // Hapus token dari localStorage
    localStorage.removeItem('userId');  // Hapus userId dari localStorage
    navigate('/login');  // Arahkan ke halaman login
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2>PhotoApp</h2>
      </div>
      <nav style={styles.nav}>
        <Link to={`/profile/${localStorage.getItem('userId')}`} style={styles.link}>
          Profile
        </Link>
        <Link to="/upload" style={styles.link}>
          Create
        </Link>
        {role === 'admin' && (
          <Link to="/admin-dashboard" style={styles.link}>
            Admin Panel
          </Link>
        )}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#fff',
    boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    position: 'fixed',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  link: {
    textDecoration: 'none',
    fontSize: '18px',
    color: '#333',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    fontSize: '18px',
    color: '#333',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Sidebar;
