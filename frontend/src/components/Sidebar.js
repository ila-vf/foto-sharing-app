import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ handleLogout }) => {
  return (
    <div className="sidebar">
      <h2>Photo Upload App</h2>
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/upload">Upload Photo</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
