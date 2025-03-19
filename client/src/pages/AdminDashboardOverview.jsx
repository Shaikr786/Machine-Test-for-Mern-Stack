import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminDashboardOverview = () => {
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    api.get('/agents')
      .then(response => setUserStats(response.data))
      .catch(error => console.error('Error fetching user stats:', error));

   
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-orange-400 mb-6">Admin Dashboard Overview</h1>

      {/* User Statistics Card */}
      {userStats && (
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-400 mb-3">User Statistics</h2>
          <p className="text-gray-300">Total Users: <span className="font-bold text-white">{userStats.totalUsers}</span></p>
          <p className="text-gray-300">Active Users: <span className="font-bold text-white">{userStats.activeUsers}</span></p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardOverview;
