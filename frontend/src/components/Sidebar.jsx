import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">PhotoApp</h2>
        </div>
        <nav className="flex flex-col gap-3">
          <NavLink
            to={`/profile/${localStorage.getItem('userId')}`}
            className={({ isActive }) =>
              `btn btn-ghost justify-start ${isActive ? 'bg-primary text-white' : ''}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `btn btn-ghost justify-start ${isActive ? 'bg-primary text-white' : ''}`
            }
          >
            Create
          </NavLink>
          {role === 'admin' && (
            <NavLink
              to="/admin-dashboard"
              className="btn btn-outline btn-primary justify-start"
            >
              Admin Panel
            </NavLink>
          )}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-error text-white mt-6"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="flex">
      {/* Sidebar untuk layar besar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 bg-base-200 min-h-screen p-6 shadow-lg">
        <SidebarContent />
      </div>

      {/* Sidebar drawer untuk mobile */}
      <div className="drawer drawer-mobile lg:hidden">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-4">
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button mb-4">
            Open Sidebar
          </label>
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content shadow-xl">
            <SidebarContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
