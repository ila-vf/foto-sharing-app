import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  console.log('Role from localStorage:', role);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>PhotoApp</h2>
      </div>
      <nav style={styles.nav}>
        <Link to={`/profile/${localStorage.getItem('userId')}`} style={styles.plainLink}>
          Profile
        </Link>
        <Link to="/upload" style={styles.plainLink}>
          Create
        </Link>
        {role === 'admin' && (
          <Link to="/admin-dashboard" style={styles.buttonLink}>
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
    width: '200px',
    height: '100vh',
    backgroundColor: '#f9fafc',
    boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.1)',
    padding: '30px 20px',
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2575fc',
    margin: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  plainLink: {
    textDecoration: 'none',
    fontSize: '16px',
    color: '#333',
    fontWeight: '500',
    transition: 'color 0.3s ease',
  },
  buttonLink: {
    textDecoration: 'none',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#2575fc',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#ff5a5f',
    border: 'none',
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
};

export default Sidebar;
