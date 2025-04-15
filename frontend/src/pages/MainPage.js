import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);  // User is logged in
    }
  }, []);

  // If logged in, redirect to upload page
  if (isLoggedIn) {
    return <Navigate to="/upload" />;
  }

  return (
    <div>
      <h2>Welcome to the Photo Upload App</h2>
      <p>Please choose an option:</p>
      <div>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
