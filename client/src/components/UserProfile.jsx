import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <img
        src={`https://www.gravatar.com/avatar/${user.email}?d=identicon`}
        alt="User Avatar"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
