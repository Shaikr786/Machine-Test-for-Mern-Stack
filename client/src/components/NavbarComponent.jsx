import React from 'react';

import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
// Navbar Component
const NavbarComponent = () => {
    const { user, logout } = useAuth();
  
    return (
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-6">
          <span className="font-semibold">Welcome, {user?.name}</span>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <button 
            onClick={logout} 
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
    );
  };
  
  export default NavbarComponent;
  