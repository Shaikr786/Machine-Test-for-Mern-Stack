import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-200 h-full p-4">
      {user && (
        <div>
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
